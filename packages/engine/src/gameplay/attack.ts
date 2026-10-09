// Attacks: a melee swing in the way an entity faces. One that means to swing (AttackIntent: the player's key, a
// hostile's AI) and is ready (its cooldown run out) lands a Hit on everyone alive within its reach and arc but its
// own side, and acts it out (Acting, for its model's lunge). What a blow does is the health system's (health.ts).

import { defineComponent, defineEvent, type Entity, type System, type World } from '../ecs';
import { BODY_RADIUS, BodyRadius, Transform } from './components';
import { Faction, Health, Hit, isAlive } from './health';

export interface AttackData {
  damage: number;
  reach: number; // world units in front of it, to the edge of what it hits
  arc: number; // radians either side of its facing
  cooldown: number; // seconds between swings
  wait: number; // seconds until it can swing again (kept by the attack system)
}
export const Attack = defineComponent<AttackData>('Attack');

export interface AttackOptions {
  reach?: number; // default 0.6
  arc?: number; // default 1 (about 57 degrees each side)
  cooldown?: number; // default 0.7
}

export function attack(damage: number, { reach = 0.6, arc = 1, cooldown = 0.7 }: AttackOptions = {}): AttackData {
  if (!(damage > 0)) throw new Error(`attack: damage must be above 0, not ${damage}`);
  if (!(reach > 0) || !(arc > 0) || !(cooldown >= 0)) throw new Error('attack: reach and arc must be above 0, cooldown 0 or more');
  return { damage, reach, arc, cooldown, wait: 0 };
}

// A swing made (hit or miss), for its sound.
export const Swing = defineEvent<{ by: Entity }>('Swing');

// It means to swing this frame (taken by the attack system, whether it could or not).
export const AttackIntent = defineComponent<true>('AttackIntent');

// What an entity is acting out (a swing, a flinch): for its model to animate. `time`: seconds into it.
export type ActionName = 'attack' | 'hurt';
export interface ActingData {
  action: ActionName;
  time: number;
  duration: number;
}
export const Acting = defineComponent<ActingData>('Acting');
export const ACTION_TIME: Readonly<Record<ActionName, number>> = { attack: 0.35, hurt: 0.25 };

// Whether `at` (facing, reaching `reach` and `arc`) reaches `target` of body `radius`.
export function inReach(at: { x: number; z: number; facing: number }, target: { x: number; z: number }, reach: number, arc: number, radius: number): boolean {
  const [dx, dz] = [target.x - at.x, target.z - at.z];
  const distance = Math.hypot(dx, dz);
  if (distance > reach + radius) return false;
  if (distance < 1e-6) return true;
  const off = Math.atan2(Math.sin(Math.atan2(dx, dz) - at.facing), Math.cos(Math.atan2(dx, dz) - at.facing));
  return Math.abs(off) <= arc + Math.asin(Math.min(1, radius / distance)); // (its body's edge counts)
}

// Everyone `attacker` would hit if it swung now.
export function targetsOf(world: World, attacker: Entity): Entity[] {
  const { reach, arc } = world.read(attacker, Attack);
  const at = world.read(attacker, Transform);
  const side = world.get(attacker, Faction);
  const found: Entity[] = [];
  for (const target of world.query(Health, Transform)) {
    if (target === attacker || !isAlive(world, target)) continue;
    if (side !== undefined && world.get(target, Faction) === side) continue;
    if (inReach(at, world.read(target, Transform), reach, arc, world.get(target, BodyRadius) ?? BODY_RADIUS)) found.push(target);
  }
  return found;
}

// Runs in the simulate stage, before the health system takes the blows.
export const attackSystem: System = {
  name: 'attack',
  stage: 'simulate',
  update(world, dt) {
    for (const entity of world.query(Attack)) {
      const a = world.read(entity, Attack);
      a.wait = Math.max(0, a.wait - dt);
      if (!world.has(entity, AttackIntent)) continue;
      world.remove(entity, AttackIntent);
      if (a.wait > 0 || !world.has(entity, Transform) || (world.has(entity, Health) && !isAlive(world, entity))) continue;
      a.wait = a.cooldown;
      world.add(entity, Acting, { action: 'attack', time: 0, duration: ACTION_TIME.attack });
      world.emit(Swing, { by: entity });
      for (const target of targetsOf(world, entity)) world.emit(Hit, { target, by: entity, damage: a.damage });
    }
  },
};

// Every action moved on, and over when its time's up; whoever took a blow this frame flinches (unless swinging).
// Runs in the present stage, after the late health system and before the visuals.
export const actingSystem: System = {
  name: 'acting',
  stage: 'present',
  update(world, dt) {
    for (const entity of world.query(Acting)) {
      const acting = world.read(entity, Acting);
      acting.time += dt;
      if (acting.time >= acting.duration) world.remove(entity, Acting);
    }
    for (const { target } of world.eventsOf(Hit)) {
      if (!world.isAlive(target) || world.get(target, Acting)?.action === 'attack') continue;
      world.add(target, Acting, { action: 'hurt', time: 0, duration: ACTION_TIME.hurt });
    }
  },
};
