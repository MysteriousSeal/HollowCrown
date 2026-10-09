// The Vale's farm beasts (the Cobbes' fields, the villages; an ambient system: gameplay): a sheep, a cow, a dog, on the
// engine's beast rig at 0.025 voxels, palette first and cheap: the sheep a cream fleece round a black face and black
// legs, its ears out sideways; the cow red-brown with white patches, cream horns, a pink muzzle, a tufted tail; the dog
// a brown farm cur with a tan face and chest, soft ears and its tail up. Each faces +Z.

import { hashUnit } from '@voxel/engine/math';
import { beastPart, type BeastSpec } from '@voxel/engine/characters';
import { createGrid, fillBox, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { BEAST_GESTURES } from './wildGestures';

const corner = (x: number, z: number, w: number, l: number) => (x === 0 || x === w - 1) && (z === 0 || z === l - 1);

// ---- the sheep ----

const S = namedPalette({ wool: 0xf4f0e6, woolShade: 0xdcd4c2, woolDark: 0xbcb29c, face: 0x2a2624, eye: 0x0e0c0c, hoof: 0x1c1a18 });

function sheepBody(): VoxelGrid {
  const g = createGrid([7, 6, 9]);
  fillBox(g, 0, 0, 0, 6, 5, 8, (x, y, z) => (corner(x, z, 7, 9) && (y === 0 || y === 5) ? 0 : y === 0 ? S.C.woolDark : (x + y * 2 + z) % 4 === 0 ? S.C.woolShade : S.C.wool)); // (a fleece in curls, rounded)
  return g;
}
function sheepHead(): VoxelGrid {
  const g = createGrid([5, 5, 5]);
  fillBox(g, 1, 0, 0, 3, 3, 1, (_x, y) => (y === 3 ? S.C.wool : S.C.woolShade)); // the fleece up the neck, a topknot
  fillBox(g, 1, 0, 2, 3, 2, 4, S.C.face); // the black face
  setColor(g, 1, 2, 3, S.C.eye);
  setColor(g, 3, 2, 3, S.C.eye);
  for (const x of [0, 4]) fillBox(g, x, 2, 2, x, 2, 2, S.C.face); // ears, out sideways
  return g;
}
function sheepLeg(): VoxelGrid {
  const g = createGrid([2, 3, 2]);
  fillBox(g, 0, 0, 0, 1, 2, 1, (_x, y) => (y === 0 ? S.C.hoof : S.C.face));
  return g;
}
function sheepTail(): VoxelGrid {
  const g = createGrid([2, 2, 2]);
  fillBox(g, 0, 0, 0, 1, 1, 1, S.C.woolShade);
  return g;
}

export const SHEEP: BeastSpec = {
  palette: S.colors,
  body: beastPart(sheepBody, [7, 6, 9]),
  head: beastPart(sheepHead, [5, 5, 5]),
  leg: beastPart(sheepLeg, [2, 3, 2]),
  tail: beastPart(sheepTail, [2, 2, 2]),
  headDrop: 3,
  tailDrop: 2,
  tailDroop: 0.8,
  legsAt: [[-2, 3], [2, 3], [-2, -3], [2, -3]],
  stride: 1.6,
  gestures: BEAST_GESTURES,
};

// ---- the cow ----

const K = namedPalette({ coat: 0x8a4a2a, coatDark: 0x6a3620, white: 0xece4d4, whiteShade: 0xd0c6b2, muzzle: 0xd0a090, horn: 0xe0d4b4, hornTip: 0x4a4038, hoof: 0x2a2220, eye: 0x120e0c });
const patch = (x: number, y: number, z: number) => hashUnit(Math.floor((x + 1) / 4), Math.floor(y / 4) + Math.floor(z / 5) * 7, 91) < 0.45; // (big white patches)

function cowBody(): VoxelGrid {
  const g = createGrid([8, 7, 14]);
  fillBox(g, 0, 0, 0, 7, 6, 13, (x, y, z) => {
    if (corner(x, z, 8, 14) && y === 6) return 0;
    if (y === 0) return z >= 3 && z <= 6 && x >= 2 && x <= 5 ? K.C.muzzle : K.C.whiteShade; // (her udder pink under her)
    const white = patch(x, y, z);
    return white ? (x === 0 || x === 7 ? K.C.whiteShade : K.C.white) : x === 0 || x === 7 ? K.C.coatDark : K.C.coat;
  });
  fillBox(g, 3, 6, 0, 4, 6, 0, K.C.coatDark); // the hip bones showing
  return g;
}
function cowHead(): VoxelGrid {
  const g = createGrid([8, 7, 6]);
  fillBox(g, 2, 0, 0, 5, 5, 3, (x, y) => (y === 5 && (x === 3 || x === 4) ? K.C.white : x === 2 || x === 5 ? K.C.coatDark : K.C.coat)); // the head, a white blaze on the poll
  fillBox(g, 2, 0, 4, 5, 2, 5, (_x, y) => (y === 2 ? K.C.coat : K.C.muzzle)); // the broad muzzle
  setColor(g, 2, 3, 3, K.C.eye);
  setColor(g, 5, 3, 3, K.C.eye);
  for (const [x, d] of [[1, -1], [6, 1]]) {
    fillBox(g, x, 4, 1, x, 4, 2, K.C.coatDark); // the ears
    fillBox(g, x + d, 5, 1, x + d, 6, 1, (_x, y) => (y === 6 ? K.C.hornTip : K.C.horn)); // the horns
  }
  return g;
}
function cowLeg(): VoxelGrid {
  const g = createGrid([2, 6, 2]);
  fillBox(g, 0, 0, 0, 1, 5, 1, (_x, y) => (y === 0 ? K.C.hoof : y <= 2 ? K.C.whiteShade : K.C.coat));
  return g;
}
function cowTail(): VoxelGrid {
  const g = createGrid([1, 1, 9]);
  fillBox(g, 0, 0, 0, 0, 0, 8, (_x, _y, z) => (z <= 1 ? K.C.coatDark : K.C.coat)); // a tuft at its end
  return g;
}

export const COW: BeastSpec = {
  palette: K.colors,
  body: beastPart(cowBody, [8, 7, 14]),
  head: beastPart(cowHead, [8, 7, 6]),
  leg: beastPart(cowLeg, [2, 6, 2]),
  tail: beastPart(cowTail, [1, 1, 9]),
  headDrop: 3,
  tailDrop: 1,
  tailDroop: 1.2,
  legsAt: [[-2.5, 5], [2.5, 5], [-2.5, -5], [2.5, -5]],
  stride: 1.1,
  gestures: BEAST_GESTURES,
};

// ---- the dog ----

const D = namedPalette({ coat: 0x6a4a30, coatDark: 0x4e3622, tan: 0xc09060, nose: 0x161210, eye: 0x161210 });

function dogBody(): VoxelGrid {
  const g = createGrid([4, 5, 8]);
  fillBox(g, 0, 0, 0, 3, 4, 7, (x, y, z) => (y === 0 ? D.C.tan : z === 7 && y <= 3 && (x === 1 || x === 2) ? D.C.tan : y === 4 && (x === 0 || x === 3) ? D.C.coatDark : D.C.coat));
  return g;
}
function dogHead(): VoxelGrid {
  const g = createGrid([4, 5, 6]);
  fillBox(g, 0, 0, 0, 3, 3, 3, (x, y) => (y === 0 ? D.C.tan : x === 0 || x === 3 ? D.C.coatDark : D.C.coat));
  fillBox(g, 1, 0, 4, 2, 1, 5, (_x, y, z) => (z === 5 && y === 1 ? D.C.nose : D.C.tan)); // the muzzle
  setColor(g, 0, 2, 3, D.C.eye);
  setColor(g, 3, 2, 3, D.C.eye);
  for (const x of [0, 3]) fillBox(g, x, 1, 1, x, 4, 1, (_x, y) => (y === 4 ? D.C.coat : D.C.coatDark)); // soft ears, folded down
  return g;
}
function dogLeg(): VoxelGrid {
  const g = createGrid([2, 4, 2]);
  fillBox(g, 0, 0, 0, 1, 3, 1, (_x, y) => (y <= 1 ? D.C.tan : D.C.coat));
  return g;
}
function dogTail(): VoxelGrid {
  const g = createGrid([1, 1, 5]);
  fillBox(g, 0, 0, 0, 0, 0, 4, (_x, _y, z) => (z === 0 ? D.C.tan : D.C.coat));
  return g;
}

export const DOG: BeastSpec = {
  palette: D.colors,
  body: beastPart(dogBody, [4, 5, 8]),
  head: beastPart(dogHead, [4, 5, 6]),
  leg: beastPart(dogLeg, [2, 4, 2]),
  tail: beastPart(dogTail, [1, 1, 5]),
  headDrop: 1,
  tailDrop: 1,
  tailDroop: -0.7, // (up)
  legsAt: [[-1, 2.5], [1, 2.5], [-1, -2.5], [1, -2.5]],
  stride: 2.2,
  gestures: BEAST_GESTURES,
};
