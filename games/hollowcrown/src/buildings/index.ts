// The Vale's buildings as models: each placed building (data/world: its size, floors, roof, walls, use) built by the
// engine's structure kit in the village palette, with what makes it itself (the inn's sign, the forge, the mill's
// wheel, the reeve's heron, Old Meg's stool, the chandlery's sign, vats and candles); the fixtures (a well, a notice board); the layer that puts them all in
// the world as the hero comes near; and the room they take, for walkers to keep out of.

import * as THREE from 'three';
import { hashUnit, oneOf } from '@voxel/engine/math';
import { VoxelModel, glowMaterial, litMaterial, type Model } from '@voxel/engine/models';
import { STRUCTURE_VOXEL, StructureModel, type StructureSpec } from '@voxel/engine/structures';
import { Obstacles, placesLayer, type ChunkLayer, type PlaceData, type Point, type WorldMap } from '@voxel/engine/world';
import type { VoxelGrid } from '@voxel/engine/voxel';
import { cardinal, footprint, type BuildingProps } from '../data/world/kinds';
import { LANDMARKS, landmarkAt } from './landmarks';
import { LOOK, structureColors, type Shutter } from './palette';
import {
  anvil, bellCote, chandlerSign, mossy, doorstepStool, dryingCandles, dryingHerbs, forgeHearth, heronPlaque, holedRoof, innSign,
  lantern, millWheel, noticeBoard, trough, waxVat, well, windowBoxes,
} from './props';

const TILE = 16; // voxels a tile

// A number from a place's id, to vary what's built for it (the same every time). A plain house gets one of LOOKS
// seeds, not its own: houses alike in size and build then look alike, built once and their meshes shared (lookOf).
const hashOf = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 10007;
const LOOKS = 4;
const UNIQUE = new Set(['holt-house', 'megs-house']); // (houses with something of their own)
const shared = (place: PlaceData) => place.kind === 'building' && (place.props as BuildingProps).use === 'house' && !UNIQUE.has(place.id);
const seedOf = (place: PlaceData) => (shared(place) ? 101 + (hashOf(place.id) % LOOKS) * 1013 : hashOf(place.id));

// What a place looks like, as a key: places with the same one are built once (placesOf), sharing their meshes.
function lookOf(place: PlaceData): string {
  if (place.kind === 'fixture') return fixtureOf(place)?.suffix ?? place.id;
  if (!shared(place)) return place.id;
  const b = place.props as BuildingProps;
  return `house ${b.size} ${b.floors} ${b.roof} ${b.walls} ${seedOf(place)}`;
}

// The spec every building starts from: walls inset from its footprint (room for the eaves), a storey a little over a
// person and a half, a door, small windows, a chimney at one end.
function baseSpec(b: BuildingProps, seed: number): StructureSpec {
  const shutter = oneOf<Shutter>(['green', 'blue', 'red'], hashUnit(seed, 1, 21));
  return {
    width: b.size[0] * TILE - 6,
    depth: b.size[1] * TILE - 6,
    storeys: b.floors,
    storeyHeight: 13,
    walls: b.walls,
    roof: b.roof,
    colors: structureColors(b.walls, b.roof, shutter),
    pitch: b.roof === 'thatch' ? 1.1 : 0.9,
    door: { width: 5, height: 10 },
    windows: { width: 4, height: 4, sill: 4, every: 14 },
    chimney: hashUnit(seed, 2, 21) < 0.5 ? -1 : 1,
    seed,
  };
}

// How far a house's door is moved along its front from the middle (voxels, the building's +x).
const doorOffset = (seed: number) => oneOf([0, -8, 8], hashUnit(seed, 4, 21));

// Where a building's door lets out (world units): a tile out from the middle of its door, its door moved along the
// front as far as it's drawn.
export function doorOf(place: PlaceData): Point {
  const b = place.props as BuildingProps;
  const along = b.use === 'house' && place.id !== 'holt-house' ? doorOffset(seedOf(place)) / TILE : 0;
  const out = (b.size[1] + 1) / 2; // (from the middle to the tile past its front)
  const [cx, cz] = centreOf(place);
  const facing = place.facing ?? 0;
  const [cos, sin] = [Math.cos(facing), Math.sin(facing)];
  return [cx + along * cos + out * sin, cz - along * sin + out * cos];
}

// Each use's own: its spec changed, and its props.
type Make = (spec: StructureSpec, seed: number, place: PlaceData) => StructureModel;

// A building from its spec in the village's look, weathered (moss up its roof from the eaves) under whatever it paints.
const built = (spec: StructureSpec, extra?: (m: StructureModel) => void) =>
  new StructureModel({ ...spec, paint: (g, layout) => (mossy(g, layout, spec), spec.paint?.(g, layout)) }, LOOK, extra);
