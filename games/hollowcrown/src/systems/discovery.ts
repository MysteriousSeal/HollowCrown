// Quests found in the wild (design's quest data, `start.found`): one starts the first time the hero comes within its
// radius of a spot, or examines its object (E on a body, a letter, a well), once its quests before are done. Each
// find is told as a Discovered event (who uses it: the HUD's "You found something…").

import { defineComponent, defineEvent, type Entity, type System, type World } from '@voxel/engine/ecs';
import { Interact, Transform } from '@voxel/engine/gameplay';
import type { Quest, QuestStage } from '../data/quests';
import { begin, foundOf, isDue } from './questStarts';
import { Quests } from './quests';

// A quest found (its first stage begun).
export const Discovered = defineEvent<{ quest: string }>('Discovered');

// Something to examine for a quest.
export const Examinable = defineComponent<{ quest: string }>('Examinable');

// Quest `id` found: begun (if it's due), told, and its first stage given to `onStage` (the clock, if it sets one).
function find(world: World, quests: Record<string, Quest>, id: string, onStage: (s: QuestStage) => void): void {
  const book = world.resource(Quests);
  if (!isDue(book, quests[id])) return;
  const stage = begin(book, quests, id);
  if (!stage) return;
  world.emit(Discovered, { quest: id });
  onStage(stage);
}

// Each frame: a spot reached, or a thing examined, finds its quest.
export function discoverySystem(hero: Entity, quests: Record<string, Quest>, onStage: (s: QuestStage) => void): System {
  return {
    name: 'discovery',
    stage: 'input', // (after the engine's interaction: its Interact this frame)
    update(world) {
      if (!world.hasResource(Quests)) return;
      for (const { target, by } of world.eventsOf(Interact)) {
        const examined = by === hero ? world.get(target, Examinable) : undefined;
        if (examined) find(world, quests, examined.quest, onStage);
      }
      const at = world.get(hero, Transform);
      if (!at) return;
      for (const quest of Object.values(quests)) {
        const found = foundOf(quest);
        if (!found || !('radius' in found)) continue;
        if (Math.hypot(at.x - found.at[0], at.z - found.at[1]) <= found.radius) find(world, quests, quest.id, onStage);
      }
    },
  };
}
