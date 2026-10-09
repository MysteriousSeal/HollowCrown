// Painting into a grid relative to an offset: a model built inside a padded grid (a body with room round it for
// what it wears) paints in its own coordinates, so -1 is the layer just outside its low side, whatever the pad.

import { colorAt, inGrid, setColor, type Size, type VoxelGrid } from './grid';

// A color for a voxel (0: leave it).
export type Paint = (x: number, y: number, z: number) => number;

// Fills a box (offset-relative, inclusive) with a color, or what `at` says (0 leaves the cell as it is).
export function box(g: VoxelGrid, o: Size, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, at: number | Paint): void {
  for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const [gx, gy, gz] = [x + o[0], y + o[1], z + o[2]];
    if (!inGrid(g, gx, gy, gz)) continue;
    const c = typeof at === 'number' ? at : at(x, y, z);
    if (c) setColor(g, gx, gy, gz, c);
  }
}

// Clears a box (offset-relative, inclusive) where `keep` doesn't hold.
export function erase(g: VoxelGrid, o: Size, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, keep?: (x: number, y: number, z: number) => boolean): void {
  for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const [gx, gy, gz] = [x + o[0], y + o[1], z + o[2]];
    if (inGrid(g, gx, gy, gz) && !keep?.(x, y, z)) setColor(g, gx, gy, gz, 0);
  }
}

// Recolors what's there already: `at` gets each filled voxel (offset-relative) and its color.
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
export function wrap(g: VoxelGrid, o: Size, at: Paint): void {
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

// Every voxel of color `from` turned to `to`.
export const recolor = (g: VoxelGrid, from: number, to: number): void => over(g, [0, 0, 0], (_x, _y, _z, c) => (c === from ? to : 0));

// Copies `from` into `to` at offset `o` (its empty cells leave `to` as it is).
export function stamp(to: VoxelGrid, from: VoxelGrid, o: Size): void {
  const [sx, sy, sz] = from.size;
  for (let z = 0; z < sz; z++) for (let y = 0; y < sy; y++) for (let x = 0; x < sx; x++) {
    const c = colorAt(from, x, y, z);
    if (c) setColor(to, x + o[0], y + o[1], z + o[2], c);
  }
}
