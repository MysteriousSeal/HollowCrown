// The Vale's dressing, placed by hand: fences round the Cobbes' strips and the kitchen gardens, hay ricks in the hay
// meadows, and the landmarks' own things (the gibbet, the Nine Sisters, the Hanging Oak). Each piece is one of the
// environment's props (src/props), by kind: at a tile facing a way, or a fence run along a line of tile edges.
// Used by the props' placing (environment) and their obstacles.

import type { Point } from '@voxel/engine/world';
import { FIRST_WALK_DRESSING, SHRINE_PASTURE } from './firstWalk';
import { EAST, NORTH, SOUTH } from './kinds';
import { WILD_PROPS } from './wildProps';

export type DressingKind = 'fence' | 'hay-rick' | 'gibbet' | 'standing-stone' | 'hanging-oak' | 'garden-bed' | 'barrow' | 'old-oak' | 'hive' | 'hedge'
  | 'flagstones' | 'rockslide' | 'milestone' | 'handcart' | 'belongings' | 'thicket' | 'lone-tree' | 'footbridge'
  | 'body' | 'childs-shoe' | 'cellar-hatch' | 'wolf-den' | 'notice' | 'hermit-fire';

export interface Dressing {
  kind: DressingKind;
  note: string;
  at?: Point; // a thing's tile (a garden bed's middle, which can fall between tiles)
  radius?: number; // a barrow's, a thicket's, a scatter's, in tiles
  rect?: [number, number, number, number]; // flagstones' extent, tiles [x0, z0, x1, z1]
  species?: 'oak' | 'birch' | 'pine'; // a lone tree's
  pose?: 'dying' | 'dead' | 'hanged' | 'drowned'; // a body's
  facing?: number; // radians, 0 toward +z
  line?: Point[]; // a fence's run, corner to corner, on tile edges (half tiles); a hedge's, point to point
}

// A fence round a rect of tiles [x0, z0, x1, z1], on its outer edges, its runs broken where `open` says: a side left
// open ('north' | 'south' | 'east' | 'west'), or a gate (a gap of `gate` tiles in the middle of that side).
type Side = 'north' | 'south' | 'east' | 'west';
function fenceRound(note: string, [x0, z0, x1, z1]: [number, number, number, number], open: Side, gate = 0): Dressing[] {
  const [a, b, c, d] = [x0 - 0.5, z0 - 0.5, x1 + 0.5, z1 + 0.5];
  const sides: Record<Side, [Point, Point]> = { north: [[a, b], [c, b]], east: [[c, b], [c, d]], south: [[c, d], [a, d]], west: [[a, d], [a, b]] };
  const runs: Point[][] = [];
  for (const side of ['north', 'east', 'south', 'west'] as const) {
    const [p, q] = sides[side];
    if (side !== open) runs.push([p, q]);
    else if (gate > 0) {
      const [mx, mz] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const [ux, uz] = [Math.sign(q[0] - p[0]), Math.sign(q[1] - p[1])];
      runs.push([p, [mx - (ux * gate) / 2, mz - (uz * gate) / 2]], [[mx + (ux * gate) / 2, mz + (uz * gate) / 2], q]);
    }
  }
  return runs.map((line) => ({ kind: 'fence' as const, note, line }));
}

// The kitchen gardens (as brindleford.ts draws them, [x0, z0, x1, z1]), each fenced but on its cottage's side.
type Rect = [number, number, number, number];
const GARDENS: Array<{ note: string; rect: Rect; open: Side; gate?: number }> = [
  ...([[917, 3340, 920, 3343], [923, 3339, 926, 3343], [929, 3339, 932, 3343], [935, 3339, 938, 3343]] as Rect[]).map((rect) => ({ note: 'a kitchen garden, East Lane north', rect, open: 'south' as const })),
  ...([[921, 3361, 924, 3366], [927, 3361, 930, 3366], [933, 3361, 936, 3366]] as Rect[]).map((rect) => ({ note: 'a kitchen garden, East Lane south', rect, open: 'north' as const })),
  ...([[850, 3335, 854, 3339], [850, 3342, 854, 3346], [850, 3358, 854, 3362]] as Rect[]).map((rect) => ({ note: 'a kitchen garden, across the ford', rect, open: 'east' as const })),
  { note: "the Cobbes' kitchen garden", rect: [942, 3419, 946, 3425], open: 'east', gate: 2 },
];

// A garden's beds: 3 tiles along their rows (east-west), 2 across, a tile's walk between, as many as it holds.
function bedsOf([x0, z0, x1, z1]: Rect, note: string): Dressing[] {
  const x = x0 + Math.floor((x1 - x0 + 1 - 3) / 2) + 1; // a 3-wide bed's middle column, centred
  const beds: Dressing[] = [];
  for (let z = z0; z + 1 <= z1; z += 3) beds.push({ kind: 'garden-bed', note: `a bed in ${note}`, at: [x, z + 0.5], facing: SOUTH });
  return beds;
}

// Hay ricks: the hay's in (Hob Cobbe says), stacked out in the meadows round the village.
const HAY_RICKS: Point[] = [[798, 3318], [810, 3326], [786, 3404], [1022, 3304], [1012, 3378], [962, 3300], [832, 3462], [1028, 3398]];

