// The Vale's map (docs/story/world.md): 4096 tiles a side, grass at tier 1 wherever nothing's drawn, the realm's frame
// and each region drawn over it, in order; and where a new game starts.

import { composeWorldMap } from '@voxel/engine/world';
import { BRINDLE_VALE } from './brindleVale';
import { BRINDLEFORD } from './brindleford';
import { TALLOW_GREEN } from './tallowGreen';
import { PLACE_KINDS, SURFACES } from './kinds';
import { REALM } from './realm';

export const WORLD_MAP = composeWorldMap({ size: { width: 4096, depth: 4096 }, baseTier: 1, surfaceKinds: SURFACES }, REALM, BRINDLE_VALE, BRINDLEFORD, TALLOW_GREEN);
export { PLACE_KINDS };
export const START_PLACE = 'pilgrims-shrine';
