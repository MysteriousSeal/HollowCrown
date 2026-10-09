// How each quest starts (design's quest data, `start`): the quests that must be finished first, and who gives it
// (talked to, they give it; none: it starts by itself once the others are done). Who uses it: the quest feature, each
// frame and at each talk.

import type { Point } from '@voxel/engine/world';
import type { Quest, QuestStage } from '../data/quests';
import { startQuest, type QuestBook } from './quests';

// How a quest is found in the wild (systems/discovery.ts): by coming within `radius` of a tile, or by examining
// something there (`prop`: its model, a CREATURES id; `label`: what E does, "Examine the cart").
export type Found = { at: Point; radius: number } | { examine: { at: Point; prop?: string; label: string } };
export const foundOf = (quest: Quest): Found | undefined => (quest.start as { found?: Found }).found;

const finished = (book: QuestBook, id: string) => book.quests.some((q) => q.quest === id && q.finished);
const started = (book: QuestBook, id: string) => book.quests.some((q) => q.quest === id);

// Whether `quest`'s turn has come: not started, every quest before it finished.
export const isDue = (book: QuestBook, quest: Quest) => !started(book, quest.id) && quest.start.after.every((a) => finished(book, a));

// The quests ready to start: due, and given by `giver` (none: those that start by themselves; not those found).
export function readyToStart(book: QuestBook, quests: Record<string, Quest>, giver?: string): string[] {
  return Object.values(quests)
    .filter((q) => q.id !== 'MQ01' && isDue(book, q) && q.start.giver === giver && !foundOf(q))
    .map((q) => q.id);
}

// Starts quest `id`: the main quest's become the one followed, a side quest's only if nothing else is. Returns its
// first stage, if it started.
export function begin(book: QuestBook, quests: Record<string, Quest>, id: string): QuestStage | undefined {
  const followed = book.tracked;
  const stage = startQuest(book, quests, id);
  const followedOn = followed && book.quests.some((q) => q.quest === followed && !q.finished);
  if (!id.startsWith('MQ') && followedOn) book.tracked = followed;
  return stage;
}

// Starts every quest ready (by `giver`, or by themselves). Returns the first stages begun.
export function startReady(book: QuestBook, quests: Record<string, Quest>, giver?: string): QuestStage[] {
  return readyToStart(book, quests, giver).flatMap((id) => begin(book, quests, id) ?? []);
}
