// The quest book: the quests started (src/data/quests), each at its stage with its objectives done, the one the
// tracker follows, and the story's flags. An objective done that finishes its stage sets the stage's flags and moves
// to the next stage, or finishes the quest. What does an objective (being somewhere, talking to someone) is the
// quest feature's (features/quests.ts).

import { defineResource } from '@voxel/engine/ecs';
import type { Objective, Quest, QuestStage } from '../data/quests';

// Objectives the game can't play yet (no waiting for the hour): they don't hold their stage back.
export const UNPLAYABLE = new Set<Objective['kind']>(['wait']);

// A quest started: its stage, the objectives done in it (ids), whether it's over.
export interface QuestProgress {
  quest: string;
  stage: string;
  done: string[];
  finished?: boolean;
}

// Every quest started, the one followed (null: none), the flags the story has set, and what the hero has taken
// (a 'take' objective's `what`: the rusty knife).
export interface QuestBook {
  quests: QuestProgress[];
  tracked: string | null;
  flags: Record<string, string | boolean>;
  items: string[];
}
export const Quests = defineResource<QuestBook>('Quests');

export const newBook = (): QuestBook => ({ quests: [], tracked: null, flags: {}, items: [] });

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

// Objective `objectiveId` of quest `questId` done (with the flags its choice sets; a 'take', its thing taken). If that ends its stage (every
// objective done but the optional and the unplayable), the stage's flags are set and the next stage begins (or the
// quest finishes); a stage with nothing in it to play yet is passed through, its flags set.
// Returns the stage begun, if one did.
export function completeObjective(
  book: QuestBook, quests: Record<string, Quest>, questId: string, objectiveId: string, sets: Record<string, string | boolean> = {},
): QuestStage | undefined {
  const progress = book.quests.find((p) => p.quest === questId && !p.finished);
  if (!progress) return undefined;
  const quest = quests[questId];
  let stage = stageOf(quest, progress.stage);
  if (!stage?.objectives.some((o) => o.id === objectiveId) || progress.done.includes(objectiveId)) return undefined;
  progress.done.push(objectiveId);
  Object.assign(book.flags, sets);
  const objective = stage.objectives.find((o) => o.id === objectiveId)!;
  if (objective.kind === 'take' && objective.what) book.items.push(objective.what);
  let begun: QuestStage | undefined;
  while (stage && neededIn(stage, progress.done).length === 0) {
    Object.assign(book.flags, stage.sets ?? {});
    const next: QuestStage | undefined = quest.stages[quest.stages.indexOf(stage) + 1];
    if (!next) {
      progress.finished = true;
      return begun;
    }
    [progress.stage, progress.done, begun, stage] = [next.id, [], next, next];
  }
  return begun;
}

// What's still needed to end `stage`: its objectives not done, but the optional and the unplayable.
const neededIn = (stage: QuestStage, done: string[]) =>
  stage.objectives.filter((o) => !done.includes(o.id) && !o.optional && !UNPLAYABLE.has(o.kind));
