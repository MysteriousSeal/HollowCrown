import { describe, expect, it } from 'vitest';
import { World, defineEvent, defineResource } from '../src/ecs';
import { Dead, FaceToward, Health, Transform, health } from '../src/gameplay';
import { AutosaveNow, Persistent, SaveGame, autosaveSystem, keep, keepResource, snapshot, type SaveSchema, type SaveStorage } from '../src/save';

// A storage in memory, as localStorage behaves.
function memoryStorage(): SaveStorage & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
  };
}

const Flags = defineResource<Record<string, boolean>>('Flags');
const schema: SaveSchema = {
  version: 2,
  components: [
    keep(Transform, { key: 'at' }),
    keep(Health, { key: 'health' }),
    keep(Dead, { key: 'dead' }),
    keep(FaceToward, {
      key: 'faces',
      save: (f, c) => ({ target: c.nameOf(f.target), rate: f.rate }),
      load: (json, c) => {
        const { target, rate } = json as { target: string; rate: number };
        return { target: c.entityOf(target)!, rate };
      },
    }),
  ],
  resources: [keepResource(Flags, { key: 'flags' })],
};

// The game's world as it builds it from its data: a hero, two wolves, a villager not kept.
function build() {
  const world = new World();
  world.setResource(Flags, { metElsa: false });
  const hero = world.spawn([Persistent, 'hero'], [Transform, { x: 10, y: 0, z: 10, facing: 0 }], [Health, health(30)]);
  const wolf1 = world.spawn([Persistent, 'wolf-1'], [Transform, { x: 20, y: 0, z: 5, facing: 0 }], [Health, health(10)]);
  const wolf2 = world.spawn([Persistent, 'wolf-2'], [Transform, { x: 22, y: 0, z: 5, facing: 0 }], [Health, health(10)]);
  const villager = world.spawn([Transform, { x: 1, y: 0, z: 1, facing: 0 }]);
  return { world, hero, wolf1, wolf2, villager };
}

describe('saving and loading', () => {
  it('puts back what was kept over a freshly built world: places, health, the dead, flags, who faces whom', () => {
    const storage = memoryStorage();
    const played = build();
    Object.assign(played.world.read(played.hero, Transform), { x: 33, z: 44 });
    played.world.read(played.hero, Health).hp = 12;
    played.world.add(played.wolf1, Dead, { since: 5 });
    played.world.despawn(played.wolf2); // (killed and cleared away)
    played.world.add(played.wolf1, FaceToward, { target: played.hero, rate: 6 });
    played.world.resource(Flags).metElsa = true;
    new SaveGame(played.world, schema, 'test', storage).save('1', 'By the river');

    const fresh = build();
    expect(new SaveGame(fresh.world, schema, 'test', storage).load('1')).toBe(true);
    const { world } = fresh;
    const hero = world.first(Persistent, Health)!;
    expect(world.read(fresh.hero, Transform)).toMatchObject({ x: 33, z: 44 });
    expect(world.read(fresh.hero, Health).hp).toBe(12);
    expect(world.read(fresh.wolf1, Dead)).toEqual({ since: 5 });
    expect(world.isAlive(fresh.wolf2)).toBe(false);
    expect(world.read(fresh.wolf1, FaceToward).target).toBe(fresh.hero);
    expect(world.resource(Flags).metElsa).toBe(true);
    expect(world.isAlive(fresh.villager)).toBe(true); // (not kept: left as built)
    expect(world.has(fresh.hero, Dead)).toBe(false);
    expect(hero).toBeDefined();
  });

  it('lists its slots newest first, and refuses an empty, broken or other-version slot', () => {
    const storage = memoryStorage();
    const { world } = build();
    const saves = new SaveGame(world, schema, 'test', storage);
    saves.save('1', 'first');
    saves.save('auto', 'later');
    storage.map.set('other:1', '{}'); // (another game's)
    expect(saves.slots().map((s) => s.slot).sort()).toEqual(['1', 'auto']);
    expect(saves.load('9')).toBe(false);
    storage.map.set('test:2', 'not json');
    expect(saves.load('2')).toBe(false);
    storage.map.set('test:3', JSON.stringify({ ...snapshot(world, schema), version: 1 }));
    expect(saves.load('3')).toBe(false);
    expect(() => saves.save('../x')).toThrow();
    saves.remove('1');
    expect(saves.slots().map((s) => s.slot)).toEqual(['auto']);
  });

  it('autosaves on its timer and on the events it watches', () => {
    const storage = memoryStorage();
    const { world } = build();
    const QuestDone = defineEvent<string>('QuestDone');
    const auto = autosaveSystem(new SaveGame(world, schema, 'test', storage), { every: 60, on: [QuestDone] });
    auto.update(world, 30);
    expect(storage.map.has('test:auto')).toBe(false);
    auto.update(world, 31);
    expect(storage.map.has('test:auto')).toBe(true);
    storage.map.clear();
    world.emit(QuestDone, 'MQ01');
    auto.update(world, 1);
    expect(storage.map.has('test:auto')).toBe(true);
    world.clearEvents();
    storage.map.clear();
    world.emit(AutosaveNow, { label: 'The Bell Hall' });
    auto.update(world, 1);
    expect(JSON.parse(storage.map.get('test:auto')!).label).toBe('The Bell Hall');
  });
});
