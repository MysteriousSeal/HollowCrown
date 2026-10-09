// Saving and loading a game. What's kept is the game's to say, in a schema: the components and resources worth
// keeping (each with how it's written to plain JSON and read back), on the entities that have a lasting name
// (Persistent: "hero", "wolf-3"). A save is that, as JSON, in a numbered or named slot of the browser's storage.
//
// A game builds its world as it always does (from its data), then loads a save over it: each saved entity's kept
// components put back on the entity of the same name (one not built any more is spawned), and every named entity
// the save doesn't have (killed and gone since) removed. Entities a component points to are written by name.

import { defineComponent, defineEvent, type ComponentType, type Entity, type EventType, type ResourceType, type System, type World } from '../ecs';

// An entity's lasting name, the same every time the game builds it: what a save knows it by.
export const Persistent = defineComponent<string>('Persistent');

// How the save refers to other entities: by their lasting names.
export interface SaveContext {
  nameOf(entity: Entity): string | null; // (null: one without a lasting name, not kept)
  entityOf(name: string): Entity | null;
}

// A component or resource worth keeping: its key in the save, and how it's written and read (none given: as it is,
// copied through JSON).
export interface Kept<T> {
  key: string;
  save?(value: T, context: SaveContext): unknown;
  load?(json: unknown, context: SaveContext): T;
}

export interface SaveSchema {
  version: number; // a save from another version isn't loaded (migrate: what to make of an older one)
  components: Array<readonly [ComponentType<unknown>, Kept<unknown>]>;
  resources?: Array<readonly [ResourceType<unknown>, Kept<unknown>]>;
  migrate?(data: SaveData): SaveData | null;
}

// A component kept (helper for the schema's typing).
export const keep = <T>(type: ComponentType<T>, kept: Kept<T>) => [type, kept] as unknown as readonly [ComponentType<unknown>, Kept<unknown>];
export const keepResource = <T>(type: ResourceType<T>, kept: Kept<T>) => [type, kept] as unknown as readonly [ResourceType<unknown>, Kept<unknown>];

export interface SaveData {
  version: number;
  savedAt: number; // ms since 1970
  label: string;
  entities: Record<string, Record<string, unknown>>; // lasting name -> component key -> JSON
  resources: Record<string, unknown>;
}

const asJson = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

function contextOf(world: World): SaveContext {
  const byName = new Map<string, Entity>();
  for (const e of world.query(Persistent)) byName.set(world.read(e, Persistent), e);
  return { nameOf: (e) => world.get(e, Persistent) ?? null, entityOf: (name) => byName.get(name) ?? null };
}

// The world as a save.
export function snapshot(world: World, schema: SaveSchema, label = ''): SaveData {
  const context = contextOf(world);
  const entities: SaveData['entities'] = {};
  for (const entity of world.query(Persistent)) {
    const kept: Record<string, unknown> = {};
    for (const [type, k] of schema.components) {
      const value = world.get(entity, type);
      if (value !== undefined) kept[k.key] = k.save ? k.save(value, context) : asJson(value);
    }
    entities[world.read(entity, Persistent)] = kept;
  }
  const resources: SaveData['resources'] = {};
  for (const [type, k] of schema.resources ?? []) {
    if (world.hasResource(type)) resources[k.key] = k.save ? k.save(world.resource(type), context) : asJson(world.resource(type));
  }
  return { version: schema.version, savedAt: Date.now(), label, entities, resources };
}

export class SaveError extends Error {}

// Whether `data` has a save's shape (it came from storage: anything could be there).
export function isSaveData(data: unknown): data is SaveData {
  const d = data as SaveData;
  return typeof d === 'object' && d !== null && typeof d.version === 'number' && typeof d.savedAt === 'number' &&
    typeof d.entities === 'object' && d.entities !== null && typeof d.resources === 'object' && d.resources !== null;
}

