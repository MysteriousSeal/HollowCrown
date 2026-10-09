// More of what the Vale's people carry (after kit.ts's): the Red Hen's ugly tools, a captive's chain, a chandler's
// candle, a beekeeper's skep, a posy. Each built along +Z from the grip. Who uses it: people/redHen.ts,
// people/tallowGreen.ts.

import { createGrid, fillBox } from '@voxel/engine/voxel';
import type { Held } from '@voxel/engine/characters';
import { K, W } from './kit';

// A butcher's cleaver: a short wrapped handle, a broad square blade, rust at its edge. (Brannoc's.)
export const cleaver: Held = {
  grid: () => {
    const g = createGrid([4, 1, 9]);
    fillBox(g, 1, 0, 0, 1, 0, 2, (_x, _y, z) => (z === 1 ? K.red : K.leatherDark));
    fillBox(g, 0, 0, 3, 3, 0, 8, (x, _y, z) => (x === 3 ? (z % 3 ? K.steel : K.leatherLight) : x === 0 ? K.steelDark : K.steelMid));
    return g;
  },
  grip: [1, 0.5, 1], turn: [0.5, 0, 0],
};
// A cudgel: a knotted length of oak, thicker at the end, an iron nail or two driven through.
export const club: Held = {
  grid: () => {
    const g = createGrid([3, 3, 10]);
    fillBox(g, 1, 1, 0, 1, 1, 9, (_x, _y, z) => (z <= 1 ? K.leatherDark : K.wood));
    fillBox(g, 0, 0, 6, 2, 2, 9, (x, y, z) => ((x + y + z) % 4 === 0 ? W.iron : (x + z) % 3 ? K.wood : K.woodDark));
    return g;
  },
  grip: [1, 1, 1], turn: [0.7, 0, 0],
};
// A woodsman's hatchet: an ash haft, the iron head bearded to one side.
export const hatchet: Held = {
  grid: () => {
    const g = createGrid([3, 1, 9]);
    fillBox(g, 1, 0, 0, 1, 0, 8, (_x, _y, z) => (z <= 1 ? K.leatherDark : K.wood));
    fillBox(g, 2, 0, 5, 2, 0, 8, (_x, _y, z) => (z === 8 || z === 5 ? W.iron : W.ironLight));
    return g;
  },
  grip: [1, 0.5, 1], turn: [0.6, 0, 0],
};
// An iron chain hanging from a manacle: links of iron, catching the light by turns.
export const chain: Held = {
  grid: () => {
    const g = createGrid([1, 1, 7]);
    fillBox(g, 0, 0, 0, 0, 0, 6, (_x, _y, z) => (z % 2 ? W.ironLight : W.iron));
    return g;
  },
  grip: [0.5, 0.5, 0], turn: [Math.PI / 2, 0, 0],
};
// A lit candle of the chandler's own tallow, held up.
export const candle: Held = {
  grid: () => {
    const g = createGrid([1, 1, 6]);
    fillBox(g, 0, 0, 0, 0, 0, 5, (_x, _y, z) => (z === 5 ? K.flame : z === 4 ? K.charcoal : W.wax));
    return g;
  },
  grip: [0.5, 0.5, 1], turn: [-Math.PI / 2, 0, 0],
};
// A straw skep, the bees' house, carried in the crook of the arm.
export const skep: Held = {
  grid: () => {
    const g = createGrid([5, 5, 5]);
    fillBox(g, 0, 0, 0, 4, 4, 4, (x, y, z) => (Math.hypot(x - 2, z - 2) <= 2.4 - y * 0.45 ? (y % 2 ? W.strawDark : W.straw) : 0));
    return g;
  },
  grip: [2, 1, 0], turn: [0, 0, 0],
};
// A posy of meadow flowers (for Elsa), the stems bound in string.
export const posy: Held = {
  grid: () => {
    const g = createGrid([3, 3, 6]);
    fillBox(g, 1, 1, 0, 1, 1, 3, (_x, _y, z) => (z === 1 ? W.string : W.herb));
    fillBox(g, 0, 0, 4, 2, 2, 5, (x, y, z) => ((x + y + z) % 3 === 0 ? W.kerchief : (x + y) % 2 ? W.flour : W.ochre));
    return g;
  },
  grip: [1, 1, 1], turn: [-1.0, 0, 0],
};
