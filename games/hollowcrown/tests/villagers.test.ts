// Brindleford's villagers: everyone living in a building stands outside its door on open ground, each looking the
// same every time, Kit child-sized, Old Meg sat by her door.

import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import type { BuildingProps } from '../src/data/world/kinds';
import { figureOf, lookOf, villagersOf } from '../src/features/villagers';
import { PEOPLE } from '../src/people';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const obstacles = obstaclesOf(map);
const people = villagersOf(map);
const who = (name: string) => people.find((v) => v.name === name)!;

describe('villagers', () => {
  it('stands every resident of every building', () => {
    const residents = map.places('building').flatMap((p) => (p.props as BuildingProps).residents);
    expect(people.map((v) => v.name).sort()).toEqual([...residents].sort());
  });

  it('puts each one outside, on walkable ground clear of the walls', () => {
    for (const v of people) {
      expect(map.walkable(v.x, v.z), v.name).toBe(true);
      expect(obstacles.blocks(v.x, v.z, 0.1), v.name).toBe(false);
    }
  });

  it('gives a name the same look each time, and different names different looks', () => {
    expect(lookOf('Odo Pell')).toEqual(lookOf('Odo Pell'));
    const looks = new Set(people.map((v) => JSON.stringify(v.look)));
    expect(looks.size).toBeGreaterThan(people.length * 0.8);
  });

  it('makes each one a figure, their own model where they have one', () => {
    for (const v of people) expect(figureOf(v).root, v.name).toBeDefined();
    expect(Object.keys(PEOPLE).some((name) => people.some((v) => v.name === name))).toBe(true);
  });

  it('makes Kit child-sized and sits Old Meg by her door', () => {
    expect(who('Kit').scale).toBeLessThan(1);
    expect(who('Old Meg').seated).toBe(true);
    expect(who('Old Meg').look.build).toBe('female');
  });
});
