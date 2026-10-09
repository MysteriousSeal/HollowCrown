// The quests: MQ01 starts with the game, at the Pilgrim's Shrine, and the quest book (systems/quests.ts) is kept as
// the hero plays. Being somewhere does a 'go', a 'search' or a 'take' there; reaching a choice that's nobody's (a
// body in a ditch) asks it there; talking to someone does what's asked of them (features/talk.ts); enough of a foe
// killed wins a fight. A stage with an hour moves the clock to it. The HUD's quest log (its tracker, journal,
// notices) is the book itself.

import type { Entity, System, World } from '@voxel/engine/ecs';
import { TimeOfDay, Transform } from '@voxel/engine/gameplay';
import type { ConversationLine } from '@voxel/engine/ui';
import type { Point, WorldMap } from '@voxel/engine/world';
import { PEOPLE_DATA } from '../data/people';
import type { Spot } from '../data/people/kinds';
import { QUESTS, type Line, type Objective, type QuestStage } from '../data/quests';
import { deathsOf, isWhat, needed } from '../systems/kills';
import { Quests, completeObjective, newBook, openObjectives, startQuest } from '../systems/quests';
import { ConversationScreen, QuestLog } from '../ui/screens';
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

// The lines an objective plays, talking with `name` (the hero on the left, everyone else on the right, named if it
// isn't `name` speaking: a third voice); a choice's replies offered on its last. None written: `fallback`.
export function linesOf(objective: Objective, name: string, fallback: Line): ConversationLine[] {
  const said = objective.lines?.length ? objective.lines : [fallback];
  const lines: ConversationLine[] = said.map(({ who, text }) => ({
    side: who === 'hero' ? 'left' : 'right',
    text,
    ...(who === 'hero' || who === name ? {} : { who }),
  }));
  if (objective.kind === 'choose') lines[lines.length - 1].choices = objective.options!.map((o) => o.label);
  return lines;
}

// What `name` says when talked to, and what it does for the quests: each open 'talk' with them played and done as
// it closes, then each 'choose' with them played and done by the reply picked. None asked of them: their first words.
export function talkWith(world: World, name: string): { lines: ConversationLine[]; onChoice: (line: number, choice: number) => void; onClose: () => void } {
  const asked = world.hasResource(Quests) ? openObjectives(world.resource(Quests), QUESTS).filter(({ objective }) => objective.who === name) : [];
  const firstWords = PEOPLE_DATA[name]?.firstWords ?? '…';
  if (asked.length === 0) return { lines: [{ side: 'right', text: firstWords }], onChoice: () => {}, onClose: () => {} };
  const isChoice = ({ objective }: (typeof asked)[number]) => objective.kind === 'choose';
  const ordered = [...asked.filter((a) => !isChoice(a)), ...asked.filter(isChoice)];
  const lines: ConversationLine[] = [];
  const choiceAt = new Map<number, (typeof asked)[number]>(); // (each choice, by the line it's asked on)
  for (const entry of ordered) {
    lines.push(...linesOf(entry.objective, name, { who: name, text: isChoice(entry) ? entry.objective.text : firstWords }));
    if (isChoice(entry)) choiceAt.set(lines.length - 1, entry);
  }
  return {
    lines,
    onChoice: (line, choice) => {
      const asking = choiceAt.get(line);
      const option = asking?.objective.options?.[choice];
      if (asking && option) complete(world, asking.quest, asking.objective.id, option.sets);
    },
    onClose: () => ordered.forEach(({ quest, objective }) => objective.kind === 'talk' && complete(world, quest, objective.id)),
  };
}

// Each frame: whatever the hero has reached done, a choice that's nobody's asked where it's found, and each death
// counted toward the fight it's part of (done once enough have fallen).
export function questSystem(map: WorldMap, hero: number): System {
  const kills = new Map<string, Set<Entity>>(); // the fallen, by quest/objective (each counted once, however often told)
  return {
    name: 'quests',
    stage: 'simulate',
    update(world) {
      const at = world.get(hero, Transform);
      if (!at || !world.hasResource(Quests)) return;
      const deaths = deathsOf(world);
      for (const { quest, objective } of openObjectives(world.resource(Quests), QUESTS)) {
        if (objective.kind === 'fight' && objective.what) {
          const key = `${quest}/${objective.id}`;
          const fallen = kills.get(key) ?? kills.set(key, new Set()).get(key)!;
          for (const d of deaths) if (isWhat(objective.what, d)) fallen.add(d.entity);
          if (fallen.size >= needed(objective)) complete(world, quest, objective.id);
          continue;
        }
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
  const lines = linesOf(objective, 'hero', { who: 'hero', text: objective.text });
  screen.open({ name: 'You' }, { name: '' }, lines, undefined, (_, choice) => complete(world, quest, objective.id, objective.options![choice]?.sets));
}

export const quests: Feature = {
  name: 'quests',
  install: ({ app, map, hero }) => {
    const book = app.world.setResource(Quests, newBook());
    begin(app.world, startQuest(book, QUESTS, 'MQ01'));
    app.world.setResource(QuestLog, book); // (the book is the HUD's quest log: its tracker, journal and notices follow it)
    app.addSystems(questSystem(map, hero));
  },
};
