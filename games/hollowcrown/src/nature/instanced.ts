// What nature scatters by the thousand (forests' trees, meadows' grass and flowers) drawn chunk by chunk: each thing
// stood on the ground where it grows, turned a quarter turn or more, tinted a little lighter or darker than the next,
// one instanced mesh a shape a chunk. Every shape's mesh is built up front (the first chunk mustn't stall).

import * as THREE from 'three';
import { litMaterial, meshPart } from '@voxel/engine/models';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import type { VoxelGrid } from '@voxel/engine/voxel';
import type { ChunkLayer, WorldMap } from '@voxel/engine/world';
import { NATURE } from './palette';

const SINK = 0.02; // a little into the ground, no gap at the foot

// One thing growing: where (world units), its shape (a key of the layer's shapes), quarter turns, and its tint
// (0..1: darker to lighter).
export interface Growth {
  x: number;
  z: number;
  shape: string;
  turn: number;
  tint: number;
}

// A shape's mesh from its grid, its foot centred under its origin.
export function natureGeometry(grid: VoxelGrid): THREE.BufferGeometry {
  return meshPart(grid, NATURE.colors, STRUCTURE_VOXEL, [grid.size[0] / 2, 0, grid.size[2] / 2]);
}

// The layer of everything in `byChunk`; `shapes`: each shape's mesh, by its key; `tint`: how far a tint reaches
// either side of the shape's own colors.
export function instancedLayer(map: WorldMap, byChunk: Map<string, Growth[]>, shapes: Map<string, THREE.BufferGeometry>, tint = 0.08): ChunkLayer {
  const material = litMaterial();
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  return {
    materials: [material],
    chunkKeys: () => byChunk.keys(),
    build: (key) => {
      const byShape = new Map<string, Growth[]>();
      for (const g of byChunk.get(key) ?? []) {
        const list = byShape.get(g.shape);
        if (list) list.push(g);
        else byShape.set(g.shape, [g]);
      }
      return [...byShape].map(([shape, all]) => {
        const mesh = new THREE.InstancedMesh(shapes.get(shape)!, material, all.length);
        all.forEach((g, i) => {
          matrix.makeRotationY((g.turn * Math.PI) / 2).setPosition(g.x, map.groundY(g.x, g.z) - SINK, g.z);
          mesh.setMatrixAt(i, matrix);
          mesh.setColorAt(i, color.setScalar(1 + (g.tint * 2 - 1) * tint));
        });
        mesh.computeBoundingSphere();
        return mesh;
      });
    },
  };
}

// Adds `g` to its chunk's list in `byChunk`.
export function plant<T extends { x: number; z: number }>(byChunk: Map<string, T[]>, g: T, chunk: number): void {
  const key = `${Math.floor(Math.round(g.x) / chunk)},${Math.floor(Math.round(g.z) / chunk)}`;
  const list = byChunk.get(key);
  if (list) list.push(g);
  else byChunk.set(key, [g]);
}
