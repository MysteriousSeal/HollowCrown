// Shapes drawn on the map by hand, in tiles (a tile (x, z) is the square round that point): which tiles they cover,
// and the box round them.

import type { Area } from './grid';

export type Point = [number, number]; // (x, z), tiles

export type Shape =
  | { rect: [number, number, number, number] } // x0, z0, x1, z1: the tiles from corner to corner, inclusive
  | { circle: [number, number, number] } // centre x, z, radius
  | { polygon: Point[] } // its corners, in order (tiles inside it, by their centres)
  | { line: Point[]; width: number }; // a path through the points, `width` tiles wide (a road, a river)

// Whether tile (x, z) is in `shape`.
export function covers(shape: Shape, x: number, z: number): boolean {
  if ('rect' in shape) {
    const [x0, z0, x1, z1] = shape.rect;
    return x >= Math.min(x0, x1) && x <= Math.max(x0, x1) && z >= Math.min(z0, z1) && z <= Math.max(z0, z1);
  }
  if ('circle' in shape) {
    const [cx, cz, r] = shape.circle;
    return (x - cx) ** 2 + (z - cz) ** 2 <= r * r;
  }
  if ('polygon' in shape) {
    let inside = false;
    const p = shape.polygon;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, zi] = p[i];
      const [xj, zj] = p[j];
      if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
    }
    return inside;
  }
  const half = shape.width / 2;
  const p = shape.line;
  for (let i = 0; i < p.length - 1; i++) if (segmentDistance(x, z, p[i], p[i + 1]) <= half) return true;
  return p.length === 1 && Math.hypot(x - p[0][0], z - p[0][1]) <= half;
}

// The tiles' box round `shape` (inclusive at both ends, as an Area's x1/z1 are exclusive: +1).
export function boundsOf(shape: Shape): Area {
  const box = (xs: number[], zs: number[], pad = 0): Area => ({
    x0: Math.floor(Math.min(...xs) - pad),
    z0: Math.floor(Math.min(...zs) - pad),
    x1: Math.ceil(Math.max(...xs) + pad) + 1,
    z1: Math.ceil(Math.max(...zs) + pad) + 1,
  });
  if ('rect' in shape) return box([shape.rect[0], shape.rect[2]], [shape.rect[1], shape.rect[3]]);
  if ('circle' in shape) return box([shape.circle[0]], [shape.circle[1]], shape.circle[2]);
  const points = 'polygon' in shape ? shape.polygon : shape.line;
  return box(points.map((p) => p[0]), points.map((p) => p[1]), 'line' in shape ? shape.width / 2 : 0);
}

function segmentDistance(x: number, z: number, [ax, az]: Point, [bx, bz]: Point): number {
  const [dx, dz] = [bx - ax, bz - az];
  const length = dx * dx + dz * dz;
  const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / length));
  return Math.hypot(x - (ax + t * dx), z - (az + t * dz));
}
