// The horrors still in their flesh (bestiary.md): the Drowned, the Hollowed, the Sewn, the pit-eater. Each painted on
// its joints from nothing (frameRig.ts), not the hero's body: its own build and silhouette, readable at the isometric
// camera's distance before any detail is.
// - The Drowned: bloated, a barrel of a body and a swollen round head, white-blue, eyes clouded like a fish's, weed for
//   hair, sodden rags; shambles with its arms out to grab.
// - The Hollowed: a living sleeper, gaunt and grey, wet unblinking eyes, blue-white lips, dirt to the elbows and the
//   knees; hunched, its head hung forward.
// - The Sewn: a thin novice in a grey robe to the ground, eyes stitched shut with black thread, a wax tablet on a cord
//   at the chest; hands out, feeling, head tilted, listening.
// - The pit-eater: crouched low, a hump of a back, long arms with claws, a small head under matted hair, filthy
//   wrappings, keepsakes on strings; quick, skittish.

import type { Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { setColor } from '@voxel/engine/voxel/voxelShapes';
import { box } from '@voxel/engine/characters/creatures/dress';
import { hashUnit, namedPalette, type Size } from '@voxel/engine/characters/creatures/creatureMesh';
import { SHAMBLE, type FrameSpec, type Gait } from '@voxel/engine/characters/creatures/frameRig';

type Paint = (x: number, y: number, z: number) => number;
const isArm = (j: Joint) => j.endsWith('Arm');
const noise = (x: number, y: number, z: number, salt: number) => hashUnit(x * 7 + y * 31, z, salt);

// An ellipsoid about (cx, cy, cz), radii (rx, ry, rz), painted by `at` (0: left empty).
function ell(g: VoxelGrid, o: Size, [cx, cy, cz]: Size, [rx, ry, rz]: Size, at: Paint): void {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
        if (((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 + ((z + 0.5 - cz) / rz) ** 2 > 1) continue;
        const c = at(x, y, z);
        if (c) setColor(g, x + o[0], y + o[1], z + o[2], c);
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// The Drowned

const DP = namedPalette({
  skin: 0xb3cde3,
  skinShade: 0x86a3bd,
  skinDeep: 0x58738f,
  eye: 0xe9f0f2,
  eyeDim: 0xa8b6bc,
  lip: 0x4a5878,
  weed: 0x34503a,
  weedDark: 0x1f3326,
  rag: 0x4c5260,
  ragDark: 0x353a46,
  wet: 0xe4f6ff,
});
const D = DP.C;
const bloat: Paint = (x, y, z) => (noise(x, y, z, 3) < 0.08 ? D.wet : y <= 1 ? D.skinShade : noise(x, y, z, 4) < 0.18 ? D.skinShade : D.skin);

function drowned(joint: Joint, g: VoxelGrid, o: Size): void {
  if (joint === 'head') {
    ell(g, o, [4.5, 4.5, 4.5], [4.5, 4.6, 4.5], bloat); // swollen, round
    box(g, o, 1, 4, 8, 2, 5, 8, D.eye); // clouded eyes, too wide apart
    box(g, o, 6, 4, 8, 7, 5, 8, D.eye);
    box(g, o, 2, 4, 8, 2, 4, 8, D.eyeDim);
    box(g, o, 6, 4, 8, 6, 4, 8, D.eyeDim);
    box(g, o, 3, 1, 8, 5, 2, 8, (_x, y) => (y === 2 ? D.lip : D.skinDeep)); // a slack blue mouth
    // Weed in clumps on the scalp, a few long strands hanging down the back and sides.
    ell(g, o, [4.5, 8.6, 3.5], [4.2, 1.6, 3.6], (x, y, z) => (noise(x, y, z, 6) < 0.55 ? (y % 2 ? D.weed : D.weedDark) : 0));
    for (const [x, z, long] of [[0, 2, 5], [1, 0, 6], [4, 0, 4], [8, 1, 6], [9, 4, 3]]) box(g, o, x, 8 - long, z, x, 8, z, (_x, y) => (y % 3 ? D.weed : D.weedDark));
  } else if (joint === 'torso') {
    ell(g, o, [5.5, 4.5, 3.5], [5.6, 4.8, 3.8], bloat); // a barrel, the belly out
    box(g, o, 0, 0, 0, 10, 2, 6, (x, y, z) => ((x === 0 || x === 10 || z === 0 || z === 6) && noise(x, y, z, 9) < 0.8 ? (y % 2 ? D.rag : D.ragDark) : 0)); // sodden breeches' top
    for (let x = 1; x <= 9; x += 3) box(g, o, x, 3, 7, x, 4 + (x % 2), 7, D.ragDark); // a shirt in strips
  } else if (isArm(joint)) {
    box(g, o, 0, 1, 0, 3, 9, 3, (x, y, z) => (x === 0 || z === 0 ? D.skinShade : bloat(x, y, z))); // puffy
    box(g, o, 0, 0, 0, 3, 0, 3, D.skinDeep); // the hand, grey-blue
  } else {
    box(g, o, 0, 0, 0, 4, 6, 4, (x, y, z) => (y <= 2 ? (x + z) % 2 ? D.rag : D.ragDark : bloat(x, y, z)));
    box(g, o, 0, 0, 4, 4, 0, 5, D.skinDeep); // bare swollen feet
  }
}

const GRASP: Gait = { ...SHAMBLE, speed: 0.8, reach: 0.55, lean: 0.12, sway: 0.1, armSwing: 0.15 };
export const DROWNED: FrameSpec = {
  palette: DP.colors,
  pad: true,
  sizes: { head: [10, 10, 9], torso: [11, 9, 7], arm: [4, 9, 4], leg: [5, 7, 6] },
  paint: drowned,
  gait: GRASP,
};

// ---------------------------------------------------------------------------------------------------------------------
// The Hollowed

const HP = namedPalette({
  skin: 0x9c9b93,
  skinShade: 0x77766e,
  hollow: 0x55524c,
  white: 0xf3f2ec,
  pupil: 0x141414,
  lip: 0xcfdae9,
  hair: 0x3b3129,
  dirt: 0x4b3926,
  dirtDark: 0x33261a,
  rag: 0x6c6252,
  ragDark: 0x4e463a,
});
const H = HP.C;

function hollowed(joint: Joint, g: VoxelGrid, o: Size): void {
  const skin: Paint = (x, _y, z) => (x === 0 || z === 0 ? H.skinShade : H.skin);
  if (joint === 'head') {
    box(g, o, 1, 0, 1, 7, 9, 7, skin); // a long, narrow face
    box(g, o, 1, 0, 1, 7, 1, 7, H.skinShade); // the jaw, sunken
    box(g, o, 1, 4, 8, 3, 5, 8, H.white); // wet, staring eyes: wide whites, pinpoint pupils
    box(g, o, 5, 4, 8, 7, 5, 8, H.white);
    setColor(g, 2 + o[0], 4 + o[1], 8 + o[2], H.pupil);
    setColor(g, 6 + o[0], 4 + o[1], 8 + o[2], H.pupil);
    box(g, o, 1, 3, 8, 3, 3, 8, H.hollow); // dark under them
    box(g, o, 5, 3, 8, 7, 3, 8, H.hollow);
    box(g, o, 3, 1, 8, 5, 1, 8, H.lip); // blue-white lips
    box(g, o, 0, 3, 0, 8, 10, 7, (x, y, z) => ((y === 10 || x === 0 || x === 8 || z === 0) && (y >= 6 || noise(x, y, z, 2) < 0.6) ? H.hair : 0)); // lank hair
  } else if (joint === 'torso') {
    box(g, o, 1, 0, 1, 5, 8, 3, skin); // a narrow chest, the ribs
    for (let y = 3; y <= 7; y += 2) box(g, o, 1, y, 4, 5, y, 4, H.skinShade);
    box(g, o, 0, -2, 0, 6, 5, 4, (x, y, z) => ((x === 0 || x === 6 || z === 0 || z === 4 || y <= 0) && noise(x, y, z, 5) < 0.85 ? (y % 3 ? H.rag : H.ragDark) : 0)); // a rag of a tunic, torn
  } else if (isArm(joint)) {
    box(g, o, 0, 0, 0, 1, 8, 1, (x, y, z) => (y <= 4 ? (noise(x, y, z, 6) < 0.5 ? H.dirt : H.dirtDark) : skin(x, y, z))); // dirt to the elbow
  } else {
    box(g, o, 0, 0, 0, 2, 6, 2, (x, y, z) => (y <= 3 ? (noise(x, y, z, 8) < 0.5 ? H.dirt : H.dirtDark) : x === 0 ? H.ragDark : H.rag));
    box(g, o, 0, 0, 3, 2, 0, 3, H.dirtDark); // bare feet, black with earth
  }
}

export const HOLLOWED: FrameSpec = {
  palette: HP.colors,
  pad: true,
  sizes: { head: [9, 11, 9], torso: [7, 9, 5], arm: [2, 9, 2], leg: [3, 7, 4] },
  paint: hollowed,
  gait: { ...SHAMBLE, speed: 0.8, lean: 0.38, headBow: 0.3, reach: 0.12, sway: 0.06, armSwing: 0.12 },
};

// ---------------------------------------------------------------------------------------------------------------------
// The Sewn

const SP = namedPalette({
  skin: 0xddd2c6,
  skinShade: 0xb8ab9e,
  raw: 0x9c4a46,
  thread: 0x101010,
  hair: 0x4a3d31,
  robe: 0x8b8a90,
  robeShade: 0x6a6970,
  robeDark: 0x4f4e56,
  wax: 0xd1b16c,
  waxDark: 0x9a7c42,
  cord: 0x5a4430,
});
const S = SP.C;

function sewn(joint: Joint, g: VoxelGrid, o: Size): void {
  if (joint === 'head') {
    box(g, o, 1, 0, 1, 7, 9, 7, (x, _y, z) => (x === 1 || z === 1 ? S.skinShade : S.skin));
    box(g, o, 1, 4, 8, 3, 5, 8, (x, y) => (y === 5 && x !== 2 ? S.thread : S.raw)); // the eyes, raw lids stitched shut
    box(g, o, 5, 4, 8, 7, 5, 8, (x, y) => (y === 5 && x !== 6 ? S.thread : S.raw));
    for (const x of [1, 3, 5, 7]) setColor(g, x + o[0], 4 + o[1], 8 + o[2], S.thread); // the stitches crossing
    box(g, o, 3, 1, 8, 5, 1, 8, S.skinShade); // a mouth, moving
    box(g, o, 0, 7, 0, 8, 10, 7, (_x, y) => (y >= 8 ? S.hair : 0)); // cropped hair, a novice's
    box(g, o, 0, 7, 0, 8, 9, 0, S.hair);
  } else if (joint === 'torso') {
    box(g, o, 0, -5, 0, 6, 8, 4, (x, y, z) => (x === 0 || z === 0 ? S.robeShade : y <= -4 ? S.robeDark : S.robe)); // the robe, to the ground
    box(g, o, 1, 8, 1, 5, 8, 3, S.robeDark); // its neck
    box(g, o, 2, 4, 5, 4, 7, 5, (x, y) => (y === 7 || x !== 3 ? S.cord : 0)); // the tablet's cord
    box(g, o, 1, 0, 5, 5, 3, 5, (x, y) => (x === 1 || x === 5 || y === 0 || y === 3 ? S.waxDark : S.wax)); // the wax tablet
    box(g, o, 2, 2, 6, 4, 2, 6, S.waxDark); // scratches on it
  } else if (isArm(joint)) {
    box(g, o, 0, 3, 0, 2, 8, 2, (x, _y, z) => (x === 0 || z === 0 ? S.robeShade : S.robe)); // a wide sleeve
    box(g, o, 0, 0, 0, 1, 2, 1, (_x, y) => (y === 0 ? S.raw : S.skin)); // thin hands, the fingertips raw
  } else {
    box(g, o, 0, 0, 0, 2, 6, 3, (x) => (x === 0 ? S.robeDark : S.robeShade)); // the robe's hem, over the feet
  }
}

export const SEWN: FrameSpec = {
  palette: SP.colors,
  pad: true,
  sizes: { head: [9, 10, 9], torso: [7, 9, 5], arm: [3, 9, 3], leg: [3, 7, 4] },
  paint: sewn,
  gait: { ...SHAMBLE, speed: 0.6, legSwing: 0.25, reach: 0.75, lean: 0.04, sway: 0.03, armSwing: 0.08, headTilt: 0.32 },
};

// ---------------------------------------------------------------------------------------------------------------------
// The pit-eater

const PP = namedPalette({
  skin: 0x8a7a61,
  skinShade: 0x6a5b46,
  filth: 0x4a3a29,
  wrap: 0x7b6c58,
  wrapDark: 0x584c3e,
  hair: 0x29211a,
  claw: 0xd9d0b0,
  eye: 0xe3d47c,
  socket: 0x1a1410,
  gold: 0xc9a141,
  doll: 0x8c3b30,
});
const PE = PP.C;
const grime: Paint = (x, y, z) => (noise(x, y, z, 11) < 0.35 ? PE.filth : x === 0 || z === 0 ? PE.skinShade : PE.skin);

function pitEater(joint: Joint, g: VoxelGrid, o: Size): void {
  if (joint === 'head') {
    box(g, o, 1, 0, 2, 6, 6, 7, grime); // small, jutting forward
    box(g, o, 1, 3, 8, 6, 4, 8, PE.socket); // deep sockets...
    setColor(g, 2 + o[0], 3 + o[1], 8 + o[2], PE.eye); // ...a glint in each
    setColor(g, 5 + o[0], 3 + o[1], 8 + o[2], PE.eye);
    box(g, o, 2, 0, 8, 5, 1, 8, (x, y) => (y === 1 && x % 2 ? PE.claw : PE.socket)); // a mouth of bad teeth
    box(g, o, 0, 2, 0, 7, 8, 6, (x, y, z) => ((y >= 6 || x === 0 || x === 7 || z <= 1) && noise(x, y, z, 13) < 0.8 ? PE.hair : 0)); // matted hair, down the back
  } else if (joint === 'torso') {
    box(g, o, 1, 0, 1, 7, 7, 4, grime);
    ell(g, o, [4.5, 6, 1], [3.6, 3.2, 2.4], (x, y, z) => (z <= 1 ? grime(x, y, z) : 0)); // the hump of the back
    box(g, o, 0, -1, 0, 8, 3, 5, (x, y, z) => ((x === 0 || x === 8 || z === 0 || z === 5) && (y + x) % 4 ? (y % 2 ? PE.wrap : PE.wrapDark) : 0)); // filthy wrappings
    box(g, o, 2, 5, 5, 2, 7, 5, PE.wrapDark); // keepsakes on strings: a ring, a rag doll
    setColor(g, 2 + o[0], 4 + o[1], 5 + o[2], PE.gold);
    box(g, o, 5, 3, 5, 6, 5, 5, (_x, y) => (y === 5 ? PE.skin : PE.doll));
  } else if (isArm(joint)) {
    box(g, o, 0, 2, 0, 2, 12, 2, grime); // long arms
    box(g, o, 0, 0, 0, 2, 1, 2, (x, y, z) => (y === 0 && (x + z) % 2 === 0 ? PE.claw : y === 0 ? 0 : PE.filth)); // claws
  } else {
    box(g, o, 0, 0, 0, 3, 6, 3, grime);
    box(g, o, 0, 0, 4, 3, 0, 4, PE.claw); // splayed toes
  }
}

export const PIT_EATER: FrameSpec = {
  palette: PP.colors,
  pad: true,
  sizes: { head: [8, 9, 9], torso: [9, 8, 6], arm: [3, 13, 3] },
  paint: pitEater,
  glows: new Set([PE.eye]),
  scale: 0.92,
  gait: { speed: 1.5, legSwing: 0.5, armSwing: 0.45, reach: 0.25, lean: 0.7, sway: 0, hover: 0, bob: 0.016, headBow: -0.15 },
};
