// The first walk (docs/story/main-quest-1.md, MQ01 "Waking", "The road east"): the Pilgrim's Shrine to Brindleford's
// ford, the most hand-made stretch of the game. The shrine in its clearing on worn flagstones, the rockslide that
// closed the west pass behind it, a brook under the road, a shepherd's hut and its pasture on a low rise to the north,
// the robbery's leavings on the road, lone trees and thickets, and the Birchwood close on the south. Its land and
// surfaces here; its props in FIRST_WALK_DRESSING (dressing.ts adds them). Used by the map and the props' placing.

import type { PlaceData, Point } from '@voxel/engine/world';
import { EAST, SOUTH, WEST, type BuildingProps, type ValePart } from './kinds';
import type { Dressing } from './dressing';

// The rockslide: the west pass's mouth, filled from the crags to the Birchwood. Not walked over.
const ROCKSLIDE: Point[] = [[300, 3300], [420, 3305], [455, 3335], [464, 3365], [466, 3392], [455, 3420], [420, 3455], [300, 3462]];
const ROCKSLIDE_FOOT: Point[] = [[300, 3290], [428, 3296], [462, 3332], [471, 3365], [472, 3394], [462, 3426], [425, 3465], [300, 3472]];

// The Shrine Brook: down off the rise north of the road, under it, into the Birchwood to a pool. Two wide, too deep
// to wade but for the culvert where the road crosses.
const BROOK: Point[] = [[596, 3150], [604, 3240], [606, 3300], [612, 3340], [618, 3369], [630, 3400], [646, 3440], [660, 3468]];
const BROOK_CROSSING: Point[] = [[608, 3370], [628, 3370]]; // the Pilgrim Road again, over the culvert

// The shepherd's hut on Shrine Rise, its path down to the road, its pasture fenced round it.
const SHRINE_RISE = { polygon: [[530, 3292], [560, 3284], [592, 3292], [598, 3318], [586, 3340], [556, 3346], [530, 3336], [522, 3312]] as Point[] };
const HUT_PATH: Point[] = [[560, 3305], [561, 3335], [562, 3369]];
export const SHRINE_PASTURE: [number, number, number, number] = [540, 3295, 580, 3335];

export const FIRST_WALK: ValePart = {
  land: [
    { note: 'the rockslide, its foot', shape: { polygon: ROCKSLIDE_FOOT }, tier: 2 },
    { note: 'the rockslide', shape: { polygon: ROCKSLIDE }, tier: 4 },
    { note: 'Shrine Rise, a low swell north of the road', shape: SHRINE_RISE, tier: 2 },
    { note: 'the Shrine Brook', shape: { line: BROOK, width: 2 }, tier: 0 },
    { note: 'the Shrine Brook, its culvert', shape: { line: BROOK_CROSSING, width: 3 }, tier: 1 },
  ],
  surfaces: [
    { note: 'the rockslide', shape: { polygon: ROCKSLIDE }, surface: 'rock' },
    { note: 'the Shrine Brook', shape: { line: BROOK, width: 2 }, surface: 'river' },
    { note: 'the Shrine Brook, its pool', shape: { circle: [662, 3472, 4] }, surface: 'water' },
    { note: 'the Pilgrim Road, over the culvert', shape: { line: BROOK_CROSSING, width: 2 }, surface: 'road' },
    { note: "the shepherd's path down Shrine Rise", shape: { line: HUT_PATH, width: 1.5 }, surface: 'path' },
  ],
  areas: [
    // Thickets: blackthorn and birch scrub round the shrine's clearing, and by the brook.
    { id: 'shrine-thicket-north', kind: 'forest', name: "The shrine's thicket, north", shape: { polygon: [[470, 3348], [500, 3352], [498, 3364], [474, 3366]] }, props: { trees: ['birch'] } },
    { id: 'shrine-thicket-south', kind: 'forest', name: "The shrine's thicket, south", shape: { polygon: [[472, 3394], [498, 3392], [502, 3408], [476, 3412]] }, props: { trees: ['birch', 'oak'] } },
    { id: 'brook-thicket', kind: 'forest', name: 'The brook thicket', shape: { polygon: [[588, 3342], [604, 3338], [608, 3360], [590, 3362]] }, props: { trees: ['birch'] } },
    { id: 'shrine-pasture', kind: 'pasture', name: 'Shrine Rise pasture', shape: { rect: SHRINE_PASTURE } },
  ],
  places: [
    building('shrine-rise-hut', "The Shrine Rise shepherd's hut", [560, 3304], SOUTH, { size: [3, 2], floors: 1, roof: 'thatch', walls: 'wattle', use: 'house', residents: [] }),
  ],
};

function building(id: string, name: string, at: Point, facing: number, props: BuildingProps): PlaceData & { kind: 'building' } {
  return { id, kind: 'building', name, at, facing, props };
}

// The props along the walk, by the environment's kinds.
export const FIRST_WALK_DRESSING: Dressing[] = [
  // The shrine's clearing: a small apron of worn flagstones before the post.
  { kind: 'flagstones', note: "the Pilgrim's Shrine's flagstones", at: [480, 3380], rect: [479, 3379, 481, 3381] },
  { kind: 'rockslide', note: 'the rockslide across the west pass', at: [462, 3380], radius: 8, facing: EAST },
  // The robbery's leavings, a little east of the shrine: the cart in the ditch, the pilgrims' things strewn.
  { kind: 'handcart', note: "an overturned handcart, the Red Hen's leavings", at: [566, 3378], facing: WEST },
  { kind: 'belongings', note: "a pilgrim's things in the grass: a bowl, a shoe, a torn bundle", at: [561, 3377], radius: 3 },
  { kind: 'belongings', note: 'more of them, flung toward the wood', at: [572, 3381], radius: 2 },
  // A milestone, worn: BRINDLEFORD II, the Regent's heron chiselled over an older crown.
  { kind: 'milestone', note: 'a milestone: Brindleford two miles', at: [588, 3368], facing: SOUTH },
  // The culvert where the road crosses the brook.
  { kind: 'footbridge', note: 'the culvert under the Pilgrim Road', at: [618, 3370], facing: EAST },
  // Lone trees along the road.
  { kind: 'lone-tree', note: 'a lone oak by the shrine', at: [508, 3360], species: 'oak' },
  { kind: 'lone-tree', note: 'a birch at the Birchwood\'s edge', at: [596, 3390], species: 'birch' },
  { kind: 'lone-tree', note: 'an oak shading the road', at: [676, 3352], species: 'oak' },
  { kind: 'lone-tree', note: 'a birch by the gibbet', at: [712, 3388], species: 'birch' },
  { kind: 'lone-tree', note: 'an oak on the hay meadows\' edge', at: [762, 3344], species: 'oak' },
  // Thickets: dense bushes by the road.
  { kind: 'thicket', note: 'bramble under the lone oak', at: [512, 3364], radius: 2 },
  { kind: 'thicket', note: 'hawthorn by the milestone', at: [584, 3364], radius: 2 },
  { kind: 'thicket', note: 'bramble round the gibbet\'s foot', at: [703, 3384], radius: 2 },
  { kind: 'thicket', note: 'elder by the road before the ford', at: [826, 3360], radius: 2 },
];
