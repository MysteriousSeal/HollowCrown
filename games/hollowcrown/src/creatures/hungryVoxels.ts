// The Hungry (famine-wraiths): the starved dead of the Wet Years, buried without rites while the reeves took the grain.
// Not the hero's body but a frame of their own, painted on its joints (the engine's FrameModel), sickly grey-green and faded:
// a small skull of a head (sunken pits for eyes with a pale light far in them, hollow cheeks, the jaw and its teeth
// showing, a few lank strands of hair); a stick of a body, the ribs drawn across it, over a swollen belly; arms and
// legs one voxel thick, knobbed at the joints, long-fingered; rags hanging off them. The man still holds a crust;
// the mother, a shawl over her head and her hair down her back, carries her child, a bundle with a small pale face.
// They drift low, reaching.

import { hashUnit } from '@voxel/engine/math';
import { box, createGrid, fillBox, fillEllipsoid, namedPalette, setColor, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { spectralMaterial } from '@voxel/engine/models';
import { type FrameSpec, type Gait, type Joint } from '@voxel/engine/characters';
import { tornHem } from './kit';

const P = namedPalette({
  skin: 0xb6c4ba,
  skinShade: 0x8c9a92,
  skinDeep: 0x56625c,
  pit: 0x161c1c,
  glow: 0xd8ffe4,
  bone: 0xd8dcc8,
  rag: 0x6e6c5e,
  ragDark: 0x4c4a40,
  hair: 0x3c3e3a,
  crust: 0xb08a52,
});
const { C } = P;
const DRIFT: Gait = { speed: 0.7, legSwing: 0.18, armSwing: 0.1, reach: 0.4, lean: 0.15, sway: 0.05, hover: 0.03, bob: 0 };
const HEAD: Size = [8, 9, 8];

// The skull: round over the brow, narrowing to the jaw; its face toward +Z (z 7).
function head(g: VoxelGrid, o: Size, mother: boolean): void {
  box(g, o, 1, 3, 1, 6, 8, 6, (x, y, z) => (x === 1 || x === 6 || z === 1 ? C.skinShade : y === 8 ? C.skinShade : C.skin)); // the cranium
  box(g, o, 0, 4, 2, 7, 7, 5, (x) => (x === 0 || x === 7 ? C.skinShade : C.skin));
  box(g, o, 2, 0, 3, 5, 2, 6, (_x, y) => (y === 0 ? C.skinShade : C.skin)); // the jaw
  box(g, o, 1, 5, 7, 2, 6, 7, C.pit); // the eye pits...
  box(g, o, 5, 5, 7, 6, 6, 7, C.pit);
  box(g, o, 2, 5, 7, 2, 5, 7, C.glow); // ...a light far in them
  box(g, o, 5, 5, 7, 5, 5, 7, C.glow);
  box(g, o, 1, 3, 6, 1, 4, 6, C.skinDeep); // the cheeks, hollow
  box(g, o, 6, 3, 6, 6, 4, 6, C.skinDeep);
  box(g, o, 3, 4, 7, 4, 4, 7, C.skinDeep); // the nose, gone
  box(g, o, 2, 1, 7, 5, 2, 7, (x, y) => (y === 2 ? (x % 2 ? C.bone : C.pit) : C.skinDeep)); // the teeth, bared
  if (mother) {
    box(g, o, 0, 3, 0, 7, 9, 6, (x, y, z) => ((x === 0 || x === 7 || z === 0 || y === 9) && y >= 3 ? (y + z) % 3 ? C.rag : C.ragDark : 0)); // her shawl
    box(g, o, 1, 9, 7, 6, 9, 7, C.ragDark);
    box(g, o, 1, -2, 0, 6, 2, 0, (x, y) => (y < -1 + (x % 2) ? 0 : C.hair)); // her hair, down her back
  } else {
    for (const [x, z] of [[1, 2], [3, 1], [5, 2], [6, 4], [2, 5]]) box(g, o, x, 9, z, x, 9, z, C.hair); // lank strands
    box(g, o, 0, 3, 1, 0, 7, 1, C.hair);
    box(g, o, 7, 2, 2, 7, 6, 2, C.hair);
  }
}

// The body: a spine of a trunk, shoulders a thin bar, the ribs across it, the belly swollen out in front; rags.
function torso(g: VoxelGrid, o: Size, mother: boolean): void {
  box(g, o, 3, 0, 1, 5, 8, 3, (x, y, z) => (y >= 5 && z === 3 && x !== 4 && y % 2 ? C.skinDeep : x === 3 || z === 1 ? C.skinShade : C.skin));
  box(g, o, -1, 8, 2, 9, 8, 2, C.skinShade); // the shoulders, a bar out to the arms
  fillEllipsoid(g, [4.5, 2.8, 3.7], [2.6, 2.2, 2.6], (_x, y) => (y <= 1 ? C.skinShade : C.skin), o); // the belly
  box(g, o, 4, 2, 6, 4, 2, 6, C.skinDeep); // its navel
  // Rags: a loincloth torn at the hem, a strip hung over one shoulder and across.
  box(g, o, 1, -3, 0, 7, -1, 5, (x, y, z) => ((x === 1 || x === 7 || z === 0 || z === 5) && y >= -3 + tornHem(x, z, 1) ? (x + z) % 3 ? C.rag : C.ragDark : 0));
  for (let y = 2; y <= 8; y++) box(g, o, 8 - y + (mother ? 0 : 2) - 2, y, 0, 8 - y + (mother ? 0 : 2) - 1, y, 0, y % 2 ? C.rag : C.ragDark);
}

// An arm or a leg: a stick of bone and skin, a knob at the elbow or knee; the hand's long fingers, or a foot.
function limb(g: VoxelGrid, o: Size, arm: boolean, salt: number): void {
  const [x, z] = arm ? [1, 1] : [1, 2];
  box(g, o, x, 1, z, x, arm ? 8 : 6, z, (_x, y) => (y === 8 ? C.skinShade : C.skin));
  box(g, o, x, arm ? 4 : 3, z, x + 1, arm ? 4 : 3, z, C.skinShade); // the joint, knobbed
  if (arm) {
    box(g, o, 0, 0, 1, 2, 1, 1, (xx, y) => (y === 1 || xx !== 1 ? C.skinShade : 0)); // long fingers
    box(g, o, 0, 7, 0, 2, 8, 2, (xx, y, zz) => (hashUnit(xx + y, zz, salt) < 0.55 ? (y === 8 ? C.rag : C.ragDark) : 0)); // a shred of sleeve
  } else {
    box(g, o, 1, 0, 1, 2, 0, 4, C.skinShade); // the foot
  }
}

function paint(mother: boolean) {
  return (joint: Joint, g: VoxelGrid, o: Size) => {
    if (joint === 'head') head(g, o, mother);
    else if (joint === 'torso') torso(g, o, mother);
    else limb(g, o, joint.endsWith('Arm'), joint.length);
  };
}

// A crust of bread in the hand.
function crust(): VoxelGrid {
  const g = createGrid([3, 2, 4]);
  fillBox(g, 0, 0, 0, 2, 1, 3, (x, y, z) => ((x + y + z) % 3 ? C.crust : C.ragDark));
  setColor(g, 2, 1, 3, 0);
  return g;
}

// Her child, a bundle in a shawl, its small pale face.
function babe(): VoxelGrid {
  const g = createGrid([4, 5, 3]);
  fillBox(g, 0, 0, 0, 3, 4, 2, (_x, y) => (y % 2 ? C.rag : C.ragDark));
  fillBox(g, 1, 2, 2, 2, 3, 2, C.skin);
  setColor(g, 1, 3, 2, C.pit);
  setColor(g, 2, 3, 2, C.pit);
  return g;
}

const hungry = (mother: boolean): FrameSpec => ({
  palette: P.colors,
  pad: true,
  sizes: { head: HEAD },
  paint: paint(mother),
  glows: new Set([C.glow]),
  material: spectralMaterial(0.92, 0x5a6a58),
  gait: mother ? { ...DRIFT, reach: 0.15, lean: 0.12 } : DRIFT,
  held: mother ? { leftArm: { grid: babe, grip: [2, 2.5, 0], turn: [-1.2, 0, 0] } } : { rightArm: { grid: crust, grip: [1.5, 1, 1.5], turn: [-0.3, 0, 0] } },
});

export const HUNGRY = hungry(false);
export const HUNGRY_MOTHER = hungry(true);
