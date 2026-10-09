// The land under everything: its size, each tile's height (in tiers), and the ground's height anywhere, as the world's
// resource (movement keeps to it; the terrain layer draws it).

import { defineResource } from '../ecs';
import type { MapSize } from './grid';

export const TILE_HEIGHT = 0.15; // world units per tier: about a person's knee height

export interface Terrain {
  readonly size: MapSize;
  tierAt(x: number, z: number): number; // a tile's height, in tiers
  groundY(x: number, z: number): number; // the ground's height under (x, z), in world units
}

export const TerrainResource = defineResource<Terrain>('Terrain');

// Level land at one tier, everywhere.
export function flatTerrain(size: MapSize, tier: number): Terrain {
  return { size, tierAt: () => tier, groundY: () => tier * TILE_HEIGHT };
}
