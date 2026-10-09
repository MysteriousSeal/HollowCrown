// The HUD's screens other features open (made by features/hud.ts), and what it follows: the conversation, for
// talking to people (who uses it: gameplay, on E); the quest followed (who sets it: the quest system; the tracker
// shows it, MQ01 from its start until it's set).

import { defineResource } from '@voxel/engine/ecs';
import type { Conversation } from '@voxel/engine/ui';
import type { QuestProgress } from './questText';

export const ConversationScreen = defineResource<Conversation>('ConversationScreen');
export const TrackedQuest = defineResource<QuestProgress>('TrackedQuest');
