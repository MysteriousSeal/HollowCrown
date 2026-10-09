// QA: the people's models and the map's residents agree. A model kept under a name nobody on the map has (a typo,
// "Tobin Harow") would never be shown, and its villager would silently fall back to a body drawn from their name; and
// whoever sits (Old Meg) must be a body that can be sat down.

import { describe, expect, it } from 'vitest';
import { FrameModel } from '@voxel/engine/characters';
import { loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../../src/data/world';
import type { BuildingProps } from '../../src/data/world/kinds';
import { figureOf, villagersOf } from '../../src/features/villagers';
import { PEOPLE } from '../../src/people';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const residents = new Set(map.places('building').flatMap((p) => (p.props as BuildingProps).residents));

describe("the people's models", () => {
  // (Was a bug: four models keyed by first name only, never shown. Fixed by characters.)
  it('are each kept under the name of someone living on the map', () => {
    expect(Object.keys(PEOPLE).filter((name) => !residents.has(name))).toEqual([]);
  });

  it('can sit whoever sits', () => {
    for (const v of villagersOf(map).filter((v) => v.seated)) expect(figureOf(v), v.name).toBeInstanceOf(FrameModel);
  });
});
