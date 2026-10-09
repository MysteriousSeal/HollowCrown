// The quest book: the quests started (src/data/quests), each at its stage with its objectives done, the one the
// tracker follows, and the story's flags. An objective done that finishes its stage sets the stage's flags and moves
// to the next stage, or finishes the quest. What does an objective (being somewhere, talking to someone) is the
// quest feature's (features/quests.ts).

import { defineResource } from '@voxel/engine/ecs';
import type { Objective, Quest, QuestStage } from '../data/quests';

// Objectives the game can't play yet (no fights, no waiting for the hour): they don't hold their stage back.
export const UNPLAYABLE = new Set<Objective['kind']>(['fight', 'wait']);

// A quest started: its stage, the objectives done in it (ids), whether it's over.
export interface QuestProgress {
  quest: string;
  stage: string;
  done: string[];
  finished?: boolean;
}

// Every quest started, the one followed (null: none), and the flags the story has set.
export interface QuestBook {
  quests: QuestProgress[];
  tracked: string | null;
  flags: Record<string, string | boolean>;
}
export const Quests = defineResource<QuestBook>('Quests');

export const newBook = (): QuestBook => ({ quests: [], tracked: null, flags: {} });

const stageOf = (quest: Quest, id: string): QuestStage | undefined => quest.stages.find((s) => s.id === id);

// Starts quest `id` at its first stage, followed (already started: nothing). Returns its first stage.
export function startQuest(book: QuestBook, quests: Record<string, Quest>, id: string): QuestStage | undefined {
  const quest = quests[id];
  if (!quest) throw new Error(`startQuest: no quest '${id}'`);
  if (book.quests.some((p) => p.quest === id)) return undefined;
  book.quests.push({ quest: id, stage: quest.stages[0].id, done: [] });
  book.tracked = id;
  return quest.stages[0];
}

// The objectives still open in every quest going on, with their quest.
export function openObjectives(book: QuestBook, quests: Record<string, Quest>): Array<{ quest: string; objective: Objective }> {
  const open: Array<{ quest: string; objective: Objective }> = [];
  for (const progress of book.quests) {
    if (progress.finished) continue;
    const stage = stageOf(quests[progress.quest], progress.stage);
    for (const objective of stage?.objectives ?? []) if (!progress.done.includes(objective.id)) open.push({ quest: progress.quest, objective });
  }
  return open;
}

// Objective `objectiveId` of quest `questId` done (with the flags its choice sets). If that ends its stage (every
// objective done but the optional and the unplayable), the stage's flags are set and the next stage begins (or the
// quest finishes). Returns the stage begun, if one did.
export function completeObjective(
  book: QuestBook, quests: Record<string, Quest>, questId: string, objectiveId: string, sets: Record<string, string | boolean> = {},
): QuestStage | undefined {
  const progress = book.quests.find((p) => p.quest === questId && !p.finished);
  if (!progress) return undefined;
  const quest = quests[questId];
  const stage = stageOf(quest, progress.stage);
  if (!stage?.objectives.some((o) => o.id === objectiveId) || progress.done.includes(objectiveId)) return undefined;
  progress.done.push(objectiveId);
  Object.assign(book.flags, sets);
  const left = stage.objectives.filter((o) => !progress.done.includes(o.id) && !o.optional && !UNPLAYABLE.has(o.kind));
  if (left.length > 0) return undefined;
  Object.assign(book.flags, stage.sets ?? {});
  const next = quest.stages[quest.stages.indexOf(stage) + 1];
  if (!next) {
    progress.finished = true;
    return undefined;
  }
  [progress.stage, progress.done] = [next.id, []];
  return next;
}
