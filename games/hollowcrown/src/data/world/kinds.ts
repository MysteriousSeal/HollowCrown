// What the Vale's map is made of: its surfaces (how each is drawn, whether it's walked on) and its kinds of place,
// each with the rules its data must keep.

import type { PlaceData, PlaceRules, SurfaceKind, SurfacePatch, WorldMapPart } from '@voxel/engine/world';

export const SURFACES = {
  water: { color: 0x3b6a86, walkable: false }, // the sea, the lake, pools
  river: { color: 0x4d7f97, walkable: false }, // running water, too fast or deep to wade
  ford: { color: 0x7a9488 }, // shallows and stepping stones: wadeable
  sand: { color: 0xc9b688 },
  marsh: { color: 0x5f6c3e }, // reeds and wet ground
  road: { color: 0x9a8461 },
  track: { color: 0x8c8a5c }, // faint, half grassed over
  rock: { color: 0x6c6862, walkable: false }, // the mountains' crags
} satisfies Record<string, SurfaceKind>;

export type Surface = keyof typeof SURFACES;

// Every place has a name; a cave or a crypt has its mouth's facing (where its door looks, radians, 0 toward +z).
const named = (p: PlaceData) => (p.name ? [] : ['it has no name']);
const facing = (p: PlaceData) => [...named(p), ...(p.facing === undefined ? ['a way in needs a facing'] : [])];

export const PLACE_KINDS = {
  town: named,
  village: named,
  landmark: named,
  building: named,
  ruin: named,
  keep: named,
  farm: named,
  camp: named,
  crypt: facing,
  cave: facing,
} satisfies PlaceRules;

export type PlaceKind = keyof typeof PLACE_KINDS;

// Facings, for data: where a door looks.
export const NORTH = Math.PI;
export const SOUTH = 0;
export const EAST = Math.PI / 2;
export const WEST = -Math.PI / 2;

// A piece of the Vale's map, its surfaces and kinds of place checked as it's written.
export interface ValePart extends WorldMapPart {
  surfaces?: Array<SurfacePatch & { surface: Surface }>;
  places?: Array<PlaceData & { kind: PlaceKind }>;
}
