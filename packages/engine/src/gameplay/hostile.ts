// Hostiles: creatures that fight the player. One idles (wandering, if it wanders) until the player comes within its
// sight, then chases through its MoveIntent, turns on the player and swings (its Attack) once in reach; led further
// than its leash from where it started, it gives up and goes back, paying the player no mind until it's home.

import { defineComponent, type System } from '../ecs';
import { BODY_RADIUS, BodyRadius, MoveIntent, MoveSpeed, Player, Transform } from './components';
import { Attack, AttackIntent } from './attack';
import { angleToward } from './facing';
import { Dead, isAlive, Health } from './health';

export type HostileState = 'idle' | 'chase' | 'return';

export interface HostileData {
  sight: number; // world units: how near the player must come to be noticed
  leash: number; // world units from home it will chase before giving up
  speed: number; // its chasing speed, tiles a second
  home: { x: number; z: number } | null; // where it gives up back to (none: where it stands at first)
  state: HostileState; // (kept by the hostile system)
}
export const Hostile = defineComponent<HostileData>('Hostile');

export interface HostileOptions {
  sight?: number; // default 6
  leash?: number; // default 14
  speed?: number; // default 3.2
  home?: { x: number; z: number };
}

export function hostile({ sight = 6, leash = 14, speed = 3.2, home }: HostileOptions = {}): HostileData {
  if (!(sight > 0) || !(leash >= sight) || !(speed > 0)) throw new Error('hostile: sight and speed must be above 0, leash at least sight');
  return { sight, leash, speed, home: home ? { ...home } : null, state: 'idle' };
}

const HOME = 0.5; // world units: this near home, it's back

// Runs in the input stage, after wandering (a chase overrides a stroll), before the attacks.
export const hostileSystem: System = {
  name: 'hostile',
  stage: 'input',
  update(world) {
    const player = world.first(Player, Transform);
    const prey = player !== undefined && (!world.has(player, Health) || isAlive(world, player)) ? world.read(player, Transform) : null;
    for (const entity of world.query(Hostile, Transform)) {
      if (world.has(entity, Dead)) continue;
      const h = world.read(entity, Hostile);
      const at = world.read(entity, Transform);
      h.home ??= { x: at.x, z: at.z };
      const fromHome = Math.hypot(at.x - h.home.x, at.z - h.home.z);
      const toPrey = prey ? Math.hypot(prey.x - at.x, prey.z - at.z) : Infinity;

      if (h.state === 'idle' && prey && toPrey <= h.sight) h.state = 'chase';
      if (h.state === 'chase' && (!prey || fromHome > h.leash || toPrey > h.leash)) h.state = 'return';
      if (h.state === 'return' && fromHome <= HOME) {
        h.state = 'idle';
        const intent = world.get(entity, MoveIntent);
        if (intent) [intent.x, intent.z] = [0, 0]; // (home: it stops, unless it wanders)
      }
      if (h.state === 'idle') continue; // (its wandering, if any, has the say)

      let intent = world.get(entity, MoveIntent);
      if (!intent) intent = world.add(entity, MoveIntent, { x: 0, z: 0 });
      world.add(entity, MoveSpeed, h.speed);
      if (h.state === 'return') {
        [intent.x, intent.z] = [h.home.x - at.x, h.home.z - at.z];
        continue;
      }
      const reach = (world.get(entity, Attack)?.reach ?? 0) + (world.get(player!, BodyRadius) ?? BODY_RADIUS) * 0.8;
      if (toPrey <= reach) {
        // In reach: stand, turn on the player, swing (the attack system holds it to its cooldown).
        [intent.x, intent.z] = [0, 0];
        at.facing = angleToward(at, prey!);
        if (world.has(entity, Attack)) world.add(entity, AttackIntent, true);
      } else [intent.x, intent.z] = [prey!.x - at.x, prey!.z - at.z];
    }
  },
};
