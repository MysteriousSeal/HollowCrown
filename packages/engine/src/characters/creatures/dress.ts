// Painting on a dressed frame's grids (frameRig.ts): the human body sits in each padded grid at offset `o`, and these
// take coordinates relative to the body's own grid (so -1 is the layer just outside its low side), whatever the pad.

import { C, type Joint } from '../human/bodyVoxels';
import type { VoxelGrid } from '../../voxel/greedyMesh';
import { colorAt, setColor } from '../../voxel/voxelShapes';
import type { Size } from './creatureMesh';

type At = (x: number, y: number, z: number) => number; // a color (0: leave it)

const inGrid = (g: VoxelGrid, x: number, y: number, z: number) => x >= 0 && y >= 0 && z >= 0 && x < g.size[0] && y < g.size[1] && z < g.size[2];

// Fills a box (body-relative, inclusive) with a color, or what `at` says (0 leaves the cell as it is).
export function box(g: VoxelGrid, o: Size, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, at: number | At): void {
  for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const [gx, gy, gz] = [x + o[0], y + o[1], z + o[2]];
    if (!inGrid(g, gx, gy, gz)) continue;
    const c = typeof at === 'number' ? at : at(x, y, z);
    if (c) setColor(g, gx, gy, gz, c);
  }
}

// Clears a box (body-relative, inclusive) where `keep` doesn't hold.
export function erase(g: VoxelGrid, o: Size, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, keep?: (x: number, y: number, z: number) => boolean): void {
  for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const [gx, gy, gz] = [x + o[0], y + o[1], z + o[2]];
    if (inGrid(g, gx, gy, gz) && !keep?.(x, y, z)) setColor(g, gx, gy, gz, 0);
  }
}

// Recolors what's there already: `at` gets each filled voxel (body-relative) and its color.
export function over(g: VoxelGrid, o: Size, at: (x: number, y: number, z: number, c: number) => number): void {
  const [sx, sy, sz] = g.size;
  for (let z = 0; z < sz; z++) for (let y = 0; y < sy; y++) for (let x = 0; x < sx; x++) {
    const c = colorAt(g, x, y, z);
    if (!c) continue;
    const to = at(x - o[0], y - o[1], z - o[2], c);
    if (to) setColor(g, x, y, z, to);
  }
}

// One layer out round what's there (each empty cell touching a filled one on a side), colored as `at` says.
export function wrap(g: VoxelGrid, o: Size, at: At): void {
  const [sx, sy, sz] = g.size;
  const was = g.cells.slice();
  const filled = (x: number, y: number, z: number) => inGrid(g, x, y, z) && was[x + sx * (y + sy * z)] !== 0;
  for (let z = 0; z < sz; z++) for (let y = 0; y < sy; y++) for (let x = 0; x < sx; x++) {
    if (filled(x, y, z)) continue;
    if (!(filled(x - 1, y, z) || filled(x + 1, y, z) || filled(x, y - 1, z) || filled(x, y + 1, z) || filled(x, y, z - 1) || filled(x, y, z + 1))) continue;
    const c = at(x - o[0], y - o[1], z - o[2]);
    if (c) setColor(g, x, y, z, c);
  }
}

export const recolor = (g: VoxelGrid, from: number, to: number) => over(g, [0, 0, 0], (_x, _y, _z, c) => (c === from ? to : 0));

// A limb's outer side (away from the body): its right is -X, so the right limbs' outer side is low x.
export const isRight = (joint: Joint) => joint.startsWith('right');
export const outerX = (joint: Joint, width: number) => (isRight(joint) ? -1 : width);

// The body's palette (bodyPalette) with some entries swapped (by the body's C names: a dead skin, clouded eyes),
// then the gear's colors after it (from index 16).
export function bodyColors(base: number[], swaps: Partial<Record<keyof typeof C, number>>, gear: number[]): number[] {
  const out = base.slice();
  for (const [name, color] of Object.entries(swaps)) out[C[name as keyof typeof C] - 1] = color as number;
  return [...out, ...gear];
}
