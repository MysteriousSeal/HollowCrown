// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { bot } from './bot';
import { buildings } from './buildings';
import { combat } from './combat';
import { daylight } from './daylight';
import { encounters } from './encounters';
import { debug } from './debug';
import { hud } from './hud';
import { land } from './land';
import { nature } from './nature';
import { quests } from './quests';
import { sprint } from './sprint';
import { talk } from './talk';
import { villagers } from './villagers';
import { wildlife } from './wildlife';

export const FEATURES: Feature[] = [
  daylight,
  debug,
  land,
  buildings,
  nature,
  villagers,
  wildlife,
  sprint,
  combat,
  hud,
  talk,
  quests,
  bot,
  encounters,
];

export type { Feature, GameContext } from './context';
