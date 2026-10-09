import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { MoveSpeed, Transform, WANDER_SPEED, Wander, movementSystem, wander, wanderSystem } from '../src/gameplay';
import { Obstacles, ObstaclesResource, TerrainResource, flatTerrain } from '../src/world';

function wanderer(options: Parameters<typeof wander>[1] = {}) {
  const world = new World();
  world.setResource(TerrainResource, flatTerrain({ width: 100, depth: 100 }, 0));
  const e = world.spawn([Transform, { x: 50, y: 0, z: 50, facing: 0 }], [Wander, wander({ x: 50, z: 50 }, options)]);
  const run = (seconds: number, dt = 1 / 30, each?: () => void) => {
    for (let t = 0; t < seconds; t += dt) {
      wanderSystem.update(world, dt);
      movementSystem.update(world, dt);
      each?.();
    }
  };
  return { world, e, at: world.read(e, Transform), state: world.read(e, Wander), run };
}

describe('wander', () => {
  it('strolls round its home, never beyond its radius, at its easy speed', () => {
    const { world, e, at, run } = wanderer({ radius: 3, pause: [0.2, 0.5] });
    let farthest = 0;
    let fastest = 0;
    let moved = false;
    run(60, 1 / 30, () => {
      farthest = Math.max(farthest, Math.hypot(at.x - 50, at.z - 50));
      fastest = Math.max(fastest, world.get(e, MoveSpeed) ?? 0);
      moved ||= Math.hypot(at.x - 50, at.z - 50) > 0.5;
    });
    expect(moved).toBe(true);
    expect(farthest).toBeLessThanOrEqual(3.01);
    expect(fastest).toBeLessThanOrEqual(WANDER_SPEED + 1e-9);
  });

  it('pauses between strolls', () => {
    const { state, run } = wanderer({ pause: [1, 2] });
    let stood = 0;
    run(30, 1 / 30, () => (stood += state.target ? 0 : 1 / 30));
    expect(stood).toBeGreaterThan(3);
  });

  it('gives up on a spot it can\'t reach and pauses', () => {
    const { world, state, at, run } = wanderer({ radius: 4, pause: [0.1, 0.2] });
    const walls = new Obstacles(); // boxed in: a pen a tile across
    for (const box of [
      { x0: 49, x1: 51, z0: 48.9, z1: 49.3 },
      { x0: 49, x1: 51, z0: 50.7, z1: 51.1 },
      { x0: 48.9, x1: 49.3, z0: 49, z1: 51 },
      { x0: 50.7, x1: 51.1, z0: 49, z1: 51 },
    ])
      walls.add(box);
    world.setResource(ObstaclesResource, walls);
    let gaveUp = 0;
    let had = false;
    run(20, 1 / 30, () => {
      if (had && !state.target) gaveUp++;
      had = state.target !== null;
    });
    expect(gaveUp).toBeGreaterThan(2);
    expect(Math.abs(at.x - 50)).toBeLessThan(0.7);
    expect(Math.abs(at.z - 50)).toBeLessThan(0.7);
  });

  it('wanders the same way each time', () => {
    const [a, b] = [wanderer(), wanderer()];
    a.run(10);
    b.run(10);
    expect([a.at.x, a.at.z]).toEqual([b.at.x, b.at.z]);
  });

  it('rejects a bad radius, speed or pause', () => {
    expect(() => wander({ x: 0, z: 0 }, { radius: 0 })).toThrow();
    expect(() => wander({ x: 0, z: 0 }, { speed: -1 })).toThrow();
    expect(() => wander({ x: 0, z: 0 }, { pause: [3, 1] })).toThrow();
  });
});
