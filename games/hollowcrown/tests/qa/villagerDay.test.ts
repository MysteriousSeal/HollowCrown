// QA: Brindleford's villagers through a whole day on the real map, its walls in the way: they stroll round their
// doors from morning to evening without wandering off or into a house, and at dusk every one of them gets back to
// their door (none caught on a wall's corner, walking into it all night).

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { MoveSpeed, TimeOfDay, Transform, movementSystem, wanderSystem } from '@voxel/engine/gameplay';
import { ObstaclesResource, TerrainResource, loadWorldMap } from '@voxel/engine/world';
import { obstaclesOf } from '../../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../../src/data/world';
import { footprint } from '../../src/data/world/kinds';
import { villagersOf } from '../../src/features/villagers';
import { Resident, STROLL, villagerDaySystem } from '../../src/systems/villagerDay';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const DT = 1 / 30;

function brindleford() {
  const world = new World();
  world.setResource(TerrainResource, map);
  world.setResource(ObstaclesResource, obstaclesOf(map));
  world.setResource(TimeOfDay, { hours: 12, rate: 0 });
  const people = villagersOf(map)
    .filter((v) => !v.seated)
    .map((v) => ({ v, e: world.spawn([Transform, { x: v.x, y: 0, z: v.z, facing: v.facing }], [MoveSpeed, 1.2], [Resident, { home: { x: v.x, z: v.z }, facing: v.facing, seated: false }]) }));
  const run = (seconds: number) => {
    for (let t = 0; t < seconds; t += DT) for (const s of [villagerDaySystem, wanderSystem, movementSystem]) s.update(world, DT);
  };
  return { world, people, run };
}

// Whether (x, z) is inside a building's footprint, a tile in from its edge (its walls are inset; this is its floor).
const indoors = (x: number, z: number) =>
  map.places('building').some((b) => {
    const f = footprint(b);
    return x > f.x0 + 1 && x < f.x1 - 1 && z > f.z0 + 1 && z < f.z1 - 1;
  });

describe("Brindleford's villagers through a day", () => {
  it('stroll by day near their doors, never indoors', () => {
    const { world, people, run } = brindleford();
    const wrong: string[] = [];
    for (let minute = 0; minute < 4; minute++) {
      run(30);
      for (const { v, e } of people) {
        const at = world.read(e, Transform);
        if (Math.hypot(at.x - v.x, at.z - v.z) > STROLL.radius + 0.5) wrong.push(`${v.name} wandered ${Math.hypot(at.x - v.x, at.z - v.z).toFixed(1)} off`);
        if (indoors(at.x, at.z)) wrong.push(`${v.name} indoors at (${at.x.toFixed(1)}, ${at.z.toFixed(1)})`);
      }
    }
    expect([...new Set(wrong)]).toEqual([]);
  });

  it('all get back to their doors at dusk', () => {
    const { world, people, run } = brindleford();
    run(120);
    world.resource(TimeOfDay).hours = 22;
    run(20);
    const away = people
      .map(({ v, e }) => ({ v, at: world.read(e, Transform) }))
      .filter(({ v, at }) => Math.hypot(at.x - v.x, at.z - v.z) > 0.15)
      .map(({ v, at }) => `${v.name} at (${at.x.toFixed(2)}, ${at.z.toFixed(2)}), home (${v.x.toFixed(2)}, ${v.z.toFixed(2)})`);
    expect(away).toEqual([]);
  });
});
