// The realm's small landmarks, placed by hand across every region (docs/story/world.md, "The lie of the land"): one
// every couple of hundred tiles of open land, so no walk is empty. Each has a kind the environment models, and a line
// of its story, in the game's voice; some will hide a little loot or lore later. By region in landmarksSouth.ts and
// landmarksNorth.ts. Used by the landmarks' models (environment), and later by loot and lore (gameplay).

import { NORTH_LANDMARKS } from './landmarksNorth';
import { SOUTH_LANDMARKS } from './landmarksSouth';
import type { Landmark } from './landmarkKinds';

export { mark, type Landmark, type LandmarkKind } from './landmarkKinds';

// By region id.
export const LANDMARKS: Record<string, Landmark[]> = { ...SOUTH_LANDMARKS, ...NORTH_LANDMARKS };
