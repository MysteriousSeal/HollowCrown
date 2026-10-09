// The Vale's life is written so it can be placed: every region a region of the map, every habitat's surfaces and
// areas ones the map has, every tile in the region, every hour real, every density positive; and Brindle Vale has the
// life the bible asks for.

import { describe, expect, it } from 'vitest';
import { covers } from '@voxel/engine/world';
import { WORLD_MAP } from '../src/data/world';
import { SURFACES } from '../src/data/world/kinds';
import { LIFE } from '../src/data/world/life';

const areaIds = new Set(WORLD_MAP.areas.map((a) => a.id));
const areaKinds = new Set(WORLD_MAP.areas.map((a) => `kind:${a.kind}`));
const surfaces = new Set([...Object.keys(SURFACES), 'grass']);

describe("the Vale's life", () => {
  for (const [id, life] of Object.entries(LIFE)) {
    it(`${id}: names only what the map has`, () => {
      const region = WORLD_MAP.areas.find((a) => a.id === id && a.kind === 'region');
      expect(region, id).toBeDefined();
      const inRegion = (at: [number, number]) => covers(region!.shape, ...at);
      for (const w of life.wildlife) {
        for (const s of w.where.on ?? []) expect(surfaces.has(s), `${w.note}: ${s}`).toBe(true);
        for (const a of w.where.in ?? []) expect(areaIds.has(a) || areaKinds.has(a), `${w.note}: ${a}`).toBe(true);
        if (w.where.edge) expect(areaKinds.has(`kind:${w.where.edge.of}`), w.note).toBe(true);
        if (w.where.near) expect(inRegion(w.where.near.at), w.note).toBe(true);
        for (const h of w.hours ?? []) expect(Number.isInteger(h) && h >= 0 && h <= 23, w.note).toBe(true);
        expect(w.density, w.note).toBeGreaterThan(0);
      }
      for (const key of Object.keys(life.byArea)) expect(areaIds.has(key) || areaKinds.has(key), key).toBe(true);
      for (const q of [...life.quiet, ...life.patches]) expect(inRegion(q.at), q.note).toBe(true);
    });
  }

  it('fills Brindle Vale with rabbits, deer, ducks, frogs, rooks, hens, dogs, sheep and cows', () => {
    const kinds = new Set(LIFE['brindle-vale'].wildlife.map((w) => w.kind));
    for (const k of ['rabbit', 'deer', 'duck', 'frog', 'rook', 'hen', 'dog', 'sheep', 'cow'] as const) expect(kinds.has(k), k).toBe(true);
    expect(LIFE['brindle-vale'].ground.flowers.length).toBeGreaterThan(0);
  });
});
