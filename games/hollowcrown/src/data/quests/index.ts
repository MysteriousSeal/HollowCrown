// Every quest written as data so far, by id: for the quest system and the journal.

import type { Quest } from './kinds';
import { MQ01 } from './mq01';
import { MQ02 } from './mq02';
import { MQ03 } from './mq03';
import { MQ04 } from './mq04';
import { SQ_BV1 } from './sqbv1';
import { SQ_BV2 } from './sqbv2';
import { SQ_BV3 } from './sqbv3';
import { SQ_BV4 } from './sqbv4';
import { SQ_BV5 } from './sqbv5';
import { SQ_BV6 } from './sqbv6';
import { SQ_BV7 } from './sqbv7';
import { SQ_BV8 } from './sqbv8';
import { WQ_BV1 } from './wqbv1';
import { WQ_BV2 } from './wqbv2';
import { WQ_BV3 } from './wqbv3';

export const QUESTS: Record<string, Quest> = Object.fromEntries([MQ01, MQ02, MQ03, MQ04, SQ_BV1, SQ_BV2, SQ_BV3, SQ_BV4, SQ_BV5, SQ_BV6, SQ_BV7, SQ_BV8, WQ_BV1, WQ_BV2, WQ_BV3].map((q) => [q.id, q]));
export type { ChoiceOption, Found, Line, Objective, ObjectiveKind, Quest, QuestStage } from './kinds';
