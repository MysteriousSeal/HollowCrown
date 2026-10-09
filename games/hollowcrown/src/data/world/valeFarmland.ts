// Brindle Vale's farmland between its places (docs/story/world.md, "The lie of the land": the in-between land has
// purpose): the villages' open fields in ploughed strips, grass balks between, and the lone farms and shepherds' huts
// out in the Vale. Drawn by hand, as Brindleford's and Tallow Green's own fields are.

import type { ValePart } from './kinds';

type Rect = [number, number, number, number];

// `n` strips running north-south, `wide` tiles each with a balk of one between, from x0 over [z0, z1].
const strips = (x0: number, z0: number, z1: number, n: number, wide = 6): Rect[] =>
  Array.from({ length: n }, (_, i) => [x0 + i * (wide + 1), z0, x0 + i * (wide + 1) + wide - 1, z1]);

// Brindleford's west fields: across the ford, south of the Pilgrim Road, between the hay meadows and the river.
const BRINDLEFORD_WEST: Rect[] = strips(815, 3375, 3410, 6);
// Tallow Green's strips: below the green, west of the Pilgrim Road, on the clover meadow's south-west corner.
const TALLOW_GREEN_STRIPS: Rect[] = strips(1115, 3068, 3100, 6);

export const VALE_FARMLAND: ValePart = {
  surfaces: [
    ...BRINDLEFORD_WEST.map((rect) => ({ note: "a strip of Brindleford's west fields", shape: { rect }, surface: 'field' as const })),
    ...TALLOW_GREEN_STRIPS.map((rect) => ({ note: "a strip of Tallow Green's fields", shape: { rect }, surface: 'field' as const })),
  ],
  areas: [
    { id: 'brindleford-west-fields', kind: 'field', name: "Brindleford's west fields", shape: { rect: [815, 3375, 855, 3410] }, props: { crop: 'barley' } },
    { id: 'tallow-green-strips', kind: 'field', name: "Tallow Green's strips", shape: { rect: [1115, 3068, 1155, 3100] }, props: { crop: 'oats' } },
  ],
};
