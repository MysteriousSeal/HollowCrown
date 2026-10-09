// A skeleton's body (the crypts' guards: model/crypts/cryptFoes.ts), on the
// human rig's joints and in its parts' sizes (human/bodyVoxels.ts), so it
// walks and swings as anyone does. Shapes first, for the camera's distance:
// the skull oversized and round, its sockets and nose dark, a row of teeth;
// the ribcage bars of bone with the dark showing between, the spine down its
// back, the pelvis under it; the limbs thin bones knobbed at the joints, the
// feet long. Bone in three tones: light on top, shade along, dark in the cracks.

// Hollowcrown's: bone browner and yellower (old crypt dead), scraps of grave-cloth at the hips and over a shoulder,
// a rusted sword; the archer a bow of black yew.

import { HUMAN_VOXEL_SIZE, type BodyPart, type Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, fillBox, setColor } from '@voxel/engine/voxel/voxelShapes';
import { SHAMBLE, type FrameSpec } from '@voxel/engine/characters/creatures/frameRig';
import { hashUnit } from '@voxel/engine/characters/creatures/creatureMesh';

// Bone, its shade, its cracks, the dark within; grave-cloth and its shade; rusted iron, rust, its edge; black yew, the string.
export const SKELETON_PALETTE = [0xd2c29a, 0xa8966c, 0x7a6a4a, 0x1c1612, 0x6a6250, 0x4a4438, 0x5c5650, 0x7a4a2e, 0x9a948a, 0x221c1a, 0xcfc6b0];
const [BONE, SHADE, CRACK, DARK, CLOTH, CLOTH_DARK, IRON, RUST, EDGE, YEW, STRING] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const PARTS: Record<BodyPart, (grid: VoxelGrid) => void> = {
  // The skull: round, big, the jaw narrower under it; its face toward +Z.
  head: (g) => {
    fillBox(g, 2, 3, 1, 8, 10, 9, BONE);
    fillBox(g, 1, 4, 2, 9, 9, 8, BONE);
    fillBox(g, 3, 10, 3, 7, 10, 7, SHADE); // its crown, in shade from the sides
    fillBox(g, 3, 0, 4, 7, 2, 9, SHADE); // the jaw
    fillBox(g, 2, 5, 9, 3, 6, 9, DARK); // the sockets (its right eye at -x)
    fillBox(g, 6, 5, 9, 7, 6, 9, DARK);
    fillBox(g, 5, 3, 9, 5, 4, 9, DARK); // the nose
    for (let x = 3; x <= 7; x++) fillBox(g, x, 2, 9, x, 2, 9, x % 2 ? BONE : CRACK); // the teeth
    fillBox(g, 8, 7, 3, 8, 9, 3, CRACK); // a crack across the crown
  },
  // The ribs: bars round an empty chest, the spine at the back, the collarbones across the top, the pelvis below.
  torso: (g) => {
    fillBox(g, 1, 0, 1, 7, 1, 3, SHADE); // the pelvis
    fillBox(g, 3, 0, 2, 5, 0, 2, DARK);
    fillBox(g, 4, 0, 0, 4, 8, 1, CRACK); // the spine, down the back
    for (const y of [3, 5, 7]) {
      fillBox(g, 1, y, 0, 7, y, 4, BONE);
      fillBox(g, 2, y, 1, 6, y, 3, 0); // (hollow)
    }
    fillBox(g, 4, 3, 4, 4, 7, 4, SHADE); // the breastbone
    fillBox(g, 0, 8, 2, 8, 8, 2, BONE); // the collarbones
  },
  // An arm: the upper bone, a knob at the elbow, the forearm, a bony hand.
  arm: (g) => {
    fillBox(g, 1, 5, 1, 1, 8, 1, BONE);
    fillBox(g, 0, 4, 0, 2, 4, 2, SHADE); // the elbow
    fillBox(g, 1, 1, 1, 1, 3, 1, BONE);
    fillBox(g, 0, 0, 1, 2, 0, 2, SHADE); // the hand
  },
  // A leg: the thigh bone, a knob at the knee, the shin, a long foot forward.
  leg: (g) => {
    fillBox(g, 1, 4, 2, 2, 6, 2, BONE);
    fillBox(g, 1, 3, 1, 2, 3, 3, SHADE); // the knee
    fillBox(g, 1, 1, 2, 2, 2, 2, BONE);
    fillBox(g, 1, 0, 1, 2, 0, 4, SHADE); // the foot
  },
};

