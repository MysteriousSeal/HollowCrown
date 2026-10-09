// Sound in the world: a PlaySound event any system can raise, the sounds the engine makes on its own (a swing's
// whoosh, a blow landing, footsteps by what's underfoot), and the ambience following the hour and the place round
// the listener.

import { defineComponent, defineEvent, defineResource, type System, type World } from '../ecs';
import { Player, Transform } from '../gameplay/components';
import { Hit } from '../gameplay/health';
import { Swing } from '../gameplay/attack';
import { TimeOfDay } from '../gameplay/time';
import { TerrainResource } from '../world/terrain';
import { ScreenAxes } from '../input/playerInput';
import type { AudioEngine } from './audioEngine';
import { ambienceMix } from './mix';

// A sound to play: a recipe's name (sfx.ts), where (none: everywhere), how loud and how high.
export const PlaySound = defineEvent<{ name: string; at?: { x: number; z: number }; volume?: number; pitch?: number }>('PlaySound');

// The game's audio, for systems and the UI (the volume, mute).
export const AudioResource = defineResource<AudioEngine>('Audio');

// It's heard walking: a step every `stride` world units it goes (the state kept by the footstep system).
export interface FootstepsData {
  stride: number;
  volume: number;
  travelled: number;
  last: { x: number; z: number } | null;
}
export const Footsteps = defineComponent<FootstepsData>('Footsteps');
export const footsteps = (stride = 0.55, volume = 1): FootstepsData => ({ stride, volume, travelled: 0, last: null });

// Which step sound a surface makes, by its name (none: bare land, 'grass').
export type StepSurface = (surfaceName: string | null) => string;
export const defaultStepSurface: StepSurface = (name) => (name === null ? 'step-grass' : /plank|bridge|boards|wood|floor/i.test(name) ? 'step-wood' : 'step-road');

// A step sounded each stride walked, by what's underfoot.
export function footstepSystem(stepSurface: StepSurface = defaultStepSurface): System {
  return {
    name: 'footsteps',
    stage: 'present',
    update(world) {
      const terrain = world.hasResource(TerrainResource) ? world.resource(TerrainResource) : null;
      for (const entity of world.query(Footsteps, Transform)) {
        const steps = world.read(entity, Footsteps);
        const { x, z } = world.read(entity, Transform);
        if (steps.last) steps.travelled += Math.min(1, Math.hypot(x - steps.last.x, z - steps.last.z)); // (a jump isn't steps)
        steps.last = { x, z };
        if (steps.travelled < steps.stride) continue;
        steps.travelled -= steps.stride;
        const surface = terrain?.surfaceAt?.(x, z) ?? 0;
        const name = surface === 0 ? null : (terrain?.surfaceNames?.[surface - 1] ?? null);
        world.emit(PlaySound, { name: stepSurface(name), at: { x, z }, volume: steps.volume });
      }
    },
  };
}

// How much water is round (x, z): the share of ground that can't be walked on within a few tiles, sampled.
function waterNear(world: World, x: number, z: number): number {
  if (!world.hasResource(TerrainResource)) return 0;
  const terrain = world.resource(TerrainResource);
  if (!terrain.walkable) return 0;
  let wet = 0;
  let all = 0;
  for (let dx = -8; dx <= 8; dx += 2) for (let dz = -8; dz <= 8; dz += 2) {
    all++;
    if (!terrain.walkable(x + dx, z + dz)) wet++;
  }
  return Math.min(1, (wet / all) * 3);
}

const AMBIENCE_EVERY = 0.5; // seconds between ambience mixes (it ramps between them)

// The audio played from the world: every PlaySound, a whoosh for a swing and a ring for a blow, the listener kept on
// the player, the ambience mixed for the hour and the water round them.
export function audioSystem(audio: AudioEngine): System {
  let since = AMBIENCE_EVERY;
  let water = 0;
  return {
    name: 'audio',
    stage: 'present',
    update(world, dt) {
      if (world.hasResource(ScreenAxes)) {
        const { right } = world.resource(ScreenAxes);
        audio.right = { x: right.x, z: right.z };
      }
      const player = world.first(Player, Transform);
      if (player !== undefined) {
        const at = world.read(player, Transform);
        audio.listener = { x: at.x, z: at.z };
      }
      for (const { by } of world.eventsOf(Swing)) {
        const at = world.get(by, Transform);
        audio.play('swing', { at: at ?? undefined });
      }
      for (const { target } of world.eventsOf(Hit)) {
        const at = world.get(target, Transform);
        audio.play('hit', { at: at ?? undefined });
      }
      for (const { name, at, volume, pitch } of world.eventsOf(PlaySound)) audio.play(name, { at, volume, pitch });
      since += dt;
      if (since >= AMBIENCE_EVERY) {
        since = 0;
        water = waterNear(world, audio.listener.x, audio.listener.z);
      }
      const hours = world.hasResource(TimeOfDay) ? world.resource(TimeOfDay).hours : 12;
      audio.ambience(ambienceMix(hours, { water }), dt);
    },
  };
}
