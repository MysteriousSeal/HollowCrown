// The quests the hero has, as the quest system keeps them (QuestLog in screens.ts: gameplay owns and changes it in
// place), and what the HUD makes of it: the one followed, and the news since last looked (a quest started, an
// objective done, a quest finished) for its notices.

import type { Toast } from '@voxel/engine/ui';
import { QUESTS } from '../data/quests';

// One quest as the hero has it: which, its stage, the objectives done (ids), and whether it's over.
export interface QuestProgress {
  quest: string;
  stage: string;
  done: string[];
  finished?: boolean;
}

export interface QuestLogData {
  quests: QuestProgress[];
  tracked: string | null; // the quest followed (its id)
}

// Until the quest system keeps one: MQ01 from its start, followed.
export const startLog = (): QuestLogData => ({ quests: [{ quest: 'MQ01', stage: 'waking', done: [] }], tracked: 'MQ01' });

export function trackedOf(log: QuestLogData): QuestProgress | null {
  return log.quests.find((q) => q.quest === log.tracked) ?? null;
}

// A copy of the log as it stands, to tell later what's new.
export function snapshot(log: QuestLogData): QuestProgress[] {
  return log.quests.map((q) => ({ ...q, done: [...q.done] }));
}

const nameOf = (id: string): string => QUESTS[id]?.name ?? id;

function objectiveText(id: string, objective: string): string {
  for (const stage of QUESTS[id]?.stages ?? []) {
    const found = stage.objectives.find((o) => o.id === objective);
    if (found) return found.text;
  }
  return objective;
}

// The news between `before` and `now`: each quest started or finished, each objective done.
export function questNews(before: QuestProgress[], now: QuestProgress[]): Toast[] {
  const news: Toast[] = [];
  for (const q of now) {
    const was = before.find((b) => b.quest === q.quest);
    if (!was) news.push({ title: 'Quest started', text: nameOf(q.quest) });
    for (const id of q.done) if (!was?.done.includes(id)) news.push({ title: 'Objective done', text: objectiveText(q.quest, id) });
    if (q.finished && !was?.finished) news.push({ title: 'Quest finished', text: nameOf(q.quest) });
  }
  return news;
}
