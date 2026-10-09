// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { buildings } from './buildings';
import { hud } from './hud';
import { land } from './land';

export const FEATURES: Feature[] = [
  land,
  buildings,
  hud,
];

export type { Feature, GameContext } from './context';
