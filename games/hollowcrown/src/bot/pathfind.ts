// The bot's routes: A* over the map's tiles (eight ways round), a tile free where a walker can stand on it (ground it
// can walk on, nothing in the way), searched only within a window round the two ends so it's always bounded; then
// pulled tight, so the route keeps only the corners it can't see past.

import type { Point } from '@voxel/engine/world';

// Whether a walker can stand at (x, z) (the map's walkable ground, clear of obstacles).
export type IsFree = (x: number, z: number) => boolean;

export interface RouteOptions {
  margin?: number; // tiles round the two ends the search may stray (default 48)
  maxNodes?: number; // tiles searched at most before giving up (default 300 000)
}

const SQRT2 = Math.SQRT2;
const STEPS: Array<[number, number, number]> = [
  [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, SQRT2], [1, -1, SQRT2], [-1, 1, SQRT2], [-1, -1, SQRT2],
];

// The free tile nearest `at` (within `reach` tiles), or null: where to aim when the spot itself is in a wall.
export function nearestFree(isFree: IsFree, at: Point, reach = 8): Point | null {
  const [x0, z0] = [Math.round(at[0]), Math.round(at[1])];
  for (let r = 0; r <= reach; r++) {
    let best: Point | null = null;
    let bestD = Infinity;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r || !isFree(x0 + dx, z0 + dz)) continue;
        const d = Math.hypot(x0 + dx - at[0], z0 + dz - at[1]);
        if (d < bestD) [best, bestD] = [[x0 + dx, z0 + dz], d];
      }
    }
    if (best) return best;
  }
  return null;
}

// A route of tiles from `from` to `to` (both ends included, pulled tight), or null if there's none in the window.
export function findRoute(isFree: IsFree, from: Point, to: Point, { margin = 48, maxNodes = 300_000 }: RouteOptions = {}): Point[] | null {
  const start = nearestFree(isFree, from, 3);
  const goal = nearestFree(isFree, to, 8);
  if (!start || !goal) return null;
  const x0 = Math.min(start[0], goal[0]) - margin;
  const z0 = Math.min(start[1], goal[1]) - margin;
  const w = Math.max(start[0], goal[0]) + margin - x0 + 1;
  const d = Math.max(start[1], goal[1]) + margin - z0 + 1;
  const size = w * d;
  const cost = new Float32Array(size).fill(Infinity);
  const from_ = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size); // 0 unknown, 1 free and closed, 2 blocked
  const index = (x: number, z: number) => (z - z0) * w + (x - x0);
  const [gx, gz] = goal;
  const guess = (x: number, z: number) => {
    const [ax, az] = [Math.abs(x - gx), Math.abs(z - gz)];
    return Math.max(ax, az) + (SQRT2 - 1) * Math.min(ax, az);
  };
  const heap = new Heap();
  const s = index(start[0], start[1]);
  cost[s] = 0;
  heap.push(s, guess(start[0], start[1]));
  const g = index(gx, gz);
  let searched = 0;
  const free = (x: number, z: number, i: number) => {
    if (closed[i] === 2) return false;
    if (isFree(x, z)) return true;
    closed[i] = 2;
    return false;
  };
  while (heap.size > 0 && searched < maxNodes) {
    const i = heap.pop();
    if (closed[i] === 1) continue;
    closed[i] = 1;
    searched++;
    if (i === g) return tighten(isFree, walkBack(from_, i, w, x0, z0));
    const [x, z] = [x0 + (i % w), z0 + Math.floor(i / w)];
    for (const [dx, dz, step] of STEPS) {
      const [nx, nz] = [x + dx, z + dz];
      if (nx < x0 || nz < z0 || nx >= x0 + w || nz >= z0 + d) continue;
      const n = index(nx, nz);
      if (closed[n] === 1 || !free(nx, nz, n)) continue;
      // No cutting a corner between two blocked tiles.
      if (dx && dz && (!free(x + dx, z, index(x + dx, z)) || !free(x, z + dz, index(x, z + dz)))) continue;
      // Nor stepping over something thin between two free tiles (a fence).
      if (!isFree(x + dx / 2, z + dz / 2)) continue;
      const c = cost[i] + step;
      if (c >= cost[n]) continue;
      cost[n] = c;
      from_[n] = i;
      heap.push(n, c + guess(nx, nz) * 1.05);
    }
  }
  return null;
}

function walkBack(from: Int32Array, end: number, w: number, x0: number, z0: number): Point[] {
  const route: Point[] = [];
  for (let i = end; i !== -1; i = from[i]) route.push([x0 + (i % w), z0 + Math.floor(i / w)]);
  return route.reverse();
}

// Whether a walker can go straight from `a` to `b`: every point on the way free, a third of a tile apart.
export function clearLine(isFree: IsFree, a: Point, b: Point): boolean {
  const steps = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 3);
  for (let k = 1; k < steps; k++) {
    const t = k / steps;
    if (!isFree(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) return false;
  }
  return true;
}

// The route pulled tight: from each corner, straight on to the farthest one it can see (looking a bounded way on).
function tighten(isFree: IsFree, route: Point[]): Point[] {
  if (route.length <= 2) return route;
  const out: Point[] = [route[0]];
  let i = 0;
  while (i < route.length - 1) {
    let j = Math.min(route.length - 1, i + 40);
    while (j > i + 1 && !clearLine(isFree, route[i], route[j])) j--;
    out.push(route[j]);
    i = j;
  }
  return out;
}

// A binary min-heap of tile indices by priority.
class Heap {
  private readonly items: number[] = [];
  private readonly keys: number[] = [];

  get size(): number {
    return this.items.length;
  }

  push(item: number, key: number): void {
    const [items, keys] = [this.items, this.keys];
    let n = items.length;
    items.push(item);
    keys.push(key);
    while (n > 0) {
      const p = (n - 1) >> 1;
      if (keys[p] <= key) break;
      [items[n], keys[n]] = [items[p], keys[p]];
      n = p;
    }
    [items[n], keys[n]] = [item, key];
  }

  pop(): number {
    const [items, keys] = [this.items, this.keys];
    const top = items[0];
    const lastItem = items.pop()!;
    const lastKey = keys.pop()!;
    const size = items.length;
    if (size === 0) return top;
    let n = 0;
    for (;;) {
      const l = 2 * n + 1;
      if (l >= size) break;
      const c = l + 1 < size && keys[l + 1] < keys[l] ? l + 1 : l;
      if (keys[c] >= lastKey) break;
      [items[n], keys[n]] = [items[c], keys[c]];
      n = c;
    }
    [items[n], keys[n]] = [lastItem, lastKey];
    return top;
  }
}
