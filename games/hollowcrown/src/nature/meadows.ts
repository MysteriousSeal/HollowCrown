// The Vale's meadows (map areas of kind 'meadow'): tufts of long grass gone to seed and wildflowers in small clumps
// (poppies, cornflowers, oxeye daisies, buttercups), on most tiles of them, each where its tile's hash puts it (the same
// every time), none on a road, a field or what's built. A few voxels each, instanced (instanced.ts): cheap by the
// thousand.

import { hashUnit } from '@voxel/engine/math';
import { createGrid, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { boundsOf, chunkKeysIn, chunkTilesIn, covers, type ChunkLayer, type Obstacles, type WorldMap } from '@voxel/engine/world';
import { instancedLayer, natureGeometry, type Growth } from './instanced';
import { N } from './palette';

const TUFTED = 0.55; // the share of a meadow's tiles with a tuft of grass
const FLOWERED = 0.16; // and with a clump of flowers

// ---- the shapes ----

// A tuft: a handful of blades, the tallest in the middle gone to seed, the short ones round it each one shade (one
// color a blade keeps it a few quads).
function tuft(variant: number): VoxelGrid {
  const g = createGrid([5, 6, 5]);
  for (let y = 0; y < 5; y++) setColor(g, 2, y, 2, y < 4 ? N.grass : N.seedHead);
  const round: Array<[number, number]> = [[1, 2], [3, 1], [2, 3], [0, 1], [4, 3], [1, 4], [3, 0]];
  round.forEach(([x, z], i) => {
    if (hashUnit(i, variant, 61) < 0.25) return;
    const tall = 1 + Math.floor(hashUnit(i, variant, 62) * 3);
    for (let y = 0; y < tall; y++) setColor(g, x, y, z, i % 2 ? N.grassDark : N.grassLight);
  });
  return g;
}

// A clump of flowers: two (or three) on stems of their own height, each head a cross of petals round its eye.
const FLOWERS: Array<{ petal: number; eye: number }> = [
  { petal: N.poppy, eye: N.grassDark },
  { petal: N.cornflower, eye: N.cornflower },
  { petal: N.daisy, eye: N.daisyEye },
  { petal: N.buttercup, eye: N.buttercup },
];
function flowers(kind: number): VoxelGrid {
  const g = createGrid([7, 7, 7]);
  const { petal, eye } = FLOWERS[kind];
  const stems: Array<[number, number, number]> = [[3, 3, 5], [1, 4, 3], [5, 1, 4]];
  for (const [x, z, h] of stems.slice(0, 2 + (kind % 2))) {
    for (let y = 0; y < h; y++) setColor(g, x, y, z, N.stem);
    setColor(g, x, h, z, eye);
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) setColor(g, x + dx, h, z + dz, petal);
  }
  return g;
}

const TUFTS = 3; // tuft shapes

// ---- where they grow ----

// The tiles round each meadow on `map` (x1, z1: just past its last).
const meadowsOf = (map: WorldMap) =>
  map.data.areas.filter((a) => a.kind === 'meadow').map((area) => {
    const b = boundsOf(area.shape);
    return { area, tiles: { x0: b.x0, z0: b.z0, x1: b.x1 + 1, z1: b.z1 + 1 } };
  });

// The chunks the meadows on `map` reach into.
export function meadowChunks(map: WorldMap): Set<string> {
  return new Set(meadowsOf(map).flatMap(({ tiles }) => [...chunkKeysIn(tiles)]));
}

// Every tuft and clump in chunk `key` of `map`'s meadows; `keepOut`: what's built. (Each stays on its own tile.)
export function meadowGrowthIn(map: WorldMap, key: string, keepOut: Obstacles): Growth[] {
  const out: Growth[] = [];
  for (const { area, tiles } of meadowsOf(map)) {
    const t = chunkTilesIn(key, tiles);
    if (!t) continue;
    for (let x = t.x0; x < t.x1; x++) {
      for (let z = t.z0; z < t.z1; z++) {
        const roll = hashUnit(x, z, 501);
        if (roll >= TUFTED + FLOWERED || !covers(area.shape, x, z) || map.surfaceAt(x, z) !== 0) continue;
        const [gx, gz] = [x + (hashUnit(x, z, 502) - 0.5) * 0.8, z + (hashUnit(x, z, 503) - 0.5) * 0.8];
        if (keepOut.blocks(gx, gz, 0.3)) continue;
        const shape = roll < TUFTED ? `tuft${Math.floor(hashUnit(x, z, 504) * TUFTS)}` : `flowers${Math.floor(hashUnit(x, z, 504) * FLOWERS.length)}`;
        out.push({ x: gx, z: gz, shape, turn: Math.floor(hashUnit(x, z, 505) * 4), tint: hashUnit(x, z, 506) });
      }
    }
  }
  return out;
}

// Each shape's grid, by its key (the model viewer).
export const MEADOW_SHAPES: Record<string, () => VoxelGrid> = Object.fromEntries([
  ...Array.from({ length: TUFTS }, (_, v) => [`tuft${v}`, () => tuft(v)]),
  ...FLOWERS.map((_, k) => [`flowers${k}`, () => flowers(k)]),
]);

// The layer of the meadows' grass and flowers (instanced.ts), each chunk's worked out as it first comes near.
export function meadowLayer(map: WorldMap, keepOut: Obstacles): ChunkLayer {
  return instancedLayer(map, meadowChunks(map), (key) => meadowGrowthIn(map, key, keepOut), (shape) => natureGeometry(MEADOW_SHAPES[shape]()), 0.1);
}

// Every tuft and clump in `map`'s meadows at once, by chunk (for tests and tools: the game grows them a chunk at a time).
export function meadowGrowth(map: WorldMap, keepOut: Obstacles): Map<string, Growth[]> {
  return new Map([...meadowChunks(map)].map((key) => [key, meadowGrowthIn(map, key, keepOut)]));
}
