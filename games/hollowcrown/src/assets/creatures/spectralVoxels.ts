// The see-through dead, built on the human body (frameRig.ts), so each is "the shape of who they were":
// - a ghost: a woman in a long dress, her hair loose, all of her washed pale blue-white; below the hem she frays
//   into wisps of smoke; her hair falls past her shoulders; dark hollows round her burning eyes, her mouth open in
//   a moan; she floats, drifting, reaching. (The Hungry, nothing but bones, are hungryVoxels.ts.)

import * as THREE from 'three';
import type { BodyLook } from '@voxel/engine/characters/human/humanoid';
import { C, bodyPalette, type Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { bodyColors, box, erase, over, recolor, wrap } from '@voxel/engine/characters/creatures/dress';
import { hashUnit, spectralMaterial, type Size } from '@voxel/engine/characters/creatures/creatureMesh';
import type { FrameSpec, Gait } from '@voxel/engine/characters/creatures/frameRig';

// A palette washed into one hue: each color's lightness carried from `dark` to `light`.
export function washed(colors: number[], dark: number, light: number): number[] {
  const [d, l, c] = [new THREE.Color(dark), new THREE.Color(light), new THREE.Color()];
  return colors.map((hex) => {
    c.setHex(hex);
    const lum = Math.min(1, (0.3 * c.r + 0.59 * c.g + 0.11 * c.b) * 1.6) ** 0.8;
    return new THREE.Color().lerpColors(d, l, lum).getHex();
  });
}

const G = { dress: 16, dressShade: 17, wisp: 18, glow: 19, hollow: 20 }; // (after the body's 15)
const GLOW: ReadonlySet<number> = new Set([G.glow]);
const DRIFT: Gait = { speed: 0.7, legSwing: 0.15, armSwing: 0.1, reach: 0.25, lean: 0.06, sway: 0.05, hover: 0.07, bob: 0 };

const torn = (x: number, z: number, salt: number) => Math.floor(hashUnit(x * 3 + z, salt, 41) * 3); // a ragged hem's length

// ---- the ghost ----

const GHOST_LOOK: BodyLook = { build: 'female', skin: 4, hair: 5, dye: 4, hairStyle: 'long', beard: false, expression: 'wistful' };

function ghostPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  recolor(g, C.eye, G.glow);
  if (joint === 'head') {
    for (const a of [0, 10]) for (const b of [0, 10]) {
      erase(g, o, a, 10, 0, a, 10, 10); // (the crown's edges rounded off: a head, not a box)
      erase(g, o, 0, 10, b, 10, 10, b);
      erase(g, o, a, 0, b, a, 10, b);
    }
    over(g, o, (x, y, z, c) => (z === 10 && y >= 4 && y <= 7 && x >= 2 && x <= 8 && c !== G.glow ? G.hollow : 0)); // the hollows round her eyes
    box(g, o, 4, 1, 10, 6, 2, 10, G.hollow); // her mouth, open
    box(g, o, 0, -2, 0, 10, -1, 2, (x) => (x % 3 ? C.hair : C.hairDark)); // her hair, down past her shoulders
  } else if (joint === 'torso') {
    box(g, o, 0, 3, -1, 6, 8, -1, (x, y) => (y < 3 + (x % 3) ? 0 : x % 3 ? C.hair : C.hairDark)); // ...down her back
    // The dress: over the body from the bust down, a long skirt flaring out over the thighs, its hem frayed.
    over(g, o, (_x, y, _z, c) => (y <= 7 && c !== C.skinLight ? (y % 3 === 0 ? G.dressShade : G.dress) : 0));
    for (let y = -5; y < 0; y++) box(g, o, -1, y, -1, 7, y, 4, (x, _y, z) => (x === -1 || x === 7 || z === -1 || z === 4 ? (y >= -4 + torn(x, z, 1) ? (y === -1 ? G.dress : G.dressShade) : 0) : 0));
  } else if (joint.endsWith('Leg')) {
    // No legs: wisps of smoke, each strand its own length, hanging from under the dress.
    erase(g, o, -1, 0, -1, 4, 6, 5);
    for (let x = 0; x <= 2; x++) for (let z = 0; z <= 3; z++) {
      const top = 6;
      const low = 2 + Math.floor(hashUnit(x + (joint === 'leftLeg' ? 7 : 0), z, 43) * 4);
      if ((x + z) % 2) box(g, o, x, low, z, x, top, z, G.wisp);
    }
  } else if (joint.endsWith('Arm')) {
    over(g, o, (_x, y, _z, c) => (y >= 4 && c !== C.skinLight ? G.dress : 0)); // sleeves to the elbow
    wrap(g, o, (_x, y) => (y === 4 ? G.dressShade : 0)); // a loose cuff
  }
}

export const GHOST: FrameSpec = {
  palette: bodyColors(washed(bodyPalette(GHOST_LOOK), 0x7f9cc4, 0xf2faff), { hair: 0xc4d8f0, hairLight: 0xd2e2f6, hairDark: 0xa8c0e0, skin: 0xe4f0fb, skinShade: 0xbcd3e4, skinLight: 0xf2f8ff }, [
    0xdcebf8, 0xb0c6de, 0xc8dcf0, 0xe0fcff, 0x22344e,
  ]),
  base: GHOST_LOOK,
  paint: ghostPaint,
  glows: GLOW,
  material: spectralMaterial(0.86),
  gait: DRIFT,
};
