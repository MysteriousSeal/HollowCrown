// Every dungeon drawn as data so far, by id (the same as its place on the world map).

import { BELLWARDENS_TOMB } from './bellwardensTomb';
import type { Dungeon } from './kinds';

export const DUNGEONS: Record<string, Dungeon> = Object.fromEntries([BELLWARDENS_TOMB].map((d) => [d.id, d]));
export { checkDungeon, type Dungeon, type DungeonDoor, type DungeonFeature, type DungeonRoom, type DungeonSpawn, type Rect } from './kinds';
