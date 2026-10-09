// The HUD's screens other features open (made by features/hud.ts), and what it follows: the conversation, for
// talking to people (who uses it: gameplay, on E); the hero's quests (who keeps it: the quest system; the tracker,
// the journal and the notices show it, MQ01 from its start until it's set).

import { defineResource } from '@voxel/engine/ecs';
import type { Conversation } from '@voxel/engine/ui';
import type { QuestLogData } from './questLog';

export const ConversationScreen = defineResource<Conversation>('ConversationScreen');
export const QuestLog = defineResource<QuestLogData>('QuestLog');
