// The human body's parts and hair meshed, round their joints (rounded shading), cached: everyone with the same look
// shares them, for as long as the page lives.

import type * as THREE from 'three';
import type { BodyLook } from './look';
import { BODIES, HAIR_PIECE_PIVOT, HUMAN_VOXEL_SIZE, bodyPalette, buildBodyPart, buildHairPiece, type BodyPart } from './bodyVoxels';
import { meshPart } from '../../models/parts';

const geometries = new Map<string, THREE.BufferGeometry | null>();
function cached(key: string, make: () => THREE.BufferGeometry | null): THREE.BufferGeometry | null {
  if (!geometries.has(key)) geometries.set(key, make());
  return geometries.get(key) ?? null;
}

const lookKey = (look: BodyLook) => `${look.build}:${look.skin}:${look.hair}:${look.dye}:${look.hairStyle}:${look.beard}:${look.expression ?? 'calm'}`;

// One body part of `look`, its pivot at the origin.
export function bodyGeometry(look: BodyLook, part: BodyPart): THREE.BufferGeometry {
  return cached(`body:${lookKey(look)}:${part}`, () => meshPart(buildBodyPart(part, look), bodyPalette(look), HUMAN_VOXEL_SIZE, BODIES[look.build].pivot[part]))!;
}

// Hair gathered past the head (a bun, a ponytail, a braid), or null.
export function hairGeometry(look: BodyLook): THREE.BufferGeometry | null {
  return cached(`hair:${look.hair}:${look.hairStyle}`, () => {
    const grid = buildHairPiece(look.hairStyle);
    return grid && meshPart(grid, bodyPalette(look), HUMAN_VOXEL_SIZE, HAIR_PIECE_PIVOT);
  });
}
