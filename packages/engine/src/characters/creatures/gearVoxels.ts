// What people wear and carry, painted onto the human body in its padded grids (frameRig.ts, dress.ts): one gear
// palette for every faction (after the body's 15 colors), garments as painters over a part, headgear standing off the
// head, and the arms they hold (built along +Z from the grip). For the male build: torso 9 x 9 x 5 (its front z 4),
// arm 3 x 9 x 3 (the hand its bottom two rows), leg 4 x 7 x 5 (the foot its bottom row, the shin's front z 3),
// head 11 x 11 x 11 (the face at z 10).

import type { VoxelGrid } from '../../voxel/greedyMesh';
import { createGrid, fillBox, setColor } from '../../voxel/voxelShapes';
import { box, over, wrap } from './dress';
import { type Size } from './creatureMesh';

const COLORS = {
  leather: 0x6a4a30, leatherDark: 0x4a3220, leatherLight: 0x8a6a48,
  rag: 0x7a6a52, ragDark: 0x5a4c3a,
  red: 0xa8382a, redDark: 0x7a2820,
  mail: 0x8e9094, mailDark: 0x5e6066,
  steel: 0xc0c6ce, steelMid: 0x8e949c, steelDark: 0x5a6068,
  grey: 0x8a8a84, greyDark: 0x62625e, greyLight: 0xaeada6,
  white: 0xece9e0,
  padded: 0xc8b896, paddedDark: 0xa08e6c,
  green: 0x3e6a32, greenDark: 0x284622, greenLight: 0x5a8a44,
  charcoal: 0x262222,
  wood: 0x7a5a3a, woodDark: 0x52402a,
  brass: 0xd0a040, brassDark: 0x8a6a28, flame: 0xffd27a,
  blue: 0x2c4c8e, blueDark: 0x1c3266, black: 0x1e1e24, blackLight: 0x383842,
  plume: 0x6a8ad8, string: 0xd8ccb0, fletch: 0xe8e2d6,
};
const KEYS = Object.keys(COLORS) as Array<keyof typeof COLORS>;
export const GEAR_COLORS: number[] = Object.values(COLORS);
export const K = Object.fromEntries(KEYS.map((k, i) => [k, i + 16])) as Record<keyof typeof COLORS, number>; // (after the body's 15)
export const GEAR_GLOW: ReadonlySet<number> = new Set([K.flame]);

type At = (x: number, y: number, z: number) => number;
const solid = (c: number): At => () => c;

// ---- garments ----

// The torso covered (rows from..8), as `at` says: a shirt, a jerkin, a breastplate.
export const torsoCover = (g: VoxelGrid, o: Size, at: At, from = 0) => over(g, o, (x, y, z) => (y >= from ? at(x, y, z) : 0));

// A skirt from the hips down `rows` (a coat's tails, a tabard's): a hollow ring one voxel out round the legs.
// `at` sees the ring's cells (x -1..9, z -1..5): returning 0 for the sides leaves front and back panels.
export function skirt(g: VoxelGrid, o: Size, rows: number, at: At): void {
  box(g, o, -1, -rows, -1, 9, -1, 5, (x, y, z) => (x === -1 || x === 9 || z === -1 || z === 5 ? at(x, y, z) : 0));
}

export const sleeves = (g: VoxelGrid, o: Size, from: number, at: At) => over(g, o, (x, y, z) => (y >= from ? at(x, y, z) : 0));
export const gloves = (g: VoxelGrid, o: Size, at: At) => over(g, o, (x, y, z) => (y <= 1 ? at(x, y, z) : 0));
export const legCover = (g: VoxelGrid, o: Size, from: number, to: number, at: At) => over(g, o, (x, y, z) => (y >= from && y <= to ? at(x, y, z) : 0));
export const boots = (g: VoxelGrid, o: Size, top: number, at: At) => over(g, o, (x, y, z) => (y <= top ? at(x, y, z) : 0));
// A thicker cuff or boot-top: one voxel out round the limb, rows from..to.
export const cuff = (g: VoxelGrid, o: Size, from: number, to: number, at: At) => wrap(g, o, (x, y, z) => (y >= from && y <= to ? at(x, y, z) : 0));

