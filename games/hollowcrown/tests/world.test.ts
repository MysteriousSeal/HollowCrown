// The Vale's map loads clean, and it's a world the story can be played in: every place stands somewhere it can be
// reached, the roads can be walked end to end, the rivers and lakes can't be.

import { describe, expect, it } from 'vitest';
import { checkWorldMap, covers, loadWorldMap, type Point } from '@voxel/engine/world';
import { PLACE_KINDS, START_PLACE, WORLD_MAP } from '../src/data/world';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);

// Points every step of a path's way.
function* along(points: Point[]): Generator<Point> {
  for (let i = 0; i < points.length - 1; i++) {
    const [[ax, az], [bx, bz]] = [points[i], points[i + 1]];
    const steps = Math.ceil(Math.hypot(bx - ax, bz - az));
    for (let s = 0; s <= steps; s++) yield [ax + ((bx - ax) * s) / steps, az + ((bz - az) * s) / steps];
  }
}

describe('the Vale map', () => {
  it('has no problems', () => {
    expect(checkWorldMap(WORLD_MAP, PLACE_KINDS)).toEqual([]);
  });

  it('starts at the Pilgrim\'s Shrine, on the road', () => {
    const start = map.place(START_PLACE)!;
    expect(start.at).toEqual([480, 3380]);
    expect(map.surfaceNames[map.surfaceAt(...start.at) - 1]).toBe('road');
  });

  it('stands every place on ground that can be walked, inside a region', () => {
    const regions = WORLD_MAP.areas.filter((a) => a.kind === 'region');
    for (const p of map.places()) {
      expect(map.walkable(...p.at), p.id).toBe(true);
      expect(regions.some((r) => covers(r.shape, ...p.at)), `${p.id} in no region`).toBe(true);
    }
  });

  it('lets every road be walked end to end (the Brindle crossed at the ford)', () => {
    for (const road of WORLD_MAP.surfaces.filter((s) => s.surface === 'road' && 'line' in s.shape)) {
      for (const [x, z] of along((road.shape as { line: Point[] }).line)) expect(map.walkable(x, z), `${road.note} at (${x}, ${z})`).toBe(true);
    }
  });

  it('keeps the river, the lake and the sea from being walked, but not the ford or the Stepping Stones', () => {
    expect(map.walkable(867, 3150)).toBe(false); // the Brindle
    expect(map.walkable(2000, 2100)).toBe(false); // Hollowmere
    expect(map.walkable(80, 2000)).toBe(false); // the sea
    expect(map.walkable(870, 3350)).toBe(true); // the ford
    expect(map.walkable(850, 3620)).toBe(true); // the Stepping Stones
  });

  it('walls the realm in with mountains', () => {
    for (const [x, z] of [[2000, 50], [4050, 2000], [2000, 4050], [100, 3500]] as Point[]) expect(map.walkable(x, z)).toBe(false);
  });

  it('draws the hills at the heights the region bible gives', () => {
    expect(map.tierAt(1080, 3180)).toBe(3); // Chapel Hill's crown
    expect(map.tierAt(1400, 3650)).toBe(5); // Mosshill's top
    expect(map.tierAt(700, 2910)).toBe(4); // the North Rise's rim
    expect(map.tierAt(480, 3380)).toBe(1); // the shrine, in the valley
  });
});
