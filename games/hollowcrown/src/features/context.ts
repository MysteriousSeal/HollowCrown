// What a feature of the game is given to install itself: the engine's app, the Vale's map, what stands in the way on
// it (a feature adds its own: trees, fences), and the hero.

import type { App } from '@voxel/engine/app';
import type { Entity } from '@voxel/engine/ecs';
import type { Obstacles, WorldMap } from '@voxel/engine/world';

export interface GameContext {
  app: App;
  map: WorldMap;
  obstacles: Obstacles;
  hero: Entity;
}

// A feature: what it adds to the game (layers, systems, entities, UI), installed once before the game starts.
export interface Feature {
  name: string;
  install(game: GameContext): void;
}
