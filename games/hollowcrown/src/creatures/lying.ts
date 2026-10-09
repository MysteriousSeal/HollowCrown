// A body lying where it fell (MQ01's dead on the road): any model posed once, then laid down (a person on their back,
// a beast on its side), resting on the ground, and never moving again. Until the engine draws corpses itself.

import * as THREE from 'three';
import type { Model } from '@voxel/engine/models';

export type Fall = 'back' | 'side';

export class Lying implements Model {
  readonly root = new THREE.Group();
  readonly height: number;

  // `pose`: set the body's joints before it's laid down (arms out, the head turned).
  constructor(body: Model, fall: Fall, pose?: (body: Model) => void) {
    body.animate(0, 0);
    pose?.(body);
    const laid = new THREE.Group();
    laid.add(body.root);
    if (fall === 'back') laid.rotation.x = -Math.PI / 2;
    else laid.rotation.z = Math.PI / 2;
    this.root.add(laid);
    laid.updateMatrixWorld(true);
    const box = new THREE.Box3();
    laid.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (mesh.geometry.type === 'PlaneGeometry') mesh.visible = false; // (the shade that stood under its feet)
      else box.expandByObject(mesh);
    });
    laid.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2); // (on the ground, centred where it lies)
    this.height = box.max.y - box.min.y;
  }

  animate(): void {} // (the dead don't breathe)
}
