// What a small landmark is (landmarks.ts): its kind, which the environment models, where, and its line of story.

import type { Point } from '@voxel/engine/world';

export type LandmarkKind =
  | 'wayside-shrine' | 'wayside-cross' | 'milestone' | 'cairn' | 'standing-stone' | 'waymark'
  | 'ruined-chapel' | 'ruined-tower' | 'burnt-farmstead' | 'abandoned-cart' | 'hanged-oak' | 'battlefield'
  | 'charcoal-clearing' | 'beehive-hut' | 'holy-well';

export interface Landmark {
  id: string;
  kind: LandmarkKind;
  at: Point;
  facing?: number;
  story: string; // a line of it, as the hero might think it
  loot?: boolean; // something to find there, later
}

// A landmark, from its kind, tile and story: its id is its region's and its tile's.
export const mark = (region: string, kind: LandmarkKind, x: number, z: number, story: string, loot = false): Landmark => ({
  id: `${region}-${kind}-${x}-${z}`, kind, at: [x, z], facing: ((x * 7 + z * 13) % 4) * (Math.PI / 2), story, ...(loot ? { loot } : {}),
});
