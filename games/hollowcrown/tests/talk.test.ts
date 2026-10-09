// Talking: interacting with a villager starts a talk (they stop strolling, the two face each other, the hero stays
// put); ending it lets them go, and the press that ended it doesn't start another.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { FaceToward, Interact, MoveIntent, TimeOfDay, Transform, Wander, wander } from '@voxel/engine/gameplay';
import { Talking, endTalk, talkSystem, type Talk } from '../src/systems/talk';
import { Resident, villagerDaySystem } from '../src/systems/villagerDay';

const setup = () => {
  const world = new World();
  world.setResource(TimeOfDay, { hours: 12, rate: 0 });
  const hero = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }], [MoveIntent, { x: 1, z: 0 }]);
  const npc = world.spawn(
    [Transform, { x: 1, y: 0, z: 0, facing: 0 }],
    [Resident, { home: { x: 1, z: 0 }, facing: 0, seated: false }],
    [Wander, wander({ x: 1, z: 0 })],
  );
  const talk: Talk = { with: null, justEnded: false };
  const opened: number[] = [];
  const system = talkSystem(talk, hero, (e) => world.has(e, Resident), (e) => opened.push(e));
  const press = () => {
    world.clearEvents();
    world.emit(Interact, { target: npc, by: hero });
    system.update(world, 1 / 60);
    villagerDaySystem.update(world, 1 / 60);
  };
  return { world, hero, npc, talk, opened, press };
};

describe('talk', () => {
  it('starts on interact: the villager stops, both face each other, the hero stays put', () => {
    const { world, hero, npc, talk, opened, press } = setup();
    press();
    expect(opened).toEqual([npc]);
    expect(talk.with).toBe(npc);
    expect(world.has(npc, Wander)).toBe(false);
    expect(world.has(npc, Talking)).toBe(true);
    expect(world.read(npc, FaceToward).target).toBe(hero);
    expect(world.read(hero, FaceToward).target).toBe(npc);
    expect(world.read(hero, MoveIntent)).toEqual({ x: 0, z: 0 });
  });

  it("doesn't start again on presses mid-talk, nor on the press that ended it", () => {
    const { world, hero, opened, talk, press } = setup();
    press();
    press();
    expect(opened).toHaveLength(1);
    endTalk(world, talk, hero);
    press();
    expect(opened).toHaveLength(1);
    press();
    expect(opened).toHaveLength(2);
  });

  it('lets them go when it ends: the villager strolls again', () => {
    const { world, hero, npc, talk, press } = setup();
    press();
    endTalk(world, talk, hero);
    villagerDaySystem.update(world, 1 / 60);
    expect(world.has(npc, FaceToward) || world.has(hero, FaceToward) || world.has(npc, Talking)).toBe(false);
    expect(world.has(npc, Wander)).toBe(true);
  });
});
