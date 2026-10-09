import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { MoveIntent, MoveSpeed, Transform, movementSystem } from '../src/gameplay';
import {
  CHUNK_SIZE, RELIEF_MAX, RELIEF_MIN, RELIEF_STEP, TILE_HEIGHT, TerrainResource, WorldDataError, boundsOf, checkWorldMap, composeWorldMap, covers, loadWorldMap, tierRects,
  type Shape, type WorldMapData,
} from '../src/world';

const SHAPES: Shape[] = [
  { rect: [3, 4, 10, 8] },
  { circle: [20, 20, 6.5] },
  { polygon: [[2, 30], [18, 28], [12, 44]] },
  { line: [[30, 2], [44, 10], [40, 30]], width: 3 },
];

describe('shapes', () => {
  it('cover the tiles they should', () => {
    expect(covers(SHAPES[0], 3, 8)).toBe(true);
    expect(covers(SHAPES[0], 11, 8)).toBe(false);
    expect(covers(SHAPES[1], 26, 20)).toBe(true);
    expect(covers(SHAPES[1], 25, 25)).toBe(false);
    expect(covers(SHAPES[2], 11, 33)).toBe(true);
    expect(covers(SHAPES[2], 3, 40)).toBe(false);
    expect(covers(SHAPES[3], 37, 6)).toBe(true); // (on the first leg)
    expect(covers(SHAPES[3], 37, 12)).toBe(false);
  });

  it('cover nothing outside their bounds', () => {
    for (const shape of SHAPES) {
      const b = boundsOf(shape);
      for (let x = b.x0 - 3; x < b.x1 + 3; x++) for (let z = b.z0 - 3; z < b.z1 + 3; z++) {
        if (covers(shape, x, z)) expect(x >= b.x0 && x < b.x1 && z >= b.z0 && z < b.z1).toBe(true);
      }
    }
  });
});

const MAP: WorldMapData = composeWorldMap(
  { size: { width: 64, depth: 64 }, baseTier: 1, surfaceKinds: { water: { color: 0x0000ff, walkable: false }, road: { color: 0x888888 } } },
  {
    land: [
      { shape: { rect: [10, 10, 40, 40] }, tier: 3 },
      { shape: { circle: [25, 25, 5] }, tier: 5 }, // (a knoll on the plateau)
      { shape: { rect: [0, 0, 63, 5] }, tier: 0 },
    ],
    surfaces: [{ shape: { rect: [0, 0, 63, 5] }, surface: 'water' }],
  },
  {
    surfaces: [{ shape: { line: [[2, 0], [2, 20]], width: 1 }, surface: 'road' }], // (a causeway over the water: later, so it wins)
    areas: [{ id: 'plateau', kind: 'upland', shape: { rect: [10, 10, 40, 40] } }],
    places: [{ id: 'hut', kind: 'house', at: [20, 20] }, { id: 'well', kind: 'well', at: [21, 20] }],
  },
);

