// The world: every entity, the components attached to them, the world's resources, and this frame's events. Entities
// are plain numbers; all their data lives in per-component stores, so systems ask for exactly what they need.

import type { ComponentType, EventType, ResourceType } from './component';

export type Entity = number;

export class World {
  private nextEntity = 1;
  private readonly alive = new Set<Entity>();
  private readonly stores = new Map<number, Map<Entity, unknown>>();
  private readonly resources = new Map<number, unknown>();
  private readonly events = new Map<number, unknown[]>();

  // A new entity, with the components given.
  spawn(...components: Array<readonly [ComponentType<unknown>, unknown]>): Entity {
    const entity = this.nextEntity++;
    this.alive.add(entity);
    for (const [type, value] of components) this.add(entity, type, value);
    return entity;
  }

  // An entity gone, with all its components.
  despawn(entity: Entity): void {
    if (!this.alive.delete(entity)) return;
    for (const store of this.stores.values()) store.delete(entity);
  }

  isAlive(entity: Entity): boolean {
    return this.alive.has(entity);
  }

  add<T>(entity: Entity, type: ComponentType<T>, value: T): T {
    if (!this.alive.has(entity)) throw new Error(`add ${type.name}: entity ${entity} doesn't exist`);
    this.store(type).set(entity, value);
    return value;
  }

  remove<T>(entity: Entity, type: ComponentType<T>): void {
    this.stores.get(type.id)?.delete(entity);
  }

  has<T>(entity: Entity, type: ComponentType<T>): boolean {
    return this.stores.get(type.id)?.has(entity) ?? false;
  }

  // The entity's component of `type`, or undefined.
  get<T>(entity: Entity, type: ComponentType<T>): T | undefined {
    return this.stores.get(type.id)?.get(entity) as T | undefined;
  }

  // The entity's component of `type`; it must have one.
  read<T>(entity: Entity, type: ComponentType<T>): T {
    const value = this.get(entity, type);
    if (value === undefined) throw new Error(`entity ${entity} has no ${type.name}`);
    return value;
  }

  // Every entity having all the components given (walking the smallest store first).
  *query(...types: Array<ComponentType<unknown>>): Generator<Entity> {
    if (types.length === 1) {
      const store = this.stores.get(types[0].id);
      if (store) yield* store.keys();
      return;
    }
    const stores = types.map((t) => this.stores.get(t.id));
    if (stores.some((s) => !s || s.size === 0)) return;
    const [smallest, ...rest] = (stores as Array<Map<Entity, unknown>>).sort((a, b) => a.size - b.size);
    for (const entity of smallest.keys()) if (rest.every((s) => s.has(entity))) yield entity;
  }

  // The first entity having all the components given, or undefined (for one-of-a-kind entities: the player).
  first(...types: Array<ComponentType<unknown>>): Entity | undefined {
    for (const entity of this.query(...types)) return entity;
    return undefined;
  }

  setResource<T>(type: ResourceType<T>, value: T): T {
    this.resources.set(type.id, value);
    return value;
  }

  resource<T>(type: ResourceType<T>): T {
    if (!this.resources.has(type.id)) throw new Error(`no resource ${type.name}`);
    return this.resources.get(type.id) as T;
  }

  hasResource<T>(type: ResourceType<T>): boolean {
    return this.resources.has(type.id);
  }

  emit<T>(type: EventType<T>, event: T): void {
    const list = this.events.get(type.id);
    if (list) list.push(event);
    else this.events.set(type.id, [event]);
  }

  // This frame's events of `type` (kept until the frame ends, for every system to read).
  eventsOf<T>(type: EventType<T>): readonly T[] {
    return (this.events.get(type.id) as T[] | undefined) ?? [];
  }

  // The frame's events let go (the schedule does this at the end of each frame).
  clearEvents(): void {
    this.events.clear();
  }

  private store<T>(type: ComponentType<T>): Map<Entity, unknown> {
    let store = this.stores.get(type.id);
    if (!store) this.stores.set(type.id, (store = new Map()));
    return store;
  }
}
