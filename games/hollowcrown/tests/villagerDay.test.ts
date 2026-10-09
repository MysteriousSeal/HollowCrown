// A villager's day: strolling round their door by day, walking back and standing there by night; the seated never
// stroll.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { MoveIntent, TimeOfDay, Transform, Wander } from '@voxel/engine/gameplay';
import { Resident, isDay, villagerDaySystem } from '../src/systems/villagerDay';

const setup = (hours: number, seated = false) => {
  const world = new World();
  world.setResource(TimeOfDay, { hours, rate: 0 });
  const person = world.spawn([Transform, { x: 2, y: 0, z: 0, facing: 1 }], [Resident, { name: 'Odo Pell', home: { x: 0, z: 0 }, facing: 0, seated }]);
  return { world, person };
};

describe('villagerDay', () => {
  it('knows day from night', () => {
    expect(isDay(12)).toBe(true);
    expect(isDay(22)).toBe(false);
    expect(isDay(5)).toBe(false);
  });

  it('strolls round their door by day', () => {
    const { world, person } = setup(12);
    villagerDaySystem.update(world, 1 / 60);
    expect(world.read(person, Wander).home).toEqual({ x: 0, z: 0 });
  });

  it('walks back to their door at night, and stands there facing out', () => {
    const { world, person } = setup(12);
    villagerDaySystem.update(world, 1 / 60);
    world.resource(TimeOfDay).hours = 22;
    villagerDaySystem.update(world, 1 / 60);
    expect(world.has(person, Wander)).toBe(false);
    expect(world.read(person, MoveIntent).x).toBeLessThan(0);
    Object.assign(world.read(person, Transform), { x: 0.05, z: 0 });
    villagerDaySystem.update(world, 1 / 60);
    expect(world.read(person, MoveIntent)).toEqual({ x: 0, z: 0 });
    expect(world.read(person, Transform).facing).toBe(0);
  });

  it('leaves the seated sat', () => {
    const { world, person } = setup(12, true);
    villagerDaySystem.update(world, 1 / 60);
    expect(world.has(person, Wander)).toBe(false);
  });
});