// A hood: a layer over the crown, the back and the sides, down to the jaw, the face left open; a point at the back.
export function hood(g: VoxelGrid, o: Size, at: At): void {
  wrap(g, o, (x, y, z) => (y >= 1 && z <= 9 && !(z >= 8 && y <= 1) ? at(x, y, z) : y === 11 && z <= 10 ? at(x, y, z) : 0));
  box(g, o, 4, 9, -2, 6, 10, -2, at); // its point
  box(g, o, 5, 8, -3, 5, 9, -3, at);
}
// A hood's shadow on the brow: a rim over the face.
export const brow = (g: VoxelGrid, o: Size, at: At) => box(g, o, 1, 10, 11, 9, 11, 11, at);

// A cloak down the back from the shoulders, a layer behind the torso and its skirt (z -2).
export function cloak(g: VoxelGrid, o: Size, rows: number, at: At): void {
  box(g, o, -1, -rows, -2, 9, 9, -2, (x, y, z) => (y >= -rows + ((x * 7) % 3 === 0 ? 1 : 0) ? at(x, y, z) : 0));
  box(g, o, -1, 9, -1, 9, 9, 4, (x, y, z) => (x === -1 || x === 9 ? 0 : at(x, y, z))); // over the shoulders
}

// A kettle helm: a round cap over the crown, a wide brim standing out all round at the brow.
export function kettleHelm(g: VoxelGrid, o: Size): void {
  box(g, o, 0, 8, 0, 10, 11, 10, (x, y, z) => (y === 11 ? (x === 5 || z === 5 ? K.steelMid : K.steel) : x === 0 || x === 10 || z === 0 || z === 10 ? (y === 8 ? K.steelDark : K.steelMid) : 0));
  box(g, o, 1, 12, 1, 9, 12, 9, (x) => (x === 5 ? K.steel : K.steelMid));
  box(g, o, -2, 8, -2, 12, 8, 12, (x, _y, z) => (x <= -1 || x >= 11 || z <= -1 || z >= 11 ? (x + z) % 4 === 0 ? K.steelDark : K.steelMid : 0)); // the brim
}

// A sallet: a rounded helm down over the back of the neck in a tail, a visor down to the nose with a slit for the
// eyes; a plume on its crown.
export function sallet(g: VoxelGrid, o: Size, plume: number): void {
  wrap(g, o, (_x, y, z) => (y >= 3 && (z <= 9 || y >= 6) ? (y === 6 && z === 11 ? K.black : y >= 9 ? K.steel : K.steelMid) : 0));
  box(g, o, 1, 2, -2, 9, 4, -2, K.steelDark); // its tail, over the neck
  box(g, o, 5, 12, 2, 5, 14, 6, (_x, y, z) => (y === 14 || z === 2 ? plume : y === 12 ? K.steelDark : plume)); // the plume
  box(g, o, 5, 13, 0, 5, 13, 1, plume);
}

// A bascinet with its visor down: closed all over but a slit for the eyes, ridged down the middle, a mail aventail
// over the neck.
export function bascinet(g: VoxelGrid, o: Size): void {
  wrap(g, o, (x, y, z) => (y >= 1 ? (z === 11 && y === 6 ? K.black : x === 5 && y >= 7 ? K.steel : z === 11 && y <= 4 && x % 2 === 0 ? K.steelDark : K.steelMid) : 0));
  box(g, o, 5, 12, 2, 5, 12, 8, K.steel); // the ridge
  box(g, o, -1, -1, -1, 11, 0, 11, (x, y, z) => (x === -1 || x === 11 || z === -1 || z === 11 ? (x + y + z) % 2 ? K.mail : K.mailDark : 0)); // the aventail
}

// Plate on a limb: rows from..to shelled in steel (a layer out), banded at the joint.
export const plate = (g: VoxelGrid, o: Size, from: number, to: number, joint = -1) =>
  wrap(g, o, (_x, y) => (y >= from && y <= to ? (y === joint ? K.steelDark : y === to ? K.steel : K.steelMid) : 0));

export const mail = (x: number, y: number, z: number) => ((x + y + z) % 2 ? K.mail : K.mailDark);

// ---- what they carry (each built along +Z from its grip, unless upright) ----

