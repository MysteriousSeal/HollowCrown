// A villager's day: from morning to evening they stroll round their door (the engine's Wander), and at dusk they
// walk back to it and stand there, facing out, through the night. Old Meg stays on her stool whatever the hour;
// anyone in a talk (systems/talk.ts) stays where they are till it's over.

import { defineComponent, type System } from '@voxel/engine/ecs';
import { MoveIntent, MoveSpeed, TimeOfDay, Transform, Wander, wander } from '@voxel/engine/gameplay';
import { Talking } from './talk';

export const DAY = [7, 20] as const; // hours they're out and about: from 7 in the morning to 8 in the evening
export const STROLL = { radius: 2.5, speed: 1.1, pause: [3, 8] as const }; // round their door, at an easy pace
const ARRIVED = 0.1; // world units: this close to their door, they're home

// A villager: their name (as the bible writes it), their home spot (just outside their door), the way they face
// there, and whether they sit (never strolling).
export interface ResidentData {
  name: string;
  home: { x: number; z: number };
  facing: number;
  seated: boolean;
}
export const Resident = defineComponent<ResidentData>('Resident');

// Whether `hours` (0..24) is in the villagers' day.
export const isDay = (hours: number) => hours >= DAY[0] && hours < DAY[1];

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
        if (!world.has(entity, Wander)) world.add(entity, Wander, wander(home, STROLL));
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
