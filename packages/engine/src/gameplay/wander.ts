// Wandering: an entity idles round a home point, now standing a while, now strolling to a spot within its radius at
// an easy walk. It walks through its MoveIntent, so the movement system keeps it out of water and walls; if it gets
// stuck on one, it gives up on that spot and pauses. Spots and pauses come from a hash of the entity and its step
// count, so the same world wanders the same way.

import type { Entity, System } from '../ecs';
import { defineComponent } from '../ecs';
import { hashUnit } from '../math';
import { MoveIntent, MoveSpeed, Transform } from './components';
import { Dead } from './health';

export const WANDER_SPEED = 1.2; // tiles a second: a stroll (the hero walks at about 4)
const ARRIVED = 0.15; // world units: this close to its spot, it's there
const STUCK_TIME = 1.2; // seconds without getting nearer before it gives up on a spot
const MIN_STEP = 0.3; // how far from where it stands a new spot must be, at least (world units)

export interface WanderData {
  home: { x: number; z: number }; // where it idles round
  radius: number; // how far from home it strolls (world units)
  speed: number; // its strolling speed, tiles a second
  pause: readonly [number, number]; // how long it stands between strolls, seconds (least, most)
  // Its state, kept by the wander system:
  target: { x: number; z: number } | null; // the spot it's walking to (null: standing)
  wait: number; // seconds left to stand
  steps: number; // spots chosen so far (seeds the next)
  closest: number; // how near its spot it has come
  stuck: number; // seconds since it last came nearer
}
export const Wander = defineComponent<WanderData>('Wander');

export interface WanderOptions {
  radius?: number; // default 3
  speed?: number; // default WANDER_SPEED
  pause?: readonly [number, number]; // default [2, 6]
}

// Wandering round `home`.
export function wander(home: { x: number; z: number }, { radius = 3, speed = WANDER_SPEED, pause = [2, 6] }: WanderOptions = {}): WanderData {
  if (!(radius > 0)) throw new Error(`wander: radius must be above 0, not ${radius}`);
  if (!(speed > 0)) throw new Error(`wander: speed must be above 0, not ${speed}`);
  if (!(pause[0] >= 0 && pause[1] >= pause[0])) throw new Error(`wander: pause must be [least, most], not [${pause}]`);
  return { home: { ...home }, radius, speed, pause, target: null, wait: 0, steps: 0, closest: Infinity, stuck: 0 };
}

const random = (entity: Entity, w: WanderData, salt: number) => hashUnit(entity, w.steps, salt);

function standStill(entity: Entity, w: WanderData): void {
  w.target = null;
  w.wait = w.pause[0] + (w.pause[1] - w.pause[0]) * random(entity, w, 1);
}

function pickSpot(entity: Entity, w: WanderData, at: { x: number; z: number }): void {
  for (let tries = 0; tries < 4; tries++, w.steps++) {
    const angle = random(entity, w, 2) * Math.PI * 2;
    const distance = Math.sqrt(random(entity, w, 3)) * w.radius;
    const spot = { x: w.home.x + Math.sin(angle) * distance, z: w.home.z + Math.cos(angle) * distance };
    if (Math.hypot(spot.x - at.x, spot.z - at.z) < MIN_STEP) continue;
    w.target = spot;
    w.closest = Infinity;
    w.stuck = 0;
    w.steps++;
    return;
  }
}

// Runs in the input stage, as the player's input does: the intents it sets are walked this same frame.
export const wanderSystem: System = {
  name: 'wander',
  stage: 'input',
  update(world, dt) {
    for (const entity of world.query(Wander, Transform)) {
      if (world.has(entity, Dead)) continue;
      const w = world.read(entity, Wander);
      const at = world.read(entity, Transform);
      let intent = world.get(entity, MoveIntent);
      if (!intent) intent = world.add(entity, MoveIntent, { x: 0, z: 0 });
      [intent.x, intent.z] = [0, 0];

      if (!w.target) {
        w.wait -= dt;
        if (w.wait > 0) continue;
        pickSpot(entity, w, at);
        if (!w.target) {
          standStill(entity, w);
          continue;
        }
      }
      const [dx, dz] = [w.target.x - at.x, w.target.z - at.z];
      const distance = Math.hypot(dx, dz);
      if (distance < w.closest - 0.01) [w.closest, w.stuck] = [distance, 0];
      else w.stuck += dt;
      if (distance < ARRIVED || w.stuck > STUCK_TIME) {
        standStill(entity, w);
        continue;
      }
      [intent.x, intent.z] = [dx, dz];
      world.add(entity, MoveSpeed, Math.min(w.speed, distance / Math.max(dt, 1e-6))); // (no overshooting its spot)
    }
  },
};
