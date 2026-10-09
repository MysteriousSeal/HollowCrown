// The quests played (features/quests.ts): being at a spot, talking to someone asked for, and choosing move MQ01 on;
// a stage with an hour moves the clock.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { TimeOfDay } from '@voxel/engine/gameplay';
import { loadWorldMap } from '@voxel/engine/world';
import { PEOPLE_DATA } from '../src/data/people';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { QUESTS } from '../src/data/quests';
import { complete, isAt, talkWith } from '../src/features/quests';
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

  it("asks Garrick's choice at the inn, its reply setting the flag, and on through midnight to dawn", () => {
    const { world, book } = atStage('the-inn');
    const talk = talkWith(world, 'Garrick Fenn');
    const asked = talk.lines.findIndex((l) => l.choices);
    expect(talk.lines[asked].choices).toHaveLength(4);
    expect(talk.lines[asked].text).toBe('Nobody comes to the Vale on purpose. So. Why?');
    talk.onChoice(asked, 1);
    talk.onClose();
    expect(book.flags.hero_reason).toBe('work');
    expect(book.quests[0].stage).toBe('dawn'); // (midnight's fight isn't played yet: passed through)
    expect(book.flags.mq01_dead_walked).toBe(true);
    expect(world.resource(TimeOfDay).hours).toBe(6);
  });

  it('names anyone else speaking in a talk (Garrick, at the well with Cuthwin)', () => {
    const { world } = atStage('dawn');
    expect(talkWith(world, 'Father Cuthwin').lines.at(-1)!.text).toMatch(/^Garrick Fenn: /);
  });

  it('has only first words for someone the quests ask nothing of', () => {
    const { world } = atStage('the-inn');
    expect(talkWith(world, 'Old Meg').lines).toEqual([{ side: 'right', text: PEOPLE_DATA['Old Meg'].firstWords }]);
  });
});
