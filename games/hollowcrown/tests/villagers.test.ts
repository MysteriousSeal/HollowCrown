// The Vale's villagers (Brindleford's, Tallow Green's) are the ones its buildings house: each lives where the map says, spends every hour somewhere
// the map has (and can be walked to), and has something to say.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { PEOPLE, PEOPLE_DATA, barkLine } from '../src/data/people';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import type { BuildingProps } from '../src/data/world/kinds';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const buildings = WORLD_MAP.places.filter((p) => p.kind === 'building');
const known = new Set([...WORLD_MAP.places.map((p) => p.id), ...WORLD_MAP.areas.map((a) => a.id)]);

describe("the Vale's villagers", () => {
  it('names everyone its buildings house, once, each at home where the map has them', () => {
    const residents = buildings.flatMap((b) => (b.props as BuildingProps).residents.map((who) => [who, b.id]));
    expect(PEOPLE.map((p) => p.name).sort()).toEqual(residents.map(([who]) => who).sort());
    for (const [who, home] of residents) expect(PEOPLE_DATA[who]?.home, who).toBe(home);
    expect(new Set(PEOPLE.map((p) => p.id)).size).toBe(PEOPLE.length);
  });

  it('spends every hour somewhere the map has, in order from midnight', () => {
    for (const p of PEOPLE) {
      expect(p.routine[0].from, p.id).toBe(0);
      for (let i = 1; i < p.routine.length; i++) expect(p.routine[i].from, p.id).toBeGreaterThanOrEqual(p.routine[i - 1].from);
      for (const s of [p.work, p.away?.at, ...p.routine.map((r) => r.at)]) {
        if (s === undefined) continue;
        if (typeof s === 'string') expect(known.has(s), `${p.id}: ${s}`).toBe(true);
        else expect(map.walkable(...s), `${p.id}: (${s})`).toBe(true);
      }
      for (const r of p.routine) expect(r.from >= 0 && r.from <= 23, p.id).toBe(true);
    }
  });

  it('gives everyone first words and two or three barks, short ones', () => {
    for (const p of PEOPLE) {
      expect(p.firstWords.length, p.id).toBeGreaterThan(1);
      expect(p.barks.length >= 2 && p.barks.length <= 3, p.id).toBe(true);
      for (const b of p.barks) expect(barkLine(b).length, `${p.id}: ${barkLine(b)}`).toBeLessThanOrEqual(80);
    }
  });
});
