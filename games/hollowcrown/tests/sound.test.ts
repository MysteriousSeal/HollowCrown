// Sound: a wolf snarls once as it turns to chase, not while it chases, and again only after it gave up.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { PlaySound } from '@voxel/engine/audio';
import { Hostile, Transform, hostile } from '@voxel/engine/gameplay';
import { snarlSystem } from '../src/features/sound';
import { Creature } from '../src/systems/kills';

describe('sound', () => {
  it('snarls as a wolf turns to chase', () => {
    const world = new World();
    const wolf = world.spawn([Transform, { x: 3, y: 0, z: 4, facing: 0 }], [Creature, { id: 'wolf', name: 'Wolf' }], [Hostile, hostile()]);
    const system = snarlSystem();
    const snarls = () => {
      system.update(world, 1 / 60);
      const heard = world.eventsOf(PlaySound).filter((s) => s.name === 'snarl');
      world.clearEvents();
      return heard;
    };
    expect(snarls()).toHaveLength(0);
    world.read(wolf, Hostile).state = 'chase';
    expect(snarls()).toEqual([{ name: 'snarl', at: { x: 3, z: 4 } }]);
    expect(snarls()).toHaveLength(0);
    world.read(wolf, Hostile).state = 'return';
    snarls();
    world.read(wolf, Hostile).state = 'chase';
    expect(snarls()).toHaveLength(1);
  });
});
