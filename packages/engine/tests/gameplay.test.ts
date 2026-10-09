import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { MoveIntent, MoveSpeed, Transform, movementSystem } from '../src/gameplay';
import { TILE_HEIGHT, TerrainResource, flatTerrain } from '../src/world';

function walker(x: number, z: number, intent: { x: number; z: number }) {
  const world = new World();
  world.setResource(TerrainResource, flatTerrain({ width: 100, depth: 100 }, 2));
  const e = world.spawn([Transform, { x, y: 0, z, facing: 0 }], [MoveIntent, intent], [MoveSpeed, 4]);
  return { world, at: world.read(e, Transform) };
}

describe('movement', () => {
  it('walks at its speed whatever the intent\'s length, facing the way it goes, on the ground', () => {
    const { world, at } = walker(50, 50, { x: 10, z: 0 });
    movementSystem.update(world, 0.5);
    expect(at.x).toBeCloseTo(52);
    expect(at.z).toBeCloseTo(50);
    expect(at.facing).toBeCloseTo(Math.PI / 2);
    expect(at.y).toBeCloseTo(2 * TILE_HEIGHT);
  });

  it('keeps to the map', () => {
    const { world, at } = walker(1, 98, { x: -1, z: 1 });
    movementSystem.update(world, 10);
    expect(at.x).toBeCloseTo(0.4);
    expect(at.z).toBeCloseTo(98.6);
  });

  it('stands still without an intent, facing as it was', () => {
    const { world, at } = walker(5, 5, { x: 0, z: 0 });
    at.facing = 1;
    movementSystem.update(world, 1);
    expect([at.x, at.z, at.facing]).toEqual([5, 5, 1]);
  });
});
