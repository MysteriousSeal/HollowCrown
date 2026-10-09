// Stable pseudo-random numbers from integer coordinates: variety that's the same every time (a voxel's shade, which
// way a rock is turned), never drawn from a random source.

// A number in [0, 1) from (x, z) and a salt (different salts: independent values for the same cell).
export function hashUnit(x: number, z: number, salt = 0): number {
  let h = Math.imul(x, 73856093) ^ Math.imul(z, 19349663) ^ Math.imul(salt, 83492791);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}

// The same from three coordinates (a voxel's).
export const noise3 = (x: number, y: number, z: number, salt: number): number => hashUnit(x * 7 + y * 31, z, salt);

// The item of `items` a number in [0, 1) lands on, each an even share.
export const oneOf = <T>(items: readonly T[], unit: number): T => items[Math.floor(unit * items.length)];
