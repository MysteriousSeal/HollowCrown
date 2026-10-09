// What grows over the Vale's bare land, everywhere (data/world/life.ts: each region's ground cover, its own in each kind
// of area or named one, and patches of their own): grass in tufts (as tall and thick as the cover says, tinted its
// color), clumps of flowers, bushes, stones, and here and there a lone tree. Each tile's from its hash (the same every
// time), only on bare land (no road, path, garden, water), nothing but grass by what's built or by a place. Worked out
// a chunk at a time as the hero comes near; instanced, the grass and flowers not drawn far off.

import { hashUnit } from '@voxel/engine/math';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import { CHUNK_SIZE, boundsOf, covers, type AreaData, type Box, type ChunkLayer, type Obstacles, type Point, type Shape, type WorldMap } from '@voxel/engine/world';
import { LIFE, type GroundCover } from '../data/world/life';
import { bush, flowerClump, grassTuft, stone, type CoverShape } from './coverShapes';
import { coarse, instancedLayer, natureGeometry, type Growth } from './instanced';
import { NATURE } from './palette';
import { treeVoxels, type Species } from './trees';

const VOXEL = STRUCTURE_VOXEL;
const TALLEST = 7; // voxels: the tallest grass drawn (reeds)
const LONE_TREES = 0.8; // lone trees per 1000 tiles of open land (no forest, no village)
const ROOM = 2; // tiles kept clear of all but grass round a place
const NO_LONE_TREES = new Set(['forest', 'village', 'town', 'farm', 'keep', 'field']);
const BUSHES = 3; // bush shapes
const STONES = 3;

// Where a chunk's cover comes from: its region's ground, the areas over it that have their own (in the order the
// region lists them), the patches near it.
interface ChunkCover {
  ground: GroundCover;
  areas: Array<{ shape: Shape; cover: Partial<GroundCover> }>;
  patches: Array<{ at: Point; radius: number; cover: Partial<GroundCover> }>;
  open: Shape[]; // the areas over it where no lone tree grows
}

const touches = (a: { x0: number; z0: number; x1: number; z1: number }, b: typeof a) => a.x0 <= b.x1 && b.x0 <= a.x1 && a.z0 <= b.z1 && b.z0 <= a.z1;

function chunkCover(map: WorldMap, key: string): ChunkCover {
  const [kx, kz] = key.split(',').map(Number);
  const box = { x0: kx * CHUNK_SIZE, z0: kz * CHUNK_SIZE, x1: (kx + 1) * CHUNK_SIZE - 1, z1: (kz + 1) * CHUNK_SIZE - 1 };
  const over = map.data.areas.filter((a) => touches(boundsOf(a.shape), box));
  const region = over.find((a) => a.kind === 'region' && LIFE[a.id] && covers(a.shape, box.x0, box.z0));
  const life = LIFE[region?.id ?? 'brindle-vale'] ?? Object.values(LIFE)[0]; // (a region with no life of its own: the Vale's)
  const areas = Object.entries(life.byArea).flatMap(([which, cover]) =>
    over.filter((a: AreaData) => (which.startsWith('kind:') ? a.kind === which.slice(5) : a.id === which)).map((a) => ({ shape: a.shape, cover })),
  );
  const patches = life.patches.filter((p) => touches({ x0: p.at[0] - p.radius, z0: p.at[1] - p.radius, x1: p.at[0] + p.radius, z1: p.at[1] + p.radius }, box));
  return { ground: life.ground, areas, patches, open: over.filter((a) => NO_LONE_TREES.has(a.kind)).map((a) => a.shape) };
}

// The cover at tile (x, z).
function coverAt(c: ChunkCover, x: number, z: number): GroundCover {
  let cover = c.ground;
  for (const a of c.areas) if (covers(a.shape, x, z)) cover = { ...cover, ...a.cover };
  for (const p of c.patches) if (Math.hypot(x - p.at[0], z - p.at[1]) <= p.radius) cover = { ...cover, ...p.cover };
  return cover;
}

