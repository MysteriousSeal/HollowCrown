// The quests played (features/quests.ts): being at a spot, talking to someone asked for, and choosing move MQ01 on;
// a stage with an hour moves the clock.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Died, Health, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { loadWorldMap } from '@voxel/engine/world';
import { PEOPLE_DATA } from '../src/data/people';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { QUESTS } from '../src/data/quests';
import { complete, isAt, questSystem, talkWith } from '../src/features/quests';
import { withRest } from '../src/features/rest';
import { Creature } from '../src/systems/kills';
import { LastRest } from '../src/systems/respawn';
import { Quests, newBook, startQuest } from '../src/systems/quests';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);

const atStage = (stage: string) => {
  const world = new World();
  world.setResource(TimeOfDay, { hours: 17, rate: 0 });
  const book = world.setResource(Quests, newBook());
  startQuest(book, QUESTS, 'MQ01');
  Object.assign(book.quests[0], { stage, done: [] });
  return { world, book };
};

describe('quest play', () => {
  it('knows when the hero is at a place, a tile or in an area', () => {
    expect(isAt(map, 'pilgrims-shrine', 482, 3381)).toBe(true);
    expect(isAt(map, 'pilgrims-shrine', 500, 3381)).toBe(false);
    expect(isAt(map, 'brindleford', 890, 3350)).toBe(true);
    expect(isAt(map, [560, 3374], 561, 3375)).toBe(true);
    expect(isAt(map, 'birchwood', 600, 3600)).toBe(true);
  });

  it('moves the clock to a stage\'s hour as it begins', () => {
    const { world, book } = atStage('road-east');
    complete(world, 'MQ01', 'pilgrim');
    complete(world, 'MQ01', 'wolves');
    complete(world, 'MQ01', 'brindleford');
    expect(book.quests[0].stage).toBe('the-bell');
    expect(world.resource(TimeOfDay).hours).toBe(21);
  });

  it("talks to Pell at the bell: the quest's lines, the hero's on the left, done as it closes", () => {
    const { world, book } = atStage('the-bell');
    const talk = talkWith(world, 'Odo Pell');
    expect(talk.lines.map((l) => l.side)).toEqual(['right', 'left', 'right']);
    expect(talk.lines[1].text).toBe('Robbed. On your road.');
    talk.onClose();
    expect(book.quests[0].stage).toBe('the-inn');
  });

  it("asks Garrick's choice at the inn, its reply setting the flag, then the bed, slept in, brings midnight", () => {
    const { world, book } = atStage('the-inn');
    const talk = talkWith(world, 'Garrick Fenn');
    const asked = talk.lines.findIndex((l) => l.choices);
    expect(talk.lines[asked].choices).toHaveLength(4);
    expect(talk.lines[asked].text).toBe('Nobody comes to the Vale on purpose. So. Why?');
    talk.onChoice(asked, 1);
    talk.onClose();
    expect(book.flags.hero_reason).toBe('work');
    expect(book.quests[0].stage).toBe('the-inn'); // (waiting for midnight)
    const hero = world.spawn([Transform, { x: 906, y: 0, z: 3346, facing: 0 }], [Health, { hp: 5, max: 30 }]);
    const again = withRest(world, hero, 'Garrick Fenn', talkWith(world, 'Garrick Fenn'));
    const offer = again.lines.findIndex((l) => l.choices);
    again.onChoice(offer, 0);
    again.onClose();
    expect(book.quests[0].stage).toBe('midnight');
    expect(world.resource(TimeOfDay).hours).toBe(0);
    expect(world.read(hero, Health).hp).toBe(30);
    expect(world.resource(LastRest)).toEqual({ x: 906, z: 3346 });
  });

  it('names anyone else speaking in a talk (Garrick, at the well with Cuthwin)', () => {
    const { world } = atStage('dawn');
    expect(talkWith(world, 'Father Cuthwin').lines.at(-1)!.who).toBe('Garrick Fenn');
  });

  it('wins the wolves once both have died, each death counted once however often told', () => {
    const { world, book } = atStage('road-east');
    const hero = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
    const wolves = [0, 1].map(() => world.spawn([Transform, { x: 650, y: 0, z: 3420, facing: 0 }], [Creature, { id: 'wolf', name: 'Wolf' }]));
    const system = questSystem(map, hero);
    world.emit(Died, { entity: wolves[0], by: hero });
    system.update(world, 1 / 60);
    system.update(world, 1 / 60); // (the same frame's events, told again)
    expect(book.quests[0].done).not.toContain('wolves');
    world.clearEvents();
    world.emit(Died, { entity: wolves[1], by: hero });
    system.update(world, 1 / 60);
    expect(book.quests[0].done).toContain('wolves');
  });

  it('sleeps to morning at the inn when no wait is on, and offers no bed while the quests ask things of Garrick', () => {
    const { world } = atStage('dawn');
    world.resource(TimeOfDay).hours = 14;
    const hero = world.spawn([Transform, { x: 906, y: 0, z: 3346, facing: 0 }], [Health, { hp: 5, max: 30 }]);
    const talk = withRest(world, hero, 'Garrick Fenn', talkWith(world, 'Garrick Fenn'));
    talk.onChoice(talk.lines.findIndex((l) => l.choices), 0);
    talk.onClose();
    expect(world.resource(TimeOfDay).hours).toBe(6);
    const { world: busy } = atStage('the-inn');
    expect(withRest(busy, hero, 'Garrick Fenn', talkWith(busy, 'Garrick Fenn')).lines.at(-1)!.choices).toHaveLength(4);
  });

  it('has only first words for someone the quests ask nothing of', () => {
    const { world } = atStage('the-inn');
    expect(talkWith(world, 'Old Meg').lines).toEqual([{ side: 'right', text: PEOPLE_DATA['Old Meg'].firstWords }]);
  });
});
