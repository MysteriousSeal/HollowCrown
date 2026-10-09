// What the quest tracker says: the quest's name, its stage, and the first thing still to do.

import { describe, expect, it } from 'vitest';
import { QUESTS } from '../src/data/quests';
import { trackedOf, startLog } from '../src/ui/questLog';
import { trackerText } from '../src/ui/questText';

const START_PROGRESS = trackedOf(startLog())!;

const waking = QUESTS.MQ01.stages[0];

describe('the quest tracker', () => {
  it('follows MQ01 from its first objective at the start', () => {
    expect(trackerText(START_PROGRESS)).toEqual({ title: 'The Stranger at the Ford', sub: 'Waking', line: waking.objectives[0].text });
  });

  it('moves to the next objective once one is done, and says nothing once all are', () => {
    expect(trackerText({ ...START_PROGRESS, done: [waking.objectives[0].id] })?.line).toBe(waking.objectives[1].text);
    expect(trackerText({ ...START_PROGRESS, done: waking.objectives.map((o) => o.id) })).toBeNull();
  });

  it('says nothing of a quest not written', () => {
    expect(trackerText({ quest: 'MQ99', stage: 'x', done: [] })).toBeNull();
  });
});
