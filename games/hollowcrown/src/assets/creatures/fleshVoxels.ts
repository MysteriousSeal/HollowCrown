// The horrors that are people still, or were: each the human body (frameRig.ts) in a skin of its own, dressed.
// - the Drowned: bloated (a layer more of flesh on trunk and arms), white-blue, the eyes clouded like a fish's;
//   a waterlogged shirt gone dark, weed in the hair and hanging down the back; water beading off its hands;
// - the Hollowed: grey skin, blue-white lips, wet staring eyes; rags; dirt to the elbows and the knees from digging;
// - a pit-eater: gaunt and filthy, wrapped in strips of cloth, long dark nails; crouched low, quick; a string of
//   keepsakes round its neck (a ring, a button, a child's bead);
// - the Sewn: a thin young novice in a grey robe to the ankles, eyes stitched shut with black thread, a wax tablet
//   hung on a cord at the chest, fingers worn raw; an iron stylus in hand; walking slowly, head cocked, listening.

import type { BodyLook } from '@voxel/engine/characters/human/humanoid';
import { C, bodyPalette, type Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, fillBox } from '@voxel/engine/voxel/voxelShapes';
import { bodyColors, box, erase, over, recolor, wrap } from '@voxel/engine/characters/creatures/dress';
import { hashUnit, type Size } from '@voxel/engine/characters/creatures/creatureMesh';
import { SHAMBLE, type FrameSpec } from '@voxel/engine/characters/creatures/frameRig';

const G = { cloth: 16, clothShade: 17, clothLight: 18, weed: 19, weedDark: 20, dirt: 21, iron: 22, wax: 23, thread: 24, raw: 25, bead: 26 };
const isArm = (j: Joint) => j.endsWith('Arm');
const isLeg = (j: Joint) => j.endsWith('Leg');
const noise = (x: number, y: number, z: number, salt: number) => hashUnit(x * 7 + y * 31, z, salt);

// ---- the Drowned ----

const DROWNED_LOOK: BodyLook = { build: 'male', skin: 4, hair: 1, dye: 1, hairStyle: 'long', beard: true, expression: 'stern' };

function drownedPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  recolor(g, C.eye, C.glint); // clouded
  if (joint === 'torso') {
    wrap(g, o, (x, y, z) => (y >= 4 && y <= 8 && x >= 0 && x <= 8 && z >= -1 ? C.skinShade : 0)); // bloated
    over(g, o, (_x, y, z, c) => (y <= 7 && c !== C.cord ? (noise(_x, y, z, 3) < 0.2 ? G.clothShade : y % 3 ? G.cloth : G.clothLight) : 0)); // the shirt, sodden
    box(g, o, -1, -3, -1, 9, -1, 5, (x, y, z) => ((x === -1 || x === 9 || z === -1 || z === 5) && y >= -3 + Math.floor(noise(x, 0, z, 4) * 3) ? G.clothShade : 0)); // its tails hanging
  } else if (joint === 'head') {
    over(g, o, (x, y, z, c) => (c >= C.hair && c <= C.hairDark && noise(x, y, z, 5) < 0.35 ? (y % 2 ? G.weed : G.weedDark) : 0)); // weed through the hair
    for (let x = 1; x <= 9; x += 2) box(g, o, x, 2 - (x % 3), -1, x, 6, -1, x % 4 ? G.weed : G.weedDark); // trailing down the back
  } else if (isArm(joint)) {
    wrap(g, o, (_x, y) => (y >= 3 && y <= 7 ? C.skinShade : 0)); // bloated
    over(g, o, (_x, y) => (y >= 5 ? G.cloth : 0));
    box(g, o, 1, -1, 1, 1, -1, 1, G.weed); // dripping
  } else {
    over(g, o, (_x, y) => (y >= 2 && y <= 6 ? (y % 2 ? G.clothShade : G.cloth) : 0)); // sodden breeches
  }
}

