// QA: every quest written can be followed. Each stage of each quest gives the tracker something to say from its
// start, and keeps saying something until the last of its objectives is done; the quest that starts the game is one
// of them.

import { describe, expect, it } from 'vitest';
import { QUESTS } from '../../src/data/quests';
import { START_PROGRESS, trackerText } from '../../src/ui/questText';

describe('quests, followed', () => {
  it('start the game on a quest and stage that are written', () => {
    expect(trackerText(START_PROGRESS)).not.toBeNull();
  });

  it('give the tracker a line at every step of every stage, until all is done', () => {
    const silent: string[] = [];
    for (const q of Object.values(QUESTS)) {
      for (const s of q.stages) {
        const done: string[] = [];
        for (const o of [...s.objectives.filter((o) => !o.optional), ...s.objectives.filter((o) => o.optional)]) {
          if (!trackerText({ quest: q.id, stage: s.id, done })) silent.push(`${q.id}/${s.id} with ${done.length} done`);
          done.push(o.id);
        }
        if (s.objectives.length === 0) silent.push(`${q.id}/${s.id}: no objectives`);
        expect(trackerText({ quest: q.id, stage: s.id, done }), `${q.id}/${s.id} all done`).toBeNull();
      }
    }
    expect(silent).toEqual([]);
  });
});
