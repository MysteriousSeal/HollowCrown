// The dungeons drawn as data hold together: sound by their own rules, tied to a crypt or cave on the world map, every
// room reachable from the way in, and the Bellwarden's Tomb has the three halls MQ02 walks through.

import { describe, expect, it } from 'vitest';
import { CREATURES } from '../src/creatures';
import { DUNGEONS, checkDungeon } from '../src/data/dungeons';
import { WORLD_MAP } from '../src/data/world';

describe('the dungeons', () => {
  for (const d of Object.values(DUNGEONS)) {
    it(`${d.id}: is sound, tied to its place, every room reached from the way in`, () => {
      expect(checkDungeon(d)).toEqual([]);
      for (const s of d.spawns) expect(CREATURES.some((c) => c.id === s.foe), s.foe).toBe(true);
      const place = WORLD_MAP.places.find((p) => p.id === d.place);
      expect(place && ['crypt', 'cave'].includes(place.kind), `${d.place} is a crypt or cave on the map`).toBe(true);
      const reached = new Set([d.entrance.room]);
      for (let grew = true; grew; ) {
        grew = false;
        for (const door of d.doors) {
          for (const [a, b] of [[door.from, door.to], [door.to, door.from]]) {
            if (reached.has(a) && !reached.has(b)) (reached.add(b), (grew = true));
          }
        }
      }
      expect([...reached].sort()).toEqual(d.rooms.map((r) => r.id).sort());
    });
  }

  it("draws the Bellwarden's Tomb: the Ossuary, the Bell Hall over its pit, the Warden's Rest with Hamund", () => {
    const tomb = DUNGEONS['bellwardens-tomb'];
    expect(tomb.rooms.map((r) => r.name)).toEqual(['The stair', 'The Ossuary', 'The Bell Hall', "The Warden's Rest"]);
    expect(tomb.features.some((f) => f.kind === 'pit') && tomb.features.some((f) => f.kind === 'rope-bridge')).toBe(true);
    expect(tomb.spawns.find((s) => s.boss)?.foe).toBe('hamund');
    for (let i = 1; i < tomb.rooms.length; i++) expect(tomb.rooms[i].tier).toBeLessThan(tomb.rooms[i - 1].tier); // each hall lower
  });
});
