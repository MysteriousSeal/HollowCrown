// Talking: pressing interact by a villager starts a talk with them. While it lasts, the villager stops where they
// stand (no strolling: villagerDay.ts leaves the Talking alone), the two turn to face each other, and the hero stays
// put, swinging nothing. When it ends, they let each other go; the press that closed it doesn't start the talk again.

import { defineComponent, type Entity, type System, type World } from '@voxel/engine/ecs';
import { AttackIntent, FaceToward, Interact, MoveIntent, Wander, faceToward } from '@voxel/engine/gameplay';

// Who's talking now (a villager in a talk has it).
export const Talking = defineComponent<true>('Talking');

// The talk going on: with whom (null: none), and whether one has just ended (its last press is ignored).
export interface Talk {
  with: Entity | null;
  justEnded: boolean;
}

// Starts a talk between `hero` and whoever they interact with that `can` talk (a villager), calling `open` with
// them; holds them both while it lasts. Runs in the input stage, after the engine's interaction.
export function talkSystem(talk: Talk, hero: Entity, can: (entity: Entity) => boolean, open: (npc: Entity) => void): System {
  return {
    name: 'talk',
    stage: 'input',
    update(world) {
      // No swinging while talking, nor on the press that closed it (Space talks too).
      if (talk.with !== null || talk.justEnded) world.remove(hero, AttackIntent);
      if (talk.with !== null) {
        world.add(hero, MoveIntent, { x: 0, z: 0 });
        world.add(talk.with, MoveIntent, { x: 0, z: 0 });
        return;
      }
      if (talk.justEnded) {
        talk.justEnded = false;
        return;
      }
      const event = world.eventsOf(Interact).find((e) => e.by === hero && can(e.target));
      if (!event) return;
      const npc = event.target;
      talk.with = npc;
      world.remove(npc, Wander);
      world.add(npc, Talking, true);
      world.add(npc, MoveIntent, { x: 0, z: 0 });
      world.add(hero, MoveIntent, { x: 0, z: 0 });
      world.add(npc, FaceToward, faceToward(hero));
      world.add(hero, FaceToward, faceToward(npc));
      open(npc);
    },
  };
}

// The talk over: both let go (the villager strolls again as their day says).
export function endTalk(world: World, talk: Talk, hero: Entity): void {
  if (talk.with === null) return;
  world.remove(talk.with, FaceToward);
  world.remove(talk.with, Talking);
  world.remove(hero, FaceToward);
  talk.with = null;
  talk.justEnded = true;
}
