// What was killed: a creature knows what it is (src/creatures CREATURES' id), and each death of one at a quest's
// 'fight' counts toward it (systems/quests.ts does the rest once enough have fallen).

import { defineComponent, type Entity, type World } from '@voxel/engine/ecs';
import { Died, Transform } from '@voxel/engine/gameplay';
import type { Objective } from '../data/quests';

// What a creature is (who uses it: the quests, counting kills; later loot and the bestiary).
export const Creature = defineComponent<{ id: string; name: string }>('Creature');

// Whether a fight's `what` ('wolf', 'the Hungry', 'brood mother', 'Red Hen bandit') names this creature: by its id or
// its name, or as a kind of its kind (a Red Hen bandit is a bandit).
export function isWhat(what: string, creature: { id: string; name: string }): boolean {
  const plain = (s: string) => s.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z]/g, '');
  return [creature.id, creature.name].some((s) => plain(s) === plain(what)) || plain(what).endsWith(plain(creature.id));
}

// Each creature that died this frame: what it was and where it fell.
export function deathsOf(world: World): Array<{ entity: Entity; id: string; name: string; x: number; z: number }> {
  const out: Array<{ entity: Entity; id: string; name: string; x: number; z: number }> = [];
  for (const { entity } of world.eventsOf(Died)) {
    const creature = world.get(entity, Creature);
    const at = world.get(entity, Transform);
    if (creature && at) out.push({ entity, ...creature, x: at.x, z: at.z });
  }
  return out;
}

// How many a fight needs (none said: one).
export const needed = (objective: Objective) => objective.count ?? 1;
