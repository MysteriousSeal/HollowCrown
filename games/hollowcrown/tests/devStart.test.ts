// Starting elsewhere for the studio: ?at=x,z on a walkable tile, ?time= an hour; anything else ignored.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { devStartOf } from '../src/features/devStart';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);

describe('devStart', () => {
  it('reads a walkable tile and an hour', () => {
    expect(devStartOf('?at=900,3355&time=13', map)).toEqual({ at: [900, 3355], hour: 13 });
  });

  it('ignores what isn\'t one', () => {
    expect(devStartOf('?at=900&time=25', map)).toEqual({});
    expect(devStartOf('?at=a,b&time=x', map)).toEqual({});
    expect(devStartOf('', map)).toEqual({});
  });
});
