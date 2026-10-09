// Tallow Green (docs/story/regions/brindle-vale.md, "Tallow Green"): beekeepers and candle-makers round a triangular
// green with an old oak, the smell of wax. The Pilgrim Road runs up the green's east side; lanes run along its north
// and west sides; Agna Bee's hives stand up the slope to the north, at the wood's edge. Each building: who lives or
// works there (by the bible's names), and what uses it.

import type { PlaceData, Point } from '@voxel/engine/world';
import { EAST, SOUTH, WEST, type BuildingProps, type ValePart } from './kinds';

// The green's corners: north-west, north-east (where the road leaves), and south (where it comes in).
const GREEN: Point[] = [[1187, 3041], [1213, 3041], [1200, 3062]];
const NORTH_LANE: Point[] = [[1183, 3038], [1216, 3038]];
const WEST_LANE: Point[] = [[1183, 3038], [1198, 3066]];
const HIVE_PATH: Point[] = [[1184, 3036], [1181, 3003]];

type Building = PlaceData & { kind: 'building' };
const building = (id: string, name: string, at: Point, facing: number, props: BuildingProps): Building => ({ id, kind: 'building', name, at, facing, props });

// A cottage, as Brindleford's: one floor, thatched, timber-framed, 3x3 tiles.
const cottage = (residents: string[]): BuildingProps => ({ size: [3, 3], floors: 1, roof: 'thatch', walls: 'timber', use: 'house', residents });

// Footpaths, door to lane or road.
const FOOTPATHS: Point[][] = [
  [[1182, 3046], [1186, 3046]],
  [[1190, 3055], [1192, 3055]],
  [[1215, 3046], [1213, 3046]],
  [[1208, 3058], [1206, 3058]],
];

export const TALLOW_GREEN: ValePart = {
  surfaces: [
    ...FOOTPATHS.map((line) => ({ note: 'a Tallow Green footpath', shape: { line, width: 1.5 }, surface: 'path' as const })),
    { note: "the path up to Agna's hives", shape: { line: HIVE_PATH, width: 1.5 }, surface: 'path' },
    { note: "Tallow Green's north lane", shape: { line: NORTH_LANE, width: 2 }, surface: 'track' },
    { note: "Tallow Green's west lane", shape: { line: WEST_LANE, width: 2 }, surface: 'track' },
  ],
  areas: [
    { id: 'tallow-green-green', kind: 'green', name: "Tallow Green's green", shape: { polygon: GREEN } },
  ],
  places: [
    // The green. The old oak: Goody Thatch holds the village's moots under it.
    { id: 'tallow-green-oak', kind: 'landmark', name: 'The old oak', at: [1200, 3046] },
    // Agna Bee's hives (SQ-BV3): twelve skeps on a bench, at the edge of Brindle Woods.
    { id: 'agnas-hives', kind: 'landmark', name: "Agna Bee's hives", at: [1180, 3000] },

    // North of the green (doors on the north lane). Goody Thatch runs the village from her porch (SQ-BV3).
    building('bee-house', "Agna Bee's house", [1190, 3034], SOUTH, cottage(['Agna Bee', 'Little Brede'])),
    building('thatch-house', "Goody Thatch's house", [1198, 3034], SOUTH, { ...cottage(['Goody Thatch']), size: [5, 3] }),
    building('tg-house-north', 'A house on the green', [1205, 3034], SOUTH, cottage([])),
    // Osmund's and Hal's: candles, wax, tallow; a shop. Hal dug the barrow for a bride-price (SQ-BV3, SQ-BV8).
    building('chandlery', 'The chandlery', [1212, 3034], SOUTH, {
      size: [5, 3], floors: 2, roof: 'shingle', walls: 'timber', use: 'house', residents: ['Osmund Wicke', 'Hal Wicke'],
    }),

    // West of the green (doors to the west lane).
    building('tg-house-west', 'A house on the green', [1180, 3046], EAST, cottage([])),
    building('tg-house-southwest', 'A house on the green', [1188, 3055], EAST, cottage([])),

    // East of the green, across the road (doors to the road).
    building('tg-house-east', 'A house on the green', [1217, 3046], WEST, cottage([])),
    building('tg-house-southeast', 'A house on the green', [1210, 3058], WEST, cottage([])),
  ],
};
