// The meshes a humanoid is made of (humanRig.ts puts them together): each
// body part, hair gathered past the head, a worn item's shell on a part, a
// held item; shared by everyone with the same look or wearing the same item,
// and made once for the page. And what they're drawn in, and the shade under their feet.

import * as THREE from 'three';
import type { BodyLook } from '../../../model/human/humanoid';
import { greedyMesh, type VoxelGrid } from '../voxel/greedyMesh';
import { BODIES, HAIR_PIECE_PIVOT, HUMAN_VOXEL_SIZE, bodyPalette, buildBodyPart, buildHairPiece, type BodyPart } from './bodyVoxels';
import { roundNormals } from '../voxel/roundedNormals';

const V = HUMAN_VOXEL_SIZE;

// What people are drawn in: their voxel colors lifted a little over the
// world's (a touch brighter, and warm light in their shade), so they stand
// out from the ground they're on.
export function personMaterial(): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, emissive: 0x2a1e14 });
  material.color.setRGB(1.12, 1.1, 1.06);
  withRimLight(material);
  return material;
}

// A warm rim of light round a figure's edges, where its surface turns away
// from the eye (strongest at the silhouette, none face on): people read as
// soft lit volumes against the ground, not cut-outs.
const RIM = { color: new THREE.Color(0xffd2a0), strength: 0.32, falloff: 2.6 };
export function withRimLight<M extends THREE.MeshStandardMaterial>(material: M): M {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.rimColor = { value: RIM.color };
    shader.fragmentShader = `uniform vec3 rimColor;\n${shader.fragmentShader}`.replace(
      '#include <opaque_fragment>',
      `float rim = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), ${RIM.falloff.toFixed(2)});
      outgoingLight += rimColor * rim * ${RIM.strength.toFixed(2)} * diffuseColor.rgb;
      #include <opaque_fragment>`,
    );
  };
  material.customProgramCacheKey = () => 'person-rim';
  return material;
}

// A soft square of shade on the ground under someone's feet (two squares, the
// inner one darker), square to the world whichever way they face; outdoors,
// where nothing else casts a shadow, it sets them apart from the ground.
export const SHADE = [
  { size: 0.36, opacity: 0.16 },
  { size: 0.24, opacity: 0.2 },
].map(({ size, opacity }) => ({
  geometry: new THREE.PlaneGeometry(size, size).rotateX(-Math.PI / 2),
  material: new THREE.MeshBasicMaterial({ color: 0x1a1008, transparent: true, opacity, depthWrite: false }),
}));

// Geometries are shared by everyone with the same look, and live as long as the page.
const geometries = new Map<string, THREE.BufferGeometry | null>();
function cached(key: string, make: () => THREE.BufferGeometry | null): THREE.BufferGeometry | null {
  if (!geometries.has(key)) geometries.set(key, make());
  return geometries.get(key) ?? null;
}

// Meshes `grid` so that `pivot` (in voxels within the grid) sits at the
// origin, shaded as a rounded form (roundedNormals.ts).
function meshAround(grid: VoxelGrid, palette: number[], pivot: [number, number, number]): THREE.BufferGeometry {
  const origin = new THREE.Vector3(-pivot[0] * V, -pivot[1] * V, -pivot[2] * V);
  return roundNormals(greedyMesh(grid, palette, V, origin), grid, V, origin);
}

export function bodyGeometry(look: BodyLook, part: BodyPart): THREE.BufferGeometry {
  const key = `body:${look.build}:${look.skin}:${look.hair}:${look.dye}:${look.hairStyle}:${look.beard}:${look.expression ?? 'calm'}:${part}`;
  return cached(key, () => meshAround(buildBodyPart(part, look), bodyPalette(look), BODIES[look.build].pivot[part]))!;
}

// Hair gathered past the head (a bun, a ponytail, a braid), or null.
export function hairGeometry(look: BodyLook): THREE.BufferGeometry | null {
  return cached(`hair:${look.hair}:${look.hairStyle}`, () => {
    const grid = buildHairPiece(look.hairStyle);
    return grid && meshAround(grid, bodyPalette(look), HAIR_PIECE_PIVOT);
  });
}
