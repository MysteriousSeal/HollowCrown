import { MAP_DEPTH, MAP_WIDTH } from '../constants';

// A world's size in tiles.
export interface MapSize {
  width: number;
  depth: number;
}

export const DEFAULT_MAP_SIZE: MapSize = { width: MAP_WIDTH, depth: MAP_DEPTH };

// A rectangle of the map, in tiles: x0..x1-1, z0..z1-1.
export interface Area {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}
export const wholeMap = (size: MapSize): Area => ({ x0: 0, z0: 0, x1: size.width, z1: size.depth });

// The hero starts at the center of the map.
export function spawnOf(size: MapSize): { x: number; z: number } {
  return { x: Math.floor(size.width / 2), z: Math.floor(size.depth / 2) };
}
