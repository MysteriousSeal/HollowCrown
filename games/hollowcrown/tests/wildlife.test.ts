// The Vale's wildlife: every animal is a creature with a model, on walkable open ground, where the bible puts it.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { CREATURES } from '../src/creatures';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { WILDLIFE } from '../src/features/wildlife';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const obstacles = obstaclesOf(map);

describe('wildlife', () => {
  it('is made of creatures the bestiary has', () => {
    for (const a of WILDLIFE) {
      expect(CREATURES.some((c) => c.id === a.creature), a.creature).toBe(true);
      expect(a.roam > 0 && a.speed > 0, a.note).toBe(true);
    }
  });

  it('stands on walkable ground, clear of walls', () => {
    for (const { at: [x, z], note } of WILDLIFE) {
      expect(map.walkable(x, z), note).toBe(true);
      expect(obstacles.blocks(x, z, 0.3), note).toBe(false);
    }
  });

  it('has two wolves at the Birchwood\'s north edge and three boars at its edges', () => {
    const wolves = WILDLIFE.filter((a) => a.creature === 'wolf');
    expect(wolves).toHaveLength(2);
    for (const { at: [x, z] } of wolves) expect(Math.hypot(x - 650, z - 3420)).toBeLessThan(4);
    expect(WILDLIFE.filter((a) => a.creature === 'boar')).toHaveLength(3);
  });
});