const plain: Make = (spec) => built(spec);

// (keyed by any use: one the map names before it's built here is drawn as a house)
const BY_USE: Record<string, Make> = {
  house: (spec, seed, place) => {
    if (place.id === 'holt-house') return built({ ...spec, shut: true, chimney: undefined, paint: holedRoof });
    const flowers = hashUnit(seed, 3, 21) < 0.6;
    const stool = place.id === 'megs-house';
    return built({
      ...spec,
      door: { width: 5, height: 10, offset: doorOffset(seed) },
      paint: (g, layout) => {
        if (flowers) windowBoxes(g, layout, seed);
        if (stool) doorstepStool(g, layout);
      },
    }, (m) => m.prop(lantern(), [1, 5, 0], [m.layout.door!.x0 - 3, 10, m.layout.z1 + 1])); // (a lantern by its door)
  },
  chandler: (spec) => built({ ...spec, jetty: true, door: { width: 6, height: 11 }, paint: dryingCandles }, (m) => {
    const { door, z1 } = m.layout;
    m.prop(chandlerSign(), [1, 10, 0], [door!.x1 + 6, 23, z1 + 2]);
    m.prop(waxVat(), [3, 0, 3], [door!.x0 - 6, 0, z1 + 5]);
    m.prop(waxVat(), [3, 0, 3], [door!.x0 - 13, 0, z1 + 4]);
  }),
  herbalist: (spec, seed) => built({ ...spec, paint: (g, layout) => (windowBoxes(g, layout, seed), dryingHerbs(g, layout)) }),
  inn: (spec) => built({ ...spec, jetty: true, door: { width: 7, height: 11 }, windows: { width: 5, height: 5, sill: 4, every: 12 }, chimney: 1 }, (m) => {
    const { door, z1 } = m.layout;
    m.prop(innSign(), [1, 10, 0], [door!.x1 + 7, 23, z1 + 2]);
    m.prop(lantern(), [1, 5, 0], [door!.x0 - 3, 10, z1 + 1]);
    m.prop(lantern(), [1, 5, 0], [door!.x1 + 3, 10, z1 + 1]);
  }),
  smithy: (spec) => built({ ...spec, door: { width: 15, height: 11, open: true }, windows: undefined, chimney: 1, storeyHeight: 14, paint: forgeHearth }, (m) => {
    const { door, z1 } = m.layout;
    m.prop(anvil(), [3.5, 0, 2], [door!.x0 + 3, 0, z1 + 5]);
    m.prop(trough(), [5, 0, 2], [door!.x1 + 6, 0, z1 + 4]);
  }),
  shrine: (spec) => built({ ...spec, storeyHeight: 15, door: { width: 6, height: 11 }, windows: { width: 2, height: 6, sill: 5, every: 12 } }, (m) => {
    const { x1, z0, z1, ridge } = m.layout;
    m.prop(bellCote(), [4.5, 0, 2.5], [x1 - 6, ridge - 1, (z0 + z1) / 2 + 0.5]);
  }),
  reeve: (spec) => built({ ...spec, jetty: true, door: { width: 6, height: 11 }, windows: { width: 4, height: 5, sill: 4, every: 12 }, paint: heronPlaque }, (m) => {
    const { door, z1 } = m.layout;
    m.prop(lantern(), [1, 5, 0], [door!.x1 + 3, 10, z1 + 1]);
  }),
  mill: (spec) => built({ ...spec, chimney: undefined }, (m) => {
    const { x0, x1, z0 } = m.layout;
    const wheel = m.prop(millWheel(), [16, 16, 3], [(x0 + x1 + 1) / 2, 13, z0 - 4]);
    m.ticks.push((t) => (wheel.rotation.z = -t * 0.9));
  }),
  farmhouse: plain,
  barn: (spec) => built({ ...spec, storeyHeight: 18, door: { width: 18, height: 15, open: true }, windows: undefined, chimney: undefined, pitch: 1 }),
};

// A placed building's model, its front toward +z, centred on its footprint.
export function buildingModel(place: PlaceData): StructureModel {
  const b = place.props as BuildingProps;
  const seed = seedOf(place);
  return (BY_USE[b.use] ?? BY_USE.house)(baseSpec(b, seed), seed, place);
}

