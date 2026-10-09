// The Vale: its size and land, and where a new game starts (docs/story/world.md).

import type { MapSize } from '@voxel/engine/world';

export const WORLD = {
  size: { width: 4096, depth: 4096 } satisfies MapSize, // tiles a side
  groundTier: 1, // bare, level grass for now (the hand-made land comes later)
  start: { x: 480, z: 3380 }, // the Pilgrim's Shrine
};
