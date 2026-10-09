// Brindle Vale, the starting region (docs/story/regions/brindle-vale.md): its hills and river, its roads, woods and
// meadows, and its places, all where the region's bible draws them.

import type { Point } from '@voxel/engine/world';
import { NORTH, SOUTH, WEST, type ValePart } from './kinds';

// (Brindleford's own lanes and buildings: brindleford.ts.)

// The Brindle, from the falls to the marsh: shallow, 5 wide; waded at the ford (where the Pilgrim
// Road crosses it) and the Stepping Stones; its bed at tier 0, a gorge where it falls from the North Rise.
const BRINDLE: Point[] = [[880, 2950], [870, 3100], [865, 3240], [870, 3350], [840, 3600], [800, 3800]];

// (Through Tallow Green it runs up the green's east side: tallowGreen.ts.)
// The roads wind a little, as roads worn by feet and carts do: no long straight runs.
const PILGRIM_ROAD: Point[] = [
  [480, 3380], [518, 3378], [552, 3374], [590, 3370], [626, 3370], [662, 3365], [700, 3362], [742, 3359], [784, 3355], [826, 3353], [870, 3350],
  [900, 3350], [910, 3348], [914, 3340], [950, 3316], [1000, 3280], [1199, 3066], [1215, 3039], [1268, 3022], [1320, 3010], [1400, 3000],
  [1500, 2996], [1600, 3003], [1700, 2997], [1800, 3002], [1900, 3000],
];
const SOUTH_ROAD: Point[] = [[900, 3350], [902, 3366], [950, 3394], [1000, 3420], [1003, 3450], [1000, 3480], [1200, 3460], [1320, 3457], [1450, 3450]];
const CHAPEL_PATH: Point[] = [[1000, 3280], [1080, 3180]];
// A rise drawn round (cx, cz): its radius every eighth of a turn, east first, then round through south (+z), so a hill
// can lean and bulge where the bible needs it.
const ring = (cx: number, cz: number, radii: number[]): { polygon: Point[] } => ({
  polygon: radii.map((r, i) => [Math.round(cx + r * Math.cos((i * Math.PI) / 4)), Math.round(cz + r * Math.sin((i * Math.PI) / 4))] as Point),
});

// The meadows' and woods' low swells: one tier up, kept off every road and track.
const SWELLS: Array<{ note: string; shape: { polygon: Point[] } }> = [
  { note: 'a swell in the hay meadows, above Mill Lane', shape: ring(795, 3290, [24, 18, 14, 20, 26, 22, 16, 20]) },
  { note: 'a swell in the hay meadows, by the Birchwood', shape: ring(800, 3452, [16, 14, 20, 24, 18, 12, 14, 18]) },
  { note: 'a swell in the hay meadows, east of the village', shape: ring(1035, 3335, [12, 18, 22, 16, 14, 20, 24, 16]) },
  { note: 'a swell in the clover meadow, under the hives', shape: ring(1262, 3098, [18, 12, 10, 14, 20, 16, 12, 14]) },
  { note: 'a swell in Brindle Woods', shape: ring(1050, 3055, [20, 16, 22, 26, 18, 14, 18, 22]) },
  { note: 'a swell in the Birchwood', shape: ring(565, 3505, [26, 22, 18, 20, 28, 24, 20, 24]) },
  { note: 'a swell in the Birchwood, toward the Stepping Stones', shape: ring(700, 3650, [20, 16, 14, 22, 18, 14, 20, 24]) },
];

const SHEPHERDS_TRACK: Point[] = [[905, 3360], [1100, 3550], [1290, 3650]];

