// A bird (a crow, a rook, a gull...): voxel parts on joints, the body over two legs, the head, two wings (folded
// along its back, spread to fly). Standing, it struts and pecks, now and then a hop; moving, it flies: lifted off the
// ground, wings beating, legs tucked.

import * as THREE from 'three';
import type { Size, VoxelGrid } from '../../voxel';
import { MODEL_VOXEL as V, joint, RiggedModel, type ModelAction, type PartLook } from '../../models';

// A part: its grid's builder, the voxel it hangs from (its pivot), and where that joint sits (voxels: on the body
// from its base's middle, the wings' and legs' for its left side, mirrored for the right).
export interface BirdPart {
  grid: () => VoxelGrid;
  pivot: Size;
  at?: Size;
}

export interface BirdSpec extends PartLook {
  body: BirdPart; // hung from the legs' top
  head: BirdPart;
  wing: BirdPart; // built for its left (+X)
  leg: BirdPart & { length: number }; // voxels from hip to toes
  height: number; // voxels from the legs' top to its crown
  shade?: number; // the shade under it (times the standard square)
  scale?: number;
  // Its gestures by name (graze, peck), posed on top of its own pose, `phase` 0 .. 1 through it (Acting with that name).
  gestures?: Readonly<Record<string, (model: BirdModel, phase: number) => void>>;
}

export class BirdModel extends RiggedModel {
  readonly lift: THREE.Group;
  readonly head: THREE.Group;
  readonly wings: Array<{ flap: THREE.Group; spread: THREE.Group; side: number }> = [];
  readonly legs: THREE.Group[] = [];

  constructor(private readonly spec: BirdSpec) {
    super(spec, spec.scale ?? 1);
    const legH = spec.leg.length * V;
    const at = (p: BirdPart, side = 1): [number, number, number] => [side * (p.at?.[0] ?? 0) * V, (p.at?.[1] ?? 0) * V, (p.at?.[2] ?? 0) * V];
    this.lift = joint(this.frame);
    const trunk = joint(this.lift, 0, legH, 0);
    this.part(trunk, spec.body.grid(), spec.body.pivot);
    this.head = joint(trunk, ...at(spec.head));
    this.part(this.head, spec.head.grid(), spec.head.pivot);
    for (const side of [1, -1]) {
      const flap = joint(trunk, ...at(spec.wing, side));
      const spread = joint(flap);
      for (const m of this.part(spread, spec.wing.grid(), spec.wing.pivot)) m.scale.x = side; // (built for its left)
      this.wings.push({ flap, spread, side });
    }
    for (const side of [1, -1]) {
      const [x, , z] = at(spec.leg, side);
      const leg = joint(this.lift, x, legH, z);
      this.part(leg, spec.leg.grid(), spec.leg.pivot);
      this.legs.push(leg);
    }
    this.finish((legH + spec.height * V) * this.scale, spec.shade ?? 0.7);
  }

  animate(t: number, fly: number, action?: ModelAction): void {
    const hop = Math.max(0, Math.sin(t * 5)) ** 8 * 0.03 * (1 - fly); // (a strut, now and then a hop)
    this.lift.position.y = fly * (0.35 + Math.sin(t * 9) * 0.02) + hop;
    this.lift.rotation.x = fly * 0.25;
    const peck = Math.max(0, Math.sin(t * 1.7)) ** 6;
    this.head.rotation.x = (1 - fly) * peck * 0.9 - fly * 0.2;
    for (const w of this.wings) {
      w.spread.rotation.y = -w.side * (Math.PI / 2) * fly; // (folded along its back .. spread wide)
      w.flap.rotation.z = w.side * fly * Math.sin(t * 14) * 0.7;
    }
    for (const leg of this.legs) leg.rotation.x = fly * 1.1; // (tucked)
    if (action) this.spec.gestures?.[action.name]?.(this, action.phase);
  }
}
