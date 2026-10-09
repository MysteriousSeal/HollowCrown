// What the HUD says, and when: the region's banner where the hero stands, the name of the place nearby.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, START_PLACE, WORLD_MAP } from '../src/data/world';
import { CONTROLS } from '../src/ui/controls';
import { riseChoices } from '../src/ui/deathScreen';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../src/ui/hudText';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const [sx, sz] = map.place(START_PLACE)!.at;

describe('the region banner', () => {
  it('names Brindle Vale and its levels at the start', () => {
    const region = regionOf(map.areasAt(sx, sz))!;
    expect(regionBanner(region)).toEqual({ title: 'BRINDLE VALE', sub: 'Levels 1–4' });
  });

  it('has no levels line for a region without them', () => {
    expect(regionBanner({ id: 'x', kind: 'region', name: 'Nowhere', shape: { rect: [0, 0, 1, 1] } }).sub).toBe('');
  });
});

describe('the place label', () => {
  it("names the Pilgrim's Shrine at the start, and Brindleford in the village, not its buildings", () => {
    expect(nearPlaceName(map.places(), sx, sz)).toBe("The Pilgrim's Shrine");
    expect(nearPlaceName(map.places(), 905, 3355)).toBe('Brindleford');
  });

  it('names nothing out in the open', () => {
    expect(nearPlaceName(map.places(), sx + 40, sz - 40)).toBeNull();
  });
});

describe('the controls page', () => {
  it('lists walking, sprint, talk, the map, the journal and pause', () => {
    expect(CONTROLS.map(([key]) => key)).toEqual(['WASD', 'Shift', 'E', 'M', 'J', 'N', 'Esc']);
  });
});

describe('the clock', () => {
  it('reads the part of the day and the time to ten minutes', () => {
    expect(clockText(17.7)).toBe('Dusk · 17:40');
    expect(clockText(0)).toBe('Night · 00:00');
    expect(clockText(6.25)).toBe('Dawn · 06:10');
    expect(clockText(23.99)).toBe('Night · 23:50');
    expect(clockText(24.5)).toBe('Night · 00:30');
  });
});

describe('the death screen', () => {
  it('offers the last rest only once the hero has rested, and always the shrine', () => {
    expect(riseChoices(false).map((c) => c.at)).toEqual(['shrine']);
    expect(riseChoices(true).map((c) => c.at)).toEqual(['rest', 'shrine']);
  });
});
