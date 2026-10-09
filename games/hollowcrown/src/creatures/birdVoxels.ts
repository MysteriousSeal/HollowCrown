// The Vale's everyday birds, for the life in the empty land and the villages (an ambient system: gameplay), on the
// engine's bird rig (standing they strut and peck, moving they fly): the house sparrow, the chaffinch, the mallard (a
// drake and a duck) for the pond, the village hens (a brown and a white, a red comb), and the common crow. One builder,
// palette first, each a round body, a head, a folded wing and a leg, the few voxels that say what it is: the
// sparrow's black bib and grey cap, the chaffinch's rosy breast and white wing-bars, the drake's green head and white
// collar, the hen's comb and her tail cocked up.

import { createGrid, fillBox, fillEllipsoid, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import type { BirdSpec } from '@voxel/engine/characters';
import { ROOK } from './rookVoxels';
import { BIRD_GESTURES } from './wildGestures';

type Size3 = [number, number, number];
const ROLES = ['back', 'backDark', 'breast', 'head', 'cap', 'cheek', 'beak', 'eye', 'leg', 'bar', 'comb'] as const;
type Colors = Record<(typeof ROLES)[number], number>;

interface Shape {
  body: Size3;
  head: Size3;
  wing: number; // its length
  leg: number; // its height
  bill?: boolean; // a duck's flat bill, not a seed-eater's cone
  tailUp?: boolean; // a hen's
  comb?: boolean;
  bib?: boolean; // a sparrow's
  collar?: boolean; // a drake's
  scale?: number;
}

function bird(colors: Colors, s: Shape): BirdSpec {
  const P = namedPalette(colors);
  const C = P.C;
  const [bw, bh, bl] = s.body;
  const [hw, hh, hl] = s.head;
  const body = (): VoxelGrid => {
    const g = createGrid(s.body);
    fillEllipsoid(g, [bw / 2, bh / 2, bl / 2 + 0.5], [bw / 2, bh / 2, bl / 2 - 0.5], (x, y, z) => (y >= bh / 2 ? ((x + z) % 3 === 0 ? C.backDark : C.back) : z >= bl / 2 ? C.breast : C.backDark));
    if (s.tailUp) fillBox(g, 1, bh - 3, 0, bw - 2, bh - 1, 1, (_x, y) => (y === bh - 1 ? C.backDark : C.back)); // the tail, cocked up
    else fillBox(g, 1, Math.floor(bh / 2), 0, bw - 2, Math.floor(bh / 2), 1, C.backDark); // the tail, out behind
    if (s.collar) fillBox(g, 0, bh - 2, bl - 2, bw - 1, bh - 2, bl - 1, C.bar);
    return g;
  };
  const head = (): VoxelGrid => {
    const g = createGrid([hw, hh, hl + 2]);
    fillEllipsoid(g, [hw / 2, hh / 2, hl / 2], [hw / 2, hh / 2, hl / 2], (_x, y, z) => (y >= hh - 1 ? C.cap : y <= 1 && z >= hl / 2 && s.bib ? C.cap : z >= hl / 2 && y < hh / 2 ? C.cheek : C.head));
    if (s.bib) fillBox(g, Math.floor(hw / 2) - 1, 0, hl - 1, Math.floor(hw / 2), 0, hl - 1, C.backDark); // the black bib
    setColor(g, 0, Math.floor(hh / 2), Math.floor(hl / 2), C.eye);
    setColor(g, hw - 1, Math.floor(hh / 2), Math.floor(hl / 2), C.eye);
    const m = Math.floor(hw / 2);
    if (s.bill) fillBox(g, m - 1, 1, hl, m, 1, hl + 1, C.beak); // the flat bill
    else setColor(g, m, Math.floor(hh / 2) - 1, hl, C.beak); // the cone
    if (s.comb) {
      fillBox(g, m, hh, 1, m, hh, hl - 1, C.comb); // the comb
      fillBox(g, m, 0, hl - 1, m, 0, hl - 1, C.comb); // the wattle
    }
    return g;
  };
  const wing = (): VoxelGrid => {
    const g = createGrid([1, 2, s.wing]);
    fillBox(g, 0, 0, 0, 0, 1, s.wing - 1, (_x, y, z) => (z === s.wing - 2 && y === 0 ? C.bar : y === 1 ? C.back : C.backDark));
    return g;
  };
  const leg = (): VoxelGrid => {
    const g = createGrid([1, s.leg, 2]);
    fillBox(g, 0, 0, 0, 0, s.leg - 1, 0, C.leg);
    setColor(g, 0, 0, 1, C.leg); // its toes forward
    return g;
  };
  return {
    palette: P.colors,
    body: { grid: body, pivot: [bw / 2, 0, bl / 2] },
    head: { grid: head, pivot: [hw / 2, 0, 1], at: [0, bh - 1, bl / 2 - 1] },
    wing: { grid: wing, pivot: [0, 1, s.wing], at: [bw / 2, bh - 1, bl / 2 - 1] },
    leg: { grid: leg, pivot: [0.5, s.leg - 0.5, 0.5], at: [Math.max(1, bw / 4), 0, 0], length: s.leg - 0.5 },
    height: bh + hh,
    shade: bw / 8,
    scale: s.scale,
    gestures: BIRD_GESTURES,
  };
}

const SONG: Shape = { body: [4, 4, 6], head: [3, 3, 3], wing: 5, leg: 2 };

export const SPARROW = bird({ back: 0x9a7350, backDark: 0x5e4430, breast: 0xcdc2ae, head: 0x8a6a4a, cap: 0x7a7670, cheek: 0xd8d0c0, beak: 0x2a2420, eye: 0x120e0c, leg: 0x9a7a6a, bar: 0xece4d4, comb: 0 }, { ...SONG, bib: true });
export const CHAFFINCH = bird({ back: 0x8a6a48, backDark: 0x4e3e2c, breast: 0xd0805e, head: 0xc8785a, cap: 0x6a7a8e, cheek: 0xd88a68, beak: 0x8a8a90, eye: 0x120e0c, leg: 0x8a7a6a, bar: 0xf2eee2, comb: 0 }, SONG);

const DUCK: Shape = { body: [6, 5, 10], head: [4, 4, 4], wing: 7, leg: 2, bill: true };
export const MALLARD_DRAKE = bird({ back: 0x8a867c, backDark: 0x5e5a52, breast: 0x7a4a32, head: 0x2f6b3a, cap: 0x3f8a4a, cheek: 0x2f6b3a, beak: 0xd8c24a, eye: 0x1c1a18, leg: 0xe08a3a, bar: 0xf1eee4, comb: 0 }, { ...DUCK, collar: true });
export const MALLARD_DUCK = bird({ back: 0x9a7048, backDark: 0x6a4c30, breast: 0xa88058, head: 0x8a6a48, cap: 0x5e4a34, cheek: 0xb08a62, beak: 0xc0803a, eye: 0x1c1a18, leg: 0xe08a3a, bar: 0x3a5aa8, comb: 0 }, DUCK);

const HEN: Shape = { body: [6, 6, 8], head: [3, 4, 3], wing: 6, leg: 4, tailUp: true, comb: true };
export const HEN_BROWN = bird({ back: 0xa0603a, backDark: 0x6e3e24, breast: 0xb8784a, head: 0xc08050, cap: 0xc08050, cheek: 0xc08050, beak: 0xd8b860, eye: 0x1a1210, leg: 0xd8b04a, bar: 0x6e3e24, comb: 0xc82a24 }, HEN);
export const HEN_WHITE = bird({ back: 0xf0ebe0, backDark: 0xd2cabc, breast: 0xf4f0e8, head: 0xf0ebe0, cap: 0xf0ebe0, cheek: 0xf0ebe0, beak: 0xd8b860, eye: 0x1a1210, leg: 0xd8b04a, bar: 0xd2cabc, comb: 0xc82a24 }, HEN);

// The common crow: the rook's shape, all black, its face feathered (no bald grey), a little smaller.
export const CROW: BirdSpec = {
  ...ROOK,
  palette: namedPalette({ feather: 0x1e1c22, sheen: 0x2a2e3a, featherDark: 0x100e12, nape: 0x1e1c22, face: 0x1e1c22, beak: 0x1a181c, beakLight: 0x3a383e, eye: 0x1a120c, leg: 0x1e1a1c }).colors,
  scale: 0.85,
  gestures: BIRD_GESTURES,
};