export const DROWNED: FrameSpec = {
  palette: bodyColors(bodyPalette(DROWNED_LOOK), { skin: 0xb6cac8, skinShade: 0x8ea6a8, skinLight: 0xd6e4e0, skinDeep: 0x5e7a80, cheek: 0x9ab0b4, mouth: 0x3e5664 }, [
    0x3e4c54, 0x2a363e, 0x52626a, 0x4a6a3a, 0x2e4a2a, 0, 0, 0, 0, 0, 0,
  ]),
  base: DROWNED_LOOK,
  paint: drownedPaint,
  gait: { ...SHAMBLE, reach: 0.35, speed: 0.8, sway: 0.1 },
};

// ---- the Hollowed ----

const HOLLOWED_LOOK: BodyLook = { build: 'female', skin: 1, hair: 3, dye: 3, hairStyle: 'shaggy', beard: false, expression: 'calm' };

function hollowedPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  if (joint === 'torso') {
    over(g, o, (x, y, z, c) => (c >= C.cloth && c <= C.clothLight ? 0 : y >= 4 && y <= 7 && noise(x, y, z, 6) < 0.55 ? (y % 2 ? G.cloth : G.clothShade) : 0)); // a ragged shift
    box(g, o, -1, -3, -1, 7, -1, 5, (x, y, z) => ((x === -1 || x === 7 || z === -1 || z === 5) && y >= -3 + Math.floor(noise(x, 1, z, 7) * 3) ? G.clothShade : 0));
  } else if (isArm(joint)) {
    over(g, o, (x, y, z) => (y <= 4 ? (noise(x, y, z, 8) < 0.3 ? G.weedDark : G.dirt) : 0)); // dirt to the elbows
  } else if (isLeg(joint)) {
    over(g, o, (x, y, z) => (y <= 3 ? (noise(x, y, z, 9) < 0.3 ? G.weedDark : G.dirt) : y >= 5 ? G.clothShade : 0));
  }
}

export const HOLLOWED: FrameSpec = {
  palette: bodyColors(bodyPalette(HOLLOWED_LOOK), { skin: 0xa8a49c, skinShade: 0x8a867e, skinLight: 0xc0bcb2, skinDeep: 0x6a665e, cheek: 0x9a968e, mouth: 0xbcd4e8, eye: 0x1a1a22, glint: 0xffffff }, [
    0x8a8070, 0x6a6052, 0xa29884, 0, 0x3e3020, 0x5e4630, 0, 0, 0, 0, 0,
  ]),
  base: HOLLOWED_LOOK,
  paint: hollowedPaint,
  gait: { ...SHAMBLE, speed: 0.9, reach: 0.1, sway: 0.12, lean: 0.06 },
};

// ---- the pit-eater ----

const PIT_LOOK: BodyLook = { build: 'male', skin: 2, hair: 1, dye: 4, hairStyle: 'shaggy', beard: true, expression: 'sly' };

function pitPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  const filth = (x: number, y: number, z: number, c: number) => (c <= C.skinDeep && noise(x, y, z, 10) < 0.3 ? G.dirt : 0);
  over(g, o, filth);
  if (joint === 'torso') {
    erase(g, o, 0, 5, 0, 8, 8, 4, (x) => x > 0 && x < 8); // gaunt
    over(g, o, (x, y, z) => (y >= 4 && y <= 7 && z === 4 && x % 2 === 1 ? C.skinDeep : 0)); // the ribs
    over(g, o, (x, y) => ((x + y) % 4 === 0 && y <= 6 ? G.cloth : 0)); // strips of cloth wound round
    box(g, o, 2, 6, 5, 6, 6, 5, (x) => (x === 4 ? G.bead : x % 2 ? G.thread : G.iron)); // keepsakes on a string
    box(g, o, 4, 5, 5, 4, 5, 5, G.wax);
  } else if (isArm(joint)) {
    over(g, o, (_x, y) => (y >= 2 && y <= 7 && y % 2 === 0 ? G.cloth : 0)); // wrappings
    box(g, o, 0, -2, 2, 2, -1, 2, (x, y) => (x === 1 || y === -1 ? G.raw : 0)); // long nails, dark
  } else if (isLeg(joint)) {
    over(g, o, (_x, y) => (y >= 1 && y <= 6 && y % 2 ? G.clothShade : 0));
  }
}

