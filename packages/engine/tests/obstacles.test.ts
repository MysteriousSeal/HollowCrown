import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { BodyRadius, MoveIntent, MoveSpeed, Transform, movementSystem } from '../src/gameplay';
import { Obstacles, ObstaclesResource, TerrainResource, flatTerrain } from '../src/world';

describe('obstacles', () => {
  const obstacles = new Obstacles();
  obstacles.add({ x0: 10, z0: 10, x1: 20, z1: 14 });
  obstacles.add({ x0: 6, z0: 30, x1: 9, z1: 41 }); // (across several cells of the index)

  it('block a body overlapping them, and nothing else', () => {
    expect(obstacles.size).toBe(2);
    expect(obstacles.blocks(15, 12, 0.1)).toBe(true);
    expect(obstacles.blocks(20.1, 12, 0.15)).toBe(true); // (its edge, within reach)
    expect(obstacles.blocks(20.2, 12, 0.15)).toBe(false);
    expect(obstacles.blocks(20.1, 14.1, 0.15)).toBe(true); // (round the corner: within reach)
    expect(obstacles.blocks(20.12, 14.12, 0.15)).toBe(false);
    expect(obstacles.blocks(7, 40.5, 0.1)).toBe(true);
    expect(obstacles.blocks(50, 50, 3)).toBe(false);
  });

  it('stop walkers at a wall, sliding along it, each at its own size', () => {
    const world = new World();
    world.setResource(TerrainResource, flatTerrain({ width: 64, depth: 64 }, 1));
    world.setResource(ObstaclesResource, obstacles);
    const small = world.spawn([Transform, { x: 12, y: 0, z: 8, facing: 0 }], [MoveIntent, { x: 1, z: 1 }], [MoveSpeed, 2]);
    const big = world.spawn([Transform, { x: 12, y: 0, z: 8, facing: 0 }], [MoveIntent, { x: 1, z: 1 }], [MoveSpeed, 2], [BodyRadius, 0.6]);
    for (let i = 0; i < 40; i++) movementSystem.update(world, 1 / 20);
    const [s, b] = [world.read(small, Transform), world.read(big, Transform)];
    expect(s.z).toBeLessThan(10);
    expect(s.z).toBeGreaterThan(9.8);
    expect(s.x).toBeGreaterThan(14); // (slid along it)
    expect(b.z).toBeLessThan(9.4);
  });
});
