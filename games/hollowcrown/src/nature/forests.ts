// The Vale's forests: trees in every forest the map draws (an area of kind 'forest', its props.trees naming the
// species, the first the most of them), on a grid of two-tile cells, most cells a tree somewhere in them, each tree's
// species, shape, turn and tint from its cell's hash (the same every time). None on a road, in water or on any drawn
// surface, none on a building or by a place. Worked out and drawn chunk by chunk as the hero comes near, instanced
// (instanced.ts).

import { hashUnit } from '@voxel/engine/math';
import { CHUNK_SIZE, boundsOf, chunkKeysIn, chunkTilesIn, covers, type Box, type ChunkLayer, type Obstacles, type Shape, type WorldMap } from '@voxel/engine/world';
import { instancedLayer, natureGeometry, type Growth } from './instanced';
import { SPECIES, VARIANTS, treeVoxels, type Species } from './trees';

const CELL = 2; // tiles a side of a forest's cells: a tree at most in each
const STANDING = 0.7; // the share of cells with a tree
const PLACE_ROOM = 2.5; // tiles kept clear round a place (a shrine, a cave's mouth)
const TRUNK: Record<Species, number> = { oak: 0.2, birch: 0.12, pine: 0.2 }; // half a trunk's width, world units

export interface Tree extends Growth {
  species: Species;
  variant: number;
}

// The forests' areas' props.
export interface ForestProps {
  trees: Species[];
}

// Each forest on `map` and the species it names (those it names that grow here).
const forestsOf = (map: WorldMap) =>
  map.data.areas
    .filter((a) => a.kind === 'forest')
    .map((area) => ({ area, species: ((area.props as ForestProps | undefined)?.trees ?? []).filter((s) => SPECIES.includes(s)) }))
    .filter((f) => f.species.length);

// The tiles round a shape, in whole cells (x1, z1: just past its last).
function cellsOf(shape: Shape): { x0: number; z0: number; x1: number; z1: number } {
  const b = boundsOf(shape);
  return { x0: Math.floor(b.x0 / CELL) * CELL, z0: Math.floor(b.z0 / CELL) * CELL, x1: (Math.floor(b.x1 / CELL) + 1) * CELL, z1: (Math.floor(b.z1 / CELL) + 1) * CELL };
}

// The chunks the forests on `map` reach into.
export function forestChunks(map: WorldMap): Set<string> {
  return new Set(forestsOf(map).flatMap(({ area }) => [...chunkKeysIn(cellsOf(area.shape))]));
}

// Every forest tree in chunk `key` of `map`; `keepOut`: what's built (no tree on it). (A cell's tree stays on its own
// two tiles, so a chunk's cells hold its trees.)
export function treesIn(map: WorldMap, key: string, keepOut: Obstacles): Tree[] {
  const trees: Tree[] = [];
  const [kx, kz] = key.split(',').map(Number);
  const places = map.placesIn({ x0: kx * CHUNK_SIZE - 3, z0: kz * CHUNK_SIZE - 3, x1: (kx + 1) * CHUNK_SIZE + 3, z1: (kz + 1) * CHUNK_SIZE + 3 }).map((p) => p.at);
  for (const { area, species } of forestsOf(map)) {
    const tiles = chunkTilesIn(key, cellsOf(area.shape));
    if (!tiles) continue;
    for (let cx = tiles.x0 / CELL; cx < tiles.x1 / CELL; cx++) {
      for (let cz = tiles.z0 / CELL; cz < tiles.z1 / CELL; cz++) {
        if (hashUnit(cx, cz, 401) >= STANDING) continue;
        const x = cx * CELL + 0.5 + (hashUnit(cx, cz, 402) - 0.5) * 1.4;
        const z = cz * CELL + 0.5 + (hashUnit(cx, cz, 403) - 0.5) * 1.4;
        const [tx, tz] = [Math.round(x), Math.round(z)];
        if (!covers(area.shape, tx, tz) || !bare(map, tx, tz) || keepOut.blocks(x, z, 1.2)) continue;
        if (places.some(([px, pz]) => Math.abs(px - x) < PLACE_ROOM && Math.abs(pz - z) < PLACE_ROOM)) continue;
        const pick = hashUnit(cx, cz, 404);
        const kind = species.length === 1 || pick < 0.65 ? species[0] : species[1 + Math.floor(((pick - 0.65) / 0.35) * (species.length - 1))];
        const variant = Math.floor(hashUnit(cx, cz, 405) * VARIANTS);
        trees.push({ x, z, species: kind, variant, shape: `${kind}${variant}`, turn: Math.floor(hashUnit(cx, cz, 406) * 4), tint: hashUnit(cx, cz, 407) });
      }
    }
  }
  return trees;
}

// Whether a tile and the four round it are bare ground (no road, water, field or path under a tree's crown).
const bare = (map: WorldMap, x: number, z: number) =>
  map.surfaceAt(x, z) === 0 && map.surfaceAt(x + 1, z) === 0 && map.surfaceAt(x - 1, z) === 0 && map.surfaceAt(x, z + 1) === 0 && map.surfaceAt(x, z - 1) === 0;

// A tree's trunk, in the way.
export function trunkOf(tree: Tree): Box {
  const h = TRUNK[tree.species];
  return { x0: tree.x - h, z0: tree.z - h, x1: tree.x + h, z1: tree.z + h };
}

// The layer of the forests' trees (instanced.ts): a chunk's trees worked out as it first comes near (kept for when it
// comes back), none on what `keepOut` holds, their trunks added to `obstacles` then.
export function forestLayer(map: WorldMap, keepOut: Obstacles, obstacles: Obstacles): ChunkLayer {
  const shapes = new Map(SPECIES.flatMap((s) => Array.from({ length: VARIANTS }, (_, v) => [`${s}${v}`, natureGeometry(treeVoxels(s, v))] as const)));
  const grow = (key: string): Tree[] => {
    const trees = treesIn(map, key, keepOut);
    for (const tree of trees) obstacles.add(trunkOf(tree));
    return trees;
  };
  return instancedLayer(map, forestChunks(map), grow, shapes);
}

// Every forest tree on `map` at once, by chunk (for tests and tools: the game works them out a chunk at a time).
export function forestTrees(map: WorldMap, keepOut: Obstacles): Map<string, Tree[]> {
  return new Map([...forestChunks(map)].map((key) => [key, treesIn(map, key, keepOut)]));
}