// A save put back over the world (see the top). Throws SaveError for a save of another version it can't migrate.
export function restore(world: World, schema: SaveSchema, saved: SaveData): void {
  let data: SaveData | null = saved;
  if (data.version !== schema.version) data = schema.migrate?.(data) ?? null;
  if (!data || data.version !== schema.version) throw new SaveError(`a save of version ${saved.version}, not ${schema.version}`);
  // Every named entity the save has, found or spawned first, so references between them resolve.
  const byName = new Map<string, Entity>();
  for (const e of world.query(Persistent)) byName.set(world.read(e, Persistent), e);
  for (const [name, entity] of [...byName]) {
    if (!(name in data.entities)) {
      world.despawn(entity);
      byName.delete(name);
    }
  }
  for (const name of Object.keys(data.entities)) if (!byName.has(name)) byName.set(name, world.spawn([Persistent, name]));
  const context: SaveContext = { nameOf: (e) => world.get(e, Persistent) ?? null, entityOf: (name) => byName.get(name) ?? null };
  for (const [name, kept] of Object.entries(data.entities)) {
    const entity = byName.get(name)!;
    for (const [type, k] of schema.components) {
      if (k.key in kept) world.add(entity, type, k.load ? k.load(kept[k.key], context) : asJson(kept[k.key]));
      else world.remove(entity, type); // (it hadn't one when saved)
    }
  }
  for (const [type, k] of schema.resources ?? []) {
    if (k.key in data.resources) world.setResource(type, k.load ? k.load(data.resources[k.key], context) : asJson(data.resources[k.key]));
  }
}

// What a slot holds, for a menu.
export interface SlotInfo {
  slot: string;
  label: string;
  savedAt: number;
}

// Where saves are kept: localStorage by default (a game's own, or a test's, otherwise).
export interface SaveStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  readonly length: number;
  key(index: number): string | null;
}

// A game's saves: its world written to and read from slots ("auto", "1", "2"...) under its own prefix.
export class SaveGame {
  constructor(
    private readonly world: World,
    private readonly schema: SaveSchema,
    private readonly prefix = 'save',
    private readonly storage: SaveStorage = globalThis.localStorage,
  ) {}

  save(slot: string, label = ''): SaveData {
    const data = snapshot(this.world, this.schema, label);
    this.storage.setItem(this.keyOf(slot), JSON.stringify(data));
    return data;
  }

  // The slot's save put back over the world; false if the slot is empty, unreadable or of another version.
  load(slot: string): boolean {
    const data = this.read(slot);
    if (!data) return false;
    try {
      restore(this.world, this.schema, data);
      return true;
    } catch (e) {
      if (e instanceof SaveError) return false;
      throw e;
    }
  }

  // Every slot holding a save it can load, newest first.
  slots(): SlotInfo[] {
    const found: SlotInfo[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (!key?.startsWith(`${this.prefix}:`)) continue;
      const slot = key.slice(this.prefix.length + 1);
      const data = this.read(slot);
      const loadable = data && (data.version === this.schema.version || this.schema.migrate?.(data)?.version === this.schema.version);
      if (data && loadable) found.push({ slot, label: data.label, savedAt: data.savedAt });
    }
    return found.sort((a, b) => b.savedAt - a.savedAt);
  }

  remove(slot: string): void {
    this.storage.removeItem(this.keyOf(slot));
  }

  private read(slot: string): SaveData | null {
    const text = this.storage.getItem(this.keyOf(slot));
    if (!text) return null;
    try {
      const data: unknown = JSON.parse(text);
      return isSaveData(data) ? data : null;
    } catch {
      return null;
    }
  }

  private keyOf(slot: string): string {
    if (!/^[\w-]{1,32}$/.test(slot)) throw new Error(`save slot "${slot}": letters, digits, - and _ only`);
    return `${this.prefix}:${slot}`;
  }
}

// Raised by a game for an autosave now (a quest done, a door into a new place).
export const AutosaveNow = defineEvent<{ label?: string }>('AutosaveNow');

export interface AutosaveOptions {
  every?: number; // game seconds between autosaves (default 120; 0: never on a timer)
  on?: ReadonlyArray<EventType<unknown>>; // events that autosave too (AutosaveNow always does)
  slot?: string; // default "auto"
  label?: () => string; // what the autosave is called (default: "Autosave")
}

// Autosaves on a timer and on events, in the simulate stage (never while paused).
export function autosaveSystem(saves: SaveGame, { every = 120, on = [], slot = 'auto', label = () => 'Autosave' }: AutosaveOptions = {}): System {
  let since = 0;
  return {
    name: 'autosave',
    stage: 'simulate',
    update(world, dt) {
      since += dt;
      const asked = world.eventsOf(AutosaveNow);
      const due = (every > 0 && since >= every) || asked.length > 0 || on.some((type) => world.eventsOf(type).length > 0);
      if (!due) return;
      since = 0;
      saves.save(slot, asked.at(-1)?.label ?? label());
    },
  };
}
