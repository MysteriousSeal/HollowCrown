// Interaction: things the player can use or talk to (a door, a villager) say what they are and how near the player
// must be. Each frame the nearest one in reach is kept in the InReach resource (for the UI's "E: Talk" prompt), and
// pressing interact (E) with one in reach emits an Interact event for the game to answer.

import { defineComponent, defineEvent, defineResource, type Entity, type System } from '../ecs';
import { KeyboardResource } from '../input/keyboard';
import { Player, Transform } from './components';

export interface InteractableData {
  label: string; // what the prompt says to do ("Talk", "Open")
  range: number; // how near the player must be, world units
}
export const Interactable = defineComponent<InteractableData>('Interactable');

// What the player can interact with now (none: entity null).
export interface InReachData {
  entity: Entity | null;
  label: string;
}
export const InReach = defineResource<InReachData>('InReach');

// The player interacted with `target`.
export const Interact = defineEvent<{ target: Entity; by: Entity }>('Interact');

export const DEFAULT_INTERACT_RANGE = 1.5;

// An interactable, checked: a label and a range above 0.
export function interactable(label: string, range = DEFAULT_INTERACT_RANGE): InteractableData {
  if (!label) throw new Error('interactable: a label is needed');
  if (!(range > 0)) throw new Error(`interactable: range must be above 0, not ${range}`);
  return { label, range };
}

// Runs in the input stage: the press is answered the frame it's made.
export const interactionSystem: System = {
  name: 'interaction',
  stage: 'input',
  update(world) {
    const reach = world.hasResource(InReach) ? world.resource(InReach) : world.setResource(InReach, { entity: null, label: '' });
    const pressed = world.hasResource(KeyboardResource) && world.resource(KeyboardResource).takePress('interact');
    [reach.entity, reach.label] = [null, ''];
    const player = world.first(Player, Transform);
    if (player === undefined) return;
    const at = world.read(player, Transform);
    let nearest = Infinity;
    for (const entity of world.query(Interactable, Transform)) {
      if (entity === player) continue;
      const { label, range } = world.read(entity, Interactable);
      const { x, z } = world.read(entity, Transform);
      const distance = Math.hypot(x - at.x, z - at.z);
      if (distance > range || distance >= nearest) continue;
      [nearest, reach.entity, reach.label] = [distance, entity, label];
    }
    if (pressed && reach.entity !== null) world.emit(Interact, { target: reach.entity, by: player });
  },
};
