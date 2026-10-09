// The Vale's dressing stands out of the way: no prop or fence on a road, a path, water or a building, none blocking a
// door, and every landmark's own thing by its landmark.

import { describe, expect, it } from 'vitest';
import { covers, loadWorldMap, type Point } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { DRESSING } from '../src/data/world/dressing';
import { footprint } from '../src/data/world/kinds';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const buildings = WORLD_MAP.places.filter((p) => p.kind === 'building');
const inBuilding = new Set(buildings.flatMap((b) => {
  const f = footprint(b);
  const tiles: string[] = [];
  for (let x = f.x0; x <= f.x1; x++) for (let z = f.z0; z <= f.z1; z++) tiles.push(`${x},${z}`);
  return tiles;
}));
const doors = new Set(buildings.map((b) => footprint(b).door.join(',')));
const WAYS = new Set(['road', 'track', 'path', 'ford']);

// What's wrong with a prop or a fence touching tile (x, z), if anything.
function trouble(x: number, z: number): string | undefined {
  const surface = map.surfaceNames[map.surfaceAt(x, z) - 1];
  if (!map.walkable(x, z)) return `on ${surface}`;
  if (surface && WAYS.has(surface)) return `on a ${surface}`;
  if (inBuilding.has(`${x},${z}`)) return 'in a building';
  if (doors.has(`${x},${z}`)) return 'in a doorway';
  return undefined;
}

describe("the Vale's dressing", () => {
  it('stands every prop on open ground', () => {
    for (const d of DRESSING.filter((d) => d.at && d.kind !== 'garden-bed')) expect(trouble(...d.at!), `${d.note} at (${d.at})`).toBeUndefined();
  });

  it('lays every garden bed (3 tiles by 2) wholly on its garden, a few in each', () => {
    const beds = DRESSING.filter((d) => d.kind === 'garden-bed');
    expect(beds.length).toBeGreaterThanOrEqual(11);
    for (const { at: [x, z] = [0, 0], note } of beds) {
      for (const dx of [-1, 0, 1]) for (const dz of [-0.5, 0.5]) {
        expect(map.surfaceNames[map.surfaceAt(x + dx, z + dz) - 1], `${note} at (${x + dx}, ${z + dz})`).toBe('garden');
      }
    }
  });

  it('runs every fence on tile edges, never across a road or path, by water or in a doorway', () => {
    for (const d of DRESSING.filter((d) => d.kind === 'fence')) {
      const [[ax, az], [bx, bz]] = d.line as [Point, Point];
      expect(ax === bx || az === bz, d.note).toBe(true);
      const steps = Math.max(Math.abs(bx - ax), Math.abs(bz - az));
      for (let s = 0; s < steps; s++) {
        const [x, z] = [ax + ((bx - ax) * (s + 0.5)) / steps, az + ((bz - az) * (s + 0.5)) / steps];
        const sides = [[Math.floor(x), Math.floor(z)], [Math.ceil(x), Math.ceil(z)]] as Point[];
        const ways = sides.filter(([tx, tz]) => WAYS.has(map.surfaceNames[map.surfaceAt(tx, tz) - 1]));
        expect(ways.length, `${d.note}: across a way at (${sides[0]})`).toBeLessThan(2);
        for (const [tx, tz] of sides) {
          expect(map.walkable(tx, tz), `${d.note}: by water at (${tx}, ${tz})`).toBe(true);
          expect(doors.has(`${tx},${tz}`), `${d.note}: in a doorway at (${tx}, ${tz})`).toBe(false);
        }
      }
    }
  });

  it("stands Tallow Green's oak on its green and Agna's skeps in their clearing, out of the woods", () => {
    const woods = WORLD_MAP.areas.find((a) => a.id === 'brindle-woods')!;
    const hives = DRESSING.filter((d) => d.kind === 'hive');
    expect(hives.length).toBeGreaterThanOrEqual(3);
    for (const h of hives) {
      expect(covers(woods.shape, ...h.at!), h.note).toBe(false);
      expect(Math.hypot(h.at![0] - 1180, h.at![1] - 3000)).toBeLessThanOrEqual(5);
    }
    const oak = DRESSING.find((d) => d.kind === 'old-oak')!;
    expect(oak.at).toEqual(map.place('tallow-green-oak')!.at);
  });

  it('runs hedgerows beside the roads, never on a road, a track, water or a building', () => {
    const hedges = DRESSING.filter((d) => d.kind === 'hedge');
    expect(hedges.length).toBeGreaterThanOrEqual(8);
    for (const h of hedges) {
      const [[ax, az], [bx, bz]] = h.line as [Point, Point];
      const steps = Math.ceil(Math.hypot(bx - ax, bz - az));
      for (let s = 0; s <= steps; s++) {
        const [x, z] = [Math.round(ax + ((bx - ax) * s) / steps), Math.round(az + ((bz - az) * s) / steps)];
        expect(trouble(x, z), `${h.note} at (${x}, ${z})`).toBeUndefined();
      }
    }
  });

  it('has the gibbet, the nine Sisters and the Hanging Oak by their landmarks', () => {
    const near = (kind: string, id: string, within: number) => DRESSING.filter((d) => d.kind === kind && Math.hypot(d.at![0] - map.place(id)!.at[0], d.at![1] - map.place(id)!.at[1]) <= within);
    expect(near('gibbet', 'gibbet', 0)).toHaveLength(1);
    expect(near('standing-stone', 'nine-sisters', 8)).toHaveLength(9);
    expect(near('hanging-oak', 'hanging-oak', 8)).toHaveLength(1);
    expect(DRESSING.filter((d) => d.kind === 'hay-rick').every((d) => d.at![0] >= 750 && d.at![0] <= 1050 && d.at![1] >= 3250 && d.at![1] <= 3500)).toBe(true);
  });
});
