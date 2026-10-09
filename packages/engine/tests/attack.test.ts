import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import {
  Acting, Attack, AttackIntent, Faction, Health, Hit, Player, Transform, actingSystem, attack, attackSystem, health, inReach,
} from '../src/gameplay';
import { KeyboardResource, ScreenAxes, playerInputSystem, type Action, type Keyboard } from '../src/input';

function arena() {
  const world = new World();
  const hero = world.spawn([Transform, { x: 10, y: 0, z: 10, facing: 0 }], [Health, health(30)], [Attack, attack(5, { reach: 0.6, cooldown: 0.5 })], [Faction, 'hero']);
  const at = (x: number, z: number, faction = 'wolves') => world.spawn([Transform, { x, y: 0, z, facing: 0 }], [Health, health(10)], [Faction, faction]);
  return { world, hero, at };
}
const hits = (world: World) => world.eventsOf(Hit).map((h) => h.target);

describe('attacks', () => {
  it('hit everyone alive in reach and arc before it, but its own side', () => {
    const { world, hero, at } = arena();
    const ahead = at(10, 10.6);
    const aside = at(10.4, 10.4);
    const behind = at(10, 9.5);
    const far = at(10, 11.5);
    const friend = at(10.1, 10.5, 'hero');
    world.add(hero, AttackIntent, true);
    attackSystem.update(world, 0);
    expect(hits(world).sort()).toEqual([ahead, aside].sort());
    expect(world.eventsOf(Hit)[0]).toMatchObject({ by: hero, damage: 5 });
    for (const e of [behind, far, friend]) expect(hits(world)).not.toContain(e);
  });

  it('swing once a cooldown, the intent taken either way', () => {
    const { world, hero, at } = arena();
    at(10, 10.5);
    world.add(hero, AttackIntent, true);
    attackSystem.update(world, 0);
    world.clearEvents();
    world.add(hero, AttackIntent, true);
    attackSystem.update(world, 0.2);
    expect(hits(world)).toEqual([]);
    expect(world.has(hero, AttackIntent)).toBe(false);
    world.add(hero, AttackIntent, true);
    attackSystem.update(world, 0.31);
    expect(hits(world)).toHaveLength(1);
  });

  it('acts out the swing, and the flinch of who it hit, for the models', () => {
    const { world, hero, at } = arena();
    const wolf = at(10, 10.5);
    world.add(hero, AttackIntent, true);
    attackSystem.update(world, 0);
    actingSystem.update(world, 0.1);
    expect(world.read(hero, Acting)).toMatchObject({ action: 'attack' });
    expect(world.read(wolf, Acting)).toMatchObject({ action: 'hurt', time: 0 });
    world.clearEvents();
    actingSystem.update(world, 1);
    expect(world.has(hero, Acting)).toBe(false);
  });

  it('reach the edge of a body, and anything right on top', () => {
    expect(inReach({ x: 0, z: 0, facing: 0 }, { x: 0, z: 0.7 }, 0.6, 1, 0.15)).toBe(true);
    expect(inReach({ x: 0, z: 0, facing: 0 }, { x: 0, z: 0.8 }, 0.6, 1, 0.15)).toBe(false);
    expect(inReach({ x: 0, z: 0, facing: 0 }, { x: 0, z: 0 }, 0.6, 1, 0.15)).toBe(true);
    expect(() => attack(0)).toThrow();
  });

  it('swing for the player on a press of attack', () => {
    const world = new World();
    const pressed = new Set<Action>(['attack']);
    world.setResource(KeyboardResource, { isHeld: () => false, takePress: (a: Action) => pressed.delete(a) } as unknown as Keyboard);
    world.setResource(ScreenAxes, { forward: { x: 0, z: -1 }, right: { x: 1, z: 0 } } as never);
    const hero = world.spawn([Player, true]);
    playerInputSystem.update(world, 0);
    expect(world.has(hero, AttackIntent)).toBe(true);
  });
});
