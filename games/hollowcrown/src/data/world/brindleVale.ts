// Brindle Vale, the starting region (docs/story/regions/brindle-vale.md): its hills and river, its roads, woods and
// meadows, and its places, all where the region's bible draws them.

import type { Point } from '@voxel/engine/world';
import { NORTH, SOUTH, WEST, type ValePart } from './kinds';

// The Brindle, from the falls to the marsh: shallow, 5 wide; waded at the ford (where the Pilgrim
// Road crosses it) and the Stepping Stones; its bed at tier 0, a gorge where it falls from the North Rise.
const BRINDLE: Point[] = [[880, 2950], [870, 3100], [865, 3240], [870, 3350], [840, 3600], [800, 3800]];

const PILGRIM_ROAD: Point[] = [[480, 3380], [600, 3370], [870, 3350], [900, 3350], [1000, 3280], [1200, 3050], [1320, 3010], [1400, 3000], [1900, 3000]];
const SOUTH_ROAD: Point[] = [[900, 3350], [1000, 3420], [1000, 3480], [1200, 3460], [1450, 3450]];
const MILL_LANE: Point[] = [[900, 3350], [882, 3300], [878, 3240]];
const CHAPEL_PATH: Point[] = [[1000, 3280], [1080, 3180]];
const SHEPHERDS_TRACK: Point[] = [[905, 3360], [1100, 3550], [1290, 3650]];

