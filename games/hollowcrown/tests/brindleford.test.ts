// Brindleford's buildings stand where they can: on dry, open ground, none in another or on a road, every door
// reachable on foot from the well, their walls in the way; and everyone living in them is someone the region's bible
// knows.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { BODY_RADIUS, MoveIntent, MoveSpeed, Transform, movementSystem } from '@voxel/engine/gameplay';
import { ObstaclesResource, TerrainResource, loadWorldMap, type PlaceData } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { LANDMARKS } from '../src/buildings/landmarks';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { BRINDLEFORD } from '../src/data/world/brindleford';
import { footprint, type BuildingProps } from '../src/data/world/kinds';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const buildings = (BRINDLEFORD.places ?? []).filter((p) => p.kind === 'building');
const props = (p: PlaceData) => p.props as BuildingProps;
const tiles = (p: PlaceData) => {
  const f = footprint(p);
  const list: Array<[number, number]> = [];
  for (let x = f.x0; x <= f.x1; x++) for (let z = f.z0; z <= f.z1; z++) list.push([x, z]);
  return list;
};

describe('Brindleford', () => {
  it('has its inn, smithy, shrine-house, reeve, herbalist, mill, farm and ten houses', () => {
    const uses = buildings.map((b) => props(b).use);
    for (const use of ['inn', 'smithy', 'shrine', 'reeve', 'herbalist', 'mill', 'farmhouse', 'barn'] as const) expect(uses).toContain(use);
    expect(uses.filter((u) => u === 'house').length + uses.filter((u) => u === 'herbalist').length).toBe(10 + 1);
  });

  it('stands its buildings on bare, dry ground, none overlapping', () => {
    const taken = new Map<string, string>();
    for (const b of buildings) {
      for (const [x, z] of tiles(b)) {
        expect(map.surfaceAt(x, z), `${b.id} at (${x}, ${z}) stands on a ${map.surfaceNames[map.surfaceAt(x, z) - 1]}`).toBe(0);
        expect(taken.get(`${x},${z}`), `${b.id} overlaps`).toBeUndefined();
        taken.set(`${x},${z}`, b.id);
      }
    }
  });

  it('can reach every door on foot from the well', () => {
    const blocked = new Set(buildings.flatMap((b) => tiles(b).map(([x, z]) => `${x},${z}`)));
    const [x0, z0, x1, z1] = [830, 3200, 1010, 3460];
    const seen = new Set<string>(['900,3350']);
    const queue: Array<[number, number]> = [[900, 3350]];
    while (queue.length) {
      const [x, z] = queue.pop()!;
      for (const [nx, nz] of [[x + 1, z], [x - 1, z], [x, z + 1], [x, z - 1]]) {
        const key = `${nx},${nz}`;
        if (nx < x0 || nx > x1 || nz < z0 || nz > z1 || seen.has(key) || blocked.has(key) || !map.walkable(nx, nz)) continue;
        seen.add(key);
        queue.push([nx, nz]);
      }
    }
    for (const b of buildings) expect(seen.has(footprint(b).door.join(',')), `${b.id}'s door`).toBe(true);
  });

  it('has its ground dressed: footpaths, kitchen gardens, the Cobbes\' ploughed strips, and a duck pond', () => {
    const surface = (x: number, z: number) => map.surfaceNames[map.surfaceAt(x, z) - 1];
    for (const kind of ['path', 'garden', 'field'] as const) expect((BRINDLEFORD.surfaces ?? []).some((s) => s.surface === kind), kind).toBe(true);
    expect(surface(918, 3342)).toBe('garden'); // behind Nan Wicket's
    expect(surface(932, 3450)).toBe('field');
    expect(surface(936, 3450)).toBeUndefined(); // a grass balk between strips
    expect(surface(952, 3354)).toBe('water');
    expect(map.walkable(952, 3354)).toBe(false);
    expect(surface(924, 3349)).toBe('path'); // Old Meg's door to the lane
  });

  it('houses only people the region\'s bible names', () => {
    const bible = readFileSync(resolve(__dirname, '../docs/story/regions/brindle-vale.md'), 'utf8');
    for (const b of buildings) {
      for (const who of props(b).residents) expect(bible.includes(who.split(' ')[0]) && bible.includes(who.split(' ').at(-1)!), `${who} (${b.id})`).toBe(true);
    }
  });
});

describe('Brindleford\'s walls', () => {
  const obstacles = obstaclesOf(map);

  it('stand in the way of every building and fixture, and leave every door clear', () => {
    expect(obstacles.size).toBe(WORLD_MAP.places.filter((p) => p.kind === 'building' || p.kind === 'fixture' || (p.kind === 'landmark' && LANDMARKS[p.id])).length); // (the whole map's)
    for (const b of buildings) {
      expect(obstacles.blocks(...centre(b), BODY_RADIUS), `${b.id}'s middle`).toBe(true);
      expect(obstacles.blocks(...footprint(b).door, BODY_RADIUS), `${b.id}'s door`).toBe(false);
    }
  });

  it('keep the hero out of the inn', () => {
    const world = new World();
    world.setResource(TerrainResource, map);
    world.setResource(ObstaclesResource, obstacles);
    const door = footprint(map.place('ferrymans-rest')!).door;
    const hero = world.spawn([Transform, { x: door[0], y: 0, z: door[1], facing: 0 }], [MoveIntent, { x: 0, z: -1 }], [MoveSpeed, 3.2]);
    for (let i = 0; i < 60; i++) movementSystem.update(world, 1 / 30);
    expect(world.read(hero, Transform).z).toBeGreaterThan(footprint(map.place('ferrymans-rest')!).z1 + 0.5 - 3 / 16);
  });
});

function centre(p: PlaceData): [number, number] {
  const f = footprint(p);
  return [(f.x0 + f.x1) / 2, (f.z0 + f.z1) / 2];
}
