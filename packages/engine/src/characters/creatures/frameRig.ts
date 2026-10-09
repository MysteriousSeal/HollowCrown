// A creature on two legs (skeletons, the undead, monsters, people): the human body's joints (human/bodyVoxels.ts), each part
// its own grid. A frame either paints its parts from nothing (a skeleton's bones) or starts from the human body
// itself (`base`: a look) and dresses it, its grids padded round the body so gear can stand off it (a helm's brim, a
// cloak, a skirt); one mesh a part, so nothing worn shares a face with the skin under it.
//
//   root
//   └ body (bobs, hovers, sways)
//     ├ leftLeg/rightLeg   hips at the pivots
//     └ upper             at the hips: leans forward (a crouch), carries
//       ├ torso, head
//       └ leftArm/rightArm (and what's in the hands)
//
// How it moves is data (a Gait): stride, arms swinging or reaching, a lean, a sway, a hover.

import * as THREE from 'three';
import type { BodyLook } from '../human/humanoid';
import { BODIES, HUMAN_VOXEL_SIZE as V, buildBodyPart, type BodyPart, type BodyShape, type Joint } from '../human/bodyVoxels';
import type { VoxelGrid } from '../../voxel/greedyMesh';
import { createGrid, setColor, colorAt } from '../../voxel/voxelShapes';
import { CREATURE_VOXEL, addPart, addShade, joint, type CreatureModel, type Size } from './creatureMesh';

export interface Gait {
  speed: number; // walk cycles a second
  legSwing: number; // radians at full stride
  armSwing: number;
  reach: number; // arms raised forward (radians), always
  lean: number; // the upper body pitched forward (radians)
  sway: number; // side to side (radians), slow
  hover: number; // world units off the ground (bobbing), 0 to walk
  bob: number; // rise at each step
  headBow?: number; // the head hung forward (radians), always
  headTilt?: number; // and to one side
}
export const MARCH: Gait = { speed: 1.6, legSwing: 0.7, armSwing: 0.55, reach: 0, lean: 0, sway: 0, hover: 0, bob: 0.012 };
export const SHAMBLE: Gait = { speed: 1.0, legSwing: 0.45, armSwing: 0.2, reach: 0, lean: 0.12, sway: 0.08, hover: 0, bob: 0.008 };

// Where a held thing sits: its grid, the voxel in it the hand grips, how it's turned (radians), its voxel size.
export interface Held {
  grid: () => VoxelGrid;
  grip: Size;
  turn?: [number, number, number];
  voxel?: number;
}

// Room round each body part a dressed frame may paint into: voxels below/behind/beside (lo), above/ahead (hi).
const PAD: Record<BodyPart, { lo: Size; hi: Size }> = {
  head: { lo: [2, 2, 2], hi: [2, 4, 2] },
  torso: { lo: [1, 5, 2], hi: [1, 2, 2] }, // a skirt down over the thighs; a cloak behind
  arm: { lo: [1, 1, 1], hi: [1, 1, 1] },
  leg: { lo: [1, 0, 1], hi: [1, 0, 1] },
};
const NO_PAD = { lo: [0, 0, 0] as Size, hi: [0, 0, 0] as Size };

export interface FrameSpec {
  palette: number[];
  base?: BodyLook; // dress the human body (its colors first in the palette: bodyPalette); else paint from nothing
  pad?: boolean; // padded grids without a body in them (a painted frame with gear standing off it)
  paint: (joint: Joint, g: VoxelGrid, o: Size) => void; // `o`: where the body's own grid starts in this one
  sizes?: Partial<Record<BodyPart, Size>>; // a part's grid, if not the body's (a bigger skull)
  shape?: BodyShape; // a body of its own build (a giant's), else the human's
  glows?: ReadonlySet<number>;
  material?: THREE.Material;
  scale?: number;
  gait?: Gait;
  held?: Partial<Record<'leftArm' | 'rightArm', Held>>;
  extra?: (model: FrameModel) => void; // anything more it carries (a ghost's tail, a lantern)
}

