import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import {
  Attack, Faction, Health, Hostile, MoveIntent, Player, Transform, attack, attackSystem, health, healthSystems, hostile, hostileSystem, movementSystem,
} from '../src/gameplay';
import { TerrainResource, flatTerrain } from '../src/world';

function hunt() {
  const world = new World();
  world.setResource(TerrainResource, flatTerrain({ width: 100, depth: 100 }, 0));
  const hero = world.spawn([Player, true], [Transform, { x: 50, y: 0, z: 50, facing: 0 }], [Health, health(30)], [Faction, 'hero']);
  const wolf = world.spawn([Transform, { x: 50, y: 0, z: 58, facing: 0 }], [Health, health(10)], [Faction, 'wolves'],
    [Attack, attack(4, { cooldown: 1 })], [Hostile, hostile({ sight: 6, leash: 14, speed: 3 })]);
  const [health1] = healthSystems();
  const step = (dt = 1 / 30) => {
    hostileSystem.update(world, dt);
    movementSystem.update(world, dt);
    attackSystem.update(world, dt);
    health1.update(world, dt);
    world.clearEvents();
  };
  return { world, hero, wolf, state: world.read(wolf, Hostile), wolfAt: world.read(wolf, Transform), heroAt: world.read(hero, Transform), step };
}

describe('hostiles', () => {
  it('idle until the player comes within sight', () => {
    const { state, wolfAt, step } = hunt();
    for (let i = 0; i < 30; i++) step();
    expect(state.state).toBe('idle');
    expect(wolfAt.z).toBe(58);
  });

  it('chase the player and bite in reach, once a cooldown', () => {
    const { world, hero, state, heroAt, wolfAt, step } = hunt();
    heroAt.z = 53;
    for (let i = 0; i < 30 * 3; i++) step(); // three seconds
    expect(state.state).toBe('chase');
    expect(Math.hypot(wolfAt.x - heroAt.x, wolfAt.z - heroAt.z)).toBeLessThan(0.8);
    const hp = world.read(hero, Health).hp;
    expect(hp).toBeLessThan(30);
    expect(hp).toBeGreaterThanOrEqual(30 - 4 * 3); // (a bite a second at most)
  });

  it('give up past their leash and go home, then idle', () => {
    const { world, state, heroAt, wolfAt, step } = hunt();
    heroAt.z = 53;
    for (let i = 0; i < 30; i++) step();
    heroAt.z = 20; // (gone far off)
    step();
    expect(state.state).toBe('return');
    for (let i = 0; i < 30 * 10; i++) step();
    expect(state.state).toBe('idle');
    expect(Math.hypot(wolfAt.x - 50, wolfAt.z - 58)).toBeLessThan(0.6);
    const intent = world.read(world.first(Hostile)!, MoveIntent);
    expect([intent.x, intent.z]).toEqual([0, 0]);
  });

  it('rejects a leash shorter than its sight', () => {
    expect(() => hostile({ sight: 8, leash: 4 })).toThrow();
  });
});
