// Resting: an innkeeper offers a bed once nothing else is asked of them (Garrick, at the Ferryman's Rest). Sleeping
// passes the night: any quest's wait there is over (its next stage brings its own hour), else it's morning; the
// hero wakes whole, and that's where they rise again if they die (LastRest).

import type { Entity, World } from '@voxel/engine/ecs';
import { Health, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import type { ConversationLine } from '@voxel/engine/ui';
import { QUESTS } from '../data/quests';
import { Quests, openObjectives } from '../systems/quests';
import { LastRest } from '../systems/respawn';
import { complete } from '../features/quests';

// Who keeps a bed, and where (a place id).
export const BEDS: Record<string, string> = {
  'Garrick Fenn': 'ferrymans-rest',
};
export const MORNING = 6; // the hour a night's sleep ends
const OFFER: ConversationLine = { side: 'right', text: 'Bed\'s made. You want it?', choices: ['Sleep till morning', 'Not yet'] };

// A night's sleep at `place`: its waits over (or the clock to morning), the hero whole, their last rest here.
export function rest(world: World, hero: Entity, place: string): void {
  let hourSet = false;
  if (world.hasResource(Quests)) {
    for (const { quest, objective } of openObjectives(world.resource(Quests), QUESTS)) {
      if (objective.kind !== 'wait' || (objective.at && objective.at !== place)) continue;
      hourSet = complete(world, quest, objective.id)?.hour !== undefined || hourSet;
    }
  }
  if (!hourSet && world.hasResource(TimeOfDay)) world.resource(TimeOfDay).hours = MORNING;
  const h = world.get(hero, Health);
  if (h) h.hp = h.max;
  const at = world.read(hero, Transform);
  world.setResource(LastRest, { x: at.x, z: at.z });
}

type Talked = { lines: ConversationLine[]; onChoice: (line: number, choice: number) => void; onClose: () => void };

// A talk with `name`, and their bed offered at its end if they keep one and it's only their first words (nothing
// else asked of them).
export function withRest(world: World, hero: Entity, name: string, talk: Talked): Talked {
  const place = BEDS[name];
  if (!place || talk.lines.length > 1 || talk.lines.some((l) => l.choices)) return talk;
  const at = talk.lines.length;
  let sleep = false;
  return {
    lines: [...talk.lines, OFFER],
    onChoice: (line, choice) => (line === at ? (sleep = choice === 0) : talk.onChoice(line, choice)),
    onClose: () => {
      talk.onClose();
      if (sleep) rest(world, hero, place);
    },
  };
}
