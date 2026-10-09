// The base every rigged model builds on: a root to place, a frame under it scaled to the model's size, its parts hung
// on joints in that frame (meshed in its look), its height and the shade under it. A rig (a humanoid, a beast, a
// spider, a bird: characters/rigs) or a game's own model extends it and animates its joints.

import * as THREE from 'three';
import type { Size, VoxelGrid } from '../voxel';
import type { Model } from './model';
import { MODEL_VOXEL, addPart, type PartLook } from './parts';
import { addShade } from './shade';

export abstract class RiggedModel implements Model {
  readonly root = new THREE.Group();
  protected readonly frame = new THREE.Group(); // the model's own space, scaled: its joints hang from here
  private drawnHeight = 0;

  constructor(
    protected readonly look: PartLook,
    readonly scale = 1,
  ) {
    this.frame.scale.setScalar(scale);
    this.root.add(this.frame);
  }

  get height(): number {
    return this.drawnHeight;
  }

  // A part: `grid` meshed in the model's look round `pivot`, under `parent` (a joint).
  protected part(parent: THREE.Object3D, grid: VoxelGrid, pivot: Size, voxel = MODEL_VOXEL, look: PartLook = this.look): THREE.Mesh[] {
    return addPart(parent, grid, look.palette, voxel, pivot, look.glows, look.material);
  }

  // Built: its height (world units, as drawn) and the shade under it, `shade` times the standard square.
  protected finish(height: number, shade: number): void {
    this.drawnHeight = height;
    addShade(this.root, shade);
  }

  abstract animate(time: number, motion: number): void;
}