// A spear or pike: a long ash haft, an iron head; `length` voxels long.
export function polearm(length: number, head: 'spear' | 'pike' | 'mace'): () => VoxelGrid {
  return () => {
    const g = createGrid([3, 3, length]);
    const tip = length - 1;
    fillBox(g, 1, 1, 0, 1, 1, head === 'mace' ? tip - 4 : tip - 6, (_x, _y, z) => (z % 6 === 0 ? K.woodDark : K.wood));
    if (head === 'mace') {
      fillBox(g, 0, 0, tip - 4, 2, 2, tip - 1, (x, y, z) => ((x + y + z) % 2 ? K.steelDark : K.steelMid)); // flanged
      fillBox(g, 1, 1, tip, 1, 1, tip, K.steel);
    } else if (head === 'spear') {
      fillBox(g, 1, 1, tip - 6, 1, 1, tip - 6, K.steelDark); // the socket
      for (let i = 0; i < 6; i++) { // a leaf blade: widest low, narrowing to its point
        const wide = i >= 1 && i <= 3;
        fillBox(g, wide ? 0 : 1, 1, tip - 5 + i, wide ? 2 : 1, 1, tip - 5 + i, i === 5 || !wide ? K.steelMid : K.steel);
      }
    } else {
      fillBox(g, 1, 1, tip - 5, 1, 1, tip, (_x, _y, z) => (z === tip ? K.steelMid : K.steel)); // a long square point
      fillBox(g, 1, 1, tip - 11, 1, 1, tip - 6, K.steelDark); // the langets, strapping it down the haft
    }
    return g;
  };
}

// A long knife (or a short sword): a wrapped grip, a little guard, the blade.
export function knife(blade: number): () => VoxelGrid {
  return () => {
    const g = createGrid([3, 1, blade + 4]);
    fillBox(g, 1, 0, 0, 1, 0, 2, K.leatherDark);
    fillBox(g, 0, 0, 3, 2, 0, 3, K.steelDark);
    fillBox(g, 1, 0, 4, 1, 0, blade + 3, K.steel);
    return g;
  };
}

// A round shield, its face toward +Z, its boss in the middle, a painted device by `device` (0: plain).
export function roundShield(field: number, rim: number, device: (x: number, y: number) => number = () => 0): () => VoxelGrid {
  return () => {
    const g = createGrid([11, 11, 2]);
    for (let x = 0; x < 11; x++) for (let y = 0; y < 11; y++) {
      const r = Math.hypot(x - 5, y - 5);
      if (r > 5.4) continue;
      setColor(g, x, y, 0, K.woodDark);
      setColor(g, x, y, 1, r > 4.4 ? rim : r < 1.2 ? K.steelMid : device(x, y) || field);
    }
    return g;
  };
}

// A bow, upright: the stave bowed forward (+Z), the string behind, a leather grip low.
export function longbow(height: number, wood: number): () => VoxelGrid {
  return () => {
    const g = createGrid([1, height, 5]);
    const mid = (height - 1) / 2;
    for (let y = 0; y < height; y++) setColor(g, 0, y, Math.round(3 * (1 - ((y - mid) / mid) ** 2)) + 1, Math.abs(y - mid + 2) < 2 ? K.leatherDark : wood);
    for (let y = 1; y < height - 1; y++) setColor(g, 0, y, 0, K.string);
    return g;
  };
}

// A crossbow (or a heavier arbalest), along +Z: the stock, the bow across its front, the string drawn back, a bolt.
export function crossbow(heavy: boolean): () => VoxelGrid {
  return () => {
    const span = heavy ? 6 : 5;
    const g = createGrid([span * 2 + 1, 3, 13]);
    fillBox(g, span, 0, 0, span, 1, 11, (_x, y, z) => (z < 4 ? K.woodDark : y === 1 ? K.wood : K.woodDark)); // the stock
    fillBox(g, 0, 1, 11, span * 2, 1, 11, (x) => (heavy ? (x === span ? K.steelDark : K.steelMid) : K.wood)); // the bow
    for (let x = 0; x <= span * 2; x++) setColor(g, x, 1, 11 - Math.round(Math.abs(x - span) * 0.6) - 1 - (x === 0 || x === span * 2 ? -1 : 0), x === span ? K.leatherDark : K.string);
    fillBox(g, span, 2, 5, span, 2, 12, K.steelDark); // the bolt, laid
    setColor(g, span, 2, 4, K.fletch);
    if (heavy) fillBox(g, span - 1, 0, 11, span + 1, 0, 12, K.steelDark); // its stirrup
    return g;
  };
}

// A brass lantern (worn on the breast, or carried), its flame lit behind horn panes.
export function lanternOnBreast(g: VoxelGrid, o: Size): void {
  box(g, o, 3, 3, 5, 5, 6, 5, (x, y) => (y === 6 || y === 3 ? K.brass : x === 4 ? K.flame : K.brassDark));
  box(g, o, 4, 4, 6, 4, 5, 6, K.flame);
  box(g, o, 4, 7, 5, 4, 7, 5, K.brassDark); // its ring
}

export const col = solid;
