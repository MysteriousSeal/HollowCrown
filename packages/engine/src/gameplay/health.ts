// Health and death: an entity's hit points, the blows that land on it (Hit events, from attacks or anything else a
// game deals damage with), and its death when they run out: a Died event, and the entity left lying as a corpse
// (Dead: it stops moving and fighting) for the game to loot, mourn or despawn.

import { defineComponent, defineEvent, type Entity, type System, type World } from '../ecs';
import { MoveIntent } from './components';

export interface HealthData {
  hp: number;
  max: number;
}
export const Health = defineComponent<HealthData>('Health');

// Full health, `max` points.
export function health(max: number): HealthData {
  if (!(max > 0)) throw new Error(`health: max must be above 0, not ${max}`);
  return { hp: max, max };
}

// Which side an entity fights on: attacks never land on its own side (none given: it fights alone).
export const Faction = defineComponent<string>('Faction');

// A blow landed: `damage` points off `target`, dealt by `by`.
export const Hit = defineEvent<{ target: Entity; by: Entity; damage: number }>('Hit');

// `entity` died, killed by `by`.
export const Died = defineEvent<{ entity: Entity; by: Entity }>('Died');

// A corpse: what died, lying where it fell (`since`: when, by the clock the health systems were given).
export const Dead = defineComponent<{ since: number }>('Dead');

// Whether `entity` can be hurt: it has health, and isn't dead already.
export const isAlive = (world: World, entity: Entity): boolean => world.has(entity, Health) && !world.has(entity, Dead);

// Every Hit this frame taken off its target's health; those it kills, dead (Died emitted once, the body stilled).
// Two systems share the work: one in the simulate stage (after the engine's attacks), one at the start of the
// present stage for blows a game's own simulate systems land after it. Each Hit is counted once.
export function healthSystems(clock: () => number = () => 0): [System, System] {
  const counted = new WeakMap<readonly unknown[], number>(); // this frame's Hit list -> how many of it are counted
  const update = (world: World) => {
    const hits = world.eventsOf(Hit);
    for (let i = counted.get(hits) ?? 0; i < hits.length; i++) {
      const { target, by, damage } = hits[i];
      if (!isAlive(world, target) || !(damage > 0)) continue;
      const h = world.read(target, Health);
      h.hp = Math.max(0, h.hp - damage);
      if (h.hp > 0) continue;
      world.add(target, Dead, { since: clock() });
      const intent = world.get(target, MoveIntent);
      if (intent) [intent.x, intent.z] = [0, 0];
      world.emit(Died, { entity: target, by });
    }
    counted.set(hits, hits.length);
  };
  return [
    { name: 'health', stage: 'simulate', update },
    { name: 'healthLate', stage: 'present', update },
  ];
}
