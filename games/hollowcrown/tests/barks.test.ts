// Barks: a villager passed says a line, then is quiet a while; a line after MQ01 is only said once it's happened,
// and said first then.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Transform } from '@voxel/engine/gameplay';
import { BARK_EVERY, Barked, barkSystem, barksOf, hasHappened } from '../src/systems/barks';
import { Quests, newBook } from '../src/systems/quests';
import { Resident } from '../src/systems/villagerDay';

describe('barks', () => {
  it('holds back a line until what it waits on has happened', () => {
    const book = newBook();
    const before = barksOf('Edric Tidy', book);
    expect(before.some((l) => l.startsWith('Someone'))).toBe(false);
    book.quests.push({ quest: 'MQ01', stage: 'dawn', done: [], finished: true });
    expect(hasHappened(book, 'MQ01')).toBe(true);
    expect(barksOf('Edric Tidy', book)).toHaveLength(before.length + 1);
    book.flags.some_flag = true;
    expect(hasHappened(book, 'some_flag')).toBe(true);
  });

  it('says a line as the hero passes (the newest first), then keeps quiet a while', () => {
    const world = new World();
    const book = world.setResource(Quests, newBook());
    book.quests.push({ quest: 'MQ01', stage: 'dawn', done: [], finished: true });
    const hero = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
    world.spawn([Transform, { x: 1, y: 0, z: 0, facing: 0 }], [Resident, { name: 'Edric Tidy', home: { x: 1, z: 0 }, facing: 0, seated: false }]);
    const system = barkSystem(hero);
    const heard: string[] = [];
    const step = (dt: number) => {
      world.clearEvents();
      system.update(world, dt);
      heard.push(...world.eventsOf(Barked).map((b) => b.line));
    };
    step(0.1);
    expect(heard).toEqual(["Someone's walking the meadows at night. Barefoot. Small feet."]);
    step(1);
    expect(heard).toHaveLength(1);
    step(BARK_EVERY);
    expect(heard).toHaveLength(2);
  });
});
