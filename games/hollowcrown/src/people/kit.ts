// What the Vale's ordinary folk wear and carry, painted on the human body (@voxel/engine/characters) as the fighting
// people's gear is (creatures/peopleVoxels.ts): a warm cloth palette after the gear's (linen, undyed and dyed wools,
// an apron's white, the reeve's heron-grey, flour), garments that fit either build, and the few things in their hands.
// Who uses it: people/brindleford.ts and people/households.ts.
//
// The builds' parts, in voxels [x, y, z] (the front is high z): torso 9 x 9 x 5 (his) or 7 x 9 x 5 (hers), arm 3 or 2
// wide (the hand its bottom two rows, the elbow about row 5), leg 4 or 3 wide, 7 tall (the foot its bottom row).

import { noise3 } from '@voxel/engine/math';
import { box, createGrid, erase, fillBox, over, wrap, type Paint, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { BODY_COLOR_COUNT, C, GEAR_COLORS, GEAR_GLOW, K, MARCH, bodyColors, bodyPalette, cuff, type BodyLook, type FrameSpec, type Gait, type Held, type Joint } from '@voxel/engine/characters';

import { GESTURES } from './gestures';

export { C, K };

// ---- the cloth palette (after the body's colors and the gear's) ----

const CLOTH = {
  linen: 0xeee3c8, linenShade: 0xd7c8a4, linenDark: 0xb8a882, roll: 0xc9b78f, // shirts, coifs, shifts (a sleeve rolled)
  apron: 0xf3ecdc, apronHem: 0xd9cfb8, string: 0xbba987,
  wool: 0x6b4a33, woolDark: 0x553a28, woolLight: 0x8a6448, // undyed brown wool: breeches, skirts, coats
  wine: 0x7a2e2a, wineDark: 0x5e2220, // madder-dyed: a bodice, a weaver's stripe
  russet: 0x9a5a32, russetDark: 0x784422,
  ochre: 0xc0903e, ochreDark: 0x9a7030,
  moss: 0x5e6b3a, mossDark: 0x47512c,
  woad: 0x4e6a8a, woadDark: 0x3a5068,
  heron: 0x7f8c92, heronDark: 0x5e6a70, heronLight: 0xa4aeb2, // the Regency's grey-blue (the reeve, a levy coat)
  robe: 0x8c867c, robeDark: 0x6a655d, // a priest's undyed grey
  widow: 0x3a3436, widowLight: 0x4e4648, // mourning black, faded
  flour: 0xf4f1e8, flourDust: 0xdcd5c2,
  shawl: 0x8e4a5e, shawlDark: 0x6e3848, fringe: 0xd8b8a0,
  kerchief: 0xb5452e, kerchiefDark: 0x963625,
  straw: 0xd8b868, strawDark: 0xb09048,
  iron: 0x3e3e42, ironLight: 0x6a6a70, soot: 0x2e2a28,
  herb: 0x6a8a3a, milk: 0xf6f4ee,
  wax: 0xe8d8a8, honey: 0xd09a30, fur: 0x5a4636, bruise: 0x7a5a6a,
  mud: 0x5a4a38, mudLight: 0x7a6650, pewter: 0x9a9a92, wound: 0x5e1614, rust: 0x8a4a26, rustDark: 0x5e3018,
};
const NAMES = Object.keys(CLOTH) as Array<keyof typeof CLOTH>;
const FIRST = BODY_COLOR_COUNT + GEAR_COLORS.length + 1;
export const W = Object.fromEntries(NAMES.map((n, i) => [n, FIRST + i])) as Record<keyof typeof CLOTH, number>;
const COLORS = [...GEAR_COLORS, ...Object.values(CLOTH)];

// ---- a person: their look, dressed ----

// A part's size by build, so a garment fits his or hers: the torso's width, the arm's, the leg's.
export interface Fit { w: number; d: number; arm: number; leg: number }
const FITS: Record<BodyLook['build'], Fit> = { male: { w: 9, d: 5, arm: 3, leg: 4 }, female: { w: 7, d: 5, arm: 2, leg: 3 } };

type Painter = (g: VoxelGrid, o: Size, f: Fit, joint: Joint) => void;
export type Dress = Partial<Record<'head' | 'torso' | 'arm' | 'leg', Painter>>;
const part = (j: Joint) => (j.endsWith('Arm') ? 'arm' : j.endsWith('Leg') ? 'leg' : j) as keyof Dress;
export const right = (j: Joint) => j.startsWith('right');

export interface Folk {
  scale?: number; // a child's smaller
  gait?: Partial<Gait>; // bent with age, a sleeper's shuffle
  held?: FrameSpec['held'];
  swaps?: Parameters<typeof bodyColors>[1]; // the body's own colors changed (blue lips, clouded eyes)
  after?: Painter; // painted over everything at the end (flour, soot)
}

export function folk(look: BodyLook, dress: Dress, more: Folk = {}): FrameSpec {
  const fit = FITS[look.build];
  return {
    palette: bodyColors(bodyPalette(look), more.swaps ?? {}, COLORS),
    base: look,
    paint: (joint, g, o) => {
      dress[part(joint)]?.(g, o, fit, joint);
      more.after?.(g, o, fit, joint);
    },
    glows: GEAR_GLOW,
    gait: { ...MARCH, speed: 1.3, legSwing: 0.55, armSwing: 0.4, ...more.gait },
    scale: more.scale,
    held: more.held,
    gestures: GESTURES, // (scratching, stretching, leaning about: gestures.ts)
  };
}

// Bent with years: the back stooped, the head brought up to look ahead, a slow step.
export const OLD: Partial<Gait> = { lean: 0.3, speed: 0.9, legSwing: 0.35, armSwing: 0.15, bob: 0.006 };

// ---- garments (each paints one part; the torso's from row 0 at the hips to 8 at the shoulders) ----

// The torso covered from row `from` up.
export const body = (g: VoxelGrid, o: Size, at: Paint, from = 0) => over(g, o, (x, y, z) => (y >= from ? at(x, y, z) : 0));
// A skirt or a coat's tails from the hips down `rows` (at most 5): a ring one voxel out round the legs.
export function skirt(g: VoxelGrid, o: Size, f: Fit, rows: number, at: Paint): void {
  box(g, o, -1, -rows, -1, f.w, -1, f.d, (x, y, z) => (x === -1 || x === f.w || z === -1 || z === f.d ? at(x, y, z) : 0));
}
// An apron standing off the front, from the chest (row `top`, 0 for one tied at the waist) down `rows` below the hips.
export function apron(g: VoxelGrid, o: Size, f: Fit, top: number, rows: number, at: Paint): void {
  box(g, o, 1, -rows, f.d, f.w - 2, top, f.d, at);
  if (top >= 4) box(g, o, 2, top + 1, f.d - 1, 2, 8, f.d - 1, W.string); // the strap round the neck
  box(g, o, 0, 2, -1, f.w - 1, 2, -1, (x) => (x === Math.floor(f.w / 2) ? W.string : 0)); // tied behind
}
// A shawl round the shoulders, knotted in front, its point down the back.
export function shawl(g: VoxelGrid, o: Size, f: Fit, at: Paint, fringe = W.fringe): void {
  wrap(g, o, (_x, y) => (y >= 6 && y <= 9 ? at(_x, y, 0) : 0));
  const m = Math.floor(f.w / 2);
  box(g, o, m - 3, 2, -1, m + 3, 5, -1, (x, y) => (Math.abs(x - m) <= y - 2 ? (y === 2 ? fringe : at(x, y, -1)) : 0)); // the point
  box(g, o, m, 4, f.d, m, 5, f.d, fringe); // the knot
}
// A long skirt to the ankle: the ring over the thighs, the legs below it the skirt's colour.
export const longSkirtLeg = (g: VoxelGrid, o: Size, at: Paint, to = 1) => over(g, o, (x, y, z) => (y >= to ? at(x, y, z) : 0));
// Sleeves from row `from` (5: rolled to the elbow, the forearms bare), shoes or boots to row `top`.
export const sleeves = (g: VoxelGrid, o: Size, from: number, at: Paint) => over(g, o, (x, y, z) => (y >= from ? at(x, y, z) : 0));
export const shoes = (g: VoxelGrid, o: Size, top: number, at: Paint) => over(g, o, (x, y, z) => (y <= top ? at(x, y, z) : 0));
// Big forearms (a ferryman's, a smith's): a layer of skin round the forearm.
export const forearms = (g: VoxelGrid, o: Size) => cuff(g, o, 2, 4, (x, _y, z) => ((x + z) % 3 ? C.skin : C.skinShade));

// ---- on the head (11 x 11 x 11, the face at z 10; the crown row 10) ----

// A coif or a kerchief: over the crown and the back, down to the ears, the face open; a hem over the brow.
export function coif(g: VoxelGrid, o: Size, at: Paint, hem: number): void {
  wrap(g, o, (x, y, z) => (y >= 5 && z <= 8 ? at(x, y, z) : y === 11 ? at(x, y, z) : y >= 9 && z >= 9 ? (y === 9 ? hem : at(x, y, z)) : 0));
}
// A wide straw hat: a crown over the head, a brim all round it.
export function strawHat(g: VoxelGrid, o: Size): void {
  wrap(g, o, (_x, y) => (y >= 9 ? (y === 9 ? W.strawDark : W.straw) : 0));
  box(g, o, -2, 9, -2, 12, 9, 12, (x, _y, z) => (x <= -1 || x >= 11 || z <= -1 || z >= 11 ? ((x + z) % 4 ? W.straw : W.strawDark) : 0));
  box(g, o, 2, 12, 2, 8, 12, 8, (x, _y, z) => (x === 2 || x === 8 || z === 2 || z === 8 ? 0 : W.straw)); // its top
}
// A soft felt cap, close on the crown, a short brim to the front.
export function cap(g: VoxelGrid, o: Size, at: number, brim: number): void {
  wrap(g, o, (_x, y, z) => (y >= 8 && !(y === 8 && z >= 9) ? at : 0));
  box(g, o, 1, 8, 11, 9, 8, 11, brim);
}
// Hair gathered up (the body's own pieces are left off a dressed head): a bun at the back, or braids at the sides.
export const bun = (g: VoxelGrid, o: Size) => box(g, o, 3, 5, -2, 7, 8, -1, (x, y, z) => (z === -2 && (x === 3 || x === 7 || y === 5 || y === 8) ? 0 : (x + y) % 3 ? C.hair : C.hairDark));
export function braids(g: VoxelGrid, o: Size): void {
  for (const x of [-1, 11]) box(g, o, x, 0, 3, x, 6, 4, (_x, y) => (y === 0 ? W.string : y % 2 ? C.hair : C.hairLight));
}
// Flour or soot dusted over cloth (`dust`) and skin and hair (`dark`), `share` of it, never on the eyes.
export const dusted = (dust: number, dark: number, share: number, salt: number): Painter => (g, o) =>
  over(g, o, (x, y, z, c) => (c === C.eye || c === C.glint ? 0 : noise3(x, y, z, salt) < share ? (c <= C.glint ? dark : dust) : 0));
// No hand (the right taken off at the wrist), the stump bound in rag.
export function stump(g: VoxelGrid, o: Size, f: Fit): void {
  erase(g, o, -1, -1, -1, f.arm, 1, f.arm);
  box(g, o, 0, 2, 0, f.arm - 1, 2, f.arm - 1, K.rag);
}

// ---- what they carry (each built along +Z from the grip; turned down at the side, or upright) ----

const UPRIGHT: [number, number, number] = [-1.4, 0, 0];

// A smith's hammer: an ash haft, an iron head across its end.
export const hammer: Held = {
  grid: () => {
    const g = createGrid([3, 1, 9]);
    fillBox(g, 1, 0, 0, 1, 0, 6, (_x, _y, z) => (z <= 1 ? K.leatherDark : K.wood));
    fillBox(g, 0, 0, 7, 2, 0, 8, (x) => (x === 1 ? W.ironLight : W.iron));
    return g;
  },
  grip: [1, 0.5, 1], turn: [0.6, 0, 0],
};
// A cook's ladle: a long handle, a round bowl.
export const ladle: Held = {
  grid: () => {
    const g = createGrid([3, 2, 8]);
    fillBox(g, 1, 1, 0, 1, 1, 5, K.wood);
    fillBox(g, 0, 0, 5, 2, 1, 7, (_x, y) => (y === 1 ? K.woodDark : K.wood));
    return g;
  },
  grip: [1, 1, 1], turn: [0.45, 0, 0],
};
// A ledger under the hand: leather boards, the pages' edge showing.
export const ledger: Held = {
  grid: () => {
    const g = createGrid([2, 6, 5]);
    fillBox(g, 0, 0, 0, 1, 5, 4, (x, y, z) => (z === 4 || y === 0 ? (x === 0 && y > 0 ? W.apron : K.leatherDark) : K.leather));
    return g;
  },
  grip: [1, 3, 2], turn: [0, 0, 0],
};
// A small brass lantern hung from its ring, a flame in it.
export const lantern: Held = {
  grid: () => {
    const g = createGrid([3, 3, 5]);
    fillBox(g, 1, 1, 0, 1, 1, 0, K.brassDark);
    fillBox(g, 0, 0, 1, 2, 2, 4, (x, y, z) => (z === 1 || z === 4 ? K.brassDark : x === 1 || y === 1 ? K.flame : K.brass));
    return g;
  },
  grip: [1, 1, 0], turn: [Math.PI / 2, 0, 0],
};
// A cup (of milk, set on the sill each night).
export const cup: Held = {
  grid: () => {
    const g = createGrid([2, 2, 3]);
    fillBox(g, 0, 0, 0, 1, 1, 2, (_x, _y, z) => (z === 2 ? W.milk : K.woodDark));
    return g;
  },
  grip: [1, 1, 1], turn: [-Math.PI / 2, 0, 0],
};
// An eel trap: a wicker cone, its mouth to the front.
export const eelTrap: Held = {
  grid: () => {
    const g = createGrid([5, 5, 10]);
    fillBox(g, 0, 0, 0, 4, 4, 9, (x, y, z) => {
      const r = 2.6 - z * 0.16;
      return Math.hypot(x - 2, y - 2) <= r && Math.hypot(x - 2, y - 2) > r - 1.2 ? ((x + y + z) % 2 ? W.strawDark : K.wood) : 0;
    });
    return g;
  },
  grip: [2, 4, 4], turn: [0, 0, 0],
};
// A staff or a stick, upright, its foot at the ground; `top`: a crook, a fork, or nothing.
export function staff(length: number, top: 'plain' | 'crook' | 'fork' = 'plain', grip = 5): Held {
  return {
    grid: () => {
      const g = createGrid([5, 1, length + 3]);
      fillBox(g, 2, 0, 0, 2, 0, length - 1, (_x, _y, z) => (z % 5 === 0 ? K.woodDark : K.wood));
      if (top === 'crook') fillBox(g, 2, 0, length, 4, 0, length + 1, (x, _y, z) => (z === length + 1 || x === 4 ? K.wood : 0)); // the hook
      if (top === 'fork') fillBox(g, 0, 0, length - 1, 4, 0, length + 2, (x, _y, z) => (z === length - 1 ? K.woodDark : x % 2 === 0 ? W.iron : 0)); // three tines
      return g;
    },
    grip: [2, 0.5, grip], turn: UPRIGHT,
  };
}
