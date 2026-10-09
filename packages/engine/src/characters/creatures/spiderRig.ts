// A spider (its parts given by a SpiderSpec): its parts
// on their joints. Walking, its legs go in two alternating fours (one side's first and third with the other's second
// and fourth), each swung on and lifted; at rest, now and then a leg twitches, its abdomen swells as it breathes, its
// fangs work.

import * as THREE from 'three';
import { CREATURE_VOXEL as V, addPart, addShade, joint, type CreatureModel, type Size } from './creatureMesh';
import type { VoxelGrid } from '../../voxel/greedyMesh';

export interface SpiderSpec {
  palette: number[];
  glows?: ReadonlySet<number>; // palette entries drawn unlit (eyes that burn in the dark)
  head: { size: Size; build: () => VoxelGrid };
  abdomen: { size: Size; build: () => VoxelGrid };
  leg: { size: Size; build: (pair: number) => VoxelGrid }; // pair 0 (front) .. 3 (back)
  fangs: { size: Size; build: () => VoxelGrid };
  hipY: number; // voxels up its leg the hip is (where the leg's built from)
  hips: Array<[number, number]>; // where each pair of legs joins the head, front first (voxels: across, along from its back)
  spread: [number, number, number, number]; // each pair's turn from straight out (radians, + toward the front)
}

interface Leg {
  yaw: THREE.Group; // swung on (about the hip, upright)
  lift: THREE.Group; // and lifted (about its own length)
  side: number; // +1 its left (+X), -1 its right
  pair: number;
  spread: number;
}

export class SpiderModel implements CreatureModel {
  readonly root = new THREE.Group();
  readonly height: number;
  private readonly body: THREE.Group;
  private readonly abdomen: THREE.Group;
  private readonly fangs: THREE.Group;
  private readonly legs: Leg[] = [];
  private readonly hip: number;

  constructor(spec: SpiderSpec, scale = 1) {
    const scaled = joint(this.root);
    scaled.scale.setScalar(scale);
    const { head, abdomen, fangs, leg, palette, glows } = spec;
    this.hip = spec.hipY * V;
    const headLong = head.size[2] * V;
    const back = -headLong * 0.45; // (the head's back, behind the hips' middle)
    this.body = joint(scaled, 0, this.hip, 0);
    const headJoint = joint(this.body, 0, 0, back);
    addPart(headJoint, head.build(), palette, V, [head.size[0] / 2, 1.5, 0], glows);
    this.fangs = joint(headJoint, 0, 0, headLong - V);
    addPart(this.fangs, fangs.build(), palette, V, [fangs.size[0] / 2, fangs.size[1], 0], glows);
    this.abdomen = joint(this.body, 0, V, back + V);
    addPart(this.abdomen, abdomen.build(), palette, V, [abdomen.size[0] / 2, abdomen.size[1] * 0.35, abdomen.size[2]], glows);
    spec.hips.forEach(([across, along], pair) => {
      const grid = leg.build(pair);
      for (const side of [1, -1]) {
        const yaw = joint(this.body, side * across * V, 0, back + along * V);
        const lift = joint(yaw);
        for (const m of addPart(lift, grid, palette, V, [0, spec.hipY, leg.size[2] / 2], glows)) m.scale.x = side; // (built for the left: mirrored)
        this.legs.push({ yaw, lift, side, pair, spread: spec.spread[pair] });
      }
    });
    this.height = (this.hip + (head.size[1] + abdomen.size[1] * 0.5) * V) * scale;
    addShade(this.root, ((abdomen.size[2] + head.size[2]) * V * scale) / 0.3);
  }

  animate(t: number, walk: number): void {
    const phase = t * Math.PI * 2 * 2.2;
    this.body.position.y = this.hip + Math.abs(Math.sin(phase)) * 0.006 * walk;
    this.abdomen.rotation.x = 0.15 + Math.sin(t * 1.8) * 0.03;
    this.fangs.rotation.x = Math.max(0, Math.sin(t * 3.1)) * -0.25 * (1 - walk);
    for (const leg of this.legs) {
      const step = phase + ((leg.pair + (leg.side > 0 ? 0 : 1)) % 2) * Math.PI; // (alternating fours)
      const twitch = walk < 0.1 && Math.sin(t * 0.7 + leg.pair * 2.1 + leg.side) > 0.985 ? 0.25 : 0;
      leg.yaw.rotation.y = -leg.side * (leg.spread + Math.sin(step) * 0.28 * walk);
      leg.lift.rotation.z = leg.side * (Math.max(0, Math.cos(step)) * 0.4 * walk + twitch);
    }
  }
}
