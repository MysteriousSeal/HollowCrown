// Facing: an entity turning to face another (someone talked to turning toward the player), the short way round at a
// set rate, through its Transform's facing. It runs after the movement system, so while it has FaceToward it faces
// its target even when walking; a game removes it when the moment's over.

import { defineComponent, type Entity, type System } from '../ecs';
import { Transform } from './components';

export interface FaceTowardData {
  target: Entity;
  rate: number; // radians a second
}
export const FaceToward = defineComponent<FaceTowardData>('FaceToward');

export const FACE_TURN_RATE = 6; // radians a second: a half turn in about half a second

// Facing `target`, turning at `rate`.
export function faceToward(target: Entity, rate = FACE_TURN_RATE): FaceTowardData {
  if (!(rate > 0)) throw new Error(`faceToward: rate must be above 0, not ${rate}`);
  return { target, rate };
}

// The facing (radians about y, 0 toward +z) from one point toward another.
export const angleToward = (from: { x: number; z: number }, to: { x: number; z: number }): number => Math.atan2(to.x - from.x, to.z - from.z);

export const facingSystem: System = {
  name: 'facing',
  stage: 'simulate',
  update(world, dt) {
    for (const entity of world.query(FaceToward, Transform)) {
      const { target, rate } = world.read(entity, FaceToward);
      const to = world.get(target, Transform);
      if (!to) continue; // (its target gone: it stays as it is)
      const at = world.read(entity, Transform);
      if (Math.hypot(to.x - at.x, to.z - at.z) < 1e-6) continue;
      const wanted = angleToward(at, to);
      const turn = Math.atan2(Math.sin(wanted - at.facing), Math.cos(wanted - at.facing));
      const step = rate * dt;
      at.facing = Math.abs(turn) <= step ? wanted : at.facing + Math.sign(turn) * step;
    }
  },
};
