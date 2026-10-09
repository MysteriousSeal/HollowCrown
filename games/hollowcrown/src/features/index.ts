// Every feature of the game, installed in this order. A new feature: its own file here, and one line below.

import type { Feature } from './context';
import { bot } from './bot';
import { ambient } from './ambient';
import { buildings } from './buildings';
import { captives } from './captives';
import { combat } from './combat';
import { daylight } from './daylight';
import { encounters } from './encounters';
import { debug } from './debug';
import { devStart } from './devStart';
import { discovery } from './discovery';
import { hud } from './hud';
import { land } from './land';
import { nature } from './nature';
import { quests } from './quests';
import { roaming } from './roaming';
import { saving } from './saving';
import { sound } from './sound';
import { sprint } from './sprint';
import { talk } from './talk';
import { villagers } from './villagers';

export const FEATURES: Feature[] = [
  daylight,
  debug,
  land,
  buildings,
  nature,
  villagers,
  captives,
  sprint,
  combat,
  hud,
  talk,
  quests,
  discovery,
  bot,
  encounters,
  roaming,
  ambient,
  sound,
  saving,
  devStart,
];

export type { Feature, GameContext } from './context';
