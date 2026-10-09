// QA: hostiles in a world with things in the way (a tree's trunk, a wall). A wolf that gives up a chase must get back
// home round whatever stands between, not press against it for good, never hunting again.

import { describe, expect, it } from 'vitest';
import { World } from '../../src/ecs';
import { Hostile, Player, Transform, hostile, hostileSystem, movementSystem } from '../../src/gameplay';
import { Obstacles, ObstaclesResource, TerrainResource, flatTerrain } from '../../src/world';

describe('a hostile going home', () => {
  // (Was a bug: a returning hostile pressed against the trunk for good. Fixed by engine: no progress home, it settles.)
  it('gets home round a trunk in its way, and hunts again', () => {
    const world = new World();
    world.setResource(TerrainResource, flatTerrain({ width: 100, depth: 100 }, 0));
    const obstacles = new Obstacles();
    obstacles.add({ x0: 47.6, z0: 49.6, x1: 48.4, z1: 50.4 }); // a trunk, square between the wolf and its home
    world.setResource(ObstaclesResource, obstacles);
    const wolf = world.spawn([Transform, { x: 50, y: 0, z: 50, facing: 0 }], [Hostile, hostile({ home: { x: 45, z: 50 }, speed: 3 })]);
    world.read(wolf, Hostile).state = 'return'; // (the player gone past its leash)
    for (let t = 0; t < 10; t += 1 / 30) {
      hostileSystem.update(world, 1 / 30);
      movementSystem.update(world, 1 / 30);
    }
    expect(world.read(wolf, Hostile).state).toBe('idle');
    world.spawn([Player, true], [Transform, { x: 45, y: 0, z: 54, facing: 0 }]);
    hostileSystem.update(world, 1 / 30);
    expect(world.read(wolf, Hostile).state).toBe('chase');
  });
});
