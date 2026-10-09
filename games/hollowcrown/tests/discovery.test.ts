// Discovery: a quest found in the wild starts as the hero first comes near its spot, or examines its thing, once its
// quests before are done; told once; and isn't given out by anyone or started by itself.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Interact, Transform } from '@voxel/engine/gameplay';
import type { Quest } from '../src/data/quests';
import { QUESTS } from '../src/data/quests';
import { Discovered, Examinable, discoverySystem } from '../src/systems/discovery';
import { readyToStart } from '../src/systems/questStarts';
import { Quests, newBook } from '../src/systems/quests';

const wild = (id: string, found: unknown, after: string[] = []): Quest =>
  ({ ...QUESTS['SQ-BV2'], id, start: { after, found } }) as unknown as Quest;
const quests: Record<string, Quest> = {
  ...QUESTS,
  'SQ-WILD1': wild('SQ-WILD1', { at: [100, 100], radius: 5 }),
  'SQ-WILD2': wild('SQ-WILD2', { examine: { at: [50, 50], label: 'Examine the cart' } }),
  'SQ-WILD3': wild('SQ-WILD3', { at: [100, 100], radius: 5 }, ['MQ04']),
};

const setup = () => {
  const world = new World();
  const book = world.setResource(Quests, newBook());
  const hero = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
  const cart = world.spawn([Transform, { x: 50, y: 0, z: 50, facing: 0 }], [Examinable, { quest: 'SQ-WILD2' }]);
  const system = discoverySystem(hero, quests, () => {});
  const step = () => {
    world.clearEvents();
    system.update(world, 1 / 60);
    return world.eventsOf(Discovered).map((d) => d.quest);
  };
  return { world, book, hero, cart, step };
};

describe('discovery', () => {
  it('starts a quest as the hero first comes near its spot, once, and not one still waiting', () => {
    const { world, book, hero, step } = setup();
    expect(step()).toEqual([]);
    Object.assign(world.read(hero, Transform), { x: 102, z: 101 });
    expect(step()).toEqual(['SQ-WILD1']);
    expect(step()).toEqual([]);
    expect(book.quests.map((q) => q.quest)).toEqual(['SQ-WILD1']);
  });

  it('starts one as its thing is examined', () => {
    const { world, hero, cart, step } = setup();
    world.emit(Interact, { target: cart, by: hero });
    const system = discoverySystem(hero, quests, () => {});
    system.update(world, 1 / 60);
    expect(world.eventsOf(Discovered).map((d) => d.quest)).toEqual(['SQ-WILD2']);
    expect(step()).toEqual([]);
  });

  it("isn't started by itself or given by anyone", () => {
    expect(readyToStart(newBook(), quests)).not.toContain('SQ-WILD1');
  });
});
