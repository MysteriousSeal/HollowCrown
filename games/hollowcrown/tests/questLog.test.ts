// The HUD's reading of the quest log: the quest followed, and the news for its notices.

import { describe, expect, it } from 'vitest';
import { QUESTS } from '../src/data/quests';
import { journalEntries, questNews, snapshot, startLog, trackedOf } from '../src/ui/questLog';

const feather = QUESTS.MQ01.stages[0].objectives[0];

describe('the journal', () => {
  it("lists MQ01 at its stage, the past stages' objectives struck through, its passage once finished", () => {
    const [first, second] = QUESTS.MQ01.stages;
    const log = startLog();
    log.quests[0].stage = second.id;
    log.quests[0].done = [second.objectives[0].id];
    const [entry] = journalEntries(log);
    expect([entry.title, entry.sub, entry.text]).toEqual(['The Stranger at the Ford', second.title, undefined]);
    expect(entry.items.map((i) => i.done)).toEqual([...first.objectives.map(() => true), true, ...second.objectives.slice(1).map(() => false)]);
    log.quests[0].finished = true;
    expect(journalEntries(log)[0]).toMatchObject({ sub: 'Finished', text: QUESTS.MQ01.journal, finished: true });
  });
});

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
