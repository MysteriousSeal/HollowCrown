// What grows over the Vale's bare land (cover.ts), as voxel grids at the buildings' voxel, each with its own little
// palette: grass tufts in pale greys (each one tinted the grass's color where it grows), clumps of a flower (in its own
// color), bushes, stones. A few voxels each: they're drawn by the thousand.

import { hashUnit } from '@voxel/engine/math';
import { createGrid, fillBox, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { OAK_BANDS, NATURE } from './palette';
import { leaves, seeded, type Volume } from './shaping';

// A shape's grid and the palette it's painted from.
export interface CoverShape {
  grid: VoxelGrid;
  palette: number[];
}

// Grass: white to mid grey, multiplied by the grass's own color as it's drawn.
const GRASS = [0xffffff, 0xe6e6e6, 0xcccccc];

// A tuft of grass `tall` voxels high: a middle blade and a handful round it, shorter, each one shade (one color a blade
// keeps it a few quads); `variant` moves the blades round.
export function grassTuft(tall: number, variant: number): CoverShape {
  const g = createGrid([7, tall, 7]);
  fillBox(g, 3, 0, 3, 3, tall - 1, 3, 1);
  const round: Array<[number, number]> = [[2, 3], [4, 2], [3, 4], [1, 2], [5, 4], [2, 5], [4, 1], [5, 2], [0, 4], [6, 3], [3, 0], [1, 6]];
  round.forEach(([x, z], i) => {
    if (hashUnit(i, variant, 61) < 0.3) return;
    const h = Math.max(1, Math.round(tall * (0.4 + hashUnit(i, variant, 62) * 0.5)));
    fillBox(g, x, 0, z, x, h - 1, z, i % 2 ? 2 : 3);
  });
  return { grid: g, palette: GRASS };
}

// A clump of a flower: two or three on stems of their own heights, each head a cross of petals round its eye (`eye`:
// a darker heart, as a poppy's; none: all petal).
export function flowerClump(petal: number, variant: number, eye?: number): CoverShape {
  const g = createGrid([6, 6, 6]);
  const stems: Array<[number, number, number]> = [[2, 2, 4], [4, 3, 3], [1, 4, 2]];
  for (const [x, z, h] of stems.slice(0, 2 + (variant % 2))) {
    fillBox(g, x, 0, z, x, h - 1, z, 1);
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) setColor(g, x + dx, h, z + dz, 2);
    setColor(g, x, h, z, eye ? 3 : 2);
  }
  return { grid: g, palette: [0x4f7f34, petal, eye ?? petal] };
}

// A bush: a few leaf puffs on the ground, shaded as an oak's crown is (tinted a little, one from the next).
export function bush(variant: number): CoverShape {
  const g = createGrid([16, 11, 16]);
  const rand = seeded(0xb05 + variant * 37);
  const puffs: Volume[] = [{ cx: 8, cy: 4, cz: 8, rx: 5.5, ry: 4.5, rz: 5.5 }];
  for (let i = 0; i < 2 + variant; i++) {
    const a = rand() * Math.PI * 2;
    const r = 3 + rand() * 1.2;
    puffs.push({ cx: 8 + Math.cos(a) * 3.5, cy: r * 0.8, cz: 8 + Math.sin(a) * 3.5, rx: r, ry: r * 0.85, rz: r });
  }
  leaves(g, puffs, OAK_BANDS.slice(1), 0xb05 + variant, 0.08);
  return { grid: g, palette: NATURE.colors };
}

// A stone half sunk in the grass: a rough grey lump, its top paler, moss on its shaded side.
export function stone(variant: number): CoverShape {
  const [w, h, d] = [[7, 4, 5], [5, 3, 5], [9, 5, 6]][variant % 3];
  const g = createGrid([w, h, d]);
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < d; z++) {
      const r = Math.hypot((x + 0.5 - w / 2) / (w / 2), (z + 0.5 - d / 2) / (d / 2));
      const top = Math.round(h * (1 - r * r) + hashUnit(x, z, 90 + variant) * 0.8);
      for (let y = 0; y < Math.min(h, top); y++) setColor(g, x, y, z, y === top - 1 ? 1 : x + z < 3 ? 3 : 2);
    }
  }
  return { grid: g, palette: [0xa8a397, 0x8a867c, 0x5d7a3a] };
}
