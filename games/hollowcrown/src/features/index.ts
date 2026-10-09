// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { buildings } from './buildings';
import { daylight } from './daylight';
import { debug } from './debug';
import { hud } from './hud';
import { land } from './land';
import { nature } from './nature';
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
  hud,
  talk,
];

export type { Feature, GameContext } from './context';
