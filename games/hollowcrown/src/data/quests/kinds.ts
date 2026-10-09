// What a quest is, as data, for the quest system to run and the journal to show: its stages in order, each stage's
// objectives (where, with whom, what), the choices in it and the story flags they set (docs/story/choices.md), and its
// rewards.

import type { Point } from '@voxel/engine/world';
import type { Spot } from '../people/kinds';

// What an objective asks: to get somewhere, speak to someone, pick something up, win a fight, choose, look round, or
// wait for the hour.
export type ObjectiveKind = 'go' | 'talk' | 'take' | 'fight' | 'choose' | 'search' | 'wait';

// One way through a choice: what the hero picks (a tone or an action), and the flags it sets ({ flag: value }).
export interface ChoiceOption {
  id: string;
  label: string; // a tone's line, or an action in brackets: "[Take the jerkin]"
  tone?: 'kind' | 'hard' | 'sly' | 'blunt';
  sets?: Record<string, string | boolean>;
}

// A line of a conversation: who says it (a villager by name, 'hero', or anyone else by name) and what they say.
export interface Line {
  who: string;
  text: string;
}

export interface Objective {
  id: string;
  kind: ObjectiveKind;
  text: string; // as the journal lists it, in the hero's voice
  at?: Spot; // a place or area id, or a tile
  who?: string; // a villager, by name (data/people)
  what?: string; // an item or a foe kind
  count?: number;
  optional?: boolean;
  options?: ChoiceOption[]; // (a choice's: the hero's replies, after its lines)
  lines?: Line[]; // what's said, in order, when a talk or a choice is played (instead of the speaker's first words)
}

// A stage: its objectives, all done (but the optional ones) before the next stage starts.
export interface QuestStage {
  id: string;
  title: string;
  hour?: number; // the hour the stage happens at, if the story sets one (the game's clock moves to it)
  objectives: Objective[];
  sets?: Record<string, string | boolean>; // flags set as the stage ends
}

// Found in the wild, not given: the hero comes within `radius` of a tile, or examines something there with E (`prop`:
// its model, a dressing kind or a creature id, placed by the map's dressing; `label`: the prompt, "Examine the cart").
export type Found = { at: Point; radius: number } | { examine: { at: Point; prop: string; label: string } };

export interface Quest {
  id: string; // 'MQ01'
  name: string;
  act: 'prologue' | 'act-1' | 'act-2' | 'act-3';
  level: number;
  minutes: number; // about how long it plays
  starts: string; // what starts it, in words
  start: { after: string[]; giver?: string; found?: Found }; // the quests done first; who gives it (a villager's name),
  // or where it's found in the wild; neither: it starts by itself
  places: string[]; // every place or area it uses, by id
  stages: QuestStage[];
  rewards: { xp: number; copper?: number; items: string[]; other: string[] };
  journal: string; // the entry when it ends
  next: string[]; // the quests it opens
}
