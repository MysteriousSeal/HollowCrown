// Carrion rooks perched in a row (brindle-vale.md: the Pilgrim Road's gibbet at the Hanging Oak, a flock at dusk;
// bestiary.md, carrion rooks): along a beam `length` world units long, each turned its own way and a little apart from
// the next, strutting and pecking out of step with the others, the leader among them. Its root is the beam's top
// (gameplay sets it on the gibbet's arm); `fly` lifts them all off it, wings beating. Who uses it: creatures/index.ts.

import * as THREE from 'three';
import { hashUnit } from '@voxel/engine/math';
import type { Model } from '@voxel/engine/models';
import { BirdModel, type BirdSpec } from '@voxel/engine/characters';
import { ROOK, ROOK_LEADER } from './rookVoxels';

export class PerchedFlock implements Model {
  readonly root = new THREE.Group();
  readonly height: number;
  private readonly birds: Array<{ model: BirdModel; lag: number }> = [];

  constructor(count = 5, length = 0.6, seed = 1) {
    for (let i = 0; i < count; i++) {
      const spec: BirdSpec = i === Math.floor(count / 2) ? ROOK_LEADER : ROOK;
      const model = new BirdModel(spec);
      const along = count === 1 ? 0 : (i / (count - 1) - 0.5) * length;
      model.root.position.set(along + (hashUnit(i, seed, 81) - 0.5) * 0.04, 0, (hashUnit(i, seed, 82) - 0.5) * 0.03);
      model.root.rotation.y = (hashUnit(i, seed, 83) - 0.5) * 2.4; // (each its own way)
      this.root.add(model.root);
      this.birds.push({ model, lag: hashUnit(i, seed, 84) * 7 });
    }
    this.root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry.type === 'PlaneGeometry') mesh.visible = false; // (no shade: they're up on a beam)
    });
    this.height = Math.max(...this.birds.map((b) => b.model.height));
  }

  animate(time: number, fly: number): void {
    for (const { model, lag } of this.birds) model.animate(time + lag, fly);
  }
}
