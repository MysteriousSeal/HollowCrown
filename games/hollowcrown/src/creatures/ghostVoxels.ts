// A ghost's body (haunting the old ruins), in the
// human's voxels (bodyVoxels.ts), for the camera's distance: silhouette first.
// A deep hood drawn to a point at the back, the dark within it, two pale eyes
// burning in the dark (their own, glowing); the robe flaring at the shoulders,
// falling in folds, and drawn in under it into a tail of tattered wisps (its
// own part, to sway); no legs. Loose sleeves for arms (their own, to swing
// from the shoulder), thin pale hands out of them. Pale blue-white in three
// tones (light up top, shade down, deep in the folds), drawn see-through.

import * as THREE from 'three';
import { createGrid, fillBox, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { glowMaterial, joint, meshPart, RiggedModel, spectralMaterial } from '@voxel/engine/models';
import { HUMAN_VOXEL_SIZE as V } from '@voxel/engine/characters';

export const GHOST_PALETTE = [0xeaf4fb, 0xbcd3e4, 0x86a2bd, 0x0b1019, 0xc8fbff, 0xf4f0e6]; // robe, its shade, its folds, the dark in the hood, the eyes, the hands
const [ROBE, SHADE, FOLD, VOID, EYE, HAND] = [1, 2, 3, 4, 5, 6];

// Sizes (voxels) and where each part hangs: the body's base over the tail's top, the shoulders.
export const GHOST_BODY: [number, number, number] = [16, 23, 14]; // x across, y up, z front (+z)
export const GHOST_TAIL: [number, number, number] = [12, 11, 10];
export const GHOST_SLEEVE: [number, number, number] = [5, 12, 5];
export const GHOST_SHOULDER = { x: 7.5, y: 13 }; // from the body's middle, its base

// The robe's half-width and half-depth at height y (0..13): drawn in at the base, flaring to the shoulders.
const robeAt = (y: number) => ({ w: 3.2 + (y / 13) ** 1.4 * 3.8, d: 2.6 + (y / 13) * 2.2 });

export function ghostBody(): VoxelGrid {
  const g = createGrid(GHOST_BODY);
  const [cx, cz] = [7.5, 6.5];
  // The robe: round in section, the folds falling down its front and sides.
  for (let y = 0; y <= 13; y++) {
    const { w, d } = robeAt(y);
    for (let x = 0; x < 16; x++) for (let z = 0; z < 14; z++) {
      const r = ((x - cx) / w) ** 2 + ((z - cz) / d) ** 2;
      if (r > 1) continue;
      const fold = r > 0.6 && (Math.round(x + z * 0.3) % 3 === 0) && y < 12;
      fillBox(g, x, y, z, x, y, z, fold ? FOLD : y > 9 ? ROBE : SHADE);
    }
  }
  // The hood: round over the shoulders, drawn back to a point; its rim light round the face.
  for (let y = 12; y < 23; y++) for (let x = 0; x < 16; x++) for (let z = 0; z < 14; z++) {
    const back = Math.max(0, y - 18) * 0.7; // (narrowing, and drawn back, up toward its point)
    const [hx, hz, hy] = [(x - cx) / (5.2 - back * 0.9), (z - (cz - back)) / (5 - back * 0.6), (y - 16) / 6.5];
    if (hx * hx + hz * hz + Math.max(0, hy) ** 2 * 0.6 > 1) continue;
    fillBox(g, x, y, z, x, y, z, y > 19 ? ROBE : hz > 0.6 ? ROBE : SHADE);
  }
  // The face: an opening into the dark, deep, framed by the hood's rim.
  fillBox(g, 5, 13, 9, 10, 18, 13, 0);
  fillBox(g, 5, 13, 8, 10, 18, 8, VOID);
  fillBox(g, 6, 19, 9, 9, 19, 12, ROBE); // the rim over it
  for (const x of [4, 11]) fillBox(g, x, 13, 9, x, 18, 11, ROBE);
  return g;
}

// The eyes, burning in the dark of the hood (drawn unlit).
export function ghostEyes(): VoxelGrid {
  const g = createGrid(GHOST_BODY);
  fillBox(g, 6, 16, 9, 7, 16, 9, EYE);
  fillBox(g, 8, 16, 9, 9, 16, 9, EYE);
  return g;
}

// The tail: the robe drawn in under the body, torn into wisps of different lengths, the shortest outermost.
export function ghostTail(): VoxelGrid {
  const g = createGrid(GHOST_TAIL);
  const [cx, cz] = [5.5, 4.5];
  for (let y = 0; y < 11; y++) for (let x = 0; x < 12; x++) for (let z = 0; z < 10; z++) {
    const reach = 3.2 * (0.35 + 0.65 * (y / 10)); // (narrowing to nothing at its tip)
    const r = Math.hypot((x - cx) / 1.1, z - cz);
    if (r > reach) continue;
    const strand = (x * 7 + z * 13) % 5; // each column its own wisp: how far down it hangs
    if (y < 8 - strand * 1.6 - (r > 1.5 ? 2 : 0) && r > 0.8) continue;
    fillBox(g, x, y, z, x, y, z, y < 4 ? FOLD : SHADE);
  }
  return g;
}

// A loose sleeve, hung from its top (the shoulder), widening to its cuff; a thin pale hand out of it, long fingers.
export function ghostSleeve(): VoxelGrid {
  const g = createGrid(GHOST_SLEEVE);
  fillBox(g, 1, 7, 1, 3, 11, 3, ROBE);
  fillBox(g, 0, 4, 0, 4, 7, 4, SHADE);
  fillBox(g, 0, 4, 0, 0, 6, 0, FOLD); // its ragged cuff
  fillBox(g, 4, 4, 4, 4, 5, 4, FOLD);
  fillBox(g, 1, 4, 1, 3, 4, 3, VOID); // the dark up it
  fillBox(g, 2, 1, 2, 2, 4, 2, HAND); // the hand
  fillBox(g, 1, 0, 2, 1, 2, 2, HAND); // its long fingers
  fillBox(g, 3, 0, 2, 3, 2, 2, HAND);
  fillBox(g, 2, 0, 3, 2, 1, 3, HAND);
  return g;
}

const FLOAT = 0.1; // how high it floats, at the bottom of its bob
const TAIL_H = GHOST_TAIL[1] * V;

// The hooded shade (a wailing ghost): floating, bobbing, its tail trailing and swaying, its sleeves drifting; seen through.
export class ShadeModel extends RiggedModel {
  private readonly float: THREE.Group;
  private readonly tail: THREE.Group;
  private readonly sleeves: THREE.Group[] = [];

  constructor() {
    super({ palette: GHOST_PALETTE, material: spectralMaterial(0.72) });
    this.float = joint(this.frame, 0, FLOAT, 0);
    const body = joint(this.float, 0, TAIL_H, 0);
    const center: Size = [GHOST_BODY[0] / 2, 0, GHOST_BODY[2] / 2];
    this.part(body, ghostBody(), center, V);
    body.add(new THREE.Mesh(meshPart(ghostEyes(), GHOST_PALETTE, V, center), glowMaterial()));
    this.tail = joint(this.float, 0, TAIL_H, 0);
    this.part(this.tail, ghostTail(), [GHOST_TAIL[0] / 2, GHOST_TAIL[1], GHOST_TAIL[2] / 2], V);
    for (const side of [1, -1]) {
      const sleeve = joint(body, side * GHOST_SHOULDER.x * V, GHOST_SHOULDER.y * V, 0);
      this.part(sleeve, ghostSleeve(), [GHOST_SLEEVE[0] / 2, GHOST_SLEEVE[1], GHOST_SLEEVE[2] / 2], V);
      this.sleeves.push(sleeve);
    }
    this.finish(FLOAT + TAIL_H + GHOST_BODY[1] * V, 0.8);
  }

  animate(t: number, walk: number): void {
    this.float.position.y = FLOAT + Math.sin(t * 2.1) * 0.025;
    this.float.rotation.x = walk * 0.15; // (leaning into its drift)
    this.tail.rotation.x = walk * 0.2 + Math.sin(t * 2.6) * 0.12;
    this.tail.rotation.z = Math.sin(t * 1.9 + 1) * 0.16;
    this.sleeves.forEach((sleeve, i) => {
      const drift = Math.sin(t * 1.7 + i * 1.3) * 0.15;
      sleeve.rotation.x = -0.15 + drift - walk * 0.3;
      sleeve.rotation.z = (i === 0 ? 1 : -1) * (0.18 + Math.abs(drift) * 0.3);
    });
  }
}