export const BRINDLE_VALE: ValePart = {
  land: [
    // The North Rise, stepping up to the vale's rim (the falls drop off it).
    { note: 'the North Rise', shape: { rect: [400, 2900, 1450, 3000] }, tier: 2 },
    { note: 'the North Rise', shape: { rect: [400, 2900, 1450, 2960] }, tier: 3 },
    { note: 'the North Rise', shape: { rect: [400, 2900, 1450, 2925] }, tier: 4 },
    // Chapel Hill: the chapel on its crown, the famine pit on its east shoulder.
    { note: 'Chapel Hill', shape: { circle: [1080, 3180, 70] }, tier: 2 },
    { note: 'Chapel Hill', shape: { circle: [1080, 3180, 40] }, tier: 3 },
    // Mosshill: gorse and rock rising to the east, Mossjaw Cave in its west face.
    { note: 'Mosshill', shape: { rect: [1150, 3500, 1450, 3800] }, tier: 2 },
    { note: 'Mosshill', shape: { rect: [1190, 3540, 1450, 3770] }, tier: 3 },
    { note: 'Mosshill', shape: { rect: [1310, 3570, 1450, 3740] }, tier: 4 },
    { note: 'Mosshill', shape: { rect: [1360, 3600, 1450, 3710] }, tier: 5 },
    // The Brindle's bed, cut through it all.
    { note: 'the Brindle', shape: { line: BRINDLE, width: 5 }, tier: 0 },
    { note: 'the Southern Marsh', shape: { rect: [600, 3750, 1000, 3900] }, tier: 1 },
  ],
  surfaces: [
    { note: 'the Southern Marsh', shape: { rect: [600, 3750, 1000, 3900] }, surface: 'marsh' },
    { note: 'a marsh pool', shape: { circle: [700, 3820, 9] }, surface: 'water' },
    { note: 'a marsh pool', shape: { circle: [905, 3790, 7] }, surface: 'water' },
    { note: 'a marsh pool', shape: { circle: [960, 3860, 11] }, surface: 'water' },
    { note: 'the Brindle', shape: { line: BRINDLE, width: 5 }, surface: 'river' },
    { note: 'the ford', shape: { circle: [870, 3350, 6] }, surface: 'ford' },
    { note: 'the ledge behind Brindle Falls', shape: { line: [[877, 2950], [883, 2950]], width: 2 }, surface: 'ford' },
    { note: 'the Stepping Stones', shape: { line: [[835, 3620], [865, 3620]], width: 3 }, surface: 'ford' },
    { note: 'the Pilgrim Road', shape: { line: PILGRIM_ROAD, width: 3 }, surface: 'road' },
    { note: 'the South Road', shape: { line: SOUTH_ROAD, width: 3 }, surface: 'road' },
    { note: 'Mill Lane', shape: { line: MILL_LANE, width: 2 }, surface: 'road' },
    { note: 'the Chapel Path', shape: { line: CHAPEL_PATH, width: 2 }, surface: 'track' },
    { note: "the shepherds' track", shape: { line: SHEPHERDS_TRACK, width: 2 }, surface: 'track' },
    { note: 'the square', shape: { circle: [905, 3350, 9] }, surface: 'road' },
  ],
  areas: [
    { id: 'birchwood', kind: 'forest', name: 'The Birchwood', shape: { polygon: [[450, 3450], [760, 3430], [800, 3700], [520, 3760]] }, props: { trees: ['birch', 'oak'] } },
    { id: 'brindle-woods', kind: 'forest', name: 'Brindle Woods', shape: { polygon: [[950, 2950], [1350, 2960], [1300, 3100], [1000, 3120]] }, props: { trees: ['oak', 'birch'] } },
    { id: 'mosshill-pines', kind: 'forest', name: 'Mosshill pines', shape: { polygon: [[1150, 3520], [1450, 3500], [1450, 3800], [1200, 3800]] }, props: { trees: ['pine'] } },
    { id: 'hay-meadows', kind: 'meadow', name: 'The hay meadows', shape: { rect: [750, 3250, 1050, 3500] } },
    { id: 'clover-meadow', kind: 'meadow', name: 'The clover meadow', shape: { rect: [1100, 2980, 1300, 3120] } },
    { id: 'southern-marsh', kind: 'wetland', name: 'The Southern Marsh', shape: { rect: [600, 3750, 1000, 3900] } },
  ],
  places: [
    { id: 'pilgrims-shrine', kind: 'landmark', name: "The Pilgrim's Shrine", at: [480, 3380], facing: Math.PI / 2 },
    { id: 'brindleford', kind: 'village', name: 'Brindleford', at: [900, 3350] },
    { id: 'tallow-green', kind: 'village', name: 'Tallow Green', at: [1200, 3050] },
    { id: 'brindle-mill', kind: 'building', name: 'Brindle Mill', at: [870, 3240] },
    { id: 'quiet-bell-chapel', kind: 'ruin', name: 'The Chapel of the Quiet Bell', at: [1080, 3180] },
    { id: 'bellwardens-tomb', kind: 'crypt', name: "The Bellwarden's Tomb", at: [1080, 3180], facing: SOUTH },
    { id: 'famine-pit', kind: 'landmark', name: 'The famine pit', at: [1090, 3200] },
    { id: 'mossjaw-cave', kind: 'cave', name: 'Mossjaw Cave', at: [1300, 3650], facing: WEST },
    { id: 'red-hen-camp', kind: 'camp', name: 'The Red Hen camp', at: [620, 3560] },
    { id: 'hobs-tower', kind: 'ruin', name: "Hob's Tower", at: [1400, 3000] },
    { id: 'nine-sisters', kind: 'landmark', name: 'The Nine Sisters', at: [750, 3050] },
    { id: 'hanging-oak', kind: 'landmark', name: 'The Hanging Oak', at: [1000, 3480] },
    { id: 'brindle-falls', kind: 'landmark', name: 'Brindle Falls', at: [880, 2950], facing: NORTH },
    { id: 'stepping-stones', kind: 'landmark', name: 'The Stepping Stones', at: [850, 3620] },
    { id: 'marsh-cairn', kind: 'landmark', name: 'The Marsh Cairn', at: [760, 3830] },
    { id: 'boundary-stone', kind: 'landmark', name: 'The Old Boundary Stone', at: [1440, 3450] },
    { id: 'gibbet', kind: 'landmark', name: "The Pilgrim Road's gibbet", at: [700, 3380] },
  ],
};
