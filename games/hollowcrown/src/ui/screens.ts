// The HUD's screens other features open (made by features/hud.ts): the conversation, for talking to people
// (who uses it: gameplay, on E).

import { defineResource } from '@voxel/engine/ecs';
import type { Conversation } from '@voxel/engine/ui';

export const ConversationScreen = defineResource<Conversation>('ConversationScreen');
