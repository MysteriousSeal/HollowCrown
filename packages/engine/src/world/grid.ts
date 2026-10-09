// A world's size in tiles, and rectangles of it.

export interface MapSize {
  width: number;
  depth: number;
}

// A rectangle of the map, in tiles: x0..x1-1, z0..z1-1.
export interface Area {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}
export const wholeMap = (size: MapSize): Area => ({ x0: 0, z0: 0, x1: size.width, z1: size.depth });
