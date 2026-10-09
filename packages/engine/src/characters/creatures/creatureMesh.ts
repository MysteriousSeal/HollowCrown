// What every creature model shares: the shape of a model (a root to place, posed each frame), palettes by name,
// per-voxel noise, parts meshed round their joints (rounded shading, as the hero's), and the materials they're drawn in.

import * as THREE from 'three';
import { greedyMesh, type VoxelGrid } from '../../voxel/greedyMesh';
import { roundNormals } from '../../voxel/roundedNormals';
import { SHADE, personMaterial } from '../human/humanParts';

export type Size = [number, number, number];

// Beasts' voxels (and held arms'): a little coarser than the body's 1/60.
export const CREATURE_VOXEL = 0.025;

// A creature on screen, as the model viewer (and the game) drives it: placed by its root, posed each frame from
// the time and how much it's walking (0 standing .. 1 full stride).
export interface CreatureModel {
  readonly root: THREE.Object3D;
  readonly height: number; // world units, feet to crown (as drawn)
  animate(time: number, walk: number): void;
}

// A palette from named colors: its list (for the mesher) and each name's index + 1 (for painting).
export function namedPalette<K extends string>(entries: Record<K, number>): { colors: number[]; C: Record<K, number> } {
  return {
    colors: Object.values(entries) as number[],
    C: Object.fromEntries(Object.keys(entries).map((name, i) => [name, i + 1])) as Record<K, number>,
  };
}

// Stable noise in [0, 1) from a cell (and a salt): per-voxel variety in a model that's the same every time.
export function hashUnit(x: number, z: number, salt = 0): number {
  let h = Math.imul(x, 73856093) ^ Math.imul(z, 19349663) ^ Math.imul(salt, 83492791);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}
export const oneOf = <T>(items: readonly T[], unit: number): T => items[Math.floor(unit * items.length)];

// A grid meshed so that `pivot` (voxels within it) sits at the origin, shaded as a rounded form. `include` limits
// which colors get faces (a glowing part meshed apart from the rest).
export function meshPart(grid: VoxelGrid, palette: number[], voxel: number, pivot: Size, include?: (color: number) => boolean): THREE.BufferGeometry {
  const origin = new THREE.Vector3(-pivot[0] * voxel, -pivot[1] * voxel, -pivot[2] * voxel);
  return roundNormals(greedyMesh(grid, palette, voxel, origin, include), grid, voxel, origin);
}

// Lit as people are (warm rim, a touch brighter than the ground), so foes stand out as the hero does.
let lit: THREE.MeshStandardMaterial | null = null;
export const creatureMaterial = (): THREE.MeshStandardMaterial => (lit ??= personMaterial());
// Eyes, embers, venom: drawn unlit, so they burn in the dark (and bloom).
let glow: THREE.MeshBasicMaterial | null = null;
export const glowMaterial = (): THREE.MeshBasicMaterial => (glow ??= new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
// The see-through dead (ghosts, wraiths): lit, but faded.
// `glow`: the cold light they give off of themselves (a ghost's blue; a sicklier one's grey-green).
export function spectralMaterial(opacity: number, glow = 0x6688bb): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, transparent: true, opacity, depthWrite: false, emissive: glow, emissiveIntensity: 0.35 });
}

// Lit parts and glowing parts of one grid, as meshes under `parent` (no glow set: one lit mesh).
export function addPart(
  parent: THREE.Object3D,
  grid: VoxelGrid,
  palette: number[],
  voxel: number,
  pivot: Size,
  glows?: ReadonlySet<number>,
  material: THREE.Material = creatureMaterial(),
): THREE.Mesh[] {
  const meshes = [new THREE.Mesh(meshPart(grid, palette, voxel, pivot, glows && ((c) => !glows.has(c))), material)];
  if (glows) meshes.push(new THREE.Mesh(meshPart(grid, palette, voxel, pivot, (c) => glows.has(c)), glowMaterial()));
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

// The soft square of shade under its feet (the hero's), `scale` times as wide.
export function addShade(root: THREE.Object3D, scale = 1): void {
  SHADE.forEach(({ geometry, material }, i) => {
    const square = new THREE.Mesh(geometry, material);
    square.position.y = 0.004 + i * 0.002;
    square.scale.setScalar(scale);
    root.add(square);
  });
}
