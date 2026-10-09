// Ambient life, planned (design's LIFE, src/data/world/life.ts): the land in cells, and in each cell, for each kind
// of wildlife, whether a tile is its habitat, how many live there (its density over the cell's share of habitat,
// in groups), and where each stands. The same cell plans the same every time: it's drawn from a hash, not chance.
// Who uses it: the ambient feature, bringing in the cells round the hero.

import { hashUnit } from '@voxel/engine/math';
import type { Point, WorldMap } from '@voxel/engine/world';
import type { Habitat, RegionLife, Wildlife } from '../data/world/life';
import { inHours } from './roaming';

export const CELL = 16; // tiles a cell's side
const SAMPLE = 2; // tiles between the points a cell's habitat is sampled at

// The creature models each kind is drawn from, by turns (CREATURES' ids). A kind without one isn't brought in yet.
export const MODELS: Partial<Record<Wildlife['kind'], string[]>> = {
  rabbit: ['rabbit'],
  deer: ['deerDoe', 'deerDoe', 'deerStag'],
  fox: ['fox'],
  duck: ['mallardDrake', 'mallardDuck'],
  frog: ['frog'],
  rook: ['rook'],
  crow: ['crow'],
  songbird: ['sparrow', 'chaffinch'],
  butterfly: ['butterflyWhite', 'butterflyPeacock', 'butterflyBrimstone'],
  hen: ['henBrown', 'henWhite'],
  dog: ['dog'],
  sheep: ['sheep'],
  cow: ['cow'],
};
// Moths: the meadows' butterflies' place at night (no entry of design's of their own).
export const MOTHS: Wildlife = { kind: 'butterfly', note: 'moths over the meadows at night', where: { in: ['kind:meadow'] }, hours: [20, 4], density: 6, group: [1, 2] };

// Whether (x, z) is `where`'s: every condition it gives holds.
export function isHabitat(map: WorldMap, where: Habitat, x: number, z: number): boolean {
  if (where.near && Math.hypot(x - where.near.at[0], z - where.near.at[1]) > where.near.radius) return false;
  if (where.on) {
    const n = map.surfaceAt(x, z);
    const name = n === 0 ? 'grass' : map.surfaceNames[n - 1];
    if (!(where.on as string[]).includes(name)) return false;
  }
  if (where.in && !inAreas(map, where.in, x, z)) return false;
  if (where.edge) {
    const { of, tiles } = where.edge;
    const inside = (px: number, pz: number) => map.areasAt(px, pz).some((a) => a.kind === of);
    const here = inside(x, z);
    const near = [[tiles, 0], [-tiles, 0], [0, tiles], [0, -tiles]].some(([dx, dz]) => inside(x + dx, z + dz) !== here);
    if (!near) return false;
  }
  return true;
}
const inAreas = (map: WorldMap, ids: string[], x: number, z: number) =>
  map.areasAt(x, z).some((a) => ids.some((id) => (id.startsWith('kind:') ? a.kind === id.slice(5) : a.id === id)));

// One of a kind, planned: which entry of the region's (its index; -1: the moths), which model, where.
export interface Planned {
  entry: number;
  model: string;
  at: Point;
}

// Everything that lives in cell (cx, cz) at `hours`: each kind out at that hour, in groups round habitat tiles, none
// where it's quiet.
export function planCell(map: WorldMap, life: RegionLife, cx: number, cz: number, hours: number): Planned[] {
  const out: Planned[] = [];
  const entries = [...life.wildlife, MOTHS];
  entries.forEach((w, i) => {
    const entry = i === life.wildlife.length ? -1 : i;
    const models = MODELS[w.kind];
    if (!models || (w.hours && !inHours(hours, w.hours))) return;
    const spots: Point[] = [];
    for (let x = cx * CELL + 1; x < (cx + 1) * CELL; x += SAMPLE) {
      for (let z = cz * CELL + 1; z < (cz + 1) * CELL; z += SAMPLE) {
        if (isHabitat(map, w.where, x, z) && !life.quiet.some((q) => Math.hypot(x - q.at[0], z - q.at[1]) < q.radius)) spots.push([x, z]);
      }
    }
    if (!spots.length) return;
    const tiles = spots.length * SAMPLE * SAMPLE;
    const [least, most] = w.group ?? [1, 1];
    const expected = (w.density * tiles) / 1000 / ((least + most) / 2);
    const groups = Math.floor(expected + hashUnit(cx * 31 + i, cz, 91));
    for (let g = 0; g < groups; g++) {
      const [sx, sz] = spots[Math.floor(hashUnit(cx * 7 + g, cz * 13 + i, 92) * spots.length)];
      const size = least + Math.floor(hashUnit(cx + g, cz + i, 93) * (most - least + 1));
      for (let k = 0; k < size; k++) {
        const angle = hashUnit(cx * 3 + g * 5 + k, cz + i, 94) * Math.PI * 2;
        const r = 0.6 + hashUnit(cx + k, cz * 3 + g + i, 95) * 1.6;
        const [x, z] = [sx + Math.cos(angle) * r, sz + Math.sin(angle) * r];
        const at: Point = isHabitat(map, w.where, x, z) ? [x, z] : [sx, sz];
        out.push({ entry, model: models[(g + k) % models.length], at });
      }
    }
  });
  return out;
}

// The cells within `radius` tiles of (x, z).
export function cellsNear(x: number, z: number, radius: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const [x0, x1, z0, z1] = [x - radius, x + radius, z - radius, z + radius].map((v) => Math.floor(v / CELL));
  for (let cx = x0; cx <= x1; cx++) for (let cz = z0; cz <= z1; cz++) out.push([cx, cz]);
  return out;
}
