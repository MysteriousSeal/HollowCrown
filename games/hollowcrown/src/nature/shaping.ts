// The ways the Vale's trees are built (trees.ts) and shaded: a trunk on its root flare, a limb out to a crown, crowns
// of leaf puffs (each voxel the puff it's deepest in, its outline nibbled), and each puff or tier lit on its own (dark
// underneath, warm on the side toward the sun) rather than one gradient over the whole tree: that's what makes a crown
// read as clumps of leaves. Shading varies in blocks of two voxels, not one, so the mesher still merges faces: a tree
// stays cheap enough for thousands to stand in view.

import { hashUnit, noise3 } from '@voxel/engine/math';
import { SUN_DIRECTION } from '@voxel/engine/render';
import { colorAt, createGrid, forEachVoxel, inGrid, nibble, setColor, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { N } from './palette';

const SUN = SUN_DIRECTION.toArray();

// An ellipsoid of leaves (a puff, a pine's tier for its lighting), voxels.
export interface Volume {
  cx: number;
  cy: number;
  cz: number;
  rx: number;
  ry: number;
  rz: number;
}

// Numbers in [0, 1) from a seed, one after another: the same every time.
export function seeded(seed: number): () => number {
  let n = 0;
  return () => hashUnit(seed, n++, 977);
}

// How lit a voxel on `v` is, -1 (its underside) to 1 (its top, toward the sun).
export function lighting(v: Volume, x: number, y: number, z: number): number {
  const [nx, ny, nz] = [(x + 0.5 - v.cx) / v.rx, (y + 0.5 - v.cy) / v.ry, (z + 0.5 - v.cz) / v.rz];
  const len = Math.hypot(nx, ny, nz) || 1;
  const sun = (nx * SUN[0] + ny * SUN[1] + nz * SUN[2]) / len;
  return Math.max(-1, Math.min(1, 0.6 * ny + 0.5 * sun));
}

// The band of `bands` (darkest first) a light of -1..1 falls in.
export const band = (bands: readonly number[], light: number): number =>
  bands[Math.min(bands.length - 1, Math.max(0, Math.floor(((light + 1) / 2) * bands.length)))];

// A tree's grid: `size` voxels, its foot in the middle of the floor.
export function treeGrid(size: Size): { g: VoxelGrid; mid: number } {
  return { g: createGrid(size), mid: Math.floor(size[0] / 2) };
}

// A limb: a thick line of bark from `from` to `to` (voxels), filling only what's empty.
export function limb(g: VoxelGrid, from: Size, to: Size, radius: number, color = N.bark): void {
  const steps = Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]) * 2);
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const [px, py, pz] = [0, 1, 2].map((i) => from[i] + (to[i] - from[i]) * t);
    for (let x = Math.floor(px - radius); x <= Math.ceil(px + radius); x++) {
      for (let y = Math.floor(py - radius); y <= Math.ceil(py + radius); y++) {
        for (let z = Math.floor(pz - radius); z <= Math.ceil(pz + radius); z++) {
          if (inGrid(g, x, y, z) && colorAt(g, x, y, z) === 0 && Math.hypot(x + 0.5 - px, y + 0.5 - py, z + 0.5 - pz) <= radius) setColor(g, x, y, z, color);
        }
      }
    }
  }
}

// An oak's or a pine's trunk: `width` voxels square from the floor to `top`, stepping one voxel toward `lean` partway
// up, its sunward faces lighter, on a flare of roots. Returns the middle of its top (x, z).
export function trunk(g: VoxelGrid, mid: number, top: number, lean: [number, number], width = 3): [number, number] {
  const base = mid - Math.floor(width / 2);
  let [ox, oz] = [0, 0];
  for (let y = 0; y <= top; y++) {
    if (y === Math.floor(top * 0.55)) [ox, oz] = lean;
    for (let dx = 0; dx < width; dx++) {
      for (let dz = 0; dz < width; dz++) {
        const sunward = dx === width - 1 || dz === width - 1; // (the sun's to +x, +z)
        setColor(g, base + dx + ox, y, base + dz + oz, y <= 1 ? N.barkDark : sunward ? N.barkLight : N.bark);
      }
    }
  }
  // the root flare: a cross wider than the trunk, two voxels high, its tips one
  for (let d = -2; d < width + 2; d++) {
    const h = d === -2 || d === width + 1 ? 0 : 1;
    for (let y = 0; y <= h; y++) {
      setColor(g, base + d, y, mid, N.barkDark);
      setColor(g, mid, y, base + d, N.barkDark);
    }
  }
  return [mid + 0.5 + ox, mid + 0.5 + oz];
}

