// Every quest written as data so far, by id: for the quest system and the journal.

import type { Quest } from './kinds';
import { MQ01 } from './mq01';
import { SQ_BV1 } from './sqbv1';
import { SQ_BV2 } from './sqbv2';
import { SQ_BV3 } from './sqbv3';
import { SQ_BV4 } from './sqbv4';
import { SQ_BV5 } from './sqbv5';
import { SQ_BV6 } from './sqbv6';
import { SQ_BV7 } from './sqbv7';

export const QUESTS: Record<string, Quest> = Object.fromEntries([MQ01, SQ_BV1, SQ_BV2, SQ_BV3, SQ_BV4, SQ_BV5, SQ_BV6, SQ_BV7].map((q) => [q.id, q]));
export type { ChoiceOption, Objective, ObjectiveKind, Quest, QuestStage } from './kinds';
