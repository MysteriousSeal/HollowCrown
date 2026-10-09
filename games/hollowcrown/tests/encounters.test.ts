// Encounters: what a stage brings stands on open ground in its stage's quest, as creatures that exist; the Hungry
// don't attack first, but turn on whoever strikes them.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Hit, Hostile, Transform } from '@voxel/engine/gameplay';
import { loadWorldMap } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { CREATURES } from '../src/creatures';
import { QUESTS } from '../src/data/quests';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { ENCOUNTERS, KEEPERS, provokeSystem } from '../src/features/encounters';
import { Creature } from '../src/systems/kills';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const obstacles = obstaclesOf(map);

describe('encounters', () => {
  it("bring creatures that exist, to a quest's stage, on open ground", () => {
    for (const [key, { creature, at, models }] of Object.entries(ENCOUNTERS)) {
      const [quest, stage] = key.split('/');
      expect(QUESTS[quest]?.stages.some((s) => s.id === stage), key).toBe(true);
      for (const model of models ?? [creature]) expect(CREATURES.some((c) => c.id === model), `${key} ${model}`).toBe(true);
      for (const [x, z] of at) expect(map.walkable(x, z) && !obstacles.blocks(x, z, 0.2), `${key} ${x},${z}`).toBe(true);
    }
  });

  it('keeps the Red Hen camp with five of the band, on open ground', () => {
    const camp = KEEPERS.find((k) => k.note === 'the Red Hen camp')!;
    expect(camp.at).toHaveLength(5);
    for (const [x, z] of camp.at) {
      expect(map.walkable(x, z) && !obstacles.blocks(x, z, 0.2), `${x},${z}`).toBe(true);
      expect(Math.hypot(x - 620, z - 3560)).toBeLessThan(8);
    }
  });

  it("brings MQ01's midnight as many of the Hungry as its fight needs", () => {
    const fight = QUESTS.MQ01.stages.find((s) => s.id === 'midnight')!.objectives[0];
    expect(ENCOUNTERS['MQ01/midnight'].at.length).toBeGreaterThanOrEqual(fight.count ?? 1);
  });

  it('turns one of the Hungry on whoever strikes it', () => {
    const world = new World();
    const hungry = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }], [Creature, { id: 'hungry', name: 'The Hungry' }]);
    provokeSystem.update(world, 1 / 60);
    expect(world.has(hungry, Hostile)).toBe(false);
    world.emit(Hit, { target: hungry, by: 99, damage: 4 });
    provokeSystem.update(world, 1 / 60);
    expect(world.has(hungry, Hostile)).toBe(true);
  });
});
