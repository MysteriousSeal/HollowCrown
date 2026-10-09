// What an entity looks like on screen, and the entity the camera follows.

import type * as THREE from 'three';
import { defineComponent } from '../ecs';

// An entity's look: an object in the scene, the materials it's drawn in (for the stylized look to patch), and how it's
// placed and animated each frame from where its Transform says it is.
export interface Visual {
  readonly object: THREE.Object3D;
  readonly materials: readonly THREE.Material[];
  update(x: number, y: number, z: number, dt: number): void;
}
export const VisualComponent = defineComponent<Visual>('Visual');

// The entity the camera follows (the first one found).
export const CameraTarget = defineComponent<true>('CameraTarget');

// A rig (a human's, a creature's) as a visual.
export const rigVisual = (rig: { root: THREE.Object3D; material: THREE.Material; update(x: number, y: number, z: number, dt: number): void }): Visual => ({
  object: rig.root,
  materials: [rig.material],
  update: (x, y, z, dt) => rig.update(x, y, z, dt),
});
