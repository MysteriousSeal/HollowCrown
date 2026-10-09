// Brindle Vale's farmland between its places (docs/story/world.md, "The lie of the land": the in-between land has
// purpose): the villages' open fields in ploughed strips, grass balks between, and the lone farms and shepherds' huts
// out in the Vale. Drawn by hand, as Brindleford's and Tallow Green's own fields are.

import type { PlaceData, Point } from '@voxel/engine/world';
import { SOUTH, WEST, type BuildingProps, type ValePart } from './kinds';

type Rect = [number, number, number, number];

// `n` strips running north-south, `wide` tiles each with a balk of one between, from x0 over [z0, z1].
const strips = (x0: number, z0: number, z1: number, n: number, wide = 6): Rect[] =>
  Array.from({ length: n }, (_, i) => [x0 + i * (wide + 1), z0, x0 + i * (wide + 1) + wide - 1, z1]);

// Brindleford's west fields: across the ford, south of the Pilgrim Road, between the hay meadows and the river.
const BRINDLEFORD_WEST: Rect[] = strips(815, 3375, 3410, 6);
// Tallow Green's strips: below the green, west of the Pilgrim Road, on the clover meadow's south-west corner.
const TALLOW_GREEN_STRIPS: Rect[] = strips(1115, 3068, 3100, 6);

type Building = PlaceData & { kind: 'building' };
const building = (id: string, name: string, at: Point, facing: number, props: BuildingProps): Building => ({ id, kind: 'building', name, at, facing, props });

// A shepherd's hut: one room, turf-roofed in all but name (thatch), 3 tiles by 2.
const hut = (): BuildingProps => ({ size: [3, 2], floors: 1, roof: 'thatch', walls: 'wattle', use: 'house', residents: [] });

// The Wyke farm, up off the Pilgrim Road: empty since the Wet Years. Its track has grassed over.
const WYKE_TRACK: Point[] = [[640, 3293], [641, 3363]];
// The North Rise hut's sheep-walk, down off the rise to the Nine Sisters.
const RISE_WALK: Point[] = [[600, 2977], [700, 3040], [735, 3046]];
// The Mosshill hut's path down to the shepherds' track.
const MOSSHILL_HUT_PATH: Point[] = [[1160, 3573], [1160, 3579]];

export const VALE_FARMLAND: ValePart = {
  surfaces: [
    ...BRINDLEFORD_WEST.map((rect) => ({ note: "a strip of Brindleford's west fields", shape: { rect }, surface: 'field' as const })),
    ...TALLOW_GREEN_STRIPS.map((rect) => ({ note: "a strip of Tallow Green's fields", shape: { rect }, surface: 'field' as const })),
    { note: "the Wyke farm's track, grassed over", shape: { line: WYKE_TRACK, width: 2 }, surface: 'track' },
    { note: "the Wyke farm's yard", shape: { circle: [644, 3294, 2.5] }, surface: 'path' },
    { note: "the Wyke farm's yard, to the barn door", shape: { line: [[645, 3292], [647, 3288]], width: 1.5 }, surface: 'path' },
    { note: "the North Rise sheep-walk", shape: { line: RISE_WALK, width: 1.5 }, surface: 'track' },
    { note: "the Mosshill hut's path", shape: { line: MOSSHILL_HUT_PATH, width: 1.5 }, surface: 'path' },
  ],
  areas: [
    { id: 'brindleford-west-fields', kind: 'field', name: "Brindleford's west fields", shape: { rect: [815, 3375, 855, 3410] }, props: { crop: 'barley' } },
    { id: 'tallow-green-strips', kind: 'field', name: "Tallow Green's strips", shape: { rect: [1115, 3068, 1155, 3100] }, props: { crop: 'oats' } },
    { id: 'wyke-fields', kind: 'field', name: "The Wyke farm's fields, gone to seed", shape: { rect: [620, 3300, 700, 3340] }, props: { crop: 'none' } },
  ],
  places: [
    // The Wyke farm: four of the Wykes are in the famine pit, against their names in Pell's old ledger (SQ-BV5).
    // Nobody's taken the land. Nobody will say why.
    { id: 'wyke-farm', kind: 'farm', name: 'The Wyke farm', at: [644, 3294] },
    building('wyke-farmhouse', 'The Wyke farmhouse', [640, 3290], SOUTH, { size: [5, 3], floors: 1, roof: 'thatch', walls: 'wattle', use: 'farmhouse', residents: [] }),
    building('wyke-barn', "The Wykes' barn", [650, 3288], WEST, { size: [5, 4], floors: 1, roof: 'thatch', walls: 'timber', use: 'barn', residents: [] }),
    // Shepherds' huts, for the summer grazing: Ned Tolley sleeps in either when he's droving and doesn't want the inn.
    building('north-rise-hut', "The North Rise shepherd's hut", [600, 2975], SOUTH, hut()),
    building('mosshill-hut', "The Mosshill shepherd's hut", [1160, 3572], SOUTH, hut()),
  ],
};