// A birch's stem: two voxels square, white with black marks (rows of them, here and there), shaded away from the sun,
// kinking one voxel toward `kink` partway up. Returns the middle of its top (x, z).
export function birchStem(g: VoxelGrid, foot: [number, number], height: number, kink: [number, number], rand: () => number): [number, number] {
  let [ox, oz] = [0, 0];
  for (let y = 0; y <= height; y++) {
    if (y === Math.floor(height * 0.6)) [ox, oz] = kink;
    const ringed = rand() < 0.3;
    for (let dx = 0; dx < 2; dx++) {
      for (let dz = 0; dz < 2; dz++) {
        const mark = y === 0 || (ringed && (dx + dz + y) % 2 === 0);
        setColor(g, foot[0] + dx + ox, y, foot[1] + dz + oz, mark ? N.birchMark : dx === 1 || dz === 1 ? N.birchBark : N.birchShade);
      }
    }
  }
  return [foot[0] + 1 + ox, foot[1] + 1 + oz];
}

const MARK = 200; // a leaf voxel's puff while it's being built (MARK + its index; never left in the grid)

// Leaves in `puffs`, filling what's empty: each voxel its puff's (the one it's deepest inside), the outlines nibbled
// (`ragged`: how much), then each shaded by its own puff's light in `bands`, lit where open to the sky, dark on the
// underside; now and then (`odd`) a voxel of another color (a leaf turned gold).
export function leaves(g: VoxelGrid, puffs: Volume[], bands: readonly number[], seed: number, ragged: number, odd?: { color: number; chance: number }): void {
  forEachVoxel(g, (x, y, z) => {
    if (colorAt(g, x, y, z) !== 0) return;
    let [best, depth] = [-1, 1];
    puffs.forEach((p, i) => {
      const d = Math.hypot((x + 0.5 - p.cx) / p.rx, (y + 0.5 - p.cy) / p.ry, (z + 0.5 - p.cz) / p.rz);
      if (d <= depth) [best, depth] = [i, d];
    });
    if (best >= 0) setColor(g, x, y, z, MARK + best);
  });
  const rand = seeded(seed);
  puffs.forEach((p, i) => nibble(g, rand, ragged, Math.floor(p.cy - p.ry * 0.5), MARK + i));
  shadeMarked(g, (i) => puffs[i], bands, seed, 0.35, -0.55, odd);
}

// Every marked voxel shaded by its volume (`volumeOf` its mark's index): its light, varied in blocks of two voxels,
// raised by `sky` where nothing's above it, kept at most `under` where nothing's below it in its lower half.
export function shadeMarked(
  g: VoxelGrid, volumeOf: (i: number) => Volume, bands: readonly number[], seed: number, sky: number, under: number,
  odd?: { color: number; chance: number },
): void {
  forEachVoxel(g, (x, y, z) => {
    const c = colorAt(g, x, y, z);
    if (c < MARK) return;
    const v = volumeOf(c - MARK);
    let light = lighting(v, x, y, z) + (noise3(x >> 1, y >> 1, z >> 1, seed) - 0.5) * 0.3;
    if (colorAt(g, x, y + 1, z) === 0) light += sky;
    if (y + 0.5 < v.cy && colorAt(g, x, y - 1, z) === 0) light = Math.min(light, under);
    const turned = odd && light > 0 && noise3(x >> 1, y >> 1, z >> 1, seed + 1) < odd.chance;
    setColor(g, x, y, z, turned ? odd.color : band(bands, light));
  });
}

export const marked = (i: number): number => MARK + i;
