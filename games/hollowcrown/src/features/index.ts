// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { buildings } from './buildings';
import { daylight } from './daylight';
import { land } from './land';
import { villagers } from './villagers';

export const FEATURES: Feature[] = [
  daylight,
  land,
  buildings,
  villagers,
];

export type { Feature, GameContext } from './context';
