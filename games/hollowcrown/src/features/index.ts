// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { buildings } from './buildings';
import { land } from './land';
import { sprint } from './sprint';
import { villagers } from './villagers';
import { wildlife } from './wildlife';

export const FEATURES: Feature[] = [
  land,
  buildings,
  villagers,
  wildlife,
  sprint,
];

export type { Feature, GameContext } from './context';
