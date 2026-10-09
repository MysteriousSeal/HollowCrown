// What lives in each region and what grows underfoot (docs/story/world.md, "The lie of the land": the land is alive
// everywhere): its wildlife (which kind, on what ground or in which area, at what hours, how thick), the places it
// falls quiet, and its ground cover (grass, flowers, bushes, stones), overridden per kind of area. Ambient only: it
// scatters from the hero and never fights. Used by the ambient life (gameplay) and the ground cover (environment).

import type { Point } from '@voxel/engine/world';
import type { Surface } from './kinds';

// Where a kind lives: on these surfaces ('grass': bare land, no surface), in these areas (by id, or 'kind:<area
// kind>': any forest, any meadow), along an area kind's edge (within `edge` tiles either side of it), round a tile, or
// in a village (round its place, `radius` tiles). Every condition given must hold.
export interface Habitat {
  on?: Array<Surface | 'grass'>;
  in?: string[];
  edge?: { of: string; tiles: number };
  near?: { at: Point; radius: number };
}

export interface Wildlife {
  kind: 'rabbit' | 'deer' | 'fox' | 'duck' | 'frog' | 'heron' | 'rook' | 'crow' | 'songbird' | 'butterfly' | 'bee' | 'hen' | 'dog' | 'cat' | 'sheep' | 'cow' | 'goat' | 'pig';
  note: string;
  where: Habitat;
  hours?: [number, number]; // from, until (wrapping past midnight); none: all day
  density: number; // how many, per 1000 tiles of their habitat
  group?: [number, number]; // seen in groups of min..max
  tame?: boolean; // a village's or a farm's: it doesn't flee far, and comes back
}

export interface Flower {
  kind: 'poppy' | 'cornflower' | 'oxeye' | 'clover' | 'buttercup' | 'foxglove' | 'heather' | 'meadowsweet' | 'grave-poppy';
  color: number;
  density: number; // clumps per 1000 tiles
}

export interface GroundCover {
  grass: { height: [number, number]; color: number; density: number }; // height in world units (a tier is 0.15); density 0..1
  flowers: Flower[];
  bushes: number; // per 1000 tiles
  stones: number; // per 1000 tiles
}

export interface RegionLife {
  wildlife: Wildlife[];
  quiet: Array<{ note: string; at: Point; radius: number }>; // no ambient life here: something's wrong
  ground: GroundCover; // the region's own
  byArea: Record<string, Partial<GroundCover>>; // an area kind's ('kind:meadow') or id's own (later keys win)
  patches: Array<{ note: string; at: Point; radius: number; cover: Partial<GroundCover> }>; // round a tile, over all else
}

