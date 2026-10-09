// How each quest starts (the quests' `starts`, docs/story): the quests that must be finished first, and who gives it
// (talked to, they give it; none: it starts by itself once the others are done). Kept here until design's quest data
// says it (who uses it: the quest feature, each frame and at each talk).

import type { Quest, QuestStage } from '../data/quests';
import { startQuest, type QuestBook } from './quests';

export const QUEST_STARTS: Record<string, { after: string[]; giver?: string }> = {
  MQ02: { after: ['MQ01'] }, // (Cuthwin and Pell, at the well, as MQ01 ends)
  MQ03: { after: ['MQ02'] },
  MQ04: { after: ['MQ02', 'MQ03'] },
  'SQ-BV1': { after: ['MQ01'], giver: 'Dunstan' },
  'SQ-BV2': { after: ['SQ-BV1'], giver: 'Kit' },
  'SQ-BV3': { after: ['MQ02'], giver: 'Agna Bee' },
  'SQ-BV4': { after: ['MQ02'], giver: 'Father Cuthwin' },
  'SQ-BV5': { after: ['MQ03'], giver: 'Odo Pell' },
  'SQ-BV6': { after: ['MQ01'], giver: 'Ada Cobbe' },
  'SQ-BV7': { after: [], giver: 'Tobin Harrow' },
  'SQ-BV8': { after: ['MQ03'], giver: 'Elsa Fenn' },
};

const finished = (book: QuestBook, id: string) => book.quests.some((q) => q.quest === id && q.finished);
const started = (book: QuestBook, id: string) => book.quests.some((q) => q.quest === id);

// The quests ready to start: not started, everything before them finished, given by `giver` (none: those that
// start by themselves).
export function readyToStart(book: QuestBook, quests: Record<string, Quest>, giver?: string): string[] {
  return Object.entries(QUEST_STARTS)
    .filter(([id, s]) => quests[id] && !started(book, id) && s.giver === giver && s.after.every((a) => finished(book, a)))
    .map(([id]) => id);
}

// Starts every quest ready (by `giver`, or by themselves); the main quest's become the one followed, a side quest's
// only if nothing else is. Returns the first stages begun.
export function startReady(book: QuestBook, quests: Record<string, Quest>, giver?: string): QuestStage[] {
  const begun: QuestStage[] = [];
  for (const id of readyToStart(book, quests, giver)) {
    const followed = book.tracked;
    const stage = startQuest(book, quests, id);
    if (stage) begun.push(stage);
    const followedOn = followed && book.quests.some((q) => q.quest === followed && !q.finished);
    if (!id.startsWith('MQ') && followedOn) book.tracked = followed;
  }
  return begun;
}
