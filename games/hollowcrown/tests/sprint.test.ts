// Sprinting: holding it while moving eases the player up to a run; letting go, or standing still, eases them back.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { MoveIntent, MoveSpeed, Player } from '@voxel/engine/gameplay';
import { sprintSystem, type Sprint } from '../src/systems/sprint';

const setup = (x: number) => {
  const world = new World();
  const hero = world.spawn([Player, true], [MoveSpeed, 3], [MoveIntent, { x, z: 0 }]);
  const state: Sprint = { held: false, pace: 0 };
  const system = sprintSystem(state, 3, 5);
  const run = (seconds: number) => { for (let t = 0; t < seconds; t += 1 / 60) system.update(world, 1 / 60); };
  return { world, hero, state, run };
};

describe('sprint', () => {
  it('runs while held and moving, walks again once let go', () => {
    const { world, hero, state, run } = setup(1);
    run(1);
    expect(world.read(hero, MoveSpeed)).toBeCloseTo(3);
    state.held = true;
    run(1.5);
    expect(world.read(hero, MoveSpeed)).toBeCloseTo(5, 1);
    state.held = false;
    run(1.5);
    expect(world.read(hero, MoveSpeed)).toBeCloseTo(3, 1);
  });

  it("doesn't build up a run while standing still", () => {
    const { state, run } = setup(0);
    state.held = true;
    run(1);
    expect(state.pace).toBeLessThan(0.01);
  });
});
