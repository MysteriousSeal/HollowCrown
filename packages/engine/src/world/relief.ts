// Relief: bare land a little uneven, never perfectly flat. Each tile's top is raised or lowered a few small steps
// (RELIEF_STEP, a third of a tier: still read as the same tier), in soft patches a few tiles across with a little
// tile-to-tile grain, the same every time (a hash of the tile, no random source). The ground drawn and the ground
// walked on both take it from here, so feet stay on it.

import { hashUnit } from '../math';
import { TILE_HEIGHT } from './terrain';

export const RELIEF_STEP = TILE_HEIGHT / 3; // world units a relief step raises a tile's top
export const RELIEF_MIN = -1; // steps: a dip...
export const RELIEF_MAX = 2; // ...to a rise
const PATCH = 5; // tiles across a patch of rises or dips
const SALT = 7717;

// Smooth value noise in [0, 1) over a lattice PATCH tiles apart.
function patchNoise(x: number, z: number): number {
  const [gx, gz] = [Math.floor(x / PATCH), Math.floor(z / PATCH)];
  const [fx, fz] = [x / PATCH - gx, z / PATCH - gz];
  const [sx, sz] = [fx * fx * (3 - 2 * fx), fz * fz * (3 - 2 * fz)];
  const a = hashUnit(gx, gz, SALT);
  const b = hashUnit(gx + 1, gz, SALT);
  const c = hashUnit(gx, gz + 1, SALT);
  const d = hashUnit(gx + 1, gz + 1, SALT);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}

// Tile (x, z)'s relief, in steps (RELIEF_MIN .. RELIEF_MAX; mostly 0 and 1).
export function reliefAt(x: number, z: number): number {
  const level = (patchNoise(x, z) - 0.5) * 3.2 + (hashUnit(x, z, SALT + 1) - 0.5) * 0.6 + 0.35;
  return Math.max(RELIEF_MIN, Math.min(RELIEF_MAX, Math.round(level)));
}
