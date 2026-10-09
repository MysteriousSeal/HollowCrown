// What stands about the Vale where the designers placed it (data/world/dressing.ts): each piece of dressing as the
// pieces it's drawn with (a fence or hedge run's lengths, a rockslide's boulders, a thicket's bushes, a tile of
// flagstones apiece, a hay rick, the gibbet, a lone tree, the Hanging Oak...), drawn chunk by chunk as the hero comes
// near, one instanced mesh a shape (nature/instanced.ts); and the room they take, for walkers to keep out of.

import { hashUnit } from '@voxel/engine/math';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import type { VoxelGrid } from '@voxel/engine/voxel';
import { CHUNK_SIZE, type Box, type ChunkLayer, type Obstacles, type WorldMap } from '@voxel/engine/world';
import type { Dressing } from '../data/world/dressing';
import { cardinal } from '../data/world/kinds';
import { bush } from '../nature/coverShapes';
import { instancedLayer, natureGeometry, type Growth } from '../nature/instanced';
import { greenOak, hangingOak } from '../nature/landmarks';
import { NATURE } from '../nature/palette';
import { treeVoxels, type Species } from '../nature/trees';
import { barrow, fencePost, fenceRails, gardenBed, gibbet, hayRick, skep, standingStone } from './models';
import { PROPS } from './palette';
import { belonging, boulder, flagstones, handcart, hedge, milestone, parapet } from './roadside';

// Each shape's grid painted from the props' palette, by its key (the model viewer too).
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
  boulder0: () => boulder(0),
  boulder1: () => boulder(1),
  boulder2: () => boulder(2),
  flags0: () => flagstones(0),
  flags1: () => flagstones(1),
  flags2: () => flagstones(2),
  milestone,
  handcart,
  belonging0: () => belonging(0),
  belonging1: () => belonging(1),
  belonging2: () => belonging(2),
  parapet,
  hedge0: () => hedge(0),
  hedge1: () => hedge(1),
};

// The landmarks among them, painted from nature's palette (the model viewer too).
export const LANDMARK_SHAPES: Record<string, () => VoxelGrid> = { 'hanging-oak': hangingOak, 'old-oak': greenOak };

// A piece and the room it takes, if it's in the way (half its size, tiles, x and z as it stands).
type Piece = Growth & { room?: [number, number] };

// What a kind standing on its own takes (half its size, tiles, x and z before it's turned); a kind not here is walked
// over or through.
const ROOM: Record<string, [number, number]> = {
  'hay-rick': [0.8, 0.6], gibbet: [0.2, 0.2], 'standing-stone': [0.35, 0.25], 'hanging-oak': [0.35, 0.35], 'old-oak': [0.45, 0.45],
  hive: [0.3, 0.3], milestone: [0.25, 0.2], handcart: [0.8, 0.5], 'lone-tree': [0.2, 0.2],
};
const RUN_HALF: Record<string, number> = { fence: 0.06, hedge: 0.3 }; // a run's half thickness, tiles

// A piece's quarter turns: the way it faces, or (facing nowhere in particular) a way of its own.
const turnOf = (d: Dressing, [x, z]: [number, number]) => cardinal(d.facing) ?? Math.floor(hashUnit(x, z, 94) * 4);

// A run along `line` (a fence's, a hedge's): its lengths, each a tile or near it, stretched to fit; a fence's posts
// between them.
function runOf(d: Dressing & { line: [number, number][] }, out: Piece[]): void {
  for (let i = 1; i < d.line.length; i++) {
    const [[ax, az], [bx, bz]] = [d.line[i - 1], d.line[i]];
    const length = Math.hypot(bx - ax, bz - az);
    const n = Math.max(1, Math.round(length));
    const turn = bx !== ax ? 0 : 1; // (along x, or along z)
    const along = (k: number): [number, number] => [ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n];
    if (d.kind === 'fence') for (let k = 0; k <= n; k++) out.push({ x: along(k)[0], z: along(k)[1], shape: 'post', turn: 0, tint: hashUnit(k, i, 92) });
    for (let k = 0; k < n; k++) {
      const [x, z] = along(k + 0.5);
      const shape = d.kind === 'fence' ? 'rails' : `hedge${Math.floor(hashUnit(Math.round(x), Math.round(z), 96) * 2)}`;
      out.push({ x, z, shape, turn, tint: hashUnit(k, i, 93), stretch: length / n });
    }
  }
}

// Points scattered in a disc round (x, z) of `radius` tiles, `n` of them (the same every time).
const scatter = ([x, z]: [number, number], radius: number, n: number, salt: number): Array<[number, number]> =>
  Array.from({ length: n }, (_, i) => {
    const [a, r] = [hashUnit(i, salt, x) * Math.PI * 2, Math.sqrt(hashUnit(i, salt, z)) * radius];
    return [x + Math.cos(a) * r, z + Math.sin(a) * r];
  });

