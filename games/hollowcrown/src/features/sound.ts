// The game's sound (the engine's audio: swings, blows, the hour's ambience come of themselves): the hero's footsteps
// and the villagers' (softer), and a snarl from a beast that turns to chase.

import type { Entity, System } from '@voxel/engine/ecs';
import { Footsteps, PlaySound, footsteps } from '@voxel/engine/audio';
import { Hostile, Transform, type HostileState } from '@voxel/engine/gameplay';
import { Creature } from '../systems/kills';
import { Resident } from '../systems/villagerDay';
import type { Feature } from './context';

// Who snarls as they give chase (creature kinds), and the hero's and a villager's footsteps (stride, volume).
export const SNARLERS = new Set(['wolf', 'boar']);
const HERO_STEPS = footsteps(0.55, 1);
const VILLAGER_STEP = { stride: 0.5, volume: 0.35 };

// Each frame: a snarl from every snarler that has just turned to chase (told as a PlaySound at it).
export function snarlSystem(): System {
  const was = new Map<Entity, HostileState>();
  return {
    name: 'snarls',
    stage: 'present',
    update(world) {
      for (const entity of world.query(Hostile, Transform)) {
        const { state } = world.read(entity, Hostile);
        const before = was.get(entity) ?? 'idle';
        was.set(entity, state);
        const kind = world.get(entity, Creature)?.id;
        if (state !== 'chase' || before === 'chase' || !kind || !SNARLERS.has(kind)) continue;
        const { x, z } = world.read(entity, Transform);
        world.emit(PlaySound, { name: 'snarl', at: { x, z } });
      }
    },
  };
}

export const sound: Feature = {
  name: 'sound',
  install: ({ app, hero }) => {
    app.enableAudio();
    app.world.add(hero, Footsteps, HERO_STEPS);
    for (const villager of app.world.query(Resident)) app.world.add(villager, Footsteps, footsteps(VILLAGER_STEP.stride, VILLAGER_STEP.volume));
    app.addSystems(snarlSystem());
  },
};