export const BRINDLE_VALE: ValePart = {
  land: [
    // The North Rise, stepping up to the vale's rim (the falls drop off it).
    { note: 'the North Rise', shape: { rect: [400, 2900, 1450, 3000] }, tier: 2 },
    { note: 'the North Rise', shape: { rect: [400, 2900, 1450, 2960] }, tier: 3 },
    { note: 'the North Rise', shape: { rect: [400, 2900, 1450, 2925] }, tier: 4 },
    ...SWELLS.map(({ note, shape }) => ({ note, shape, tier: 2 })),
    // Chapel Hill: a broad foot and the crown, leaning east, the famine pit on its shoulder. The Pilgrim Road crests it
    // beside the chapel.
    { note: 'Chapel Hill, its foot', shape: ring(1082, 3182, [80, 72, 66, 62, 64, 66, 70, 76]), tier: 2 },
    { note: 'Chapel Hill, its crown', shape: ring(1082, 3184, [40, 36, 30, 26, 28, 30, 32, 38]), tier: 3 },
    // Mosshill: gorse and rock rising to the east in four rings, Mossjaw Cave in the face of the third.
    { note: 'Mosshill', shape: { polygon: [[1150, 3540], [1210, 3505], [1330, 3492], [1451, 3490], [1451, 3800], [1190, 3800], [1150, 3700]] }, tier: 2 },
    { note: 'Mosshill', shape: { polygon: [[1200, 3570], [1260, 3535], [1360, 3520], [1451, 3520], [1451, 3775], [1230, 3770], [1195, 3690]] }, tier: 3 },
    { note: 'Mosshill', shape: { polygon: [[1305, 3600], [1330, 3565], [1400, 3550], [1451, 3555], [1451, 3750], [1340, 3745], [1305, 3690]] }, tier: 4 },
    { note: 'Mosshill', shape: { polygon: [[1355, 3610], [1400, 3590], [1451, 3600], [1451, 3715], [1400, 3720], [1360, 3680]] }, tier: 5 },
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
    { note: 'the Pilgrim Road', shape: { line: PILGRIM_ROAD, width: 2 }, surface: 'road' },
    { note: 'the South Road', shape: { line: SOUTH_ROAD, width: 2 }, surface: 'road' },
    { note: 'the Chapel Path', shape: { line: CHAPEL_PATH, width: 1.5 }, surface: 'track' },
    { note: "the shepherds' track", shape: { line: SHEPHERDS_TRACK, width: 1.5 }, surface: 'track' },
  ],
  areas: [
    { id: 'birchwood', kind: 'forest', name: 'The Birchwood', shape: { polygon: [[478, 3418], [505, 3398], [560, 3392], [640, 3392], [690, 3402], [725, 3410], [760, 3430], [800, 3700], [520, 3760], [455, 3470]] }, props: { trees: ['birch', 'oak'] } },
    { id: 'brindle-woods', kind: 'forest', name: 'Brindle Woods', shape: { polygon: [[950, 2950], [1350, 2960], [1300, 3010], [1235, 3022], [1192, 3020], [1192, 2992], [1168, 2992], [1166, 3018], [1100, 3060], [1000, 3120]] }, props: { trees: ['oak', 'birch'] } }, // (north of Tallow Green, a clearing for its hives)
    { id: 'mosshill-pines', kind: 'forest', name: 'Mosshill pines', shape: { polygon: [[1150, 3520], [1450, 3500], [1450, 3800], [1200, 3800]] }, props: { trees: ['pine'] } },
    { id: 'hay-meadows', kind: 'meadow', name: 'The hay meadows', shape: { rect: [750, 3250, 1050, 3500] } },
    { id: 'clover-meadow', kind: 'meadow', name: 'The clover meadow', shape: { rect: [1100, 2980, 1300, 3120] } },
    { id: 'southern-marsh', kind: 'wetland', name: 'The Southern Marsh', shape: { rect: [600, 3750, 1000, 3900] } },
  ],
  places: [
    { id: 'pilgrims-shrine', kind: 'landmark', name: "The Pilgrim's Shrine", at: [480, 3380], facing: Math.PI / 2 },
    { id: 'brindleford', kind: 'village', name: 'Brindleford', at: [900, 3350] },
    { id: 'tallow-green', kind: 'village', name: 'Tallow Green', at: [1200, 3050] },
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
