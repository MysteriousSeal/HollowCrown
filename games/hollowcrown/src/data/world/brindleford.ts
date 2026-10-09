// Brindleford (docs/story/regions/brindle-vale.md, "Brindleford"): the first village, either side of the Brindle's ford.
// The square and its well on the east bank, the inn and the shrine-house on its north side, the smithy and the reeve on
// its south; the East Lane's seven houses; three poorer houses across the ford; the mill up Mill Lane; the Cobbes'
// farm down the South Road. Each building: who lives or works there, and what uses it (quests, shops, routines).

import type { PlaceData, Point } from '@voxel/engine/world';
import { EAST, NORTH, SOUTH, WEST, type BuildingProps, type ValePart } from './kinds';

const MILL_LANE: Point[] = [[900, 3350], [882, 3300], [873, 3240]];
const EAST_LANE: Point[] = [[911, 3351], [944, 3354]];
const FARM_TRACK: Point[] = [[950, 3392], [950, 3417]];

type Building = PlaceData & { kind: 'building' };
const building = (id: string, name: string, at: Point, facing: number, props: BuildingProps): Building => ({ id, kind: 'building', name, at, facing, props });

// A cottage: one floor, thatched, timber-framed, 3x3 tiles.
const cottage = (residents: string[]): BuildingProps => ({ size: [3, 3], floors: 1, roof: 'thatch', walls: 'timber', use: 'house', residents });

export const BRINDLEFORD: ValePart = {
  surfaces: [
    { note: 'the square', shape: { circle: [905, 3350, 5] }, surface: 'road' },
    { note: 'Mill Lane', shape: { line: MILL_LANE, width: 2 }, surface: 'road' },
    { note: 'the East Lane', shape: { line: EAST_LANE, width: 2 }, surface: 'road' },
    { note: "the Cobbes' track", shape: { line: FARM_TRACK, width: 2 }, surface: 'track' },
  ],
  areas: [
    { id: 'cobbe-fields', kind: 'field', name: "The Cobbes' fields", shape: { rect: [930, 3434, 990, 3470] }, props: { crop: 'hay' } },
  ],
  places: [
    // The square. The well: MQ01's dawn (the village gathers there), SQ-BV1. The notice board: contracts, rumours.
    { id: 'brindleford-well', kind: 'fixture', name: "Brindleford's well", at: [900, 3350] },
    { id: 'brindleford-notices', kind: 'fixture', name: 'The notice board', at: [901, 3351] },

    // North of the square. The inn: food, ale, the hero's bed; Garrick (MQ01, MQ04, MQ11, SQ-BV8), Elsa (SQ-BV8).
    building('ferrymans-rest', "The Ferryman's Rest", [906, 3343], SOUTH, {
      size: [5, 4], floors: 2, roof: 'thatch', walls: 'timber', use: 'inn', residents: ['Garrick Fenn', 'Elsa Fenn'],
    }),
    // Father Cuthwin's: MQ02, SQ-BV4.
    building('shrine-house', 'The shrine-house', [892, 3343], SOUTH, {
      size: [3, 4], floors: 1, roof: 'slate', walls: 'stone', use: 'shrine', residents: ['Father Cuthwin'],
    }),

    // South of the square. Tobin's: gear levels 1-5, repairs; Wat sleeps in the loft (SQ-BV7).
    building('smithy', 'The smithy', [894, 3359], NORTH, {
      size: [4, 3], floors: 1, roof: 'shingle', walls: 'stone', use: 'smithy', residents: ['Tobin Harrow', 'Wat'],
    }),
    // The reeve's: two ledgers, the old archive (MQ02, MQ03, SQ-BV5); a grey heron over the door.
    building('reeves-house', "The reeve's house", [912, 3357], NORTH, {
      size: [4, 3], floors: 2, roof: 'slate', walls: 'timber', use: 'reeve', residents: ['Odo Pell'],
    }),

    // The East Lane, north side (doors on the lane). Nan Wicket's: potions, herbs, healing; Hesper's sickbed (MQ03).
    building('herbalists-cottage', "Nan Wicket's cottage", [918, 3346], SOUTH, { ...cottage(['Nan Wicket']), use: 'herbalist' }),
    // Old Meg on her doorstep: rumours; her sister rose from the pit (MQ01).
    building('megs-house', "Old Meg's house", [924, 3346], SOUTH, cottage(['Old Meg'])),
    building('reede-house', 'The Reedes\' house', [930, 3346], SOUTH, cottage(['Rolf Reede', 'Tamsin Reede'])),
    building('lusk-house', "Joan Lusk's house", [936, 3346], SOUTH, cottage(['Joan Lusk'])),

    // The East Lane, south side.
    building('tidy-house', 'The Tidys\' house', [922, 3359], NORTH, cottage(['Edric Tidy', 'Wynn Tidy'])),
    building('hask-house', "Sibyl Hask's house", [928, 3359], NORTH, cottage(['Sibyl Hask'])),
    building('orr-house', 'The Orrs\' house', [934, 3359], NORTH, cottage(['Gammer Orr', 'Simkin Orr'])),
    // Shuttered since the Wet Years; Kit gets in by the back; the reeve means to take it.
    building('holt-house', 'The Holt house', [940, 3359], NORTH, cottage([])),

    // Across the ford (the west bank), doors to the river.
    building('ferry-cottage', 'The old ferry cottage', [857, 3338], EAST, cottage(['Ned Tolley'])),
    building('fletcher-house', 'The Fletchers\' house', [857, 3344], EAST, cottage(['Alys Fletcher', 'Cob Fletcher'])),
    building('hollin-house', 'The Hollins\' house', [857, 3360], EAST, cottage(['Bran Hollin', 'Gert Hollin'])),

    // Up Mill Lane. Dunstan's and Jory's: SQ-BV1. The wheel on the river side.
    building('brindle-mill', 'Brindle Mill', [870, 3240], EAST, {
      size: [4, 4], floors: 2, roof: 'thatch', walls: 'stone', use: 'mill', residents: ['Dunstan', 'Jory'],
    }),

    // Down the South Road. The Cobbes': SQ-BV6. Kit sleeps in the barn (SQ-BV1, SQ-BV2).
    building('cobbe-farmhouse', 'The Cobbe farmhouse', [950, 3420], NORTH, {
      size: [4, 3], floors: 1, roof: 'thatch', walls: 'wattle', use: 'farmhouse', residents: ['Hob Cobbe', 'Ada Cobbe', 'Wenna'],
    }),
    building('cobbe-barn', "The Cobbes' barn", [960, 3428], WEST, {
      size: [6, 4], floors: 1, roof: 'thatch', walls: 'timber', use: 'barn', residents: ['Kit'],
    }),
  ],
};
