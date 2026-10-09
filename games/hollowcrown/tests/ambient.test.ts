// Ambient life: a cell plans the same each time, its creatures on their habitat, sheep in the Cobbes' fields by day
// and not at night, nothing where it's quiet; startled, a rabbit runs and a bird flies off and is gone.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { MoveIntent, Transform } from '@voxel/engine/gameplay';
import { loadWorldMap } from '@voxel/engine/world';
import { CREATURES } from '../src/creatures';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { LIFE } from '../src/data/world/life';
import { CELL, MODELS, isHabitat, planCell } from '../src/systems/ambient';
import { Critter, FLY_FOR, critterSystem } from '../src/systems/critters';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const life = LIFE['brindle-vale'];
const cellOf = (x: number, z: number) => [Math.floor(x / CELL), Math.floor(z / CELL)] as const;

describe('ambient life', () => {
  it('draws every kind from creatures that exist', () => {
    for (const models of Object.values(MODELS)) for (const m of models!) expect(CREATURES.some((c) => c.id === m), m).toBe(true);
  });

  it("puts sheep in the Cobbes' fields by day, the same each time, none at night", () => {
    const fields = (hours: number) => {
      const [x0, z0] = cellOf(930, 3434);
      const [x1, z1] = cellOf(990, 3470);
      const all = [];
      for (let cx = x0; cx <= x1; cx++) for (let cz = z0; cz <= z1; cz++) all.push(...planCell(map, life, cx, cz, hours));
      return all;
    };
    const day = fields(12);
    expect(day.filter((p) => p.model === 'sheep').length).toBeGreaterThan(0);
    expect(fields(12)).toEqual(day);
    expect(fields(23).filter((p) => p.model === 'sheep')).toHaveLength(0);
    const groupsOnHabitat = day.filter((p) => p.entry >= 0 && isHabitat(map, life.wildlife[p.entry].where, ...p.at));
    expect(groupsOnHabitat.length / day.length).toBeGreaterThan(0.8); // (a group's stragglers may stand just off it)
  });

  it('keeps the famine pit quiet', () => {
    const [cx, cz] = cellOf(1090, 3200);
    for (const p of planCell(map, life, cx, cz, 12)) expect(Math.hypot(p.at[0] - 1090, p.at[1] - 3200)).toBeGreaterThanOrEqual(18);
  });

  it('runs a startled rabbit, and flies a startled crow off, gone', () => {
    const world = new World();
    const hero = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
    const rabbit = world.spawn([Transform, { x: 2, y: 0, z: 0, facing: 0 }], [Critter, { kind: 'rabbit', home: { x: 2, z: 0 }, tame: false, state: 'calm', flown: 0 }]);
    const crow = world.spawn([Transform, { x: 0, y: 0, z: 2, facing: 0 }], [Critter, { kind: 'crow', home: { x: 0, z: 2 }, tame: false, state: 'calm', flown: 0 }]);
    const gone: number[] = [];
    const system = critterSystem(hero, (e) => gone.push(e));
    system.update(world, 1 / 60);
    system.update(world, 1 / 60);
    expect(world.read(rabbit, Critter).state).toBe('running');
    expect(world.read(rabbit, MoveIntent).x).toBeGreaterThan(0);
    expect(world.read(crow, Critter).state).toBe('flying');
    for (let t = 0; t < FLY_FOR + 0.5; t += 0.1) system.update(world, 0.1);
    expect(gone).toContain(crow);
    expect(world.read(crow, Transform).z).toBeGreaterThan(10);
  });
});