const JOINTS: Joint[] = ['torso', 'head', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

export class FrameModel implements CreatureModel {
  readonly root = new THREE.Group();
  readonly height: number;
  readonly body = new THREE.Group();
  readonly upper = new THREE.Group();
  readonly joints = {} as Record<Joint, THREE.Group>;
  private readonly gait: Gait;
  readonly ticks: Array<(time: number, walk: number) => void> = []; // what an extra moves each frame

  constructor(readonly spec: FrameSpec) {
    const shape = spec.shape ?? BODIES[spec.base?.build ?? 'male'];
    this.gait = spec.gait ?? MARCH;
    const scaled = joint(this.root);
    scaled.scale.setScalar(spec.scale ?? 1);
    scaled.add(this.body);
    this.upper.position.y = shape.joints.torso.at[1] * V;
    this.body.add(this.upper);
    for (const name of JOINTS) {
      const { part, at } = shape.joints[name];
      const parent = name.endsWith('Leg') ? this.body : this.upper;
      const group = joint(parent, at[0] * V, at[1] * V - (parent === this.upper ? this.upper.position.y : 0), at[2] * V);
      const { lo, hi } = spec.base || spec.pad ? PAD[part] : NO_PAD;
      const size = spec.sizes?.[part] ?? shape.grid[part];
      const grid = createGrid([size[0] + lo[0] + hi[0], size[1] + lo[1] + hi[1], size[2] + lo[2] + hi[2]]);
      if (spec.base) stamp(grid, buildBodyPart(part, spec.base), lo);
      spec.paint(name, grid, lo);
      const pivot = shape.pivot[part];
      const off = size === shape.grid[part] ? [0, 0, 0] : [(size[0] - shape.grid[part][0]) / 2, 0, (size[2] - shape.grid[part][2]) / 2];
      addPart(group, grid, spec.palette, V, [pivot[0] + lo[0] + off[0], pivot[1] + lo[1], pivot[2] + lo[2] + off[2]], spec.glows, spec.material);
      this.joints[name] = group;
    }
    for (const side of ['leftArm', 'rightArm'] as const) {
      const held = spec.held?.[side];
      if (!held) continue;
      const hand = joint(this.joints[side], shape.hand[0] * V, shape.hand[1] * V, shape.hand[2] * V);
      hand.rotation.set(...(held.turn ?? [0, 0, 0]));
      addPart(hand, held.grid(), spec.palette, held.voxel ?? CREATURE_VOXEL, held.grip, spec.glows, spec.material);
    }
    spec.extra?.(this);
    this.height = (shape.joints.head.at[1] + shape.grid.head[1]) * V * (spec.scale ?? 1);
    addShade(this.root, spec.scale ?? 1);
  }

  animate(time: number, walk: number): void {
    const g = this.gait;
    const phase = time * Math.PI * 2 * g.speed;
    const s = Math.sin(phase) * walk;
    const j = this.joints;
    j.leftLeg.rotation.x = s * g.legSwing;
    j.rightLeg.rotation.x = -s * g.legSwing;
    j.leftArm.rotation.x = -g.reach - s * g.armSwing;
    j.rightArm.rotation.x = -g.reach + s * g.armSwing;
    const breath = Math.sin(time * 2.2) * 0.004;
    this.body.position.y = g.hover + (g.hover ? Math.sin(time * 1.8) * 0.02 : Math.abs(s) * g.bob + breath * (1 - walk));
    this.upper.rotation.x = g.lean;
    this.upper.rotation.z = Math.sin(time * 0.9) * g.sway;
    j.head.rotation.x = breath * 4 - g.lean * 0.8 + (g.headBow ?? 0); // (looking ahead, however low it's bent)
    j.head.rotation.z = -this.upper.rotation.z * 0.6 + (g.headTilt ?? 0);
    for (const tick of this.ticks) tick(time, walk);
  }
}

// Copies `from` into `to` at offset `o` (the body into its padded grid).
export function stamp(to: VoxelGrid, from: VoxelGrid, o: Size): void {
  const [sx, sy, sz] = from.size;
  for (let z = 0; z < sz; z++) for (let y = 0; y < sy; y++) for (let x = 0; x < sx; x++) {
    const c = colorAt(from, x, y, z);
    if (c) setColor(to, x + o[0], y + o[1], z + o[2], c);
  }
}
