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

// The layer of what grows in chunks `keys`: `grow` works out a chunk's growth the first time it comes near (kept for
// when it comes back); `shapes`: each shape's mesh, by its key; `tint`: how far a tint reaches either side of the
// shape's own colors.
export function instancedLayer(
  map: WorldMap, keys: Iterable<string>, grow: (key: string) => Growth[], shapes: Map<string, THREE.BufferGeometry>, tint = 0.08,
): ChunkLayer {
  const material = litMaterial();
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const grown = new Map<string, Map<string, Growth[]>>(); // chunk -> shape -> its growth
  const byShape = (key: string) => {
    if (!grown.has(key)) {
      const shaped = new Map<string, Growth[]>();
      for (const g of grow(key)) {
        const list = shaped.get(g.shape);
        if (list) list.push(g);
        else shaped.set(g.shape, [g]);
      }
      grown.set(key, shaped);
    }
    return grown.get(key)!;
  };
  return {
    materials: [material],
    chunkKeys: () => keys,
    build: (key) =>
      [...byShape(key)].map(([shape, all]) => {
        const mesh = new THREE.InstancedMesh(shapes.get(shape)!, material, all.length);
        all.forEach((g, i) => {
          matrix.makeRotationY((g.turn * Math.PI) / 2).setPosition(g.x, map.groundY(g.x, g.z) - SINK, g.z);
          mesh.setMatrixAt(i, matrix);
          mesh.setColorAt(i, color.setScalar(1 + (g.tint * 2 - 1) * tint));
        });
        mesh.computeBoundingSphere();
        return mesh;
      }),
  };
}
