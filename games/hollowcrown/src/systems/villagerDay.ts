// A villager's day: from morning to evening they stroll round their door (the engine's Wander), and at dusk they
// walk back to it and stand there, facing out, through the night. Old Meg stays on her stool whatever the hour;
// anyone in a talk (systems/talk.ts) stays where they are till it's over. Stood still a while between strolls, now
// and then one scratches, stretches, yawns (a gesture: engine's Acting, played if their model has it).

import { defineComponent, type Entity, type System, type World } from '@voxel/engine/ecs';
import { Acting, MoveIntent, MoveSpeed, TimeOfDay, Transform, Wander, wander, type WanderData } from '@voxel/engine/gameplay';
import { hashUnit } from '@voxel/engine/math';
import { Talking } from './talk';

export const DAY = [7, 20] as const; // hours they're out and about: from 7 in the morning to 8 in the evening
export const STROLL = { radius: 2.5, speed: 1.1, pause: [3, 8] as const }; // round their door, at an easy pace
const ARRIVED = 0.1; // world units: this close to their door, they're home
// The gestures a villager makes in a pause (people/gestures.ts GESTURES), one pause in GESTURE_ODDS, GESTURE_TIME long.
export const IDLE_GESTURES = ['scratch', 'stretch', 'lean', 'yawn', 'shrug', 'wipeBrow', 'lookRound'];
const GESTURE_ODDS = 0.5;
const GESTURE_TIME = 2; // seconds

// A villager: their name (as the bible writes it), their home spot (just outside their door), the way they face
// there, and whether they sit (never strolling).
export interface ResidentData {
  name: string;
  home: { x: number; z: number };
  facing: number;
  seated: boolean;
  gestured?: number; // the pause (its Wander step) they last gestured in
}
export const Resident = defineComponent<ResidentData>('Resident');

// Whether `hours` (0..24) is in the villagers' day.
export const isDay = (hours: number) => hours >= DAY[0] && hours < DAY[1];

// In a pause long enough, once a pause, maybe a gesture (which one, and whether, by the entity and the pause).
function gesture(world: World, entity: Entity, w: WanderData): void {
  const resident = world.read(entity, Resident);
  if (w.target || w.wait < GESTURE_TIME || resident.gestured === w.steps || world.has(entity, Acting)) return;
  resident.gestured = w.steps;
  if (hashUnit(entity, w.steps, 31) >= GESTURE_ODDS) return;
  const action = IDLE_GESTURES[Math.floor(hashUnit(entity, w.steps, 32) * IDLE_GESTURES.length)];
  world.add(entity, Acting, { action, time: 0, duration: GESTURE_TIME });
}

// Each resident strolling by day, home and still by night (no time of day: always day).
export const villagerDaySystem: System = {
  name: 'villagerDay',
  stage: 'input',
  update(world) {
    const day = world.hasResource(TimeOfDay) ? isDay(world.resource(TimeOfDay).hours) : true;
    for (const entity of world.query(Resident, Transform)) {
      const { home, facing, seated } = world.read(entity, Resident);
      if (seated || world.has(entity, Talking)) continue;
      if (day) {
        const w = world.get(entity, Wander) ?? world.add(entity, Wander, wander(home, STROLL));
        gesture(world, entity, w);
        continue;
      }
      if (world.has(entity, Wander)) world.remove(entity, Wander);
      const at = world.read(entity, Transform);
      const [dx, dz] = [home.x - at.x, home.z - at.z];
      const there = Math.hypot(dx, dz) < ARRIVED;
      world.add(entity, MoveIntent, there ? { x: 0, z: 0 } : { x: dx, z: dz });
      world.add(entity, MoveSpeed, STROLL.speed);
      if (there) at.facing = facing;
    }
  },
};
