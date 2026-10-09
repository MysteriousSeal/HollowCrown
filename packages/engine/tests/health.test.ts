import { describe, expect, it } from 'vitest';
import { Schedule, World } from '../src/ecs';
import { Dead, Died, Health, Hit, MoveIntent, MoveSpeed, Transform, health, healthSystems, isAlive, movementSystem } from '../src/gameplay';
import { TerrainResource, flatTerrain } from '../src/world';

function setup() {
  const world = new World();
  world.setResource(TerrainResource, flatTerrain({ width: 50, depth: 50 }, 0));
  const wolf = world.spawn([Health, health(10)], [Transform, { x: 5, y: 0, z: 5, facing: 0 }], [MoveIntent, { x: 1, z: 0 }], [MoveSpeed, 2]);
  const hero = world.spawn([Health, health(30)]);
  const [early, late] = healthSystems(() => 42);
  return { world, wolf, hero, early, late };
}

describe('health', () => {
  it('takes each blow off, and dies once at zero: Died, a still corpse', () => {
    const { world, wolf, hero, early, late } = setup();
    world.emit(Hit, { target: wolf, by: hero, damage: 4 });
    early.update(world, 0);
    expect(world.read(wolf, Health).hp).toBe(6);
    expect(isAlive(world, wolf)).toBe(true);
    world.clearEvents();

    world.emit(Hit, { target: wolf, by: hero, damage: 4 });
    world.emit(Hit, { target: wolf, by: hero, damage: 4 });
    world.emit(Hit, { target: wolf, by: hero, damage: 4 }); // (one too many: a corpse takes no more)
    early.update(world, 0);
    late.update(world, 0);
    expect(world.read(wolf, Health).hp).toBe(0);
    expect(world.eventsOf(Died)).toEqual([{ entity: wolf, by: hero }]);
    expect(world.read(wolf, Dead)).toEqual({ since: 42 });
    expect(isAlive(world, wolf)).toBe(false);

    const at = { ...world.read(wolf, Transform) };
    world.setResource(TerrainResource, flatTerrain({ width: 50, depth: 50 }, 0));
    world.read(wolf, MoveIntent).x = 1;
    movementSystem.update(world, 1);
    expect(world.read(wolf, Transform).x).toBe(at.x);
  });

  it('counts a blow landed after the simulate stage in the present stage, never twice', () => {
    const { world, wolf, hero, early, late } = setup();
    const schedule = new Schedule().add(early, { name: 'trap', stage: 'simulate', update: (w) => w.emit(Hit, { target: wolf, by: hero, damage: 3 }) }, late);
    schedule.run(world, 0.1);
    expect(world.read(wolf, Health).hp).toBe(7);
    schedule.run(world, 0.1);
    expect(world.read(wolf, Health).hp).toBe(4);
  });

  it('rejects health of nothing', () => {
    expect(() => health(0)).toThrow();
  });
});
