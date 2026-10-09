// QA: what's drawn on the ground and what stands on it agree. No building stands on a kitchen garden, a ploughed
// strip, a pond or a marsh; no villager stands in a garden, a strip or the pond.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../../src/data/world';
import { footprint } from '../../src/data/world/kinds';
import { villagersOf } from '../../src/features/villagers';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const surface = (x: number, z: number) => map.surfaceNames[map.surfaceAt(x, z) - 1] ?? 'grass';
const NOT_UNDERFOOT = new Set(['garden', 'field', 'water', 'marsh', 'river']);

describe('the ground under Brindleford', () => {
  it('stands no building on a garden, a field, water or marsh', () => {
    const wrong: string[] = [];
    for (const b of map.places('building')) {
      const f = footprint(b);
      for (let x = f.x0; x <= f.x1; x++) {
        for (let z = f.z0; z <= f.z1; z++) if (NOT_UNDERFOOT.has(surface(x, z))) wrong.push(`${b.id} at (${x}, ${z}): ${surface(x, z)}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('stands no villager in a garden, a field or the pond', () => {
    const wrong = villagersOf(map)
      .map((v) => ({ v, s: surface(Math.round(v.x), Math.round(v.z)) }))
      .filter(({ s }) => NOT_UNDERFOOT.has(s))
      .map(({ v, s }) => `${v.name}: ${s}`);
    expect(wrong).toEqual([]);
  });
});
