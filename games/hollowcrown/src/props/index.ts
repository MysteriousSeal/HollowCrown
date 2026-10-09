// What stands about the Vale where the designers placed it (data/world/dressing.ts): its pieces (a fence run's rails
// and posts, a hay rick, the gibbet, a standing stone, a vegetable bed, the barrow, the Hanging Oak), drawn chunk by chunk as the hero comes near,
// one instanced mesh a shape (nature/instanced.ts); and the room they take, for walkers to keep out of.

import { hashUnit } from '@voxel/engine/math';
import type { VoxelGrid } from '@voxel/engine/voxel';
import { CHUNK_SIZE, type Box, type ChunkLayer, type Obstacles, type WorldMap } from '@voxel/engine/world';
import type { Dressing } from '../data/world/dressing';
import { cardinal } from '../data/world/kinds';
import { instancedLayer, natureGeometry, type Growth } from '../nature/instanced';
import { greenOak, hangingOak } from '../nature/landmarks';
import { NATURE } from '../nature/palette';
import { barrow, fencePost, fenceRails, gardenBed, gibbet, hayRick, skep, standingStone } from './models';
import { PROPS } from './palette';

// Each shape's grid, by its key (the model viewer too).
export const PROP_SHAPES: Record<string, () => VoxelGrid> = {
  rails: fenceRails,
  post: fencePost,
  'hay-rick': hayRick,
  gibbet,
  stone0: () => standingStone(0),
  stone1: () => standingStone(1),
  stone2: () => standingStone(2),
  'garden-bed': gardenBed,
  barrow,
  hive: skep,
};

// The landmarks among them, painted from nature's palette (the model viewer too).
export const LANDMARK_SHAPES: Record<string, () => VoxelGrid> = { 'hanging-oak': hangingOak, 'old-oak': greenOak };

// What a piece standing on its own takes (half its size, tiles, x and z before it's turned); a kind not here is
// walked over or through.
const ROOM: Record<string, [number, number]> = { 'hay-rick': [0.8, 0.6], gibbet: [0.2, 0.2], 'standing-stone': [0.35, 0.25], 'hanging-oak': [0.35, 0.35], 'old-oak': [0.45, 0.45], hive: [0.3, 0.3] };
const FENCE_HALF = 0.06; // a fence's half thickness, tiles

// A piece's shape: its kind's, a standing stone one of its three by where it stands.
const shapeOf = (d: Dressing & { at: [number, number] }) => (d.kind === 'standing-stone' ? `stone${Math.floor(hashUnit(d.at[0], d.at[1], 91) * 3)}` : d.kind);

// A piece's quarter turns: the way it faces, or (facing nowhere in particular) a way of its own.
const turnOf = (d: Dressing, [x, z]: [number, number]) => cardinal(d.facing) ?? Math.floor(hashUnit(x, z, 94) * 4);

// The pieces of `dressing`, each where it stands.
export function piecesOf(dressing: readonly Dressing[]): Growth[] {
  const out: Growth[] = [];
  for (const d of dressing) {
    if (d.kind === 'fence' && d.line) {
      for (let i = 1; i < d.line.length; i++) {
        const [[ax, az], [bx, bz]] = [d.line[i - 1], d.line[i]];
        const length = Math.hypot(bx - ax, bz - az);
        const n = Math.max(1, Math.round(length));
        const turn = bx !== ax ? 0 : 1; // (along x, or along z)
        for (let k = 0; k <= n; k++) out.push({ x: ax + ((bx - ax) * k) / n, z: az + ((bz - az) * k) / n, shape: 'post', turn: 0, tint: hashUnit(k, i, 92) });
        for (let k = 0; k < n; k++) {
          out.push({ x: ax + ((bx - ax) * (k + 0.5)) / n, z: az + ((bz - az) * (k + 0.5)) / n, shape: 'rails', turn, tint: hashUnit(k, i, 93), stretch: length / n });
        }
      }
    } else if (d.at && (PROP_SHAPES[shapeOf({ ...d, at: d.at })] || LANDMARK_SHAPES[d.kind])) {
      out.push({ x: d.at[0], z: d.at[1], shape: shapeOf({ ...d, at: d.at }), turn: turnOf(d, d.at), tint: hashUnit(d.at[0], d.at[1], 95) });
    }
  }
  return out;
}

// The layer of `dressing`'s pieces.
export function dressingLayer(map: WorldMap, dressing: readonly Dressing[]): ChunkLayer {
  const byChunk = new Map<string, Growth[]>();
  for (const piece of piecesOf(dressing)) {
    const key = `${Math.floor(Math.round(piece.x) / CHUNK_SIZE)},${Math.floor(Math.round(piece.z) / CHUNK_SIZE)}`;
    byChunk.set(key, [...(byChunk.get(key) ?? []), piece]);
  }
  const meshOf = (shape: string) => (LANDMARK_SHAPES[shape] ? natureGeometry(LANDMARK_SHAPES[shape](), NATURE.colors) : natureGeometry(PROP_SHAPES[shape](), PROPS.colors));
  return instancedLayer(map, byChunk.keys(), (key) => byChunk.get(key) ?? [], meshOf, { tint: 0.06 });
}

// The room `dressing` takes: each fence run a thin box along it, each piece that's in the way its box; added to
// `obstacles`.
export function dressingObstacles(dressing: readonly Dressing[], obstacles: Obstacles): void {
  for (const d of dressing) {
    if (d.kind === 'fence' && d.line) {
      for (let i = 1; i < d.line.length; i++) {
        const [[ax, az], [bx, bz]] = [d.line[i - 1], d.line[i]];
        obstacles.add(box((ax + bx) / 2, (az + bz) / 2, Math.abs(bx - ax) / 2 + FENCE_HALF, Math.abs(bz - az) / 2 + FENCE_HALF));
      }
    } else if (d.at && ROOM[d.kind]) {
      const [hx, hz] = ROOM[d.kind];
      const across = turnOf(d, d.at) % 2 === 1;
      obstacles.add(box(d.at[0], d.at[1], across ? hz : hx, across ? hx : hz));
    }
  }
}

const box = (x: number, z: number, hx: number, hz: number): Box => ({ x0: x - hx, z0: z - hz, x1: x + hx, z1: z + hz });
