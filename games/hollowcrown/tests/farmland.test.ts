// The Vale's farmland between its places is drawn where it can be: every strip on dry land off the roads and tracks,
// inside its field, and inside the Vale.

import { describe, expect, it } from 'vitest';
import { covers, loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { VALE_FARMLAND } from '../src/data/world/valeFarmland';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const before = loadWorldMap({ ...WORLD_MAP, surfaces: WORLD_MAP.surfaces.filter((s) => !(VALE_FARMLAND.surfaces ?? []).includes(s as never)) }, PLACE_KINDS);
const vale = WORLD_MAP.areas.find((a) => a.id === 'brindle-vale')!;

describe("the Vale's farmland", () => {
  it('ploughs its strips over bare ground only, inside their fields and the Vale', () => {
    const fields = (VALE_FARMLAND.areas ?? []).filter((a) => a.kind === 'field');
    expect(fields.length).toBeGreaterThanOrEqual(2);
    for (const strip of VALE_FARMLAND.surfaces ?? []) {
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
});
