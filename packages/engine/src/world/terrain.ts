// The land under everything: its size, each tile's height (in tiers), what covers it (a surface: water, a path) and
// whether it can be walked on, and the ground's height anywhere, as the world's resource (movement keeps to it; the
// terrain layer draws it).

import { defineResource } from '../ecs';
import type { MapSize } from './grid';

export const TILE_HEIGHT = 0.15; // world units per tier: about a person's knee height

export interface Terrain {
  readonly size: MapSize;
  tierAt(x: number, z: number): number; // a tile's height, in tiers
  groundY(x: number, z: number): number; // the ground's height under (x, z), in world units
  surfaceAt?(x: number, z: number): number; // what covers a tile: 0 the bare land, else a surface's number (1..)
  drawnSurfaceAt?(x: number, z: number): number; // the surface its top is drawn as (none given: surfaceAt's)
  reliefAt?(x: number, z: number): number; // a tile top's rise or dip, in relief steps (relief.ts; none given: flat)
  walkable?(x: number, z: number): boolean; // whether anyone can stand there (none given: everywhere)
  readonly surfaceNames?: readonly string[]; // surface number n's name is surfaceNames[n - 1] (for debugging)
}

export const TerrainResource = defineResource<Terrain>('Terrain');

// The tile (x, z) falls in (tiles are centred on whole numbers).
export const tileOf = (v: number): number => Math.round(v);

// Level land at one tier, everywhere.
export function flatTerrain(size: MapSize, tier: number): Terrain {
  return { size, tierAt: () => tier, groundY: () => tier * TILE_HEIGHT };
}
