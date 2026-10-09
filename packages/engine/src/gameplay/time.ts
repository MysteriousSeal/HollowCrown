// The time of day: the hour (0 midnight .. 24), moving on at a set rate, game hours per real second. The day and
// night (app.enableDayNight) light the world from it; games read it for what happens when.

import { defineResource, type System } from '../ecs';

export interface TimeOfDayData {
  hours: number; // 0 .. 24 (6 dawn, 12 noon, 19 dusk)
  rate: number; // game hours a real second (0: time stands still)
}
export const TimeOfDay = defineResource<TimeOfDayData>('TimeOfDay');

// The rate for a game day lasting `minutes` real minutes (24: an hour a minute).
export const hoursPerSecond = (minutes: number): number => 24 / (minutes * 60);

// The clock moved on, wrapping round at midnight.
export const timeOfDaySystem: System = {
  name: 'timeOfDay',
  stage: 'simulate',
  update(world, dt) {
    if (!world.hasResource(TimeOfDay)) return;
    const time = world.resource(TimeOfDay);
    time.hours = (((time.hours + time.rate * dt) % 24) + 24) % 24;
  },
};
