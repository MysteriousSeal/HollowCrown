// The Vale's dressing, placed by hand: fences round the Cobbes' strips and the kitchen gardens, hay ricks in the hay
// meadows, and the landmarks' own things (the gibbet, the Nine Sisters, the Hanging Oak). Each piece is one of the
// environment's props (src/props), by kind: at a tile facing a way, or a fence run along a line of tile edges.
// Used by the props' placing (environment) and their obstacles.

import type { Point } from '@voxel/engine/world';
import { EAST, NORTH, SOUTH } from './kinds';

export type DressingKind = 'fence' | 'hay-rick' | 'gibbet' | 'standing-stone' | 'hanging-oak' | 'garden-bed' | 'barrow' | 'old-oak' | 'hive';

export interface Dressing {
  kind: DressingKind;
  note: string;
  at?: Point; // a thing's tile (a garden bed's middle, which can fall between tiles)
  radius?: number; // a barrow's, in tiles
  facing?: number; // radians, 0 toward +z
  line?: Point[]; // a fence's run, corner to corner, on tile edges (half tiles)
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
];
