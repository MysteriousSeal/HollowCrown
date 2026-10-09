// A barrow-giant: Hrathgar's hall-guard, three centuries in the barrow until it's more oak than man. A body of its own
// build (long legs, a broad trunk, long arms, a small head), drawn at 2.4x (its voxels near the world's), three times
// the hero's height. Bark in three browns over all of it, split where bone shows through (knees, elbows, a cage of
// ribs on its chest); the iron it was buried in still on it, rusted (a belt, a bracer, a shoulder plate); moss in
// its hollows; legs that end in roots splayed over the ground; a face of bark with cold green light deep in its eyes,
// a beard of hanging roots, and a crown of roots reaching up from its head.

import { hashUnit } from '@voxel/engine/math';
import { fillBox, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { type BodyShape, type FrameSpec, type Joint } from '@voxel/engine/characters';

const P = namedPalette({
  bark: 0x5a4632,
  barkDark: 0x3c2e20,
  barkLight: 0x7a6248,
  bone: 0xcfc4a4,
  boneShade: 0x9e9278,
  iron: 0x5c5650,
  rust: 0x7e4a2c,
  moss: 0x5e6e3a,
  mossLight: 0x7e8c48,
  root: 0x4a3828,
  hollow: 0x140e0a,
  eye: 0xa8ffd8,
});
const { C } = P;

export const GIANT_SHAPE: BodyShape = {
  grid: { leg: [6, 12, 8], torso: [15, 13, 8], arm: [5, 15, 5], head: [9, 13, 9] }, // (the head's top 4 rows its crown)
  pivot: { leg: [3, 12, 3], torso: [7.5, 0, 4], arm: [2.5, 15, 2.5], head: [4.5, 0, 4.5] },
  joints: {
    torso: { part: 'torso', side: 'center', at: [0, 12, 0] },
    head: { part: 'head', side: 'center', at: [0, 25, 0.5] },
    rightArm: { part: 'arm', side: 'right', at: [-10, 24, 0] },
    leftArm: { part: 'arm', side: 'left', at: [10, 24, 0] },
    rightLeg: { part: 'leg', side: 'right', at: [-4, 12, 0] },
    leftLeg: { part: 'leg', side: 'left', at: [4, 12, 0] },
  },
  hand: [0, -14, 0],
};

// Bark: vertical runs of dark and light (the grain), moss low in its hollows here and there.
const bark = (x: number, y: number, z: number, salt: number) => {
  const n = hashUnit(x * 5 + z * 3, Math.floor(y / 3), salt);
  if (n < 0.06) return hashUnit(x, y + z, salt + 1) < 0.5 ? C.moss : C.mossLight;
  return (x + z * 2) % 3 === 0 ? C.barkDark : n > 0.8 ? C.barkLight : C.bark;
};

const legs = (g: VoxelGrid, salt: number) => {
  fillBox(g, 1, 2, 1, 4, 11, 5, (x, y, z) => bark(x, y, z, salt)); // the trunk of it
  fillBox(g, 0, 6, 1, 5, 11, 6, (x, y, z) => bark(x, y, z, salt)); // the thigh, thicker
  fillBox(g, 1, 6, 6, 4, 7, 6, (_x, y) => (y === 6 ? C.boneShade : C.bone)); // the knee, bone through the bark
  fillBox(g, 0, 9, 0, 5, 9, 6, (x) => (x % 2 ? C.rust : C.iron)); // a band of iron round the thigh
  // Roots splayed out over the ground for feet: forward, out and back, thinning.
  fillBox(g, 0, 0, 0, 5, 1, 7, (x, y, z) => (y === 1 && (x === 0 || x === 5 || z === 0) ? 0 : (x + z) % 2 ? C.root : C.barkDark));
  for (const x of [0, 2, 5]) setColor(g, x, 0, 7, C.root);
};

const torso = (g: VoxelGrid) => {
  fillBox(g, 0, 0, 0, 14, 12, 7, (x, y, z) => bark(x, y, z, 70));
  fillBox(g, 1, 12, 1, 13, 12, 6, C.barkLight); // the shoulders' tops
  // The chest split open, a cage of bone ribs across it, dark between.
  fillBox(g, 4, 5, 7, 10, 10, 7, C.hollow);
  for (const y of [5, 7, 9]) fillBox(g, 4, y, 7, 10, y, 7, (x) => (x === 7 ? C.boneShade : C.bone));
  fillBox(g, 7, 4, 7, 7, 11, 7, C.boneShade); // the breastbone
  fillBox(g, 0, 2, 0, 14, 3, 7, (x, y) => (y === 3 && x % 3 === 0 ? C.rust : C.iron)); // the belt
  fillBox(g, 6, 2, 7, 8, 3, 7, C.rust); // its buckle
  fillBox(g, 0, 9, 1, 3, 12, 6, (x, y, z) => ((x + y + z) % 4 === 0 ? C.rust : C.iron)); // what's left of a breastplate, its right side
};

const arm = (g: VoxelGrid, salt: number, right: boolean) => {
  fillBox(g, 1, 3, 1, 3, 14, 3, (x, y, z) => bark(x, y, z, salt));
  fillBox(g, 0, 11, 0, 4, 14, 4, (x, y, z) => (right ? ((x + y + z) % 3 ? C.iron : C.rust) : bark(x, y, z, salt))); // the shoulder (plate on the right)
  fillBox(g, 1, 8, 4, 3, 8, 4, C.bone); // the elbow, bone through
  fillBox(g, 0, 4, 0, 4, 6, 4, (x, y) => (right ? (y === 5 ? C.rust : C.iron) : bark(x, y, 0, salt))); // a bracer
  fillBox(g, 0, 0, 0, 4, 3, 4, (x, y, z) => (y === 0 && (x + z) % 2 ? C.root : C.barkDark)); // the fist, gnarled
};

const head = (g: VoxelGrid) => {
  fillBox(g, 0, 0, 0, 8, 7, 8, (x, y, z) => bark(x, y, z, 90));
  fillBox(g, 1, 3, 8, 7, 4, 8, C.hollow); // the brow's shadow, deep
  setColor(g, 2, 3, 8, C.eye);
  setColor(g, 6, 3, 8, C.eye);
  fillBox(g, 3, 1, 8, 5, 1, 8, C.hollow); // a mouth, a split in the bark
  for (let x = 1; x <= 7; x++) fillBox(g, x, 0, 8, x, Math.floor(hashUnit(x, 3, 91) * 2), 8, C.root); // the beard of roots...
  for (const x of [2, 4, 6]) fillBox(g, x, 0, 8, x, 0, 8, C.root);
  // The crown: roots reaching up and out from the crown of its head, each its own height.
  for (const [x, z] of [[0, 1], [2, 0], [4, 1], [6, 0], [8, 1], [0, 6], [8, 6], [3, 7], [5, 7], [1, 4], [7, 4]]) {
    const top = 9 + Math.floor(hashUnit(x, z, 92) * 4);
    fillBox(g, x, 8, z, x, top, z, (_x, y) => (y === top ? C.barkLight : C.root));
  }
};

export const BARROW_GIANT: FrameSpec = {
  palette: P.colors,
  shape: GIANT_SHAPE,
  paint: (joint: Joint, g: VoxelGrid) => {
    if (joint === 'torso') torso(g);
    else if (joint === 'head') head(g);
    else if (joint.endsWith('Arm')) arm(g, joint.length * 7, joint === 'rightArm');
    else legs(g, joint === 'leftLeg' ? 40 : 50);
  },
  glows: new Set([C.eye]),
  scale: 2.4,
  gait: { speed: 0.5, legSwing: 0.35, armSwing: 0.3, reach: 0.05, lean: 0.1, sway: 0.04, hover: 0, bob: 0.03 },
};
