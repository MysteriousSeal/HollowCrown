// The Vale's buildings as models: each placed building (data/world: its size, floors, roof, walls, use) built by the
// engine's structure kit in the village palette, with what makes it itself (the inn's sign, the forge, the mill's
// wheel, the reeve's heron, Old Meg's stool); the fixtures (a well, a notice board); the layer that puts them all in
// the world as the hero comes near; and the room they take, for walkers to keep out of.

import * as THREE from 'three';
import { hashUnit, oneOf } from '@voxel/engine/math';
import { VoxelModel, glowMaterial, litMaterial, type Model } from '@voxel/engine/models';
import { STRUCTURE_VOXEL, StructureModel, type StructureSpec } from '@voxel/engine/structures';
import { Obstacles, placesLayer, type ChunkLayer, type PlaceData, type WorldMap } from '@voxel/engine/world';
import type { VoxelGrid } from '@voxel/engine/voxel';
import { cardinal, footprint, type BuildingProps } from '../data/world/kinds';
import { LOOK, structureColors, type Shutter } from './palette';
import {
  anvil, bellCote, doorstepStool, dryingHerbs, forgeHearth, heronPlaque, holedRoof, innSign, lantern, millWheel, noticeBoard, trough,
  well, windowBoxes,
} from './props';

const TILE = 16; // voxels a tile

// A number from a place's id, to vary what's built for it (the same every time).
const seedOf = (id: string) => [...id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 10007;

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

// Each use's own: its spec changed, and its props.
type Make = (spec: StructureSpec, seed: number, place: PlaceData) => StructureModel;
const plain: Make = (spec) => new StructureModel(spec, LOOK);

const BY_USE: Record<BuildingProps['use'], Make> = {
  house: (spec, seed, place) => {
    if (place.id === 'holt-house') return new StructureModel({ ...spec, shut: true, chimney: undefined, paint: holedRoof }, LOOK);
    const flowers = hashUnit(seed, 3, 21) < 0.6;
    const stool = place.id === 'megs-house';
    return new StructureModel({
      ...spec,
      door: { width: 5, height: 10, offset: oneOf([0, -8, 8], hashUnit(seed, 4, 21)) },
      paint: (g, layout) => {
        if (flowers) windowBoxes(g, layout, seed);
        if (stool) doorstepStool(g, layout);
      },
    }, LOOK);
  },
  herbalist: (spec, seed) => new StructureModel({ ...spec, paint: (g, layout) => (windowBoxes(g, layout, seed), dryingHerbs(g, layout)) }, LOOK),
  inn: (spec) => new StructureModel({ ...spec, jetty: true, door: { width: 7, height: 11 }, windows: { width: 5, height: 5, sill: 4, every: 12 }, chimney: 1 }, LOOK, (m) => {
    const { door, z1 } = m.layout;
    m.prop(innSign(), [1, 10, 0], [door!.x1 + 7, 23, z1 + 2]);
    m.prop(lantern(), [1, 5, 0], [door!.x0 - 3, 10, z1 + 1]);
    m.prop(lantern(), [1, 5, 0], [door!.x1 + 3, 10, z1 + 1]);
  }),
  smithy: (spec) => new StructureModel({ ...spec, door: { width: 15, height: 11, open: true }, windows: undefined, chimney: 1, storeyHeight: 14, paint: forgeHearth }, LOOK, (m) => {
    const { door, z1 } = m.layout;
    m.prop(anvil(), [3.5, 0, 2], [door!.x0 + 3, 0, z1 + 5]);
    m.prop(trough(), [5, 0, 2], [door!.x1 + 6, 0, z1 + 4]);
  }),
  shrine: (spec) => new StructureModel({ ...spec, storeyHeight: 15, door: { width: 6, height: 11 }, windows: { width: 2, height: 6, sill: 5, every: 12 } }, LOOK, (m) => {
    const { x1, z0, z1, ridge } = m.layout;
    m.prop(bellCote(), [4.5, 0, 2.5], [x1 - 6, ridge - 1, (z0 + z1) / 2 + 0.5]);
  }),
  reeve: (spec) => new StructureModel({ ...spec, jetty: true, door: { width: 6, height: 11 }, windows: { width: 4, height: 5, sill: 4, every: 12 }, paint: heronPlaque }, LOOK, (m) => {
    const { door, z1 } = m.layout;
    m.prop(lantern(), [1, 5, 0], [door!.x1 + 3, 10, z1 + 1]);
  }),
  mill: (spec) => new StructureModel({ ...spec, chimney: undefined }, LOOK, (m) => {
    const { x0, x1, z0 } = m.layout;
    const wheel = m.prop(millWheel(), [16, 16, 3], [(x0 + x1 + 1) / 2, 13, z0 - 4]);
    m.ticks.push((t) => (wheel.rotation.z = -t * 0.9));
  }),
  farmhouse: plain,
  barn: (spec) => new StructureModel({ ...spec, storeyHeight: 18, door: { width: 18, height: 15, open: true }, windows: undefined, chimney: undefined, pitch: 1 }, LOOK),
};

// A placed building's model, its front toward +z, centred on its footprint.
export function buildingModel(place: PlaceData): StructureModel {
  const b = place.props as BuildingProps;
  const seed = seedOf(place.id);
  return BY_USE[b.use](baseSpec(b, seed), seed, place);
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

// A place's model, if it's drawn as one.
export function placeModel(place: PlaceData): Model | null {
  return place.kind === 'building' ? buildingModel(place) : place.kind === 'fixture' ? fixtureModel(place) : null;
}

// The layer of every drawn place on `map`: each built once (kept for when its chunk comes back), stood on the ground
// in the middle of its footprint, turned the way it faces.
export function placesOf(map: WorldMap): ChunkLayer {
  const built = new Map<string, THREE.Object3D | null>();
  const make = (place: PlaceData): THREE.Object3D | null => {
    if (!built.has(place.id)) {
      const model = placeModel(place);
      if (model) {
        const [cx, cz] = place.kind === 'building' ? centreOf(place) : place.at;
        model.root.position.set(cx, map.groundY(...place.at), cz);
        model.root.rotation.y = place.facing ?? 0;
        model.animate(0, 0);
      }
      built.set(place.id, model?.root ?? null);
    }
    return built.get(place.id)!;
  };
  return placesLayer(map.places().filter((p) => p.kind === 'building' || p.kind === 'fixture'), make, [litMaterial(), glowMaterial()]);
}

// What stands in the way on `map`: every building's walls (inset from its footprint as they're built: the eaves can
// be walked under), every fixture; added to `obstacles` (a new set, none given).
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
    if (half) obstacles.add({ x0: cx - half[0], z0: cz - half[1], x1: cx + half[0], z1: cz + half[1] });
  }
  return obstacles;
}

function centreOf(place: PlaceData): [number, number] {
  const f = footprint(place);
  return [(f.x0 + f.x1) / 2, (f.z0 + f.z1) / 2];
}
