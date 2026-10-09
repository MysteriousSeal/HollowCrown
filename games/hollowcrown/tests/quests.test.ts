// The quests written as data hold together: every place they name is on the map and every tile walkable, everyone
// they name is someone the village knows, ids are unique, and every choice has somewhere to go.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { PEOPLE_DATA } from '../src/data/people';
import { QUESTS } from '../src/data/quests';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const known = new Set([...WORLD_MAP.places.map((p) => p.id), ...WORLD_MAP.areas.map((a) => a.id)]);

describe('the quests', () => {
  it('has MQ01, The Stranger at the Ford, starting at the Pilgrim\'s Shrine and ending at the well', () => {
    const q = QUESTS.MQ01;
    expect(q.name).toBe('The Stranger at the Ford');
    expect(q.stages[0].objectives[0].at).toBe('pilgrims-shrine');
    expect(q.stages.at(-1)!.objectives[0].at).toBe('brindleford-well');
  });

  for (const q of Object.values(QUESTS)) {
    it(`${q.id}: names only places on the map, walkable tiles and known people`, () => {
      for (const id of q.places) expect(known.has(id), id).toBe(true);
      const stages = new Set(q.stages.map((s) => s.id));
      expect(stages.size).toBe(q.stages.length);
      for (const s of q.stages) {
        const ids = s.objectives.map((o) => o.id);
        expect(new Set(ids).size, s.id).toBe(ids.length);
        for (const o of s.objectives) {
          if (typeof o.at === 'string') expect(q.places.includes(o.at), `${s.id}/${o.id}: ${o.at} not in its places`).toBe(true);
          else if (o.at) expect(map.walkable(...o.at), `${s.id}/${o.id}`).toBe(true);
          if (o.who) expect(PEOPLE_DATA[o.who], `${s.id}/${o.id}: ${o.who}`).toBeDefined();
          for (const l of o.lines ?? []) expect(l.who.length > 0 && l.text.length > 0, `${s.id}/${o.id}: a line`).toBe(true);
          if (o.kind === 'choose') expect((o.options ?? []).length, `${s.id}/${o.id}`).toBeGreaterThan(1);
        }
      }
      for (const next of q.next) expect(next).toMatch(/^(MQ|SQ-)/);
    });
  }
});