// The Nine Sisters: nine stones in a ring round (750, 3050), a gap to the south where the tenth fell.
const SISTERS: Point[] = Array.from({ length: 9 }, (_, i) => {
  const a = Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 10; // ten places round, the south one empty
  return [Math.round(750 + 7 * Math.cos(a)), Math.round(3050 + 7 * Math.sin(a))] as Point;
});

// Hedgerows along the roads, a few tiles off them, either side, broken where a track or a gate comes through: a run
// from `a` to `b` along the road, `off` tiles to its left (+) or right (-) as you walk from a to b.
function hedge(note: string, a: Point, b: Point, off: number): Dressing {
  const [dx, dz] = [b[0] - a[0], b[1] - a[1]];
  const length = Math.hypot(dx, dz);
  const [nx, nz] = [dz / length, -dx / length]; // (to the left, walking a to b, x east and z south)
  const shift = (p: Point): Point => [Math.round((p[0] + nx * off) * 2) / 2, Math.round((p[1] + nz * off) * 2) / 2];
  return { kind: 'hedge', note, line: [shift(a), shift(b)] };
}

const HEDGES: Dressing[] = [
  // The Pilgrim Road, the shrine to the ford: hawthorn both sides, broken at the gibbet and the hay meadows' gate.
  hedge('the Pilgrim Road, north side, past the shrine', [505, 3379], [548, 3375], 4),
  hedge("the Pilgrim Road, north side, past the Wyke farm's gate", [650, 3366], [680, 3364], 4),
  hedge('the Pilgrim Road, south side, past the shrine', [505, 3379], [550, 3375], -4), // (then the Birchwood's edge)
  hedge('the Pilgrim Road, north side, to the ford', [720, 3361], [840, 3352], 4),
  hedge('the Pilgrim Road, south side, to the ford', [720, 3361], [850, 3351], -4),
  // The Pilgrim Road, up past Chapel Hill to Tallow Green: one side only.
  hedge('the Pilgrim Road, south-east side, below Chapel Hill (the Chapel Path runs the other)', [1010, 3268], [1060, 3214], -4),
  hedge('the Pilgrim Road, west side, toward Tallow Green', [1120, 3150], [1185, 3082], 4),
  // The Pilgrim Road, east of Tallow Green, toward Hob's Tower.
  hedge('the Pilgrim Road, south side, past the clover meadow', [1230, 3035], [1310, 3013], -4),
  // The South Road, the Hanging Oak to the Boundary Stone: both sides, broken where the shepherds' track crosses.
  hedge('the South Road, north side, toward the Stone', [1050, 3475], [1190, 3461], 4),
  hedge('the South Road, south side, toward the Stone', [1060, 3474], [1190, 3461], -4),
  hedge('the South Road, north side, under Mosshill', [1210, 3460], [1430, 3451], 4),
];

export const DRESSING: Dressing[] = [
  // The Cobbes' strips (brindleford.ts), open on the east to the fallow end and the shepherds' track.
  ...fenceRound("the Cobbes' fields", [929, 3434, 977, 3471], 'east'),
  ...GARDENS.flatMap(({ note, rect, open, gate }) => [...fenceRound(note, rect, open, gate), ...bedsOf(rect, note)]),
  ...HAY_RICKS.map((at, i): Dressing => ({ kind: 'hay-rick', note: 'a hay rick, the hay meadows', at, facing: [SOUTH, EAST][i % 2] })),
  // The Pilgrim Road's gibbet: an empty cage, turning; the Red Hen's feathers tied to it.
  { kind: 'gibbet', note: "the Pilgrim Road's gibbet", at: [700, 3380], facing: NORTH },
  ...SISTERS.map((at): Dressing => ({ kind: 'standing-stone', note: 'one of the Nine Sisters', at })),
  // The mound inside the ring, dug into on its south side, toward the gap (SQ-BV3).
  { kind: 'barrow', note: "the Nine Sisters' barrow", at: [750, 3050], radius: 3, facing: SOUTH },
  // Tallow Green (tallowGreen.ts): the old oak on its green, and Agna Bee's skeps in a row on their clearing's edge.
  { kind: 'old-oak', note: 'the old oak on Tallow Green', at: [1200, 3046], facing: SOUTH },
  ...[1176, 1178, 1180, 1182, 1184].map((x): Dressing => ({ kind: 'hive', note: "one of Agna Bee's skeps", at: [x, 2999], facing: SOUTH })),
  // The Hanging Oak, where the South Road bends: its hollow (MQ03's note), Jory's Wednesdays. A step off the road.
  { kind: 'hanging-oak', note: 'the Hanging Oak', at: [997, 3485], facing: EAST },
  ...HEDGES,
  // The first walk's own (firstWalk.ts), and the Shrine Rise pasture's fence, its gate on the hut's path.
  ...FIRST_WALK_DRESSING,
  ...WILD_PROPS, // (the wild side quests')
  ...fenceRound('Shrine Rise pasture', SHRINE_PASTURE, 'south', 3),
];