describe('the world map', () => {
  const map = loadWorldMap(MAP, { house: () => [], well: () => [] });

  it('lays its land in order, later patches over earlier ones', () => {
    expect(map.tierAt(50, 50)).toBe(1);
    expect(map.tierAt(12, 12)).toBe(3);
    expect(map.tierAt(25, 25)).toBe(5);
    expect(map.tierAt(25, 3)).toBe(0);
    expect(map.groundY(25.3, 24.8)).toBe(map.groundY(25, 25)); // (by the tile a point falls in)
    expect(map.tiers()).toEqual([0, 1, 3, 5]);
  });

  it('paints its surfaces, and knows what can be walked on', () => {
    expect(map.surfaceNames[map.surfaceAt(30, 2) - 1]).toBe('water');
    expect(map.walkable(30, 2)).toBe(false);
    expect(map.walkable(2, 2)).toBe(true); // (the causeway)
    expect(map.walkable(30, 30)).toBe(true);
    expect(map.surfaceColors()).toEqual([0x0000ff, 0x888888]);
  });

  it('works out each tile the same whichever chunk is asked for first', () => {
    const fresh = loadWorldMap(MAP, { house: () => [], well: () => [] });
    for (let x = CHUNK_SIZE * 2 - 1; x >= 0; x--) for (let z = 0; z < CHUNK_SIZE * 2; z += 3) expect(fresh.tierAt(x, z)).toBe(map.tierAt(x, z));
  });

  it('finds its areas and places', () => {
    expect(map.areasAt(30, 30).map((a) => a.id)).toEqual(['plateau']);
    expect(map.place('hut')?.at).toEqual([20, 20]);
    expect(map.places('well')).toHaveLength(1);
    expect(map.placesIn({ x0: 0, z0: 0, x1: 21, z1: 64 }).map((p) => p.id)).toEqual(['hut']);
  });

  it('feeds the terrain layer one rectangle per run of tier and surface', () => {
    const rects = tierRects(map, { x0: 0, z0: 0, x1: 16, z1: 16 });
    const area = rects.reduce((n, r) => n + r.width * r.depth, 0);
    expect(area).toBe(256);
    expect(rects.some((r) => r.surface === 1 && r.tier === 0)).toBe(true);
  });

  it('makes bare land a little uneven, in small steps, the ground walked on following it', () => {
    const levels = new Set<number>();
    for (let x = 12; x < 40; x++) for (let z = 12; z < 40; z++) {
      const relief = map.reliefAt(x, z);
      expect(relief).toBeGreaterThanOrEqual(RELIEF_MIN);
      expect(relief).toBeLessThanOrEqual(RELIEF_MAX);
      levels.add(relief);
      expect(map.groundY(x, z)).toBeCloseTo(map.tierAt(x, z) * TILE_HEIGHT + relief * RELIEF_STEP);
    }
    expect(levels.size).toBeGreaterThan(1);
    expect(RELIEF_STEP * Math.max(-RELIEF_MIN, RELIEF_MAX)).toBeLessThan(TILE_HEIGHT); // (still read as its tier)
    for (let z = 0; z <= 4; z++) expect(map.reliefAt(30, z)).toBe(0); // (water and roads stay flat)
    const flat = loadWorldMap({ ...MAP, relief: false }, { house: () => [], well: () => [] });
    expect(flat.reliefAt(20, 20)).toBe(0);
    expect(flat.groundY(20, 20)).toBeCloseTo(flat.tierAt(20, 20) * TILE_HEIGHT);
  });

  it('lists every problem in bad data at once, and refuses to load it', () => {
    const bad: WorldMapData = {
      ...MAP,
      land: [{ shape: { rect: [0, 0, 4, 4] }, tier: 1.5 }, { shape: { circle: [500, 500, 3] }, tier: 2 }, { shape: { rect: [0, 0, 1, 1] }, tier: 99 }],
      surfaces: [{ shape: { rect: [0, 0, 1, 1] }, surface: 'lava' }],
      places: [{ id: 'hut', kind: 'house', at: [1, 1] }, { id: 'hut', kind: 'castle', at: [70, 1] }],
    };
    const problems = checkWorldMap(bad, { house: (p) => (p.name ? [] : ['no name']) });
    expect(problems).toEqual([
      'land[0]: tier 1.5 is outside 0..31',
      'land[1]: off the map',
      'land[2]: tier 99 is outside 0..31',
      'surfaces[0]: no surface kind "lava"',
      'place hut: no name',
      'place hut: the id "hut" is used twice',
      'place hut: at (70, 1), off the map',
      'place hut: no kind "castle"',
    ]);
    expect(() => loadWorldMap(bad)).toThrow(WorldDataError);
  });

  it('keeps walkers out of what can\'t be walked on, sliding along its edge', () => {
    const world = new World();
    world.setResource(TerrainResource, map);
    const e = world.spawn([Transform, { x: 30, y: 0, z: 8, facing: 0 }], [MoveIntent, { x: 1, z: -1 }], [MoveSpeed, 2]);
    for (let i = 0; i < 60; i++) movementSystem.update(world, 1 / 20);
    const at = world.read(e, Transform);
    expect(map.walkable(at.x, at.z)).toBe(true);
    expect(at.z).toBeGreaterThan(5);
    expect(at.x).toBeGreaterThan(33); // (still moving east, along the shore)
  });
});
