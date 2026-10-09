// A carrion rook, fat on hanged men: a black bird bigger than it should be, oily feathers with a blue-violet sheen,
// the bald grey face of a rook, a heavy dark beak; the flock's leader older, greyer at the nape, white-eyed. In
// voxel parts for the engine's bird rig: the body (its tail fanned behind), the head, a wing, a leg.

import { createGrid, fillBox, fillEllipsoid, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import type { BirdSpec } from '@voxel/engine/characters';

const colors = {
  feather: 0x221f26,
  sheen: 0x2e3442,
  featherDark: 0x121014,
  nape: 0x221f26, // (the leader's greyer)
  face: 0xb4a49c,
  beak: 0x2c2a2e,
  beakLight: 0x56525a,
  eye: 0x1a120c,
  leg: 0x2a2426,
};
const P = namedPalette(colors);
const { C } = P;
const LEADER = namedPalette({ ...colors, nape: 0x6a6670, eye: 0xf4f2ea }).colors;

const BODY: [number, number, number] = [6, 6, 12];
const HEAD: [number, number, number] = [5, 5, 8];
const WING: [number, number, number] = [2, 3, 10];
const LEG: [number, number, number] = [3, 4, 3];

// The body: a round breast, a sheen along the back, the tail fanned out behind (at low z).
function body(): VoxelGrid {
  const g = createGrid(BODY);
  fillEllipsoid(g, [3, 3.1, 8], [3, 3, 4.6], (x, y) => (y >= 4 && (x === 2 || x === 3) ? C.sheen : y <= 1 ? C.featherDark : C.feather));
  fillBox(g, 1, 3, 0, 4, 3, 3, (x, _y, z) => (z === 0 && x % 2 ? 0 : x === 1 || x === 4 ? C.featherDark : C.feather)); // the tail, its tip notched
  fillBox(g, 2, 4, 9, 3, 4, 11, C.nape); // the nape
  return g;
}

// The head: the skull dark, the bald grey face round the beak's base, the beak long and heavy, eyes either side.
function head(): VoxelGrid {
  const g = createGrid(HEAD);
  fillEllipsoid(g, [2.5, 2.7, 2.1], [2.6, 2.5, 2.3], (_x, y, z) => (z >= 2 && y <= 3 ? C.face : y >= 4 ? C.sheen : C.feather)); // a round skull, bald-faced in front
  fillBox(g, 1, 4, 0, 3, 4, 1, C.nape);
  setColor(g, 0, 3, 3, C.eye);
  setColor(g, 4, 3, 3, C.eye);
  fillBox(g, 1, 1, 4, 3, 2, 5, (_x, y) => (y === 2 ? C.beakLight : C.beak)); // the beak, long and heavy, tapering
  fillBox(g, 2, 1, 6, 2, 2, 6, C.beak);
  setColor(g, 2, 1, 7, C.beak);
  return g;
}

// A wing, folded: from the shoulder (high z) back past the tail, the long primaries ragged at the tip.
function wing(): VoxelGrid {
  const g = createGrid(WING);
  for (let z = 0; z < 10; z++) {
    const top = z >= 6 ? 2 : z >= 3 ? 1 : 0; // deep at the shoulder, thinning back to the primaries
    const outer = z >= 2 ? 1 : 0; // the tips one feather thick
    for (let y = 0; y <= top; y++) for (let x = 0; x <= outer; x++) {
      if (z < 3 && z % 2 === 1) continue; // (ragged tips: the long primaries apart)
      setColor(g, x, y, z, y === top && x === outer ? C.sheen : z < 4 ? C.featherDark : C.feather);
    }
  }
  return g;
}

function leg(): VoxelGrid {
  const g = createGrid(LEG);
  fillBox(g, 1, 1, 1, 1, 3, 1, C.leg);
  fillBox(g, 0, 0, 2, 2, 0, 2, C.leg); // the toes, splayed forward...
  setColor(g, 1, 0, 1, C.leg);
  setColor(g, 1, 0, 0, C.leg); // ...and one back
  return g;
}

// The rook, and the flock's leader (older, bigger, white-eyed), as the engine's bird rig draws them.
export const ROOK: BirdSpec = {
  palette: P.colors,
  body: { grid: body, pivot: [3, 0, 6] },
  head: { grid: head, pivot: [2.5, 0, 1], at: [0, 4, 5] },
  wing: { grid: wing, pivot: [0, 2, 10], at: [3, 5, 4] },
  leg: { grid: leg, pivot: [1.5, LEG[1] - 0.5, 1.5], at: [1.2, 0, 0], length: LEG[1] - 0.5 },
  height: 9,
  shade: 0.7,
};
export const ROOK_LEADER: BirdSpec = { ...ROOK, palette: LEADER, scale: 1.25 };
