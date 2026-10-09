// A voxel grid: a box of cells, each a palette index + 1 (0 empty), and reading and writing its cells.

export type Size = [number, number, number]; // voxels (or a position in them) along x, y, z

export interface VoxelGrid {
  size: Size;
  cells: Uint8Array; // palette index + 1 per voxel (0 = empty), x fastest, then y, then z
}

export const voxelIndex = (grid: VoxelGrid, x: number, y: number, z: number): number => x + grid.size[0] * (y + grid.size[1] * z);

export const inGrid = (grid: VoxelGrid, x: number, y: number, z: number): boolean =>
  x >= 0 && y >= 0 && z >= 0 && x < grid.size[0] && y < grid.size[1] && z < grid.size[2];

export function createGrid(size: Size): VoxelGrid {
  return { size, cells: new Uint8Array(size[0] * size[1] * size[2]) };
}

// The color at a voxel; 0 outside the grid.
export const colorAt = (grid: VoxelGrid, x: number, y: number, z: number): number => (inGrid(grid, x, y, z) ? grid.cells[voxelIndex(grid, x, y, z)] : 0);

export function setColor(grid: VoxelGrid, x: number, y: number, z: number, color: number): void {
  grid.cells[voxelIndex(grid, x, y, z)] = color;
}

export function forEachVoxel(grid: VoxelGrid, fn: (x: number, y: number, z: number) => void): void {
  const [sx, sy, sz] = grid.size;
  for (let z = 0; z < sz; z++) for (let y = 0; y < sy; y++) for (let x = 0; x < sx; x++) fn(x, y, z);
}
