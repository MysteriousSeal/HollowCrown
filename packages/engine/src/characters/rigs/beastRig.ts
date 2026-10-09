// A four-legged creature (a wolf, a boar, a bear, a hound...): voxel parts on joints.
// Walking, its legs trot in diagonal pairs with a bob of the body and the head; standing, it breathes, its head
// turns now and then, its tail wags low.

import * as THREE from 'three';
import type { Size, VoxelGrid } from '../../voxel';
import { MODEL_VOXEL as V, joint, RiggedModel, type PartLook } from '../../models';

export type BeastPart = { grid: () => VoxelGrid; size: Size };

export interface BeastSpec extends PartLook {
  body: BeastPart;
  head: BeastPart;
  leg: BeastPart;
  tail: BeastPart;
  headDrop: number; // voxels below the body's top that the head sits at
  tailDrop?: number; // voxels below the body's top that the tail's root is (1 if not given)
  tailDroop?: number; // radians the tail hangs down at rest (a stub angled down)
  legsAt: Array<[number, number]>; // front right, front left, back right, back left (voxels; its right is -X)
  scale?: number; // drawn bigger (an alpha) or smaller
  stride?: number; // gait cycles a second at a walk
}

// A part of a beast: its grid's builder and size.
export const beastPart = (grid: () => VoxelGrid, size: Size): BeastPart => ({ grid, size });

const LEG_SWING = 0.6;

export class BeastModel extends RiggedModel {
  private readonly body: THREE.Group;
  private readonly head: THREE.Group;
  private readonly tail: THREE.Group;
  private readonly legs: THREE.Group[] = [];

  constructor(private readonly spec: BeastSpec) {
    super(spec, spec.scale ?? 1);
    const [legH, bodyH, bodyL] = [spec.leg.size[1] * V, spec.body.size[1] * V, spec.body.size[2] * V];
    this.body = joint(this.frame);
    const add = (g: THREE.Group, p: BeastPart, pivot: Size) => this.part(g, p.grid(), pivot);
    add(joint(this.body, 0, legH, 0), spec.body, [spec.body.size[0] / 2, 0, spec.body.size[2] / 2]);
    this.head = joint(this.body, 0, legH + bodyH - spec.headDrop * V, bodyL / 2 - V);
    add(this.head, spec.head, [spec.head.size[0] / 2, 0, 0]);
    this.tail = joint(this.body, 0, legH + bodyH - (spec.tailDrop ?? 1) * V, -bodyL / 2);
    add(this.tail, spec.tail, [spec.tail.size[0] / 2, spec.tail.size[1] / 2, spec.tail.size[2]]);
    for (const [x, z] of spec.legsAt) {
      const leg = joint(this.body, x * V, legH, z * V);
      add(leg, spec.leg, [spec.leg.size[0] / 2, spec.leg.size[1], spec.leg.size[2] / 2]);
      this.legs.push(leg);
    }
    this.finish((legH + bodyH + spec.head.size[1] * V * 0.5) * this.scale, (bodyL / 0.36) * this.scale);
  }
  animate(time: number, walk: number): void {
    const phase = time * Math.PI * 2 * (this.spec.stride ?? 1.6);
    const s = Math.sin(phase) * LEG_SWING * walk;
    this.legs[0].rotation.x = s; // (diagonal pairs together)
    this.legs[3].rotation.x = s;
    this.legs[1].rotation.x = -s;
    this.legs[2].rotation.x = -s;
    const breath = Math.sin(time * 2.4) * 0.004 * (1 - walk);
    this.body.position.y = Math.abs(Math.cos(phase)) * 0.012 * walk + breath;
    this.head.rotation.x = Math.sin(phase * 2) * 0.06 * walk + breath * 3;
    this.head.rotation.y = Math.sin(time * 0.6) * 0.25 * (1 - walk); // looking about
    this.tail.rotation.x = -(this.spec.tailDroop ?? 0.35) + 0.4 * walk;
    this.tail.rotation.y = Math.sin(time * 6) * 0.35 * (1 - walk);
  }
}
