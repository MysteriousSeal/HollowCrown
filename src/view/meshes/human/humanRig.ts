// A humanoid on screen (the hero): the naked body (bodyVoxels.ts) on a simple rig of joints, so each part swings on
// its own pivot.
//
//   root (at the feet, turned to face where they walk)
//   └ body (bobs while walking, breathes while idle)
//     ├ torso            hips at the pivot
//     ├ head             neck at the pivot
//     ├ leftArm/rightArm shoulders at the pivots, arms hang down
//     └ leftLeg/rightLeg hips at the pivots, legs hang down
//
// Walking is driven by distance actually moved, so the stride matches any speed and stops the moment they do.
// Its meshes are made in humanParts.ts.

import * as THREE from 'three';
import { HERO_LOOK, type BodyLook } from '../../../model/human/humanoid';
import { BODIES, HUMAN_VOXEL_SIZE, JOINT_NAMES, type Joint } from './bodyVoxels';
import { SHADE, bodyGeometry, hairGeometry, personMaterial } from './humanParts';

const V = HUMAN_VOXEL_SIZE;
const STRIDE = 4.5; // walk-cycle radians per world unit walked: ~3 cycles a second at walking speed
const LEG_SWING = 0.7; // radians at full stride: long, loping steps
const ARM_SWING = 0.55;
const BOB = 0.012; // body rise at each step, world units
const TURN_RATE = 14; // how fast they turn toward where they're walking (per second)

export class HumanRig {
  readonly root = new THREE.Group();
  readonly joints: Record<Joint, THREE.Group>;
  private readonly body = new THREE.Group();
  private readonly last = new THREE.Vector3(Number.NaN, 0, 0);
  private readonly shade = new THREE.Group(); // on the ground under them (see SHADE)
  private phase = 0;
  private swing = 0; // 0 standing .. 1 full stride, eased
  private heading = 0;
  private time = 0;

  constructor(
    readonly look: BodyLook = HERO_LOOK,
    readonly material: THREE.Material = personMaterial(),
  ) {
    const joints = {} as Record<Joint, THREE.Group>;
    for (const joint of JOINT_NAMES) {
      const { part, at } = BODIES[look.build].joints[joint];
      const group = new THREE.Group();
      group.position.set(at[0] * V, at[1] * V, at[2] * V);
      group.add(new THREE.Mesh(bodyGeometry(look, part), material));
      this.body.add(group);
      joints[joint] = group;
    }
    this.joints = joints;
    this.root.add(this.body);
    for (const [i, { geometry, material: shade }] of SHADE.entries()) {
      const square = new THREE.Mesh(geometry, shade);
      square.position.y = 0.004 + i * 0.002; // just clear of the ground, the inner one over the outer
      this.shade.add(square);
    }
    this.root.add(this.shade);
    const hair = hairGeometry(look);
    if (hair) joints.head.add(new THREE.Mesh(hair, material));
  }

  // Places the body at (x, y, z) and animates from how far they moved since last frame (facing, walk cycle, bob, or
  // idle breathing).
  update(x: number, y: number, z: number, dt: number): void {
    this.time += dt;
    const dx = Number.isNaN(this.last.x) ? 0 : x - this.last.x;
    const dz = Number.isNaN(this.last.x) ? 0 : z - this.last.z;
    this.last.set(x, y, z);
    this.root.position.set(x, y, z);

    const moved = Math.hypot(dx, dz);
    const walking = moved > 1e-4;
    if (walking) {
      // Turn toward the direction of travel along the shortest way round.
      const target = Math.atan2(dx, dz);
      const diff = Math.atan2(Math.sin(target - this.heading), Math.cos(target - this.heading));
      this.heading += diff * Math.min(1, TURN_RATE * dt);
      this.phase += moved * STRIDE;
    }
    this.root.rotation.y = this.heading;
    this.shade.rotation.y = -this.heading; // square to the world
    this.swing += ((walking ? 1 : 0) - this.swing) * Math.min(1, 12 * dt);

    const s = Math.sin(this.phase) * this.swing;
    this.joints.leftLeg.rotation.x = s * LEG_SWING;
    this.joints.rightLeg.rotation.x = -s * LEG_SWING;
    this.joints.leftArm.rotation.x = -s * ARM_SWING;
    this.joints.rightArm.rotation.x = s * ARM_SWING;
    // A rise at each footfall while walking; a slow breath while idle.
    const breath = Math.sin(this.time * 2.2) * 0.004 * (1 - this.swing);
    this.body.position.y = Math.abs(Math.sin(this.phase)) * BOB * this.swing + breath;
    this.joints.head.rotation.x = breath * 4; // the head nods slightly with it
  }
}
