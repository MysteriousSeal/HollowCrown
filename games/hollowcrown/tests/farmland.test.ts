// The Vale's farmland between its places is drawn where it can be: every strip on dry land off the roads and tracks,
// inside its field, and inside the Vale.

import { describe, expect, it } from 'vitest';
import { covers, loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { footprint } from '../src/data/world/kinds';
import { VALE_FARMLAND } from '../src/data/world/valeFarmland';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const before = loadWorldMap({ ...WORLD_MAP, surfaces: WORLD_MAP.surfaces.filter((s) => !(VALE_FARMLAND.surfaces ?? []).includes(s as never)) }, PLACE_KINDS);
const vale = WORLD_MAP.areas.find((a) => a.id === 'brindle-vale')!;

describe("the Vale's farmland", () => {
  it('ploughs its strips over bare ground only, inside their fields and the Vale', () => {
    const fields = (VALE_FARMLAND.areas ?? []).filter((a) => a.kind === 'field');
    expect(fields.length).toBeGreaterThanOrEqual(2);
    for (const strip of (VALE_FARMLAND.surfaces ?? []).filter((s) => s.surface === 'field')) {
      const [x0, z0, x1, z1] = (strip.shape as { rect: [number, number, number, number] }).rect;
      for (let x = x0; x <= x1; x++) {
        for (let z = z0; z <= z1; z++) {
          expect(before.surfaceAt(x, z), `${strip.note} at (${x}, ${z}) over a ${before.surfaceNames[before.surfaceAt(x, z) - 1]}`).toBe(0);
          expect(fields.some((f) => covers(f.shape, x, z)) && covers(vale.shape, x, z), `${strip.note} at (${x}, ${z})`).toBe(true);
          expect(map.walkable(x, z)).toBe(true);
        }
      }
    }
  });

  it('stands its farms and huts on bare ground, each door on or by a track or path out', () => {
    const buildings = (VALE_FARMLAND.places ?? []).filter((p) => p.kind === 'building');
    expect(buildings.length).toBeGreaterThanOrEqual(4);
    const way = (x: number, z: number) => ['track', 'path', 'road'].includes(map.surfaceNames[map.surfaceAt(x, z) - 1]);
    for (const b of buildings) {
      const f = footprint(b);
      for (let x = f.x0; x <= f.x1; x++) for (let z = f.z0; z <= f.z1; z++) expect(map.surfaceAt(x, z), `${b.id} at (${x}, ${z})`).toBe(0);
      const [dx, dz] = f.door;
      expect(map.walkable(dx, dz), `${b.id}'s door`).toBe(true);
      expect([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([ox, oz]) => way(dx + ox, dz + oz)), `${b.id}'s door has no way out`).toBe(true);
    }
  });
});
