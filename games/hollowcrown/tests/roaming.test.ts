// The roaming foes: out in their hours (past midnight too), after and until what they wait on, never if ruled out;
// back after their days once killed; standing on walkable ground in their range; the days counted at midnight.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { TimeOfDay } from '@voxel/engine/gameplay';
import { loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { BRINDLE_VALE_ENCOUNTERS } from '../src/data/world/encounters';
import { CREATURES } from '../src/creatures';
import { FOES } from '../src/systems/foes';
import { newBook } from '../src/systems/quests';
import { Roaming, calendarSystem, inHours, isBack, isOut, rangeOf, spotsOf } from '../src/systems/roaming';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const enc = (id: string) => BRINDLE_VALE_ENCOUNTERS.find((e) => e.id === id)!;

describe('roaming', () => {
  it('knows its hours, wrapping past midnight', () => {
    expect(inHours(19, [18, 21])).toBe(true);
    expect(inHours(2, [21, 5])).toBe(true);
    expect(inHours(12, [21, 5])).toBe(false);
  });

  it('brings the Hungry onto Chapel Hill at night after MQ01, not after MQ02, never once the pit is blessed', () => {
    const book = newBook();
    const hungry = enc('chapel-hill-hungry');
    expect(isOut(hungry, 23, book)).toBe(false);
    book.quests.push({ quest: 'MQ01', stage: 'dawn', done: [], finished: true });
    expect(isOut(hungry, 23, book)).toBe(true);
    expect(isOut(hungry, 12, book)).toBe(false);
    book.flags.famine_pit = 'blessed';
    expect(isOut(hungry, 23, book)).toBe(false);
  });

  it('brings a band back after its days, and one that never comes back, never', () => {
    expect(isBack(enc('birchwood-boar-west'), 2, 6)).toBe(false);
    expect(isBack(enc('birchwood-boar-west'), 2, 7)).toBe(true);
    expect(isBack(enc('marsh-cairn-skeleton'), 2, 100)).toBe(false);
    expect(isBack(enc('marsh-cairn-skeleton'), undefined, 0)).toBe(true);
  });

  it('stands every band on walkable ground in its range, as foes and models that exist', () => {
    for (const e of BRINDLE_VALE_ENCOUNTERS) {
      const spots = spotsOf(e, map);
      expect(spots.length, e.id).toBe(e.count);
      const { at, radius } = rangeOf(e);
      for (const [x, z] of spots) expect(Math.hypot(x - at[0], z - at[1]), e.id).toBeLessThanOrEqual(radius + 0.01);
      expect(FOES[e.foe], e.foe).toBeDefined();
      for (const m of [e.foe, e.leader].filter(Boolean)) expect(CREATURES.some((c) => c.id === m), m).toBe(true);
    }
  });

  it('counts a day each time the clock passes midnight', () => {
    const world = new World();
    world.setResource(TimeOfDay, { hours: 23, rate: 0 });
    world.setResource(Roaming, { day: 0, killed: {} });
    calendarSystem.update(world, 1);
    world.resource(TimeOfDay).hours = 0.5;
    calendarSystem.update(world, 1);
    expect(world.resource(Roaming).day).toBe(1);
  });
});
