// Coming back from death: the death screen's Retry asks (a Respawn event, who emits it: the HUD), and the hero rises
// whole where they last rested (the LastRest resource, kept by the game: none yet, so the shrine) or at the shrine.

import { defineEvent, defineResource, type Entity, type System } from '@voxel/engine/ecs';
import { Dead, Health, MoveIntent, Transform } from '@voxel/engine/gameplay';
import type { Point, WorldMap } from '@voxel/engine/world';

// Retry: back at the last rest, or at the shrine.
export const Respawn = defineEvent<{ at: 'rest' | 'shrine' }>('Respawn');

// Where the hero last rested (a bed, a camp), or null (who sets it: resting, when there is any; who reads it: the HUD
// to offer it, the respawn).
export const LastRest = defineResource<{ x: number; z: number } | null>('LastRest');

// The hero brought back on a Respawn: stood at the spot asked for (`shrine`: where the game starts), full of health,
// no longer a corpse.
export function respawnSystem(hero: Entity, map: WorldMap, shrine: Point): System {
  return {
    name: 'respawn',
    stage: 'present', // (the input and simulate stages may be paused under the death screen)
    update(world) {
      const asked = world.eventsOf(Respawn).at(-1);
      if (!asked) return;
      const rest = world.hasResource(LastRest) ? world.resource(LastRest) : null;
      const [x, z] = asked.at === 'rest' && rest ? [rest.x, rest.z] : shrine;
      const at = world.read(hero, Transform);
      [at.x, at.y, at.z] = [x, map.groundY(x, z), z];
      const h = world.get(hero, Health);
      if (h) h.hp = h.max;
      world.remove(hero, Dead);
      world.add(hero, MoveIntent, { x: 0, z: 0 });
    },
  };
}
