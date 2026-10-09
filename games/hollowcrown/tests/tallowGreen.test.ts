// Tallow Green's buildings stand round its green: on bare, dry ground, none overlapping, every door reachable on foot
// from the green, and everyone in them someone the region's bible names.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { covers, loadWorldMap, type PlaceData } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { footprint, type BuildingProps } from '../src/data/world/kinds';
import { TALLOW_GREEN } from '../src/data/world/tallowGreen';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const buildings = (TALLOW_GREEN.places ?? []).filter((p) => p.kind === 'building');
const tiles = (p: PlaceData) => {
  const f = footprint(p);
  const list: Array<[number, number]> = [];
  for (let x = f.x0; x <= f.x1; x++) for (let z = f.z0; z <= f.z1; z++) list.push([x, z]);
  return list;
};

describe('Tallow Green', () => {
  it('has eight buildings round a green with its old oak, the chandlery among them, and the hives up the slope', () => {
    expect(buildings).toHaveLength(8);
    expect(buildings.some((b) => b.id === 'chandlery')).toBe(true);
    const green = TALLOW_GREEN.areas!.find((a) => a.id === 'tallow-green-green')!;
    expect(covers(green.shape, ...map.place('tallow-green-oak')!.at)).toBe(true);
    expect(map.place('agnas-hives')!.at).toEqual([1180, 3000]);
    expect(map.surfaceNames[map.surfaceAt(1207, 3052) - 1]).toBe('road'); // the Pilgrim Road, up the green's east side
  });

  it('stands its buildings on bare ground, none overlapping, out of the woods', () => {
    const woods = WORLD_MAP.areas.find((a) => a.id === 'brindle-woods')!;
    const taken = new Set<string>();
    for (const b of buildings) {
      for (const [x, z] of tiles(b)) {
        expect(map.surfaceAt(x, z), `${b.id} at (${x}, ${z})`).toBe(0);
        expect(covers(woods.shape, x, z), `${b.id} in the woods`).toBe(false);
        expect(taken.has(`${x},${z}`), `${b.id} overlaps`).toBe(false);
        taken.add(`${x},${z}`);
      }
    }
  });

  it('can reach every door, and the hives, on foot from the oak', () => {
    const blocked = new Set(buildings.flatMap((b) => tiles(b).map(([x, z]) => `${x},${z}`)));
    const start = '1200,3050';
    const seen = new Set([start]);
    const queue: Array<[number, number]> = [[1200, 3050]];
    while (queue.length) {
      const [x, z] = queue.pop()!;
      for (const [nx, nz] of [[x + 1, z], [x - 1, z], [x, z + 1], [x, z - 1]]) {
        const key = `${nx},${nz}`;
        if (nx < 1160 || nx > 1240 || nz < 2995 || nz > 3080 || seen.has(key) || blocked.has(key) || !map.walkable(nx, nz)) continue;
        seen.add(key);
        queue.push([nx, nz]);
      }
    }
    for (const b of buildings) expect(seen.has(footprint(b).door.join(',')), `${b.id}'s door`).toBe(true);
    expect(seen.has('1180,3000')).toBe(true);
  });

  it("houses only people the region's bible names", () => {
    const bible = readFileSync(resolve(__dirname, '../docs/story/regions/brindle-vale.md'), 'utf8');
    for (const b of buildings) for (const who of (b.props as BuildingProps).residents) expect(bible.includes(who), `${who} (${b.id})`).toBe(true);
  });
});