// The fixtures, by the end of their ids: each one's grid, and the room it takes (half its size, world units, x and z).
const FIXTURES: Array<{ suffix: string; grid: () => VoxelGrid; half: [number, number] }> = [
  { suffix: '-well', grid: well, half: [0.45, 0.45] },
  { suffix: '-notices', grid: noticeBoard, half: [0.5, 0.12] },
];
const fixtureOf = (place: PlaceData) => FIXTURES.find((f) => place.id.endsWith(f.suffix));

// A fixture's model (a well, a notice board), or null if it has none.
export function fixtureModel(place: PlaceData): Model | null {
  const fixture = fixtureOf(place);
  return fixture ? new VoxelModel(fixture.grid(), LOOK, { voxel: STRUCTURE_VOXEL }) : null;
}

// A landmark's model (the Pilgrim's Shrine), or null if it has none.
export function landmarkModel(place: PlaceData): Model | null {
  const landmark = LANDMARKS[place.id];
  return landmark ? new VoxelModel(landmark.grid(), LOOK, { voxel: STRUCTURE_VOXEL }) : null;
}

// A place's model, if it's drawn as one.
export function placeModel(place: PlaceData): Model | null {
  if (place.kind === 'building') return buildingModel(place);
  return place.kind === 'fixture' ? fixtureModel(place) : place.kind === 'landmark' ? landmarkModel(place) : null;
}

// Whether a place is drawn here (a building, a fixture, a landmark with a model).
const drawn = (p: PlaceData) => p.kind === 'building' || p.kind === 'fixture' || (p.kind === 'landmark' && !!LANDMARKS[p.id]);

// The layer of every drawn place on `map`: each built once (kept for when its chunk comes back; places that look
// alike share one build's meshes), stood on the ground in the middle of its footprint, turned the way it faces.
export function placesOf(map: WorldMap): ChunkLayer {
  const built = new Map<string, THREE.Object3D | null>();
  const looks = new Map<string, THREE.Object3D | null>();
  const make = (place: PlaceData): THREE.Object3D | null => {
    if (!built.has(place.id)) {
      const look = lookOf(place);
      if (!looks.has(look)) {
        const model = placeModel(place);
        model?.animate(0, 0);
        looks.set(look, model?.root ?? null);
      }
      const root = looks.get(look)?.clone() ?? null; // (a clone shares its meshes' geometry)
      if (root) {
        const [cx, cz] = place.kind === 'building' ? centreOf(place) : place.kind === 'landmark' ? landmarkAt(place) : place.at;
        root.position.set(cx, map.groundY(...place.at), cz);
        root.rotation.y = place.facing ?? 0;
      }
      built.set(place.id, root);
    }
    return built.get(place.id)!;
  };
  return placesLayer(map.places().filter(drawn), make, [litMaterial(), glowMaterial()]);
}

// The ground under every building and fixture on `map` made level, a tile round it too (no wall over a dip, no grass
// through a floor). Once, as the map loads, before anything's drawn on it.
export function levelGround(map: WorldMap): void {
  for (const place of map.places()) {
    if (place.kind === 'building') {
      const f = footprint(place);
      map.flatten({ rect: [f.x0 - 1, f.z0 - 1, f.x1 + 1, f.z1 + 1] });
    } else if ((place.kind === 'fixture' && fixtureOf(place)) || (place.kind === 'landmark' && LANDMARKS[place.id])) {
      const [x, z] = place.at;
      map.flatten({ rect: [x - 1, z - 1, x + 1, z + 1] });
    }
  }
}

// What stands in the way on `map`: every building's walls (inset from its footprint as they're built: the eaves can
// be walked under), every fixture, every landmark drawn here; added to `obstacles` (a new set, none given).
export function obstaclesOf(map: WorldMap, obstacles = new Obstacles()): Obstacles {
  for (const place of map.places()) {
    let half: [number, number] | undefined;
    let [cx, cz] = place.at;
    if (place.kind === 'building') {
      const [across, deep] = (place.props as BuildingProps).size;
      const [w, d] = [(across * TILE - 6) / TILE / 2, (deep * TILE - 6) / TILE / 2];
      half = cardinal(place.facing)! % 2 === 0 ? [w, d] : [d, w];
      [cx, cz] = centreOf(place);
    } else if (place.kind === 'fixture') half = fixtureOf(place)?.half;
    else if (place.kind === 'landmark') [half, [cx, cz]] = [LANDMARKS[place.id]?.half, landmarkAt(place)];
    if (half) obstacles.add({ x0: cx - half[0], z0: cz - half[1], x1: cx + half[0], z1: cz + half[1] });
  }
  return obstacles;
}

function centreOf(place: PlaceData): [number, number] {
  const f = footprint(place);
  return [(f.x0 + f.x1) / 2, (f.z0 + f.z1) / 2];
}
