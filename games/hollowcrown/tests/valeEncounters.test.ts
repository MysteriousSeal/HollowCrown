// Brindle Vale's encounters can be spawned: every foe a creature that exists, every spot walkable ground in the Vale,
// every area on the map, every hour a real one; and the region bible's enemies table is all there.

import { describe, expect, it } from 'vitest';
import { covers, loadWorldMap } from '@voxel/engine/world';
import { CREATURES } from '../src/creatures';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { BRINDLE_VALE_ENCOUNTERS } from '../src/data/world/encounters';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const vale = WORLD_MAP.areas.find((a) => a.id === 'brindle-vale')!;
const creatures = new Set(CREATURES.map((c) => c.id));

describe("Brindle Vale's encounters", () => {
  it('names creatures that exist, on walkable ground in the Vale, at real hours', () => {
    expect(new Set(BRINDLE_VALE_ENCOUNTERS.map((e) => e.id)).size).toBe(BRINDLE_VALE_ENCOUNTERS.length);
    for (const e of BRINDLE_VALE_ENCOUNTERS) {
      for (const foe of [e.foe, e.leader ?? e.foe]) expect(creatures.has(foe), `${e.id}: ${foe}`).toBe(true);
      if ('at' in e.where) {
        expect(map.walkable(...e.where.at), `${e.id}`).toBe(true);
        expect(covers(vale.shape, ...e.where.at), `${e.id} outside the Vale`).toBe(true);
      } else {
        const area = e.where.area;
        expect(WORLD_MAP.areas.some((a) => a.id === area), `${e.id}: ${area}`).toBe(true);
      }
      for (const h of e.hours ?? []) expect(Number.isInteger(h) && h >= 0 && h <= 23, e.id).toBe(true);
      expect(e.level >= 1 && e.count >= 1, e.id).toBe(true);
    }
  });

  it("has the bible's table: Mosshill's two packs of three, the rooks at dusk, the Marsh Cairn's skeleton", () => {
    const by = (foe: string) => BRINDLE_VALE_ENCOUNTERS.filter((e) => e.foe === foe);
    expect(by('wolf').filter((e) => e.level === 3 && e.count === 3)).toHaveLength(2);
    expect(by('rook').every((e) => e.count === 12 && e.hours?.[0] === 18)).toBe(true);
    expect(by('boar')).toHaveLength(3);
    expect(BRINDLE_VALE_ENCOUNTERS.find((e) => e.id === 'marsh-cairn-skeleton')?.level).toBe(4);
  });
});
