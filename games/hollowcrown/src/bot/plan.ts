// What the bot does next, from the quest book: the followed quest's open objectives first, in the order the stage
// lists them (its optional ones before the required, so they're not passed by), leaving what can't be played (a
// 'wait'; a 'fight' with no foe about) and what it's given up; and where an objective is on the map, and how to say it.

import { boundsOf, type Point, type WorldMap } from '@voxel/engine/world';
import type { Spot } from '../data/people/kinds';
import type { Objective, Quest } from '../data/quests';
import { openObjectives, type QuestBook } from '../systems/quests';
import { POLICY } from './policy';

export interface Next {
  quest: string;
  objective: Objective;
}

export interface PlanOptions {
  canFight?: boolean; // whether there's a foe to fight (no: 'fight' objectives are passed by)
  skip?: ReadonlySet<string>; // objectives given up ('MQ01/elsa')
}

export const keyOf = ({ quest, objective }: Next): string => `${quest}/${objective.id}`;

// The objective to play next, or null: nothing left that can be played.
export function nextObjective(book: QuestBook, quests: Record<string, Quest>, { canFight = false, skip = new Set() }: PlanOptions = {}): Next | null {
  const open = openObjectives(book, quests).filter((n) => {
    if (skip.has(keyOf(n))) return false;
    if (n.objective.kind === 'wait') return false;
    if (n.objective.kind === 'fight') return canFight;
    return POLICY.playOptional || !n.objective.optional;
  });
  if (open.length === 0) return null;
  const rank = (n: Next) => (n.quest === book.tracked ? 0 : 2) + (n.objective.optional ? 0 : 1);
  return open.map((n, i) => ({ n, i })).sort((a, b) => rank(a.n) - rank(b.n) || a.i - b.i)[0].n;
}

// What the hero waits for, if nothing can be played but a 'wait' (its text), or null.
export function waitingFor(book: QuestBook, quests: Record<string, Quest>): string | null {
  return openObjectives(book, quests).find((n) => n.objective.kind === 'wait')?.objective.text ?? null;
}

// Where `spot` is on the map: a tile, a place's spot, or an area's middle; null if the map has no such spot.
export function pointOf(map: WorldMap, spot: Spot): Point | null {
  if (typeof spot !== 'string') return spot;
  const place = map.place(spot);
  if (place) return place.at;
  const area = map.data.areas.find((a) => a.id === spot);
  if (!area) return null;
  const { x0, z0, x1, z1 } = boundsOf(area.shape);
  return [Math.round((x0 + x1) / 2), Math.round((z0 + z1) / 2)];
}

// A spot as the badge says it: a place's or area's name; a tile, the named area it's in, else the nearest named place.
export function nameOf(map: WorldMap, spot: Spot | undefined): string {
  if (spot === undefined) return 'the road';
  if (typeof spot !== 'string') {
    const [x, z] = spot;
    const area = map.areasAt(x, z).find((a) => a.name);
    if (area) return area.name!;
    const near = map.places().filter((p) => p.name).sort((a, b) => Math.hypot(a.at[0] - x, a.at[1] - z) - Math.hypot(b.at[0] - x, b.at[1] - z))[0];
    return near ? `the road by ${near.name}` : 'the road';
  }
  return map.place(spot)?.name ?? map.data.areas.find((a) => a.id === spot)?.name ?? spot;
}

// What an objective asks, as the badge says it ("talk to Garrick Fenn").
export function deedOf(objective: Objective): string {
  switch (objective.kind) {
    case 'talk':
      return `talk to ${objective.who}`;
    case 'choose':
      return objective.who ? `answer ${objective.who}` : 'decide';
    case 'take':
      return `take the ${objective.what ?? 'thing'}`;
    case 'search':
      return `look for the ${objective.what ?? 'signs'}`;
    case 'fight':
      return `fight the ${objective.what ?? 'foes'}`;
    default:
      return 'get there';
  }
}

// The goal the badge shows on the way to an objective: "Walking to Brindleford — talk to Garrick Fenn".
export function walkingTo(map: WorldMap, objective: Objective): string {
  return `Walking to ${nameOf(map, objective.at)} — ${deedOf(objective)}`;
}