export const PIT_EATER: FrameSpec = {
  palette: bodyColors(bodyPalette(PIT_LOOK), { skin: 0x9a8670, skinShade: 0x7a6852, skinLight: 0xae9a82, skinDeep: 0x52443a, eye: 0xd8c890 }, [
    0x6e6450, 0x4e463a, 0, 0, 0, 0x3e3226, 0x8a8478, 0xc8b070, 0x2a2420, 0x2a221c, 0xb84a3a,
  ]),
  base: PIT_LOOK,
  paint: pitPaint,
  gait: { speed: 2.4, legSwing: 0.55, armSwing: 0.3, reach: 0.5, lean: 0.75, sway: 0.03, hover: 0, bob: 0.02 },
};

// ---- the Sewn ----

const SEWN_LOOK: BodyLook = { build: 'female', skin: 4, hair: 2, dye: 4, hairStyle: 'cropped', beard: false, expression: 'calm' };

function sewnPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  if (joint === 'head') {
    over(g, o, (x, y, _z, c) => (c === C.eye || c === C.glint ? ((x + y) % 2 ? G.thread : C.skinDeep) : 0)); // stitched shut
    for (const x of [2, 4, 6, 8]) box(g, o, x, 5, 11, x, 5, 11, G.thread); // the stitches standing out
  } else if (joint === 'torso') {
    over(g, o, (x, y, z, c) => (c === C.skinLight && y === 8 ? 0 : (x + y + z) % 5 === 0 ? G.clothShade : G.cloth)); // the robe
    for (let y = -5; y < 0; y++) box(g, o, -1, y, -1, 7, y, 5, (x, _y, z) => (x === -1 || x === 7 || z === -1 || z === 5 ? (x + z) % 3 === 0 ? G.clothShade : G.cloth : 0));
    box(g, o, 1, 3, 5, 5, 6, 5, (x, y) => (x === 1 || x === 5 || y === 3 || y === 6 ? G.dirt : G.wax)); // the tablet, framed
    box(g, o, 2, 5, 6, 4, 5, 6, G.thread); // scratched letters
    box(g, o, 1, 7, 4, 1, 8, 4, G.thread); // its cord
    box(g, o, 5, 7, 4, 5, 8, 4, G.thread);
  } else if (isArm(joint)) {
    over(g, o, (_x, y) => (y >= 2 ? G.cloth : y === 0 ? G.raw : 0)); // sleeves; the fingertips raw
    wrap(g, o, (_x, y) => (y === 2 ? G.clothShade : 0));
  }
}

// The stylus: an iron spike, along +Z.
function stylus(): VoxelGrid {
  const g = createGrid([1, 1, 9]);
  fillBox(g, 0, 0, 0, 0, 0, 8, G.iron);
  return g;
}

export const SEWN: FrameSpec = {
  palette: bodyColors(bodyPalette(SEWN_LOOK), { skin: 0xd8cfc4, skinShade: 0xbab0a4, skinLight: 0xe8e0d4, skinDeep: 0x9a8e84 }, [
    0x8a8a86, 0x6a6a68, 0, 0, 0, 0x8a6a40, 0x4a4a50, 0xc8a85a, 0x141214, 0xc0625a, 0,
  ]),
  base: SEWN_LOOK,
  paint: sewnPaint,
  scale: 0.95,
  gait: { ...SHAMBLE, speed: 0.7, legSwing: 0.35, armSwing: 0.08, reach: 0.15, lean: 0.04, sway: 0.18 },
  held: { rightArm: { grid: stylus, grip: [0.5, 0.5, 1], turn: [-0.5, 0, 0] } },
};
