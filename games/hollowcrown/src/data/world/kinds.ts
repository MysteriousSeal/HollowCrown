// What the Vale's map is made of: its surfaces (how each is drawn, whether it's walked on) and its kinds of place,
// each with the rules its data must keep.

import type { PlaceData, PlaceRules, Point, SurfaceKind, SurfacePatch, WorldMapPart } from '@voxel/engine/world';

export const SURFACES = {
  water: { color: 0x3b6a86, walkable: false }, // the sea, the lake, pools
  river: { color: 0x4d7f97, walkable: false }, // running water, too fast or deep to wade
  ford: { color: 0x7a9488 }, // shallows and stepping stones: wadeable
  sand: { color: 0xc9b688 },
  marsh: { color: 0x5f6c3e }, // reeds and wet ground
  road: { color: 0x9a8461 },
  track: { color: 0x8c8a5c }, // faint, half grassed over
  path: { color: 0xa8956c }, // a footpath trodden bare: door to lane, yard to barn
  garden: { color: 0x6a5434 }, // dug soil in rows: kitchen gardens behind the cottages
  field: { color: 0x87683f }, // ploughed strips, after the harvest
  rock: { color: 0x6c6862, walkable: false }, // the mountains' crags
} satisfies Record<string, SurfaceKind>;

export type Surface = keyof typeof SURFACES;

// Every place has a name; a cave or a crypt has its mouth's facing (where its door looks, radians, 0 toward +z).
const named = (p: PlaceData) => (p.name ? [] : ['it has no name']);
const facing = (p: PlaceData) => [...named(p), ...(p.facing === undefined ? ['a way in needs a facing'] : [])];

// A building: its footprint (tiles: `size` [across its front, deep], centred on its place), floors, roof and walls,
// what it's for, and who lives or works there (by their names in the story's bible). Its door is in the middle of
// its front, which faces one of the four ways.
export type BuildingUse = 'house' | 'inn' | 'smithy' | 'shrine' | 'reeve' | 'herbalist' | 'mill' | 'farmhouse' | 'barn';
export type BuildingProps = {
  size: [number, number];
  floors: number;
  roof: 'thatch' | 'slate' | 'shingle';
  walls: 'timber' | 'stone' | 'wattle';
  use: BuildingUse;
  residents: string[];
};

const building = (p: PlaceData) => {
  const problems = named(p);
  const b = p.props as Partial<BuildingProps> | undefined;
  if (cardinal(p.facing) === undefined) problems.push('a building faces one of the four ways');
  if (!b?.size || !b.size.every((n) => Number.isInteger(n) && n >= 1 && n <= 12)) problems.push('a building needs a size, 1..12 tiles a side');
  if (!b?.floors || b.floors < 1 || b.floors > 3) problems.push('a building has 1..3 floors');
  if (!b?.use || !b.roof || !b.walls || !Array.isArray(b.residents)) problems.push('a building needs its use, roof, walls and residents');
  return problems;
};

export const PLACE_KINDS = {
  town: named,
  village: named,
  landmark: named,
  ruin: named,
  keep: named,
  farm: named,
  camp: named,
  crypt: facing,
  cave: facing,
  building,
  fixture: named, // a well, a notice board: something in the open, walked round
} satisfies PlaceRules;

export type PlaceKind = keyof typeof PLACE_KINDS;

// Facings, for data: where a door looks.
export const NORTH = Math.PI;
export const SOUTH = 0;
export const EAST = Math.PI / 2;
export const WEST = -Math.PI / 2;

// Which of the four ways `facing` is (0 south, 1 east, 2 north, 3 west), or undefined if it's none of them.
export function cardinal(facing: number | undefined): 0 | 1 | 2 | 3 | undefined {
  if (facing === undefined) return undefined;
  const quarter = facing / (Math.PI / 2);
  if (Math.abs(quarter - Math.round(quarter)) > 1e-6) return undefined;
  return (((Math.round(quarter) % 4) + 4) % 4) as 0 | 1 | 2 | 3;
}

// The tiles a building stands on (inclusive), and the tile just outside its door.
export function footprint(p: PlaceData): { x0: number; z0: number; x1: number; z1: number; door: Point } {
  const way = cardinal(p.facing) ?? 0;
  const [across, deep] = (p.props as BuildingProps).size;
  const [w, d] = way % 2 === 0 ? [across, deep] : [deep, across]; // (its front along x facing south or north)
  const [ax, az] = p.at;
  const x0 = ax - Math.floor(w / 2);
  const z0 = az - Math.floor(d / 2);
  const [x1, z1] = [x0 + w - 1, z0 + d - 1];
  const door: Point = [[ax, z1 + 1], [x1 + 1, az], [ax, z0 - 1], [x0 - 1, az]][way] as Point;
  return { x0, z0, x1, z1, door };
}

// A piece of the Vale's map, its surfaces and kinds of place checked as it's written.
export interface ValePart extends WorldMapPart {
  surfaces?: Array<SurfacePatch & { surface: Surface }>;
  places?: Array<PlaceData & { kind: PlaceKind }>;
}
