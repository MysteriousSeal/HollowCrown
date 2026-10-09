// Every quest written as data so far, by id: for the quest system and the journal.

import type { Quest } from './kinds';
import { MQ01 } from './mq01';
import { SQ_BV1 } from './sqbv1';

export const QUESTS: Record<string, Quest> = Object.fromEntries([MQ01, SQ_BV1].map((q) => [q.id, q]));
export type { ChoiceOption, Objective, ObjectiveKind, Quest, QuestStage } from './kinds';
