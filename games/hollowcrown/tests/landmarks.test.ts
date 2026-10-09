// The realm's small landmarks stand where they can be found: on walkable ground off the roads, inside their region,
// clear of each other and of the named places, each with a short story; and every region has its share.

import { describe, expect, it } from 'vitest';
import { covers, loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { LANDMARKS } from '../src/data/world/landmarks';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const regions = WORLD_MAP.areas.filter((a) => a.kind === 'region');

describe("the realm's landmarks", () => {
  it('gives every region its share', () => {
    for (const r of regions) expect(LANDMARKS[r.id]?.length ?? 0, r.id).toBeGreaterThanOrEqual(10);
  });

  it('stands each on open walkable ground in its region, clear of the others and the named places, with a short story', () => {
    const all = Object.entries(LANDMARKS).flatMap(([region, list]) => list.map((l) => ({ region, l })));
    expect(new Set(all.map(({ l }) => l.id)).size).toBe(all.length);
    for (const { region, l } of all) {
      const surface = map.surfaceNames[map.surfaceAt(...l.at) - 1];
      expect(map.walkable(...l.at), `${l.id} on ${surface}`).toBe(true);
      expect(['road', 'track', 'path'].includes(surface ?? ''), `${l.id} on a ${surface}`).toBe(false);
      expect(covers(regions.find((r) => r.id === region)!.shape, ...l.at), `${l.id} outside ${region}`).toBe(true);
      expect(l.story.length, l.id).toBeLessThanOrEqual(140);
      for (const p of WORLD_MAP.places) expect(Math.hypot(p.at[0] - l.at[0], p.at[1] - l.at[1]), `${l.id} on ${p.id}`).toBeGreaterThan(20);
      for (const o of all) if (o.l !== l) expect(Math.hypot(o.l.at[0] - l.at[0], o.l.at[1] - l.at[1]), `${l.id} by ${o.l.id}`).toBeGreaterThan(60);
    }
  });
});
