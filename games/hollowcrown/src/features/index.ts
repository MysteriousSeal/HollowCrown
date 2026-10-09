// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { buildings } from './buildings';
import { daylight } from './daylight';
import { hud } from './hud';
import { land } from './land';
import { villagers } from './villagers';
import { wildlife } from './wildlife';

export const FEATURES: Feature[] = [
  daylight,
  land,
  buildings,
  villagers,
  wildlife,
  hud,
];

export type { Feature, GameContext } from './context';
