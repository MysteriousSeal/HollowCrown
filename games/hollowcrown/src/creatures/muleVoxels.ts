// A pilgrim's mule (MQ01: dead at the Birchwood's edge, the wolves already at it), as voxel parts for the engine's beast
// rig, palette first: a dusty dun coat with a dark stripe down the spine and a dark upright mane, a pale mealy muzzle
// and belly, long ears, dark legs; a pack-saddle's blanket still girthed on (the packs cut away), and torn red where the
// wolves have fed. Same 0.025 voxels as the wolf, but taller in the leg and longer in the head. Faces +Z.

import { beastPart, type BeastSpec } from '@voxel/engine/characters';
import { createGrid, fillBox, setColor, type VoxelGrid } from '@voxel/engine/voxel';

const ENTRIES = {
  coat: 0x8a7258,
  coatShade: 0x6e5a44,
  stripe: 0x3e3026,
  mealy: 0xc8b496,
  hoof: 0x2a2420,
  eye: 0x141010,
  blanket: 0x7a2e2a,
  blanketHem: 0xc0903e,
  girth: 0x4a3220,
  wound: 0x6a1a18,
  woundDark: 0x3e0e0e,
} as const;

const PALETTE: number[] = Object.values(ENTRIES);
const C = Object.fromEntries(Object.keys(ENTRIES).map((name, i) => [name, i + 1])) as Record<keyof typeof ENTRIES, number>;

const BODY: [number, number, number] = [7, 7, 14];
const HEAD: [number, number, number] = [5, 9, 9];
const LEG: [number, number, number] = [2, 7, 2];
const TAIL: [number, number, number] = [1, 1, 7];

// The barrel: the dark stripe down the spine, the mealy belly, the blanket over the back girthed under it, the
// wolves' work torn into the flank and the belly behind.
function body(): VoxelGrid {
  const g = createGrid(BODY);
  fillBox(g, 0, 0, 0, 6, 5, 13, (x, y) => (y === 5 && x === 3 ? C.stripe : y === 0 ? C.mealy : x === 0 || x === 6 ? C.coatShade : C.coat));
  fillBox(g, 0, 3, 5, 6, 6, 9, (x, y, z) => (y === 6 || x === 0 || x === 6 ? (y === 3 ? C.blanketHem : (x + z) % 4 ? C.blanket : C.blanketHem) : 0)); // the blanket
  fillBox(g, 0, 0, 8, 6, 2, 8, (x, y) => (x === 0 || x === 6 || y === 0 ? C.girth : 0)); // the girth
  for (const [x, y, z] of [[6, 2, 2], [6, 3, 2], [6, 2, 3], [6, 1, 1], [5, 0, 2], [4, 0, 3], [6, 4, 3]]) setColor(g, x, y, z, (y + z) % 2 ? C.wound : C.woundDark); // torn
  for (const x of [0, 6]) for (const z of [0, 13]) setColor(g, x, 5, z, 0); // its top edges rounded a touch
  return g;
}

// The long head, carried high: the jaw and a pale muzzle, dark eyes, the mane up its neck, the long ears.
function head(): VoxelGrid {
  const g = createGrid(HEAD);
  fillBox(g, 1, 0, 0, 3, 5, 3, (x, y) => (y === 5 && x === 2 ? C.stripe : C.coat)); // the neck's top, the poll
  fillBox(g, 1, 0, 4, 3, 3, 8, (_x, y, z) => (z >= 7 || y === 0 ? C.mealy : C.coat)); // the face, the muzzle
  fillBox(g, 2, 4, 0, 2, 5, 3, C.stripe); // the mane, standing
  setColor(g, 1, 3, 4, C.eye);
  setColor(g, 3, 3, 4, C.eye);
  for (const x of [0, 4]) fillBox(g, x, 5, 2, x, 8, 2, (_x, y) => (y === 8 ? C.stripe : C.coat)); // the ears
  return g;
}

function leg(): VoxelGrid {
  const g = createGrid(LEG);
  fillBox(g, 0, 0, 0, 1, 6, 1, (_x, y) => (y === 0 ? C.hoof : y <= 2 ? C.stripe : C.coatShade));
  return g;
}

// A thin tail, a dark switch at its end (the root at +Z).
function tail(): VoxelGrid {
  const g = createGrid(TAIL);
  fillBox(g, 0, 0, 0, 0, 0, 6, (_x, _y, z) => (z <= 2 ? C.stripe : C.coatShade));
  return g;
}

export const MULE: BeastSpec = {
  palette: PALETTE,
  body: beastPart(body, BODY),
  head: beastPart(head, HEAD),
  leg: beastPart(leg, LEG),
  tail: beastPart(tail, TAIL),
  headDrop: 1, // (carried high)
  legsAt: [[-2, 5], [2, 5], [-2, -5], [2, -5]],
  stride: 1.4,
};
