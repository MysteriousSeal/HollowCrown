// The Vale's meadows (map areas of kind 'meadow'): tufts of long grass gone to seed and wildflowers in small clumps
// (poppies, cornflowers, oxeye daisies, buttercups), on most tiles of them, each where its tile's hash puts it (the same
// every time), none on a road, a field or what's built. A few voxels each, instanced (instanced.ts): cheap by the
// thousand.

import { hashUnit } from '@voxel/engine/math';
import { createGrid, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { CHUNK_SIZE, boundsOf, covers, type ChunkLayer, type Obstacles, type WorldMap } from '@voxel/engine/world';
import { instancedLayer, natureGeometry, plant, type Growth } from './instanced';
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

// A clump of flowers: two or three on stems of their own height, each head a cross of petals round its eye.
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
  setColor(g, 2, 0, 3, N.grass); // a leaf or two at the foot
  setColor(g, 4, 0, 3, N.grass);
  return g;
}

const TUFTS = 3; // tuft shapes

// ---- where they grow ----

// Every tuft and clump in the meadows on `map`, by chunk; `keepOut`: what's built.
export function meadowGrowth(map: WorldMap, keepOut: Obstacles): Map<string, Growth[]> {
  const byChunk = new Map<string, Growth[]>();
  for (const area of map.data.areas.filter((a) => a.kind === 'meadow')) {
    const b = boundsOf(area.shape);
    for (let x = b.x0; x <= b.x1; x++) {
      for (let z = b.z0; z <= b.z1; z++) {
        if (!covers(area.shape, x, z) || map.surfaceAt(x, z) !== 0) continue;
        const roll = hashUnit(x, z, 501);
        if (roll >= TUFTED + FLOWERED) continue;
        const [gx, gz] = [x + (hashUnit(x, z, 502) - 0.5) * 0.8, z + (hashUnit(x, z, 503) - 0.5) * 0.8];
        if (keepOut.blocks(gx, gz, 0.3)) continue;
        const shape = roll < TUFTED ? `tuft${Math.floor(hashUnit(x, z, 504) * TUFTS)}` : `flowers${Math.floor(hashUnit(x, z, 504) * FLOWERS.length)}`;
        plant(byChunk, { x: gx, z: gz, shape, turn: Math.floor(hashUnit(x, z, 505) * 4), tint: hashUnit(x, z, 506) }, CHUNK_SIZE);
      }
    }
  }
  return byChunk;
}

// Each shape's grid, by its key (the model viewer).
export const MEADOW_SHAPES: Record<string, () => VoxelGrid> = Object.fromEntries([
  ...Array.from({ length: TUFTS }, (_, v) => [`tuft${v}`, () => tuft(v)]),
  ...FLOWERS.map((_, k) => [`flowers${k}`, () => flowers(k)]),
]);

// The layer of the meadows' grass and flowers (instanced.ts).
export function meadowLayer(map: WorldMap, byChunk: Map<string, Growth[]>): ChunkLayer {
  const shapes = new Map(Object.entries(MEADOW_SHAPES).map(([key, make]) => [key, natureGeometry(make())]));
  return instancedLayer(map, byChunk, shapes, 0.1);
}
