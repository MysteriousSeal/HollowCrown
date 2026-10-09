// What nature scatters by the thousand (forests' trees, meadows' grass and flowers) drawn chunk by chunk: each thing
// stood on the ground where it grows, turned a quarter turn or more, tinted a little lighter or darker than the next,
// one instanced mesh a shape a chunk. Each shape's mesh is made once, when it's first needed; a shape may have a far
// stand-in at half the resolution (a tree: a quarter of the triangles), drawn for chunks well off from the hero.

import * as THREE from 'three';
import { litMaterial, meshPart } from '@voxel/engine/models';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import { CAMERA_OFFSET } from '@voxel/engine/render';
import { colorAt, createGrid, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { CHUNK_SIZE, type ChunkLayer, type WorldMap } from '@voxel/engine/world';
import { NATURE } from './palette';

const SINK = 0.02; // a little into the ground, no gap at the foot

// One thing growing (or standing: a fence, a stone): where (world units), its shape (a key of the layer's shapes),
// quarter turns, its tint (0..1: darker to lighter), and how far it's stretched along its own x (a fence's rails to
// the length of their run; none: 1).
export interface Growth {
  x: number;
  z: number;
  shape: string;
  turn: number;
  tint: number;
  stretch?: number;
}

// A shape's mesh from its grid (painted from `palette`), its foot centred under its origin; `voxel`: world units a
// voxel (a far stand-in's are twice the size).
export function natureGeometry(grid: VoxelGrid, palette = NATURE.colors, voxel = STRUCTURE_VOXEL): THREE.BufferGeometry {
  return meshPart(grid, palette, voxel, [grid.size[0] / 2, 0, grid.size[2] / 2]);
}

// A grid at half its resolution, for a far stand-in: each block of two voxels a side kept if at least three of its
// eight are (so a thin trunk stays), in the color most of them are.
export function coarse(grid: VoxelGrid): VoxelGrid {
  const [sx, sy, sz] = grid.size;
  const out = createGrid([Math.ceil(sx / 2), Math.ceil(sy / 2), Math.ceil(sz / 2)]);
  const counts = new Map<number, number>();
  for (let z = 0; z < out.size[2]; z++) {
    for (let y = 0; y < out.size[1]; y++) {
      for (let x = 0; x < out.size[0]; x++) {
        counts.clear();
        let [filled, best, most] = [0, 0, 0];
        for (let d = 0; d < 8; d++) {
          const c = colorAt(grid, 2 * x + (d & 1), 2 * y + ((d >> 1) & 1), 2 * z + (d >> 2));
          if (!c) continue;
          filled++;
          const n = (counts.get(c) ?? 0) + 1;
          counts.set(c, n);
          if (n > most) [best, most] = [c, n];
        }
        if (filled >= 3) setColor(out, x, y, z, best);
      }
    }
  }
  return out;
}

// How far (tiles, from the hero to a chunk's middle) a chunk's things are drawn by their far stand-ins, as the camera
// measures it: its own height and distance off the hero, and that far across the ground.
export const FAR_TILES = 25;
const FAR = Math.hypot(CAMERA_OFFSET.length(), FAR_TILES);

// The layer of what grows in chunks `keys`: `grow` works out a chunk's growth the first time it comes near (kept for
// when it comes back); `meshOf`: a shape's mesh from its key, made the first time a chunk needs it (not all up front:
// the game mustn't wait on shapes it hasn't come near); `farOf`, if given: its far stand-in, drawn instead for a chunk
// FAR_TILES off or more; `tint`: how far a tint reaches either side of the shape's own colors.
export function instancedLayer(
  map: WorldMap, keys: Iterable<string>, grow: (key: string) => Growth[], meshOf: (shape: string) => THREE.BufferGeometry,
  { tint = 0.08, farOf }: { tint?: number; farOf?: (shape: string) => THREE.BufferGeometry } = {},
): ChunkLayer {
  const material = litMaterial();
  const matrix = new THREE.Matrix4();
  const stretch = new THREE.Matrix4();
  const color = new THREE.Color();
  const grown = new Map<string, Map<string, Growth[]>>(); // chunk -> shape -> its growth
  const cache = (make: (shape: string) => THREE.BufferGeometry) => {
    const made = new Map<string, THREE.BufferGeometry>();
    return (shape: string) => made.get(shape) ?? made.set(shape, make(shape)).get(shape)!;
  };
  const [near, far] = [cache(meshOf), farOf && cache(farOf)];
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
  // One instanced mesh a shape, from `meshes`, each thing placed less `origin` (where the meshes' parent stands).
  const meshesOf = (key: string, meshes: (shape: string) => THREE.BufferGeometry, [ox, oz]: [number, number]) =>
    [...byShape(key)].map(([shape, all]) => {
      const mesh = new THREE.InstancedMesh(meshes(shape), material, all.length);
      all.forEach((g, i) => {
        matrix.makeRotationY((g.turn * Math.PI) / 2).multiply(stretch.makeScale(g.stretch ?? 1, 1, 1)).setPosition(g.x - ox, map.groundY(g.x, g.z) - SINK, g.z - oz);
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, color.setScalar(1 + (g.tint * 2 - 1) * tint));
      });
      mesh.computeBoundingSphere();
      return mesh;
    });
  return {
    materials: [material],
    chunkKeys: () => keys,
    build: (key) => {
      if (!far) return meshesOf(key, near, [0, 0]);
      // near and far, the chunk's middle their origin (the camera's distance to it picks which is drawn)
      const [cx, cz] = key.split(',').map((n) => (Number(n) + 0.5) * CHUNK_SIZE - 0.5);
      const lod = new THREE.LOD();
      lod.position.set(cx, 0, cz);
      lod.addLevel(new THREE.Group().add(...meshesOf(key, near, [cx, cz])), 0);
      lod.addLevel(new THREE.Group().add(...meshesOf(key, far, [cx, cz])), FAR);
      return byShape(key).size ? [lod] : [];
    },
  };
}
