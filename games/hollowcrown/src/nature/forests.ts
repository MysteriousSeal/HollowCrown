// The Vale's forests: trees in every forest the map draws (an area of kind 'forest', its props.trees naming the
// species, the first the most of them), on a grid of two-tile cells, most cells a tree somewhere in them, each tree's
// species, shape, turn and tint from its cell's hash (the same every time). None on a road, in water or on any drawn
// surface, none on a building or by a place. Drawn chunk by chunk, instanced (instanced.ts).

import { hashUnit } from '@voxel/engine/math';
import { CHUNK_SIZE, boundsOf, covers, type Box, type ChunkLayer, type Obstacles, type WorldMap } from '@voxel/engine/world';
import { instancedLayer, natureGeometry, plant, type Growth } from './instanced';
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

// Every forest tree on `map`, by chunk; `keepOut`: what's built (no tree on it).
export function forestTrees(map: WorldMap, keepOut: Obstacles): Map<string, Tree[]> {
  const byChunk = new Map<string, Tree[]>();
  const places = map.places().map((p) => p.at);
  for (const area of map.data.areas.filter((a) => a.kind === 'forest')) {
    const species = ((area.props as ForestProps | undefined)?.trees ?? []).filter((s) => SPECIES.includes(s));
    if (!species.length) continue;
    const b = boundsOf(area.shape);
    for (let cx = Math.floor(b.x0 / CELL); cx * CELL <= b.x1; cx++) {
      for (let cz = Math.floor(b.z0 / CELL); cz * CELL <= b.z1; cz++) {
        if (hashUnit(cx, cz, 401) >= STANDING) continue;
        const x = cx * CELL + 0.5 + (hashUnit(cx, cz, 402) - 0.5) * 1.4;
        const z = cz * CELL + 0.5 + (hashUnit(cx, cz, 403) - 0.5) * 1.4;
        const [tx, tz] = [Math.round(x), Math.round(z)];
        if (!covers(area.shape, tx, tz) || !bare(map, tx, tz) || keepOut.blocks(x, z, 1.2)) continue;
        if (places.some(([px, pz]) => Math.abs(px - x) < PLACE_ROOM && Math.abs(pz - z) < PLACE_ROOM)) continue;
        const pick = hashUnit(cx, cz, 404);
        const kind = species.length === 1 || pick < 0.65 ? species[0] : species[1 + Math.floor(((pick - 0.65) / 0.35) * (species.length - 1))];
        const variant = Math.floor(hashUnit(cx, cz, 405) * VARIANTS);
        plant(byChunk, { x, z, species: kind, variant, shape: `${kind}${variant}`, turn: Math.floor(hashUnit(cx, cz, 406) * 4), tint: hashUnit(cx, cz, 407) }, CHUNK_SIZE);
      }
    }
  }
  return byChunk;
}

// Whether a tile and the four round it are bare ground (no road, water, field or path under a tree's crown).
const bare = (map: WorldMap, x: number, z: number) =>
  map.surfaceAt(x, z) === 0 && map.surfaceAt(x + 1, z) === 0 && map.surfaceAt(x - 1, z) === 0 && map.surfaceAt(x, z + 1) === 0 && map.surfaceAt(x, z - 1) === 0;

// A tree's trunk, in the way.
export function trunkOf(tree: Tree): Box {
  const h = TRUNK[tree.species];
  return { x0: tree.x - h, z0: tree.z - h, x1: tree.x + h, z1: tree.z + h };
}

// The layer of the forests' trees (instanced.ts).
export function forestLayer(map: WorldMap, byChunk: Map<string, Tree[]>): ChunkLayer {
  const shapes = new Map(SPECIES.flatMap((s) => Array.from({ length: VARIANTS }, (_, v) => [`${s}${v}`, natureGeometry(treeVoxels(s, v))] as const)));
  return instancedLayer(map, byChunk, shapes);
}
