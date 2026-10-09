// Shapes filled into voxel grids: boxes, ellipsoids, lines; and an outline nibbled. Colors are palette index + 1
// (0 = empty), as the greedy mesher expects.

import { colorAt, forEachVoxel, setColor, type Size, type VoxelGrid } from './grid';

// Fills the inclusive box [x0..x1] x [y0..y1] x [z0..z1] (clipped to the grid).
export function fillBox(
  grid: VoxelGrid,
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  color: number | ((x: number, y: number, z: number) => number),
): void {
  const [sx, sy, sz] = grid.size;
  for (let z = Math.max(0, z0); z <= Math.min(sz - 1, z1); z++) {
    for (let y = Math.max(0, y0); y <= Math.min(sy - 1, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(sx - 1, x1); x++) {
        setColor(grid, x, y, z, typeof color === 'number' ? color : color(x, y, z));
      }
    }
  }
}

// One-voxel-thick straight line between two voxels (inclusive), e.g. a brace.
export function voxelLine(grid: VoxelGrid, from: Size, to: Size, color: number): void {
  const steps = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]), Math.abs(to[2] - from[2]), 1);
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const [x, y, z] = [0, 1, 2].map((a) => Math.round(from[a] + (to[a] - from[a]) * t));
    if (x >= 0 && y >= 0 && z >= 0 && x < grid.size[0] && y < grid.size[1] && z < grid.size[2]) setColor(grid, x, y, z, color);
  }
}

// Exposed on any side except straight down (bottoms rest on the ground or trunk).
export function isSurface(grid: VoxelGrid, x: number, y: number, z: number): boolean {
  return (
    colorAt(grid, x + 1, y, z) === 0 ||
    colorAt(grid, x - 1, y, z) === 0 ||
    colorAt(grid, x, y + 1, z) === 0 ||
    colorAt(grid, x, y, z + 1) === 0 ||
    colorAt(grid, x, y, z - 1) === 0
  );
}

// Fills the ellipsoid about `center`, `radii` along each axis (voxel centers inside it), coloured by `paint` (0: left as
// it is), which also gets how far out the voxel lies (0 at the center, 1 on the surface). `offset`: where (0, 0, 0)
// is in the grid (painting relative to a body inside a padded grid). Clipped to the grid.
export function fillEllipsoid(
  grid: VoxelGrid,
  center: Size,
  radii: Size,
  paint: (x: number, y: number, z: number, r: number) => number,
  offset: Size = [0, 0, 0],
): void {
  const [cx, cy, cz] = center;
  const [rx, ry, rz] = radii;
  const [ox, oy, oz] = offset;
  const [sx, sy, sz] = grid.size;
  for (let z = Math.max(-oz, Math.floor(cz - rz)); z <= Math.min(sz - 1 - oz, Math.ceil(cz + rz)); z++) {
    for (let y = Math.max(-oy, Math.floor(cy - ry)); y <= Math.min(sy - 1 - oy, Math.ceil(cy + ry)); y++) {
      for (let x = Math.max(-ox, Math.floor(cx - rx)); x <= Math.min(sx - 1 - ox, Math.ceil(cx + rx)); x++) {
        const r = ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 + ((z + 0.5 - cz) / rz) ** 2;
        if (r > 1) continue;
        const color = paint(x, y, z, r);
        if (color) setColor(grid, x + ox, y + oy, z + oz, color);
      }
    }
  }
}

export interface Ellipsoid {
  cx: number;
  cy: number;
  cz: number;
  rx: number;
  ry: number;
  rz: number;
}

export function insideEllipsoid(e: Ellipsoid, x: number, y: number, z: number): boolean {
  const dx = (x + 0.5 - e.cx) / e.rx;
  const dy = (y + 0.5 - e.cy) / e.ry;
  const dz = (z + 0.5 - e.cz) / e.rz;
  return dx * dx + dy * dy + dz * dz <= 1;
}

// Knocks out a fraction of exposed voxels at or above minY, so outlines
// read as organic rather than perfect geometric shapes. Only voxels of the
// given color are eligible (e.g. foliage, never the trunk).
export function nibble(grid: VoxelGrid, rng: () => number, chance: number, minY: number, color: number): void {
  const doomed: Array<[number, number, number]> = [];
  forEachVoxel(grid, (x, y, z) => {
    if (y >= minY && colorAt(grid, x, y, z) === color && isSurface(grid, x, y, z) && rng() < chance) doomed.push([x, y, z]);
  });
  for (const [x, y, z] of doomed) setColor(grid, x, y, z, 0);
}
