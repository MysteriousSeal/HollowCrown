// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { buildings } from './buildings';
import { land } from './land';

export const FEATURES: Feature[] = [
  land,
  buildings,
];

export type { Feature, GameContext } from './context';