// Everything growing in chunk `key` of `map`; `keepOut`: what's built.
export function coverIn(map: WorldMap, key: string, keepOut: Obstacles): Growth[] {
  const c = chunkCover(map, key);
  const [kx, kz] = key.split(',').map(Number);
  const places = map.placesIn({ x0: kx * CHUNK_SIZE - ROOM, z0: kz * CHUNK_SIZE - ROOM, x1: (kx + 1) * CHUNK_SIZE + ROOM, z1: (kz + 1) * CHUNK_SIZE + ROOM }).map((p) => p.at);
  const out: Growth[] = [];
  for (let x = kx * CHUNK_SIZE; x < (kx + 1) * CHUNK_SIZE; x++) {
    for (let z = kz * CHUNK_SIZE; z < (kz + 1) * CHUNK_SIZE; z++) {
      if (map.surfaceAt(x, z) !== 0) continue;
      const cover = coverAt(c, x, z);
      const h = (salt: number) => hashUnit(x, z, salt);
      const at = (salt: number): [number, number] => [x + (h(salt) - 0.5) * 0.9, z + (h(salt + 1) - 0.5) * 0.9];
      // grass: up to three tufts, as thick as the cover says, two voxels high at the least (or it doesn't read)
      const { height, color, density } = cover.grass;
      for (let t = 0; t < 3; t++) {
        if (h(601 + t) >= density - t * 0.3) continue;
        const [gx, gz] = at(610 + t * 2);
        const tall = Math.max(2, Math.min(TALLEST, Math.round((height[0] + (height[1] - height[0]) * h(620 + t)) / VOXEL)));
        out.push({ x: gx, z: gz, shape: `grass${tall}:${Math.floor(h(630 + t) * 2)}`, turn: Math.floor(h(640 + t) * 4), tint: h(650 + t), color: grassColor(color) });
      }
      // the rest (flowers, bushes, stones, a lone tree): one at most a tile, each as often as the cover says
      const clear = !keepOut.blocks(x, z, 0.6) && !places.some(([px, pz]) => Math.abs(px - x) <= ROOM && Math.abs(pz - z) <= ROOM);
      if (!clear) continue;
      let roll = h(700) * 1000;
      const [ox, oz] = at(710);
      const put = (shape: string, extra: Partial<Growth> = {}) => out.push({ x: ox, z: oz, shape, turn: Math.floor(h(720) * 4), tint: h(730), ...extra });
      const flower = cover.flowers.find((f) => (roll -= f.density) < 0);
      if (flower) put(`flower${flower.color.toString(16)}:${Math.floor(h(740) * 2)}${flower.kind === 'poppy' ? 'e' : ''}`);
      else if ((roll -= cover.bushes) < 0) put(`bush${Math.floor(h(750) * BUSHES)}`);
      else if ((roll -= cover.stones) < 0) put(`stone${Math.floor(h(760) * STONES)}`);
      else if ((roll -= LONE_TREES) < 0 && bareRound(map, x, z) && !c.open.some((s) => covers(s, x, z))) {
        const species: Species = h(770) < 0.7 ? 'oak' : 'birch';
        put(`${species}${Math.floor(h(780) * 3)}`, { x: x + 0.5, z: z + 0.5 });
      }
    }
  }
  return out;
}

// Whether the tiles round (x, z) are bare too (a tree's crown over no road).
const bareRound = (map: WorldMap, x: number, z: number) => [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dx, dz]) => map.surfaceAt(x + dx, z + dz) === 0);

// A shape's grid and palette, from its key.
function shapeOf(key: string): CoverShape | null {
  const [name, variant = '0'] = key.split(':');
  if (name.startsWith('grass')) return grassTuft(Number(name.slice(5)), Number(variant));
  if (name.startsWith('flower')) return flowerClump(parseInt(name.slice(6), 16), Number(variant[0]), variant.endsWith('e') ? 0x2a1f1a : undefined);
  if (name.startsWith('bush')) return bush(Number(name.slice(4)));
  if (name.startsWith('stone')) return stone(Number(name.slice(5)));
  return null;
}
const isTree = (key: string) => /^(oak|birch|pine)\d$/.test(key);
const treeOf = (key: string) => treeVoxels(key.slice(0, -1) as Species, Number(key.slice(-1)));

// A lone tree's trunk, in the way.
const trunkOf = (g: Growth): Box => ({ x0: g.x - 0.2, z0: g.z - 0.2, x1: g.x + 0.2, z1: g.z + 0.2 });

// The layer of the cover on `map`: none on what `keepOut` holds; lone trees' trunks added to `obstacles` as their chunk
// first comes near. Far off, only the bushes and trees are drawn (at half resolution).
export function coverLayer(map: WorldMap, keepOut: Obstacles, obstacles: Obstacles): ChunkLayer {
  const grow = (key: string) => {
    const growth = coverIn(map, key, keepOut);
    for (const g of growth) if (isTree(g.shape)) obstacles.add(trunkOf(g));
    return growth;
  };
  const meshOf = (key: string) => {
    if (isTree(key)) return natureGeometry(treeOf(key));
    const s = shapeOf(key)!;
    return natureGeometry(s.grid, s.palette);
  };
  const farOf = (key: string) => {
    if (isTree(key)) return natureGeometry(coarse(treeOf(key)), NATURE.colors, 2 * VOXEL);
    if (!key.startsWith('bush')) return null;
    const s = shapeOf(key)!;
    return natureGeometry(coarse(s.grid), s.palette, 2 * VOXEL);
  };
  return instancedLayer(map, { [Symbol.iterator]: () => allChunks(map) }, grow, meshOf, { farOf, tint: 0.1 });
}

// Every chunk of `map`.
function* allChunks(map: WorldMap): Generator<string> {
  for (let x = 0; x < map.size.width / CHUNK_SIZE; x++) for (let z = 0; z < map.size.depth / CHUNK_SIZE; z++) yield `${x},${z}`;
}

// Grass as it's drawn: the cover's color brought most of the way to the land's green, and lighter (the cover's own
// end-of-summer khaki on its own reads as bare earth from the camera).
const LAND = [0x6f, 0xb1, 0x4f];
function grassColor(color: number): number {
  const [r, g, b] = [(color >> 16) & 255, (color >> 8) & 255, color & 255].map((c, i) => Math.min(255, Math.round((c * 0.3 + LAND[i] * 0.7) * 1.2)));
  return (r << 16) | (g << 8) | b;
}
