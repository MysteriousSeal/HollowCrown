// A model's parts: voxel grids meshed round their joints (rounded shading), drawn lit or glowing, hung on joints.

import * as THREE from 'three';
import { greedyMesh, greedyMeshSplit, roundNormals, type Size, type VoxelGrid } from '../voxel';
import { glowMaterial, litMaterial } from './materials';

// Most models' voxels: a little coarser than a human body's 1/60.
export const MODEL_VOXEL = 0.025;

// How a model's parts are coloured and drawn: its palette, which entries glow (drawn unlit), its lit material.
export interface PartLook {
  palette: number[];
  glows?: ReadonlySet<number>;
  material?: THREE.Material;
}

// A grid meshed so that `pivot` (voxels within it) sits at the origin, shaded as a rounded form. `include` limits
// which colors get faces (a glowing part meshed apart from the rest).
export function meshPart(grid: VoxelGrid, palette: number[], voxel: number, pivot: Size, include?: (color: number) => boolean): THREE.BufferGeometry {
  const origin = new THREE.Vector3(-pivot[0] * voxel, -pivot[1] * voxel, -pivot[2] * voxel);
  return roundNormals(greedyMesh(grid, palette, voxel, origin, include), grid, voxel, origin);
}

// A grid's lit voxels and its glowing ones, as meshes under `parent` (no glows: one lit mesh).
export function addPart(
  parent: THREE.Object3D,
  grid: VoxelGrid,
  palette: number[],
  voxel: number,
  pivot: Size,
  glows?: ReadonlySet<number>,
  material: THREE.Material = litMaterial(),
): THREE.Mesh[] {
  let meshes: THREE.Mesh[];
  if (glows) {
    // One meshing pass sorting the faces into lit and glowing (meshing is most of a model's build time).
    const origin = new THREE.Vector3(-pivot[0] * voxel, -pivot[1] * voxel, -pivot[2] * voxel);
    const [lit, glowing] = greedyMeshSplit(grid, palette, voxel, origin, (c) => glows.has(c));
    meshes = [new THREE.Mesh(roundNormals(lit, grid, voxel, origin), material), new THREE.Mesh(roundNormals(glowing, grid, voxel, origin), glowMaterial())];
  } else meshes = [new THREE.Mesh(meshPart(grid, palette, voxel, pivot), material)];
  parent.add(...meshes);
  return meshes;
}

// A joint: a group at (x, y, z) under `parent`, for a part to swing on.
export function joint(parent: THREE.Object3D, x = 0, y = 0, z = 0): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}
