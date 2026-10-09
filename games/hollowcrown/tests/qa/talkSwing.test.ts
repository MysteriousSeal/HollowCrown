// QA: Space both talks and swings. From real key events through the engine's keyboard, the player's input, the talk
// and the attack: no swing while a talk is open, none on the press that closes it, and the next press swings again.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Attack, Faction, Health, Hit, Player, Transform, attack, attackSystem, health } from '@voxel/engine/gameplay';
import { Keyboard, KeyboardResource, ScreenAxes, playerInputSystem } from '@voxel/engine/input';
import { endTalk, talkSystem, type Talk } from '../../src/systems/talk';

let keyListeners: Map<string, (e: unknown) => void>;
beforeEach(() => {
  keyListeners = new Map();
  vi.stubGlobal('window', { addEventListener: (type: string, fn: (e: unknown) => void) => keyListeners.set(type, fn) });
});
afterEach(() => vi.unstubAllGlobals());

const press = (code: string) => {
  keyListeners.get('keydown')!({ code, repeat: false, preventDefault() {} });
  keyListeners.get('keyup')!({ code, repeat: false, preventDefault() {} });
};

function scene() {
  const world = new World();
  world.setResource(KeyboardResource, new Keyboard());
  world.setResource(ScreenAxes, { forward: { x: 0, z: 1 }, right: { x: 1, z: 0 } } as never);
  const hero = world.spawn([Player, true], [Transform, { x: 0, y: 0, z: 0, facing: 0 }], [Attack, attack(5, { cooldown: 0 })], [Faction, 'hero']);
  const villager = world.spawn([Transform, { x: 0, y: 0, z: 0.5, facing: Math.PI }], [Health, health(20)], [Faction, 'folk']);
  const talk: Talk = { with: null, justEnded: false };
  const talking = talkSystem(talk, hero, () => true, () => {});
  let hits = 0;
  const frame = () => {
    for (const s of [playerInputSystem, talking, attackSystem]) s.update(world, 1 / 30);
    hits += world.eventsOf(Hit).length;
    world.clearEvents();
  };
  return { world, hero, villager, talk, frame, hits: () => hits };
}

describe('Space in a talk', () => {
  it('never swings while talking, nor on the press that ends the talk; the next press swings', () => {
    const { world, hero, villager, talk, frame, hits } = scene();
    talk.with = villager; // a talk open with the villager in front
    press('Space'); // the next line
    frame();
    expect(hits()).toBe(0);
    press('Space'); // the last line: the conversation closes on this press
    endTalk(world, talk, hero);
    frame();
    frame();
    expect(hits()).toBe(0);
    press('Space'); // a press of its own, the talk over
    frame();
    expect(hits()).toBe(1);
  });
});