export const LIFE: Record<string, RegionLife> = {
  'brindle-vale': {
    wildlife: [
      { kind: 'rabbit', note: 'rabbits in the meadows, out at the ends of the day', where: { on: ['grass'], in: ['kind:meadow'] }, hours: [5, 21], density: 6, group: [1, 3] },
      { kind: 'rabbit', note: 'rabbits on the open grass anywhere', where: { on: ['grass'] }, hours: [5, 9], density: 1.5, group: [1, 2] },
      { kind: 'deer', note: 'deer at the edge of the woods, at dawn and dusk', where: { on: ['grass'], edge: { of: 'forest', tiles: 6 } }, hours: [4, 7], density: 1.2, group: [2, 5] },
      { kind: 'deer', note: 'deer at the edge of the woods, at dusk', where: { on: ['grass'], edge: { of: 'forest', tiles: 6 } }, hours: [18, 21], density: 1.2, group: [2, 5] },
      { kind: 'fox', note: 'a fox crossing the fields at night', where: { on: ['grass', 'field', 'track'] }, hours: [21, 4], density: 0.3 },
      { kind: 'duck', note: 'ducks on the duck pond', where: { on: ['water', 'marsh'], near: { at: [952, 3354], radius: 6 } }, density: 300, group: [4, 7], tame: true },
      { kind: 'duck', note: 'ducks on the marsh pools', where: { on: ['water'], in: ['southern-marsh'] }, hours: [5, 20], density: 40, group: [2, 4] },
      { kind: 'frog', note: 'frogs in the marsh, loud at night', where: { on: ['marsh'] }, hours: [19, 6], density: 25, group: [1, 4] },
      { kind: 'heron', note: 'a heron fishing the Brindle', where: { on: ['ford', 'marsh'] }, hours: [5, 10], density: 2 },
      { kind: 'rook', note: 'rooks over the ploughed strips and the stubble', where: { on: ['field'] }, hours: [6, 19], density: 20, group: [5, 12] },
      { kind: 'crow', note: 'crows along the roads', where: { on: ['road', 'track'] }, hours: [6, 19], density: 3, group: [1, 3] },
      { kind: 'songbird', note: 'songbirds in the woods by day', where: { in: ['kind:forest'] }, hours: [5, 19], density: 8, group: [1, 4] },
      { kind: 'butterfly', note: 'butterflies over the meadows on warm afternoons', where: { in: ['kind:meadow'] }, hours: [10, 17], density: 10, group: [1, 3] },
      { kind: 'bee', note: "Agna's bees over the clover meadow", where: { in: ['clover-meadow'] }, hours: [8, 18], density: 30, group: [3, 8] },
      { kind: 'hen', note: 'hens scratching round Brindleford', where: { on: ['grass', 'path', 'garden'], near: { at: [915, 3352], radius: 30 } }, hours: [5, 20], density: 15, group: [2, 6], tame: true },
      { kind: 'hen', note: "hens in the Cobbes' yard", where: { near: { at: [954, 3424], radius: 6 } }, hours: [5, 20], density: 80, group: [3, 6], tame: true },
      { kind: 'dog', note: "the village dogs (Scrap, the Cobbes', among them)", where: { on: ['road', 'path', 'grass'], near: { at: [915, 3352], radius: 35 } }, density: 2, group: [1, 2], tame: true },
      { kind: 'cat', note: 'cats on the doorsteps and in the gardens', where: { on: ['path', 'garden'], near: { at: [915, 3352], radius: 30 } }, density: 4, tame: true },
      { kind: 'hen', note: 'hens on Tallow Green', where: { on: ['grass', 'path'], near: { at: [1200, 3050], radius: 20 } }, hours: [5, 20], density: 15, group: [2, 5], tame: true },
      { kind: 'sheep', note: "the Cobbes' sheep on the fallow end of their fields", where: { on: ['grass'], in: ['cobbe-fields'] }, hours: [6, 20], density: 40, group: [5, 12], tame: true },
      { kind: 'sheep', note: "sheep on the south pastures, Wenna's charge", where: { on: ['grass'], near: { at: [1030, 3500], radius: 25 } }, hours: [6, 20], density: 25, group: [6, 14], tame: true },
      { kind: 'sheep', note: 'sheep on Shrine Rise, the first thing alive the hero sees', where: { on: ['grass'], in: ['shrine-pasture'] }, hours: [5, 21], density: 60, group: [4, 9], tame: true },
      { kind: 'dog', note: "the Shrine Rise shepherd's dog, minding them", where: { in: ['shrine-pasture'] }, hours: [5, 21], density: 1, tame: true },
      { kind: 'cow', note: "the Cobbes' cows, by the barn", where: { on: ['grass'], near: { at: [985, 3425], radius: 15 } }, hours: [6, 20], density: 15, group: [2, 4], tame: true },
    ],
    quiet: [
      { note: 'the famine pit: no birds, no insects', at: [1090, 3200], radius: 18 },
      { note: 'the Marsh Cairn: the frogs stop', at: [760, 3830], radius: 12 },
      { note: 'the Nine Sisters: the bees come here to die', at: [750, 3050], radius: 10 },
      { note: "the Pilgrim Road's gibbet: only the rooks", at: [700, 3380], radius: 8 },
    ],
    ground: {
      grass: { height: [0.06, 0.16], color: 0x8a9a4a, density: 0.7 },
      flowers: [
        { kind: 'buttercup', color: 0xe8c43a, density: 6 },
        { kind: 'oxeye', color: 0xf2eedc, density: 4 },
        { kind: 'poppy', color: 0xc8402a, density: 2 },
      ],
      bushes: 3,
      stones: 2,
    },
    byArea: {
      'kind:meadow': {
        grass: { height: [0.14, 0.3], color: 0xa3a056, density: 0.9 },
        flowers: [
          { kind: 'oxeye', color: 0xf2eedc, density: 14 },
          { kind: 'cornflower', color: 0x4a6fb8, density: 8 },
          { kind: 'poppy', color: 0xc8402a, density: 8 },
          { kind: 'meadowsweet', color: 0xefe6c4, density: 5 },
        ],
        bushes: 1,
        stones: 0.5,
      },
      'clover-meadow': {
        flowers: [
          { kind: 'clover', color: 0xd48aa8, density: 30 },
          { kind: 'clover', color: 0xf0ede2, density: 12 },
          { kind: 'buttercup', color: 0xe8c43a, density: 6 },
        ],
      },
      'kind:forest': {
        grass: { height: [0.04, 0.1], color: 0x5f7034, density: 0.4 },
        flowers: [{ kind: 'foxglove', color: 0xa85a9a, density: 4 }],
        bushes: 18,
        stones: 4,
      },
      'mosshill-pines': {
        grass: { height: [0.03, 0.08], color: 0x6b6a3a, density: 0.3 },
        flowers: [{ kind: 'heather', color: 0x8e5a8a, density: 20 }],
        bushes: 25, // gorse
        stones: 14,
      },
      'kind:wetland': {
        grass: { height: [0.2, 0.4], color: 0x6f7a3e, density: 0.95 }, // reeds
        flowers: [],
        bushes: 2,
        stones: 1,
      },
      'kind:field': { grass: { height: [0.03, 0.06], color: 0xb39a5a, density: 0.5 }, flowers: [{ kind: 'poppy', color: 0xc8402a, density: 10 }], bushes: 0, stones: 1 }, // stubble
    },
    patches: [
      { note: 'grave-poppy thick on the famine pit, white as frost', at: [1090, 3200], radius: 6, cover: { flowers: [{ kind: 'grave-poppy', color: 0xf4f1ea, density: 120 }] } },
      { note: 'the square and the green, trodden short', at: [905, 3350], radius: 8, cover: { grass: { height: [0.02, 0.05], color: 0x8f9550, density: 0.4 }, flowers: [], bushes: 0, stones: 0 } },
      { note: "Tallow Green's green, grazed and trodden", at: [1200, 3050], radius: 10, cover: { grass: { height: [0.03, 0.06], color: 0x8f9a4e, density: 0.8 }, bushes: 0, stones: 0 } },
    ],
  },
};
