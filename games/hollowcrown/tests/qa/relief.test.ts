// QA: the uneven ground (the engine's relief) and what stands on it. Every building stands level on its ground: no
// tile under it higher than its floor (the grass coming through) or lower (the house in the air). The roads, the
// river and every drawn surface stay flat, and stay walkable; and a walker's feet are where the ground is drawn.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { levelGround } from '../../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../../src/data/world';
import { footprint } from '../../src/data/world/kinds';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
levelGround(map); // (as the buildings feature does, before anything is drawn)

describe('uneven ground', () => {
  it('is really uneven somewhere in the Vale (the relief is on)', () => {
    const tops = new Set<number>();
    for (let x = 700; x < 760; x++) tops.add(map.reliefAt(x, 3300));
    expect(tops.size).toBeGreaterThan(1);
  });

  // (Was a bug: 15 buildings floated over dips, grass through their floors. Fixed: engine's flatten, levelGround.)
  it('lets every building stand level, its footprint all at its floor', () => {
    const uneven: string[] = [];
    for (const b of map.places('building')) {
      const floor = map.groundY(...b.at);
      const f = footprint(b);
      let [low, high] = [Infinity, -Infinity];
      for (let x = f.x0; x <= f.x1; x++) {
        for (let z = f.z0; z <= f.z1; z++) [low, high] = [Math.min(low, map.groundY(x, z)), Math.max(high, map.groundY(x, z))];
      }
      if (high - floor > 1e-6 || floor - low > 1e-6) uneven.push(`${b.id}: floor ${floor.toFixed(2)}, ground ${low.toFixed(2)}..${high.toFixed(2)}`);
    }
    expect(uneven).toEqual([]);
  });

  it('keeps every drawn surface flat and the roads walkable', () => {
    const bumps: string[] = [];
    for (const s of WORLD_MAP.surfaces.filter((s) => 'line' in s.shape)) {
      for (const [x, z] of (s.shape as { line: Array<[number, number]> }).line) {
        const [tx, tz] = [Math.round(x), Math.round(z)];
        if (map.surfaceAt(tx, tz) !== 0 && map.reliefAt(tx, tz) !== 0) bumps.push(`${s.note} at (${tx}, ${tz})`);
        if (s.surface === 'road' && !map.walkable(tx, tz)) bumps.push(`${s.note} not walkable at (${tx}, ${tz})`);
      }
    }
    expect(bumps).toEqual([]);
  });

  it("puts feet on the drawn ground: a tile's height is its tier and its relief, at any point on it", () => {
    for (const [x, z] of [[731, 3301], [731.4, 3300.6], [900, 3350], [1080, 3180]] as Array<[number, number]>) {
      const [tx, tz] = [Math.round(x), Math.round(z)];
      expect(map.groundY(x, z)).toBeCloseTo(map.groundY(tx, tz), 9);
      expect(map.groundY(x, z)).toBeCloseTo(map.tierAt(tx, tz) * 0.15 + map.reliefAt(tx, tz) * (0.15 / 3), 9);
    }
  });
});