// Grave-cloth: a ragged wrap round the hips, a rag hung from one shoulder.
function rags(joint: Joint, g: VoxelGrid): void {
  if (joint === 'torso') {
    for (let x = 0; x <= 8; x++) for (const z of [0, 4]) {
      const low = hashUnit(x, z, 31) < 0.5 ? 0 : 1; // (torn, ragged at the hem)
      fillBox(g, x, low, z, x, 2, z, (x + z) % 3 ? CLOTH : CLOTH_DARK);
    }
    fillBox(g, 0, 0, 1, 0, 2, 3, CLOTH);
    fillBox(g, 8, 1, 1, 8, 2, 3, CLOTH_DARK);
    fillBox(g, 5, 4, 4, 7, 8, 4, (_x, y) => (y % 2 ? CLOTH : CLOTH_DARK)); // over its left shoulder
    fillBox(g, 6, 3, 4, 6, 3, 4, CLOTH_DARK);
  }
}

// The rusted sword, along +Z from the grip: pommel, grip, guard, a pitted blade.
function rustySword(): VoxelGrid {
  const g = createGrid([5, 2, 22]);
  fillBox(g, 2, 0, 0, 2, 1, 4, CRACK); // the grip
  setColor(g, 2, 0, 0, IRON);
  fillBox(g, 0, 0, 5, 4, 1, 5, IRON); // the guard
  fillBox(g, 1, 0, 6, 3, 1, 20, (x, y, z) => (x === 2 ? (hashUnit(z, y, 5) < 0.3 ? RUST : IRON) : hashUnit(x * 9 + y, z, 6) < 0.35 ? RUST : EDGE));
  fillBox(g, 2, 0, 21, 2, 1, 21, EDGE);
  return g;
}

// The bow, black yew: a long stave up and down (along Y), bowed forward, the string straight behind; gripped low.
function yewBow(): VoxelGrid {
  const g = createGrid([2, 25, 7]);
  for (let y = 0; y <= 24; y++) {
    const bend = Math.round(5 * (1 - ((y - 12) / 12) ** 2)); // (bowed forward in the middle, its tips swept back)
    fillBox(g, 0, y, bend + 1, 1, y, bend + 1, y >= 10 && y <= 14 ? CLOTH_DARK : YEW);
    if (y === 0 || y === 24) fillBox(g, 0, y, 0, 1, y, 1, YEW);
  }
  for (let y = 1; y <= 23; y++) fillBox(g, 0, y, 0, 1, y, 0, STRING); // the string, pale
  return g;
}

const paint = (joint: Joint, g: VoxelGrid) => {
  PARTS[(joint.endsWith('Arm') ? 'arm' : joint.endsWith('Leg') ? 'leg' : joint) as BodyPart](g);
  rags(joint, g);
};

export const SKELETON: FrameSpec = {
  palette: SKELETON_PALETTE,
  paint,
  gait: { ...SHAMBLE, sway: 0.04, lean: 0.05 },
  held: { rightArm: { grid: rustySword, grip: [2.5, 1, 2], turn: [-0.9, 0, 0] } },
};

export const SKELETON_ARCHER: FrameSpec = {
  ...SKELETON,
  held: { leftArm: { grid: yewBow, grip: [1, 12, 6], voxel: HUMAN_VOXEL_SIZE, turn: [-0.5, 0, -0.5] } }, // (held up and across, at the ready)
};