// The pieces of `dressing`, each where it stands.
export function piecesOf(dressing: readonly Dressing[]): Piece[] {
  const out: Piece[] = [];
  for (const d of dressing) {
    if ((d.kind === 'fence' || d.kind === 'hedge') && d.line) {
      runOf({ ...d, line: d.line }, out);
      continue;
    }
    if (!d.at) continue;
    const at = d.at;
    const tint = hashUnit(at[0], at[1], 95);
    const one = (shape: string, extra: Partial<Piece> = {}) => out.push({ x: at[0], z: at[1], shape, turn: turnOf(d, at), tint, room: ROOM[d.kind], ...extra });
    const f = d.facing ?? 0;
    switch (d.kind) {
      case 'standing-stone': one(`stone${Math.floor(hashUnit(at[0], at[1], 91) * 3)}`); break;
      case 'lone-tree': one(`${d.species ?? 'oak'}${Math.floor(hashUnit(at[0], at[1], 97) * 3)}`); break;
      case 'flagstones': {
        const [x0, z0, x1, z1] = d.rect ?? [at[0], at[1], at[0], at[1]];
        for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) out.push({ x, z, shape: `flags${Math.floor(hashUnit(x, z, 98) * 3)}`, turn: Math.floor(hashUnit(x, z, 99) * 4), tint: hashUnit(x, z, 100) });
        break;
      }
      case 'rockslide': {
        // boulders heaped along a line across the way it faces, out from where it stands, the biggest at its middle
        const r = d.radius ?? 6;
        const [ax, az, fx, fz] = [Math.cos(f), -Math.sin(f), Math.sin(f), Math.cos(f)]; // (across it, and out in front)
        for (let i = 0; i < Math.round(r * 2.5); i++) {
          const across = (hashUnit(i, 1, 101) * 2 - 1) * r;
          const out_ = 2.5 + hashUnit(i, 2, 101) * 3 + (1 - Math.abs(across) / r) * 1.5; // (off its foot: the crag it fell from is behind)
          const size = Math.min(2, Math.floor(hashUnit(i, 3, 101) * 2 + (1 - Math.abs(across) / r) * 1.5));
          const half = [0.7, 1, 1.3][size];
          out.push({ x: at[0] + ax * across + fx * out_, z: at[1] + az * across + fz * out_, shape: `boulder${size}`, turn: Math.floor(hashUnit(i, 4, 101) * 4), tint: hashUnit(i, 5, 101), room: [half, half] });
        }
        break;
      }
      case 'belongings':
        scatter(at, d.radius ?? 2, 5, 102).forEach(([x, z], i) => out.push({ x, z, shape: `belonging${i % 3}`, turn: i % 4, tint: hashUnit(i, 0, 102) }));
        break;
      case 'thicket':
        scatter(at, d.radius ?? 2, Math.round((d.radius ?? 2) ** 2 * 2), 103).forEach(([x, z], i) =>
          out.push({ x, z, shape: `bush${i % 3}`, turn: i % 4, tint: hashUnit(i, 0, 103), room: [0.35, 0.35] }));
        break;
      case 'footbridge':
        // a parapet either side of the road where it crosses (the road runs the way it faces)
        for (const side of [-1, 1]) one('parapet', { x: at[0] + Math.cos(f) * side * 2.2, z: at[1] - Math.sin(f) * side * 2.2, turn: (turnOf(d, at) + 1) % 4, room: undefined });
        break;
      default:
        if (PROP_SHAPES[d.kind] || LANDMARK_SHAPES[d.kind]) one(d.kind);
    }
  }
  return out;
}

// A piece's mesh, by its key: a prop's, a landmark's, a bush's or a tree's.
function meshOf(shape: string) {
  if (shape.startsWith('boulder')) return natureGeometry(PROP_SHAPES[shape](), PROPS.colors, 2 * STRUCTURE_VOXEL);
  if (PROP_SHAPES[shape]) return natureGeometry(PROP_SHAPES[shape](), PROPS.colors);
  if (LANDMARK_SHAPES[shape]) return natureGeometry(LANDMARK_SHAPES[shape](), NATURE.colors);
  if (shape.startsWith('bush')) return natureGeometry(bush(Number(shape.slice(4))).grid, NATURE.colors);
  return natureGeometry(treeVoxels(shape.slice(0, -1) as Species, Number(shape.slice(-1))));
}

// The layer of `dressing`'s pieces.
export function dressingLayer(map: WorldMap, dressing: readonly Dressing[]): ChunkLayer {
  const byChunk = new Map<string, Growth[]>();
  for (const piece of piecesOf(dressing)) {
    const key = `${Math.floor(Math.round(piece.x) / CHUNK_SIZE)},${Math.floor(Math.round(piece.z) / CHUNK_SIZE)}`;
    byChunk.set(key, [...(byChunk.get(key) ?? []), piece]);
  }
  return instancedLayer(map, byChunk.keys(), (key) => byChunk.get(key) ?? [], meshOf, { tint: 0.06 });
}

// The room `dressing` takes: each fence or hedge run a thin box along it, each piece that's in the way its box; added
// to `obstacles`.
export function dressingObstacles(dressing: readonly Dressing[], obstacles: Obstacles): void {
  for (const d of dressing) {
    if (!d.line || !RUN_HALF[d.kind]) continue;
    const t = RUN_HALF[d.kind];
    for (let i = 1; i < d.line.length; i++) {
      const [[ax, az], [bx, bz]] = [d.line[i - 1], d.line[i]];
      obstacles.add(box((ax + bx) / 2, (az + bz) / 2, Math.abs(bx - ax) / 2 + t, Math.abs(bz - az) / 2 + t));
    }
  }
  for (const p of piecesOf(dressing)) {
    if (!p.room) continue;
    const [hx, hz] = p.room;
    obstacles.add(p.turn % 2 === 1 ? box(p.x, p.z, hz, hx) : box(p.x, p.z, hx, hz));
  }
}

const box = (x: number, z: number, hx: number, hz: number): Box => ({ x0: x - hx, z0: z - hz, x1: x + hx, z1: z + hz });
