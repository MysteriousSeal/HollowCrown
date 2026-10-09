// The Vale's forests: trees in every forest the map draws (an area of kind 'forest', its props.trees naming the
// species, the first the most of them), on a grid of two-tile cells, most cells a tree somewhere in them, each tree's
// species, shape, turn and tint from its cell's hash (the same every time). None on a road, in water or on any drawn
// surface, none on a building or by a place. Drawn chunk by chunk: each tree shape's mesh built once, instanced.

import * as THREE from 'three';
import { hashUnit } from '@voxel/engine/math';
import { litMaterial, meshPart } from '@voxel/engine/models';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import { CHUNK_SIZE, boundsOf, covers, type Box, type ChunkLayer, type Obstacles, type WorldMap } from '@voxel/engine/world';
import { NATURE } from './palette';
import { SPECIES, VARIANTS, treeVoxels, type Species } from './trees';

const CELL = 2; // tiles a side of a forest's cells: a tree at most in each
const STANDING = 0.7; // the share of cells with a tree
const PLACE_ROOM = 2.5; // tiles kept clear round a place (a shrine, a cave's mouth)
const TRUNK: Record<Species, number> = { oak: 0.2, birch: 0.12, pine: 0.2 }; // half a trunk's width, world units
const SINK = 0.02; // roots a little into the ground, no gap at the foot

export interface Tree {
  x: number;
  z: number;
  species: Species;
  variant: number;
  turn: number; // quarter turns
  tint: number; // 0..1: darker to lighter
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
        const tree: Tree = {
          x, z,
          species: species.length === 1 || pick < 0.65 ? species[0] : species[1 + Math.floor(((pick - 0.65) / 0.35) * (species.length - 1))],
          variant: Math.floor(hashUnit(cx, cz, 405) * VARIANTS),
          turn: Math.floor(hashUnit(cx, cz, 406) * 4),
          tint: hashUnit(cx, cz, 407),
        };
        const key = `${Math.floor(tx / CHUNK_SIZE)},${Math.floor(tz / CHUNK_SIZE)}`;
        const list = byChunk.get(key);
        if (list) list.push(tree);
        else byChunk.set(key, [tree]);
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

// Each tree shape's mesh, built once.
const geometries = new Map<string, THREE.BufferGeometry>();
function treeGeometry(species: Species, variant: number): THREE.BufferGeometry {
  const key = `${species}${variant}`;
  if (!geometries.has(key)) {
    const grid = treeVoxels(species, variant);
    geometries.set(key, meshPart(grid, NATURE.colors, STRUCTURE_VOXEL, [grid.size[0] / 2, 0, grid.size[2] / 2]));
  }
  return geometries.get(key)!;
}

// The layer of the forests' trees: a chunk's trees as one instanced mesh a shape, each tree stood on the ground,
// turned, tinted a little lighter or darker than the next. Every shape's mesh is built here, up front, so the first
// forest the hero nears doesn't stall.
export function forestLayer(map: WorldMap, byChunk: Map<string, Tree[]>): ChunkLayer {
  for (const species of SPECIES) for (let v = 0; v < VARIANTS; v++) treeGeometry(species, v);
  const material = litMaterial();
  const turn = new THREE.Matrix4();
  const color = new THREE.Color();
  return {
    materials: [material],
    chunkKeys: () => byChunk.keys(),
    build: (key) => {
      const byShape = new Map<string, Tree[]>();
      for (const tree of byChunk.get(key) ?? []) {
        const shape = `${tree.species}${tree.variant}`;
        byShape.set(shape, [...(byShape.get(shape) ?? []), tree]);
      }
      return [...byShape.values()].map((trees) => {
        const mesh = new THREE.InstancedMesh(treeGeometry(trees[0].species, trees[0].variant), material, trees.length);
        trees.forEach((tree, i) => {
          turn.makeRotationY((tree.turn * Math.PI) / 2).setPosition(tree.x, map.groundY(tree.x, tree.z) - SINK, tree.z);
          mesh.setMatrixAt(i, turn);
          mesh.setColorAt(i, color.setScalar(0.92 + tree.tint * 0.16));
        });
        mesh.computeBoundingSphere();
        return mesh;
      });
    },
  };
}
