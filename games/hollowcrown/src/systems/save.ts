// What a save keeps (the engine's save: names that last, a schema): where every lasting entity stands, its health and
// whether it's dead; the quest book, the hour, the last rest, the roaming foes' days. Kept resources are loaded into the objects already in
// use (the HUD's quest log is the quest book itself), not swapped for new ones. The Saves resource is the game's
// SaveGame (who uses it: the pause menu's Save and Load pages; the autosaves).

import { defineResource, type System, type World } from '@voxel/engine/ecs';
import { Dead, Health, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { AutosaveNow, keep, keepResource, type SaveGame, type SaveSchema } from '@voxel/engine/save';
import { QUESTS } from '../data/quests';
import { Quests, type QuestBook } from './quests';
import { LastRest } from './respawn';
import { Roaming } from './roaming';

export const Saves = defineResource<SaveGame>('Saves');
export const SAVE_VERSION = 1;

// Lasting names: the hero, a villager by their name, a camp's foe by its camp and place in it.
export const lastingName = {
  hero: 'hero',
  villager: (name: string) => `villager:${name}`,
  keeper: (band: string, i: number) => `keeper:${band}:${i}`,
};

// `json` copied into `into` (its own object kept), and `into` returned.
const into = <T extends object>(target: T, json: unknown): T => Object.assign(target, json as Partial<T>);

// The save's schema over `world`.
export function saveSchema(world: World): SaveSchema {
  return {
    version: SAVE_VERSION,
    components: [
      keep(Transform, { key: 'at' }),
      keep(Health, { key: 'hp' }),
      keep(Dead, { key: 'dead' }),
    ],
    resources: [
      keepResource(Quests, { key: 'quests', load: (json) => into(world.resource(Quests), { items: [], ...(json as object) }) as QuestBook }),
      keepResource(TimeOfDay, { key: 'time', load: (json) => into(world.resource(TimeOfDay), json) }),
      keepResource(LastRest, { key: 'rest' }),
      keepResource(Roaming, { key: 'roaming', load: (json) => into(world.resource(Roaming), json) }),
    ],
  };
}

// What's worth an autosave: a quest's stage begun, a night slept (the last rest set again). Each is told as an
// AutosaveNow, named for it, for the engine's autosave.
export function autosaveMoments(): System {
  const stages = new Map<string, string>();
  let rest: unknown = undefined;
  return {
    name: 'autosaveMoments',
    stage: 'simulate',
    update(world) {
      const now = world.hasResource(LastRest) ? world.resource(LastRest) : null;
      if (rest !== undefined && now !== rest) world.emit(AutosaveNow, { label: 'Slept' });
      rest = now;
      if (!world.hasResource(Quests)) return;
      for (const { quest, stage } of world.resource(Quests).quests) {
        const before = stages.get(quest);
        stages.set(quest, stage);
        if (before === undefined || before === stage) continue;
        const title = QUESTS[quest]?.stages.find((s) => s.id === stage)?.title ?? stage;
        world.emit(AutosaveNow, { label: `${QUESTS[quest]?.name ?? quest}: ${title}` });
      }
    },
  };
}
