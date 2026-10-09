// The HUD's reading of the quest log: the quest followed, and the news for its notices.

import { describe, expect, it } from 'vitest';
import { QUESTS } from '../src/data/quests';
import { questNews, snapshot, startLog, trackedOf } from '../src/ui/questLog';

const feather = QUESTS.MQ01.stages[0].objectives[0];

describe('the quest log', () => {
  it('follows MQ01 at the start', () => {
    expect(trackedOf(startLog())?.quest).toBe('MQ01');
    expect(trackedOf({ quests: [], tracked: null })).toBeNull();
  });

  it('tells a quest started, an objective done, a quest finished, once each', () => {
    const log = startLog();
    expect(questNews([], log.quests)).toEqual([{ title: 'Quest started', text: 'The Stranger at the Ford' }]);
    const before = snapshot(log);
    log.quests[0].done.push(feather.id);
    log.quests[0].finished = true;
    expect(questNews(before, log.quests)).toEqual([
      { title: 'Objective done', text: feather.text },
      { title: 'Quest finished', text: 'The Stranger at the Ford' },
    ]);
    expect(questNews(snapshot(log), log.quests)).toEqual([]);
  });
});
