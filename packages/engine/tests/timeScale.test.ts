import { describe, expect, it } from 'vitest';
import { MAX_STEP, MAX_STEPS, Schedule, World, defineEvent } from '../src/ecs';
import { MoveSpeed, TimeOfDay, Transform, movementSystem, timeOfDaySystem, wander, Wander, wanderSystem } from '../src/gameplay';
import { TerrainResource, flatTerrain } from '../src/world';

// A walker strolling round its home and a clock, run for `frames` real frames of 1/60 s at `scale`.
function play(scale: number, frames: number) {
  const world = new World();
  world.setResource(TerrainResource, flatTerrain({ width: 100, depth: 100 }, 0));
  world.setResource(TimeOfDay, { hours: 6, rate: 0.5 });
  const walker = world.spawn([Transform, { x: 50, y: 0, z: 50, facing: 0 }], [Wander, wander({ x: 50, z: 50 }, { radius: 6, pause: [0.5, 1] })]);
  const schedule = new Schedule().add(wanderSystem, movementSystem, timeOfDaySystem);
  let time = 0;
  for (let i = 0; i < frames; i++) time += schedule.frame(world, 1 / 60, { scale });
  return { time, at: world.read(walker, Transform), hours: world.resource(TimeOfDay).hours, speed: world.get(walker, MoveSpeed) };
}

describe('time scale', () => {
  it('plays a second at 10x as ten seconds at 1x', () => {
    const [fast, slow] = [play(10, 60), play(1, 600)];
    expect(fast.time).toBeCloseTo(10);
    expect(slow.time).toBeCloseTo(10);
    expect(fast.hours).toBeCloseTo(slow.hours);
    expect(fast.at.x).toBeCloseTo(slow.at.x, 3);
    expect(fast.at.z).toBeCloseTo(slow.at.z, 3);
  });

  it('steps the game no longer than MAX_STEP, presents once a frame, keeps the frame\'s events for all of it', () => {
    const Ping = defineEvent<number>('Ping');
    const world = new World();
    const steps: number[] = [];
    let presented = 0;
    let pings = 0;
    const schedule = new Schedule().add(
      { name: 'sim', stage: 'simulate', update: (w, dt) => (steps.push(dt), w.emit(Ping, 1)) },
      { name: 'show', stage: 'present', update: (w) => ((presented += 1), (pings = w.eventsOf(Ping).length)) },
    );
    schedule.frame(world, 1 / 60, { scale: 10 });
    expect(steps).toHaveLength(10);
    for (const dt of steps) expect(dt).toBeLessThanOrEqual(MAX_STEP + 1e-12);
    expect([presented, pings]).toEqual([1, 10]);
    expect(world.eventsOf(Ping)).toEqual([]);

    steps.length = 0;
    schedule.frame(world, 0.1, { scale: 100 }); // (ten game seconds in a frame: capped steps, each longer)
    expect(steps).toHaveLength(MAX_STEPS);
  });

  it('lets each step\'s systems read an event once, however many steps a frame takes', () => {
    const Ping = defineEvent<number>('Ping');
    const world = new World();
    let emitted = 0;
    let read = 0;
    const schedule = new Schedule().add(
      { name: 'read', stage: 'input', update: (w) => (read += w.eventsOf(Ping).length) },
      { name: 'emit', stage: 'simulate', update: (w) => (w.emit(Ping, 1), emitted++) },
      { name: 'readAfter', stage: 'simulate', update: (w) => (read += w.eventsOf(Ping).length) },
    );
    schedule.frame(world, 1 / 60, { scale: 10 });
    expect(emitted).toBe(10);
    expect(read).toBe(10); // (by the system after the emitter, in its own step; never again in later steps)
  });

  it('passes no time while paused, presenting still', () => {
    const world = new World();
    let simulated = 0;
    let presented = 0;
    const schedule = new Schedule().add({ name: 'sim', stage: 'simulate', update: () => simulated++ }, { name: 'show', stage: 'present', update: () => presented++ });
    expect(schedule.frame(world, 1 / 60, { scale: 10, paused: true })).toBe(0);
    expect([simulated, presented]).toEqual([0, 1]);
  });
});
