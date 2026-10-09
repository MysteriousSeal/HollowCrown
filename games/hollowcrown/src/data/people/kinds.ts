// What a named villager is, as data: who they are, where they live and work, where they are each hour, and what they
// say. Used by the villagers' spawning and routines (gameplay), their models (characters), and dialogue.

import type { Point } from '@voxel/engine/world';

// Where someone can be: a place or an area by its id in the world map (a building, the well, the hay meadows: an
// area means somewhere in it), or a tile.
export type Spot = string | Point;

// What they're doing there.
export type Doing = 'held' | 'sleep' | 'work' | 'eat' | 'drink' | 'pray' | 'sit' | 'stand' | 'wander' | 'gather' | 'herd' | 'travel';

// One step of a day: from `from` (the hour, 0..23) until the next step's hour, they're at `at`, doing `doing`. A step
// with `days` only happens on the days it names (the day count since the game began: day % every === on); on other
// days it's skipped, the step before it carrying on.
export interface RoutineStep {
  from: number;
  at: Spot;
  doing: Doing;
  days?: { every: number; on: number };
}

// A line said in passing, overheard as the hero walks by; `after` a story flag, it's only said once that's happened.
export type Bark = string | { line: string; after: string };

export interface Villager {
  id: string;
  name: string; // as the region's bible and their building's residents have it
  who: string; // their trade, age, what weighs on them, in a few words
  home: string; // a building id
  work?: string; // a building or area id
  routine: RoutineStep[]; // from hour 0, in order
  firstWords: string; // the first time the hero speaks to them
  barks: Bark[];
  quests: string[];
  // Somewhere else instead of their routine until a quest is done (Wat, in the Red Hen's stock until SQ-BV7, which
  // freeing him in MQ03 completes): spawned there, doing that, then home.
  away?: { until: string; at: Spot; doing: Doing };
  bed?: { line: string; yes: string; no: string }; // an innkeeper's offer of a bed, and the hero's two answers
}

// The line of a bark, whatever its kind.
export const barkLine = (b: Bark) => (typeof b === 'string' ? b : b.line);
