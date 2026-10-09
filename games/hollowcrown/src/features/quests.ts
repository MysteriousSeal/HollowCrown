// The quests: MQ01 starts with the game, at the Pilgrim's Shrine, and the quest book (systems/quests.ts) is kept as
// the hero plays. Being somewhere does a 'go', a 'search' or a 'take' there; reaching a choice that's nobody's (a
// body in a ditch) asks it there; talking to someone does what's asked of them (features/talk.ts). A stage with an
// hour moves the clock to it. The HUD's tracker follows the quest followed.

import type { System, World } from '@voxel/engine/ecs';
import { TimeOfDay, Transform } from '@voxel/engine/gameplay';
import type { ConversationLine } from '@voxel/engine/ui';
import type { Point, WorldMap } from '@voxel/engine/world';
import { PEOPLE_DATA } from '../data/people';
import type { Spot } from '../data/people/kinds';
import { QUESTS, type Objective, type QuestStage } from '../data/quests';
import { Quests, completeObjective, newBook, openObjectives, startQuest } from '../systems/quests';
import { ConversationScreen, TrackedQuest } from '../ui/screens';
import type { Feature } from './context';

// How near the hero must come to a spot to be there (tiles), by what it is.
const NEAR: Record<string, number> = { village: 12, building: 4, fixture: 3, landmark: 5, tile: 2.5 };
const BY_BEING_THERE = new Set<Objective['kind']>(['go', 'search', 'take']);

// Whether (x, z) is at `spot`: within reach of a place or a tile, or inside an area.
export function isAt(map: WorldMap, spot: Spot, x: number, z: number): boolean {
  if (typeof spot !== 'string') return near(spot, NEAR.tile, x, z);
  const place = map.place(spot);
  if (place) return near(place.at, NEAR[place.kind] ?? NEAR.landmark, x, z);
  return map.areasAt(x, z).some((a) => a.id === spot);
}
const near = ([px, pz]: Point, reach: number, x: number, z: number) => Math.hypot(x - px, z - pz) <= reach;

// A stage begun: the clock moved to its hour, if it has one.
function begin(world: World, stage: QuestStage | undefined): void {
  if (stage?.hour !== undefined && world.hasResource(TimeOfDay)) world.resource(TimeOfDay).hours = stage.hour;
}

// Objective `id` of `quest` done (with its choice's flags), and the stage it begins, begun.
export function complete(world: World, quest: string, id: string, sets?: Record<string, string | boolean>): void {
  begin(world, completeObjective(world.resource(Quests), QUESTS, quest, id, sets));
}

// What `name` says when talked to, and what it does for the quests: each open 'talk' with them done as it closes,
// each 'choose' with them asked (its options as the hero's replies). None asked of them: their first words.
export function talkWith(world: World, name: string): { lines: ConversationLine[]; onChoice: (line: number, choice: number) => void; onClose: () => void } {
  const asked = world.hasResource(Quests) ? openObjectives(world.resource(Quests), QUESTS).filter(({ objective }) => objective.who === name) : [];
  const talks = asked.filter(({ objective }) => objective.kind === 'talk');
  const choices = asked.filter(({ objective }) => objective.kind === 'choose');
  const lines: ConversationLine[] = [{ side: 'right', text: PEOPLE_DATA[name]?.firstWords ?? '…' }];
  for (const { objective } of choices) lines.push({ side: 'right', text: objective.text, choices: objective.options!.map((o) => o.label) });
  return {
    lines,
    onChoice: (line, choice) => {
      const asking = choices[line - 1];
      const option = asking?.objective.options?.[choice];
      if (option) complete(world, asking.quest, asking.objective.id, option.sets);
    },
    onClose: () => talks.forEach(({ quest, objective }) => complete(world, quest, objective.id)),
  };
}

// Each frame: whatever the hero has reached done, and a choice that's nobody's asked where it's found.
function questSystem(map: WorldMap, hero: number): System {
  return {
    name: 'quests',
    stage: 'simulate',
    update(world) {
      const at = world.get(hero, Transform);
      if (!at || !world.hasResource(Quests)) return;
      for (const { quest, objective } of openObjectives(world.resource(Quests), QUESTS)) {
        if (!objective.at || objective.who || !isAt(map, objective.at, at.x, at.z)) continue;
        if (BY_BEING_THERE.has(objective.kind)) complete(world, quest, objective.id);
        else if (objective.kind === 'choose') ask(world, quest, objective);
      }
    },
  };
}

// A choice that's nobody's, asked on the conversation screen (once it's free): the hero alone with it.
function ask(world: World, quest: string, objective: Objective): void {
  if (!world.hasResource(ConversationScreen)) return;
  const screen = world.resource(ConversationScreen);
  if (screen.isOpen) return;
  const lines: ConversationLine[] = [{ side: 'left', text: objective.text, choices: objective.options!.map((o) => o.label) }];
  screen.open({ name: 'You' }, { name: '' }, lines, undefined, (_, choice) => complete(world, quest, objective.id, objective.options![choice]?.sets));
}

export const quests: Feature = {
  name: 'quests',
  install: ({ app, map, hero }) => {
    const book = app.world.setResource(Quests, newBook());
    begin(app.world, startQuest(book, QUESTS, 'MQ01'));
    app.world.setResource(TrackedQuest, book.quests[0]);
    app.addSystems(questSystem(map, hero));
  },
};
