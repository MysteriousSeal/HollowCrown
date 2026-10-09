// QA: a frame in several steps (a slow frame, or the time scale up) plays as the same steps would one frame each: an
// event emitted in one step is read once by each system, not again in every step after it. (A death counted twice
// is a quest's fight won early.)

import { describe, expect, it } from 'vitest';
import { Schedule, World, defineEvent, type System } from '../../src/ecs';

const Fell = defineEvent<number>('QaFell');

function scene() {
  const world = new World();
  let emitted = false;
  let seen = 0;
  const killer: System = { name: 'killer', stage: 'simulate', update: (w) => void (!emitted && (emitted = true, w.emit(Fell, 1))) };
  const counter: System = { name: 'counter', stage: 'simulate', update: (w) => void (seen += w.eventsOf(Fell).length) };
  return { world, schedule: new Schedule().add(killer, counter), seen: () => seen };
}

describe('a frame in several steps', () => {
  it('reads one event once at one step a frame', () => {
    const { world, schedule, seen } = scene();
    schedule.frame(world, 1 / 60);
    expect(seen()).toBe(1);
  });

  // BUG (engine): ecs/schedule.ts frame() keeps a frame's events through all its steps ("the frame's events kept for
  // all of it"), so a system reading them in the simulate stage sees an event again every step: at 30 fps (two steps)
  // or a time scale of 10, a wolf's death counts two or ten times toward MQ01's fight (features/quests.ts:90). Filed.
  it.skip('reads one event once however many steps the frame takes (30 fps, or a time scale of 10)', () => {
    for (const [dt, scale] of [[1 / 30, 1], [1 / 60, 10]]) {
      const { world, schedule, seen } = scene();
      schedule.frame(world, dt, { scale });
      expect(seen(), `dt ${dt}, scale ${scale}`).toBe(1);
    }
  });
});
