import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { FaceToward, Transform, angleToward, faceToward, facingSystem } from '../src/gameplay';

function pair(facing: number) {
  const world = new World();
  const player = world.spawn([Transform, { x: 5, y: 0, z: 0, facing: 0 }]);
  const npc = world.spawn([Transform, { x: 0, y: 0, z: 0, facing }], [FaceToward, faceToward(player, 4)]);
  return { world, player, at: world.read(npc, Transform) };
}

describe('facing', () => {
  it('turns toward its target at its rate, then faces it', () => {
    const { world, at } = pair(0); // facing +z; the player is to +x, a quarter turn away
    facingSystem.update(world, 0.1);
    expect(at.facing).toBeCloseTo(0.4);
    facingSystem.update(world, 1);
    expect(at.facing).toBeCloseTo(Math.PI / 2);
  });

  it('turns the short way round', () => {
    const { world, at } = pair(-2.5); // the player a quarter turn round past the back: shorter clockwise, through pi
    facingSystem.update(world, 0.05);
    const turned = Math.atan2(Math.sin(at.facing + 2.5), Math.cos(at.facing + 2.5));
    expect(Math.abs(turned)).toBeCloseTo(0.2);
    expect(at.facing).toBeLessThan(-2.5); // (clockwise, away from 0)
    facingSystem.update(world, 2);
    expect(Math.cos(at.facing - Math.PI / 2)).toBeCloseTo(1);
  });

  it('follows a target that moves, and stays put if it\'s gone', () => {
    const { world, player, at } = pair(Math.PI / 2);
    world.read(player, Transform).x = -5;
    facingSystem.update(world, 5);
    expect(Math.cos(at.facing + Math.PI / 2)).toBeCloseTo(1);
    world.despawn(player);
    const before = at.facing;
    facingSystem.update(world, 1);
    expect(at.facing).toBe(before);
  });

  it('measures the angle from one point to another as Transform.facing does', () => {
    expect(angleToward({ x: 0, z: 0 }, { x: 0, z: 1 })).toBeCloseTo(0);
    expect(angleToward({ x: 0, z: 0 }, { x: 1, z: 0 })).toBeCloseTo(Math.PI / 2);
    expect(() => faceToward(1, 0)).toThrow();
  });
});
