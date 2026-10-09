// The quest book: a quest starts at its first stage, objectives done move it through its stages (the optional and
// the unplayable don't hold a stage back), flags are set by choices and stages, and the last stage finishes it.

import { describe, expect, it } from 'vitest';
import { QUESTS } from '../src/data/quests';
import { completeObjective, newBook, openObjectives, startQuest } from '../src/systems/quests';

describe('quests', () => {
  it('starts MQ01 at waking, followed, once', () => {
    const book = newBook();
    expect(startQuest(book, QUESTS, 'MQ01')?.id).toBe('waking');
    expect(startQuest(book, QUESTS, 'MQ01')).toBeUndefined();
    expect(book.quests).toEqual([{ quest: 'MQ01', stage: 'waking', done: [] }]);
    expect(book.tracked).toBe('MQ01');
    expect(openObjectives(book, QUESTS).map((o) => o.objective.id)).toEqual(['feather', 'bowl', 'first-words']);
  });

  it('moves to the next stage when every objective needed is done', () => {
    const book = newBook();
    startQuest(book, QUESTS, 'MQ01');
    expect(completeObjective(book, QUESTS, 'MQ01', 'feather')).toBeUndefined();
    expect(completeObjective(book, QUESTS, 'MQ01', 'feather')).toBeUndefined(); // (done already)
    expect(completeObjective(book, QUESTS, 'MQ01', 'pilgrim')).toBeUndefined(); // (not this stage's)
    completeObjective(book, QUESTS, 'MQ01', 'bowl');
    expect(completeObjective(book, QUESTS, 'MQ01', 'first-words')?.id).toBe('road-east');
    expect(book.quests[0]).toEqual({ quest: 'MQ01', stage: 'road-east', done: [] });
  });

  it("sets a choice's flags, and holds the road until the wolves are dead", () => {
    const book = newBook();
    startQuest(book, QUESTS, 'MQ01');
    for (const id of ['feather', 'bowl', 'first-words']) completeObjective(book, QUESTS, 'MQ01', id);
    completeObjective(book, QUESTS, 'MQ01', 'pilgrim', { pilgrim_jerkin: 'covered' });
    expect(book.flags.pilgrim_jerkin).toBe('covered');
    expect(completeObjective(book, QUESTS, 'MQ01', 'brindleford')).toBeUndefined();
    expect(completeObjective(book, QUESTS, 'MQ01', 'wolves')?.id).toBe('the-bell');
  });

  it("sets a stage's flags as it ends, and finishes the quest after its last", () => {
    const book = newBook();
    startQuest(book, QUESTS, 'MQ01');
    for (const stage of QUESTS.MQ01.stages) for (const o of stage.objectives) completeObjective(book, QUESTS, 'MQ01', o.id);
    expect(book.flags.mq01_dead_walked).toBe(true);
    expect(book.quests[0].finished).toBe(true);
    expect(openObjectives(book, QUESTS)).toEqual([]);
  });
});
