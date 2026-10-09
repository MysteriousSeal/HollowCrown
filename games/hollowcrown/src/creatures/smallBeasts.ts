// The Vale's small wild beasts, for the life in the empty land (an ambient system: gameplay): the rabbit and the fox,
// on the engine's beast rig at its 0.025 voxels, palette first, silhouette over detail (they're a few pixels at the
// game's camera): the rabbit's long ears up and its white scut, the fox's russet, its black stockings and the white tip
// of its brush. Each faces +Z, in parts like the wolf's (the tail's root at +Z, its tip at 0).

import { beastPart, type BeastSpec } from '@voxel/engine/characters';
import { createGrid, fillBox, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { BEAST_GESTURES } from './wildGestures';

// ---- the rabbit ----

const R = namedPalette({ coat: 0x8a7258, coatLight: 0xa88c6c, coatDark: 0x6a5642, belly: 0xe2d6bc, scut: 0xf4efe4, ear: 0xc89a8a, eye: 0x1a1412, nose: 0xc88a84 });

const rabbitBody = (): VoxelGrid => {
  const g = createGrid([4, 4, 6]);
  fillBox(g, 0, 0, 0, 3, 3, 5, (x, y, z) => (y === 0 ? R.C.belly : y === 3 ? ((x === 0 || x === 3) || z === 0 || z === 5 ? 0 : R.C.coatDark) : x === 0 || x === 3 ? R.C.coat : (x + z) % 3 ? R.C.coatLight : R.C.coat)); // (its back rounded)
  return g;
};
const rabbitHead = (): VoxelGrid => {
  const g = createGrid([4, 8, 4]);
  fillBox(g, 0, 0, 0, 3, 2, 3, (x, y) => (y === 0 ? R.C.belly : x === 0 || x === 3 ? R.C.coat : R.C.coatLight));
  for (const x of [1, 2]) fillBox(g, x, 3, 0, x, 7, 0, (_x, y) => (y === 7 ? R.C.coatDark : R.C.coat)); // the ears, up
  for (const x of [1, 2]) fillBox(g, x, 4, 1, x, 6, 1, R.C.ear); // their pink insides, to the front
  setColor(g, 0, 2, 2, R.C.eye);
  setColor(g, 3, 2, 2, R.C.eye);
  fillBox(g, 1, 1, 3, 2, 1, 3, R.C.nose);
  return g;
};
const rabbitLeg = (): VoxelGrid => {
  const g = createGrid([2, 2, 2]);
  fillBox(g, 0, 0, 0, 1, 1, 1, (_x, y) => (y === 0 ? R.C.belly : R.C.coat));
  return g;
};
const rabbitTail = (): VoxelGrid => {
  const g = createGrid([2, 2, 1]);
  fillBox(g, 0, 0, 0, 1, 1, 0, R.C.scut);
  return g;
};

export const RABBIT: BeastSpec = {
  palette: R.colors,
  body: beastPart(rabbitBody, [4, 4, 6]),
  head: beastPart(rabbitHead, [4, 8, 4]),
  leg: beastPart(rabbitLeg, [2, 2, 2]),
  tail: beastPart(rabbitTail, [2, 2, 1]),
  headDrop: 1,
  tailDrop: 1,
  tailDroop: -0.3, // (the scut cocked up)
  legsAt: [[-1, 1.5], [1, 1.5], [-1, -1.5], [1, -1.5]],
  stride: 3.2,
  gestures: BEAST_GESTURES,
};

// ---- the fox ----

const F = namedPalette({ coat: 0xb8602a, coatDark: 0x8e4620, coatLight: 0xd07a3a, white: 0xf0e8da, black: 0x1e1814, eye: 0x2a1a10 });

const foxBody = (): VoxelGrid => {
  const g = createGrid([4, 4, 9]);
  fillBox(g, 0, 0, 0, 3, 3, 8, (x, y, z) => (y === 0 ? (z >= 5 ? F.C.white : F.C.coatDark) : y === 3 ? (z === 0 || z === 8 ? 0 : F.C.coatDark) : x === 0 || x === 3 ? F.C.coat : (x + z) % 4 ? F.C.coatLight : F.C.coat));
  fillBox(g, 1, 1, 8, 2, 2, 8, F.C.white); // its chest
  return g;
};
const foxHead = (): VoxelGrid => {
  const g = createGrid([4, 6, 6]);
  fillBox(g, 0, 0, 0, 3, 2, 2, (x, y) => (y === 0 ? F.C.white : x === 0 || x === 3 ? F.C.coat : F.C.coatLight)); // the skull
  fillBox(g, 1, 0, 3, 2, 1, 4, (_x, y) => (y === 0 ? F.C.white : F.C.coat)); // the long muzzle
  fillBox(g, 1, 1, 5, 2, 1, 5, (x) => (x === 1 ? F.C.black : F.C.coat));
  setColor(g, 1, 1, 5, F.C.black); // its nose
  setColor(g, 2, 1, 5, 0);
  for (const x of [0, 3]) {
    fillBox(g, x, 0, 2, x, 1, 2, F.C.white); // white cheeks
    fillBox(g, x, 3, 0, x, 5, 1, (_x, y) => (y === 5 ? F.C.black : y === 3 ? F.C.coat : F.C.coatDark)); // the ears, black-tipped
  }
  setColor(g, 0, 2, 2, F.C.eye);
  setColor(g, 3, 2, 2, F.C.eye);
  return g;
};
const foxLeg = (): VoxelGrid => {
  const g = createGrid([2, 4, 2]);
  fillBox(g, 0, 0, 0, 1, 3, 1, (_x, y) => (y <= 2 ? F.C.black : F.C.coat)); // black stockings
  return g;
};
const foxTail = (): VoxelGrid => {
  const g = createGrid([3, 3, 8]);
  fillBox(g, 0, 0, 0, 2, 2, 7, (x, y, z) => ((x === 0 || x === 2) && (y === 0 || y === 2) ? 0 : z <= 1 ? F.C.white : z === 7 && x !== 1 ? 0 : (y === 2 ? F.C.coatLight : F.C.coat))); // the brush, white-tipped
  return g;
};

export const FOX: BeastSpec = {
  palette: F.colors,
  body: beastPart(foxBody, [4, 4, 9]),
  head: beastPart(foxHead, [4, 6, 6]),
  leg: beastPart(foxLeg, [2, 4, 2]),
  tail: beastPart(foxTail, [3, 3, 8]),
  headDrop: 1,
  tailDrop: 2,
  tailDroop: 0.2,
  legsAt: [[-1, 3], [1, 3], [-1, -3], [1, -3]],
  stride: 2.2,
  gestures: BEAST_GESTURES,
};
