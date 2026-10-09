// Kills: a fight's foe is known by its creature id or name; the wolves at the Birchwood win MQ01's fight once both
// have died.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Died, Transform } from '@voxel/engine/gameplay';
import { Creature, deathsOf, isWhat } from '../src/systems/kills';

describe('kills', () => {
  it('knows a foe by its id or its name', () => {
    expect(isWhat('wolf', { id: 'wolf', name: 'Wolf' })).toBe(true);
    expect(isWhat('the Hungry', { id: 'hungry', name: 'The Hungry' })).toBe(true);
    expect(isWhat('brood mother', { id: 'broodMother', name: 'Brood mother' })).toBe(true);
    expect(isWhat('wolf', { id: 'alphaWolf', name: 'Alpha wolf' })).toBe(false);
    expect(isWhat('Red Hen bandit', { id: 'bandit', name: 'Red Hen brute' })).toBe(true); // (MQ03's camp)
  });

  it("tells this frame's creature deaths, what each was and where it fell", () => {
    const world = new World();
    const wolf = world.spawn([Transform, { x: 650, y: 0, z: 3420, facing: 0 }], [Creature, { id: 'wolf', name: 'Wolf' }]);
    const someone = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
    world.emit(Died, { entity: wolf, by: someone });
    world.emit(Died, { entity: someone, by: wolf });
    expect(deathsOf(world)).toEqual([{ entity: wolf, id: 'wolf', name: 'Wolf', x: 650, z: 3420 }]);
  });
});
