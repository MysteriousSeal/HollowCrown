// Respawn: Retry brings the dead hero back whole, at the last rest if there's one, else at the shrine.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Dead, Health, Transform } from '@voxel/engine/gameplay';
import { loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { LastRest, Respawn, respawnSystem } from '../src/systems/respawn';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);

const dead = (rest: { x: number; z: number } | null) => {
  const world = new World();
  world.setResource(LastRest, rest);
  const hero = world.spawn([Transform, { x: 650, y: 0, z: 3420, facing: 0 }], [Health, { hp: 0, max: 30 }], [Dead, { since: 1 }]);
  return { world, hero, system: respawnSystem(hero, map, [480, 3380]) };
};

describe('respawn', () => {
  it('does nothing until Retry', () => {
    const { world, hero, system } = dead(null);
    system.update(world, 1 / 60);
    expect(world.has(hero, Dead)).toBe(true);
  });

  it('brings the hero back whole at the shrine', () => {
    const { world, hero, system } = dead(null);
    world.emit(Respawn, { at: 'rest' }); // (no rest yet: the shrine)
    system.update(world, 1 / 60);
    expect(world.has(hero, Dead)).toBe(false);
    expect(world.read(hero, Health).hp).toBe(30);
    expect(world.read(hero, Transform)).toMatchObject({ x: 480, z: 3380 });
  });

  it('or at the last rest', () => {
    const { world, hero, system } = dead({ x: 906, z: 3346 });
    world.emit(Respawn, { at: 'rest' });
    system.update(world, 1 / 60);
    expect(world.read(hero, Transform)).toMatchObject({ x: 906, z: 3346 });
  });
});
