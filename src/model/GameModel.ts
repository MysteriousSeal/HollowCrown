// Model: the game's state and rules, no rendering or input: the land (bare grass, level) and the hero walking it.

import { EDGE_MARGIN, GROUND_TIER, HERO_SPEED, TILE_HEIGHT } from './constants';
import { DEFAULT_MAP_SIZE, spawnOf, type MapSize } from './map/grid';
import { HERO_LOOK, type BodyLook } from './human/humanoid';

export interface Hero {
  x: number;
  y: number;
  z: number;
  look: BodyLook;
}

export class GameModel {
  readonly hero: Hero;

  constructor(readonly size: MapSize = DEFAULT_MAP_SIZE) {
    const spawn = spawnOf(size);
    this.hero = { ...spawn, y: this.groundY(), look: { ...HERO_LOOK } };
  }

  // The height of the ground anywhere, in world units.
  groundY(): number {
    return GROUND_TIER * TILE_HEIGHT;
  }

  // Walks the hero along (dirX, dirZ) for `dt` seconds, at their speed whatever the direction's length, kept on the map.
  moveHero(dirX: number, dirZ: number, dt: number): void {
    const len = Math.hypot(dirX, dirZ);
    if (len < 1e-6) return;
    const step = (HERO_SPEED * dt) / len;
    const { hero, size } = this;
    hero.x = Math.min(size.width - 1 - EDGE_MARGIN, Math.max(EDGE_MARGIN, hero.x + dirX * step));
    hero.z = Math.min(size.depth - 1 - EDGE_MARGIN, Math.max(EDGE_MARGIN, hero.z + dirZ * step));
  }
}
