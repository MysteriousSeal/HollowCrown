// What the quest tracker says: the quest followed, its stage, and the first thing still to do in it (the optional
// ones only once the rest are done). Until the quest system follows one, MQ01 from its start.

import type { TrackerText } from '@voxel/engine/ui';
import { QUESTS } from '../data/quests';

// The quest followed, as the quest system keeps it: which quest, its stage, and the objectives done (ids).
export interface QuestProgress {
  quest: string;
  stage: string;
  done: string[];
}

export const START_PROGRESS: QuestProgress = { quest: 'MQ01', stage: 'waking', done: [] };

// The tracker's text for `progress` (null: a quest or stage that isn't written, or nothing left to do in it).
export function trackerText({ quest: id, stage: stageId, done }: QuestProgress): TrackerText | null {
  const quest = QUESTS[id];
  const stage = quest?.stages.find((s) => s.id === stageId);
  if (!quest || !stage) return null;
  const left = stage.objectives.filter((o) => !done.includes(o.id));
  const now = left.find((o) => !o.optional) ?? left[0];
  return now ? { title: quest.name, sub: stage.title, line: now.text } : null;
}
