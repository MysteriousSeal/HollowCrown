// Quest starts: MQ02 starts by itself once MQ01 is over and is followed; a side quest waits for its giver and its
// quests before, and doesn't take the tracker from the main quest.

import { describe, expect, it } from 'vitest';
import { QUESTS } from '../src/data/quests';
import { QUEST_STARTS, readyToStart, startReady } from '../src/systems/questStarts';
import { newBook, startQuest } from '../src/systems/quests';

const afterMQ01 = () => {
  const book = newBook();
  startQuest(book, QUESTS, 'MQ01');
  book.quests[0].finished = true;
  return book;
};

describe('quest starts', () => {
  it('names only quests that are written, and givers only after what they wait on', () => {
    for (const [id, s] of Object.entries(QUEST_STARTS)) {
      expect(QUESTS[id], id).toBeDefined();
      for (const a of s.after) expect(QUESTS[a], `${id} after ${a}`).toBeDefined();
    }
  });

  it('starts MQ02 by itself after MQ01, followed', () => {
    const book = afterMQ01();
    expect(startReady(book, QUESTS).map((s) => s.id)).toEqual([QUESTS.MQ02.stages[0].id]);
    expect(book.tracked).toBe('MQ02');
    expect(startReady(book, QUESTS)).toEqual([]);
  });

  it('gives SQ-BV1 when Dunstan is talked to after MQ01, the main quest still followed', () => {
    const book = newBook();
    expect(readyToStart(book, QUESTS, 'Dunstan')).toEqual([]);
    const after = afterMQ01();
    startReady(after, QUESTS);
    expect(startReady(after, QUESTS, 'Dunstan')).toHaveLength(1);
    expect(after.quests.map((q) => q.quest)).toContain('SQ-BV1');
    expect(after.tracked).toBe('MQ02');
  });
});
