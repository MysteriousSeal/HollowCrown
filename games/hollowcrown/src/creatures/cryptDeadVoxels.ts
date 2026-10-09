// The Bellwarden's Tomb (main-quest-1.md MQ02): the Ossuary's dead and Sir Hamund, the Bellwarden, its crypt lord.
// The skeleton's own bones (skeletonVoxels.ts) stamped into padded grids, so what they were buried in can stand off
// them: each of the Ossuary's three its own (a guard in a rusted cap with a spear, a cowled lay brother swinging a
// thighbone, the Bellwarden's squire in what's left of his tabard); Hamund bigger, in rusted plate over the bones and a
// faded surcoat with the bell on it, a cold gold light in his sockets, the bell's iron tongue in his fist and his
// sword still at his hip.

import { hashUnit } from '@voxel/engine/math';
import { box, createGrid, fillBox, stamp, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { PART_GRID, SHAMBLE, type BodyPart, type FrameSpec, type Held, type Joint } from '@voxel/engine/characters';
import { PARTS, SKELETON_PALETTE, rags, rustySword } from './skeletonVoxels';

// After the skeleton's eleven: rusted iron and its rust, the surcoat's faded green and its gold bell, the cowl's
// grey, rope, the sockets' cold light.
const MORE = { iron: 0x4e4a46, ironRust: 0x7a4a2e, ironLight: 0x7a7670, coat: 0x4e5a3e, coatDark: 0x3a4430, bell: 0xb89a4a, cowl: 0x6e6a62, cowlDark: 0x4e4a44, rope: 0x9a8a62, glow: 0xffe2a0 };
const PALETTE = [...SKELETON_PALETTE, ...Object.values(MORE)];
const M = Object.fromEntries(Object.keys(MORE).map((k, i) => [k, SKELETON_PALETTE.length + 1 + i])) as Record<keyof typeof MORE, number>;
const [BONE, SHADE, DARK, CLOTH_DARK, YEW] = [1, 2, 4, 6, 10];

type Dress = (joint: Joint, g: VoxelGrid, o: Size) => void;
const partOf = (j: Joint) => (j.endsWith('Arm') ? 'arm' : j.endsWith('Leg') ? 'leg' : j) as BodyPart;
const rust = (x: number, y: number, z: number) => (hashUnit(x * 7 + y, z, 71) < 0.3 ? M.ironRust : M.iron);

// The bones (and their grave-cloth, if they have it), then what they were buried in.
function crypt(dress: Dress, { cloth = true, ...more }: Partial<FrameSpec> & { cloth?: boolean } = {}): FrameSpec {
  return {
    palette: PALETTE,
    pad: true,
    paint: (joint, g, o) => {
      const bones = createGrid(PART_GRID[partOf(joint)]);
      PARTS[partOf(joint)](bones);
      if (cloth) rags(joint, bones);
      stamp(g, bones, o);
      dress(joint, g, o);
    },
    glows: new Set([M.glow]),
    gait: { ...SHAMBLE, sway: 0.04, lean: 0.05 },
    ...more,
  };
}

// A thighbone, swung like a club.
const thighbone: Held = {
  grid: () => {
    const g = createGrid([3, 2, 9]);
    fillBox(g, 1, 0, 0, 1, 1, 8, BONE);
    fillBox(g, 0, 0, 0, 2, 1, 1, (x) => (x === 1 ? BONE : SHADE));
    fillBox(g, 0, 0, 7, 2, 1, 8, (x, _y, z) => (x === 1 || z === 8 ? BONE : SHADE));
    return g;
  },
  grip: [1, 1, 1], turn: [-0.6, 0, 0],
};
// A rusted spear, held upright.
const spear: Held = {
  grid: () => {
    const g = createGrid([3, 1, 28]);
    fillBox(g, 1, 0, 0, 1, 0, 22, (_x, _y, z) => (z % 7 === 0 ? CLOTH_DARK : YEW));
    fillBox(g, 0, 0, 23, 2, 0, 25, (x, _y, z) => (x === 1 || z === 24 ? rust(x, 0, z) : 0));
    fillBox(g, 1, 0, 26, 1, 0, 27, M.ironRust);
    return g;
  },
  grip: [1, 0.5, 5], turn: [-1.35, 0, 0],
};
// The bell's tongue: the great iron clapper, a ring at the top for the baldric, a heavy ball at the end.
const bellTongue: Held = {
  grid: () => {
    const g = createGrid([4, 4, 13]);
    fillBox(g, 1, 1, 0, 2, 2, 1, M.ironLight); // the ring
    fillBox(g, 1, 1, 2, 2, 2, 9, (x, y, z) => rust(x, y, z));
    fillBox(g, 0, 0, 10, 3, 3, 12, (x, y, z) => ((x === 0 || x === 3) && (y === 0 || y === 3) ? 0 : rust(x, y, z)));
    return g;
  },
  grip: [1.5, 1.5, 3], turn: [-0.7, 0, 0],
};

// ---- the Ossuary's dead ----

// A guard: a rusted iron cap, a scrap of mail on the chest, a rotted spear.
export const OSSUARY_GUARD = crypt((joint, g, o) => {
  if (joint === 'head') box(g, o, 0, 8, 0, 10, 11, 10, (x, y, z) => (y === 8 && (x === 0 || x === 10 || z === 0 || z === 10) ? M.ironLight : y >= 9 && x >= 1 && x <= 9 && z >= 1 && z <= 9 && (y === 11 || x === 1 || x === 9 || z === 1 || z === 9) ? rust(x, y, z) : 0));
  if (joint === 'torso') box(g, o, 1, 4, 5, 7, 8, 5, (x, y) => (hashUnit(x, y, 72) < 0.7 ? ((x + y) % 2 ? M.iron : M.ironLight) : 0));
}, { held: { rightArm: spear } });

// A lay brother: a grey cowl over the skull, a grey habit to the shins roped at the waist, a thighbone in his fist.
export const OSSUARY_BROTHER = crypt((joint, g, o) => {
  if (joint === 'head') box(g, o, 0, 3, -1, 10, 11, 9, (x, y, z) => ((x === 0 || x === 10 || z === -1 || y === 11) && !(z >= 8 && y <= 4) ? (y + z) % 3 ? M.cowl : M.cowlDark : 0));
  if (joint === 'torso') {
    box(g, o, -1, -5, -1, 9, 8, 5, (x, y, z) => ((x === -1 || x === 9 || z === -1 || z === 5) && y >= -5 + (hashUnit(x, z, 73) < 0.5 ? 1 : 0) ? (y === 0 ? M.rope : (x + y) % 4 ? M.cowl : M.cowlDark) : 0));
  }
}, { held: { rightArm: thighbone }, cloth: false, gait: { ...SHAMBLE, lean: 0.14, sway: 0.05, headBow: 0.15 } });

// The Bellwarden's squire: the rag of a green tabard with the gold bell on it, its edge gone to threads, and the rusted
// sword the crypt's dead all carry.
export const OSSUARY_SQUIRE = crypt((joint, g, o) => {
  if (joint === 'torso') box(g, o, 1, -3, 5, 7, 8, 5, (x, y) => (y < -3 + Math.floor(hashUnit(x, 0, 74) * 3) ? 0 : x === 4 && y >= 4 && y <= 6 ? M.bell : (y === 5 && (x === 3 || x === 5)) ? M.bell : (x + y) % 3 ? M.coat : M.coatDark));
}, { held: { rightArm: { grid: rustySword, grip: [2.5, 1, 2], turn: [-0.9, 0, 0] } } });

// ---- Sir Hamund, the Bellwarden ----

export const HAMUND = crypt((joint, g, o) => {
  if (joint === 'head') {
    box(g, o, 0, 3, 0, 10, 11, 10, (x, y, z) => ((x === 0 || x === 10 || z === 0 || y === 11 || (z === 10 && y >= 7)) && !(z === 10 && y <= 6) ? (x === 5 && y === 11 ? M.ironLight : rust(x, y, z)) : 0)); // an open bascinet
    box(g, o, 2, 5, 9, 3, 5, 9, M.glow); // the cold light in his sockets
    box(g, o, 6, 5, 9, 7, 5, 9, M.glow);
  }
  if (joint === 'torso') {
    box(g, o, 0, 3, 5, 8, 8, 5, (x, y, z) => rust(x, y, z)); // the breastplate
    box(g, o, -1, -4, -1, 9, 8, 5, (x, y, z) => ((x === -1 || x === 9 || z === -1) && y >= -4 + Math.floor(hashUnit(x, z, 75) * 2) ? (y === 2 ? M.rope : (x + y) % 3 ? M.coat : M.coatDark) : z === 5 && y <= 2 ? (x === 4 && y >= -2 ? M.bell : (x + y) % 3 ? M.coat : M.coatDark) : 0)); // the surcoat, the bell low on its front
    box(g, o, 9, -5, 1, 9, 2, 2, (_x, y) => (y === 2 ? M.ironLight : y <= -4 ? M.iron : DARK)); // his sword, scabbarded at his left hip
  }
  if (joint.endsWith('Arm')) box(g, o, -1, 6, -1, 3, 9, 3, (x, y, z) => ((x === -1 || x === 3 || z === -1 || z === 3 || y === 9) ? (y === 6 ? M.ironLight : rust(x, y, z)) : 0)); // pauldrons
  if (joint.endsWith('Leg')) box(g, o, 0, 1, 0, 3, 3, 4, (x, y, z) => ((z === 4 || x === 0 || x === 3) ? rust(x, y, z) : 0)); // greaves
}, {
  held: { rightArm: bellTongue },
  scale: 1.15,
  gait: { speed: 1.0, legSwing: 0.5, armSwing: 0.25, reach: 0, lean: 0.02, sway: 0.01, hover: 0, bob: 0.01 }, // (still a knight's walk)
  cloth: false,
});
