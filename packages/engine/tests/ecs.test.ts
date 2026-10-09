import { describe, expect, it } from 'vitest';
import { Schedule, World, defineComponent, defineEvent, defineResource } from '../src/ecs';

const Position = defineComponent<{ x: number }>('Position');
const Speed = defineComponent<number>('Speed');
const Clock = defineResource<{ t: number }>('Clock');
const Moved = defineEvent<{ entity: number }>('Moved');

describe('World', () => {
  it('stores components per entity and queries those having all of them', () => {
    const world = new World();
    const a = world.spawn([Position, { x: 0 }], [Speed, 2]);
    world.spawn([Position, { x: 5 }]);
    expect([...world.query(Position, Speed)]).toEqual([a]);
    expect(world.read(a, Speed)).toBe(2);
    world.despawn(a);
    expect([...world.query(Position, Speed)]).toEqual([]);
    expect(world.has(a, Position)).toBe(false);
  });

  it('keeps resources and a frame of events', () => {
    const world = new World();
    world.setResource(Clock, { t: 0 });
    const mover = world.spawn([Position, { x: 0 }], [Speed, 3]);
    const seen: number[] = [];
    new Schedule()
      .add({ name: 'move', stage: 'simulate', update: (w, dt) => {
        for (const e of w.query(Position, Speed)) {
          w.read(e, Position).x += w.read(e, Speed) * dt;
          w.emit(Moved, { entity: e });
        }
        w.resource(Clock).t += dt;
      } })
      .add({ name: 'watch', stage: 'present', update: (w) => w.eventsOf(Moved).forEach((m) => seen.push(m.entity)) })
      .run(world, 0.5);
    expect(world.read(mover, Position).x).toBe(1.5);
    expect(world.resource(Clock).t).toBe(0.5);
    expect(seen).toEqual([mover]);
    expect(world.eventsOf(Moved)).toEqual([]); // (cleared after the frame)
  });

  it('runs only the stages asked for (paused: just presenting)', () => {
    const ran: string[] = [];
    const schedule = new Schedule().add(
      { name: 'a', stage: 'present', update: () => ran.push('present') },
      { name: 'b', stage: 'input', update: () => ran.push('input') },
      { name: 'c', stage: 'simulate', update: () => ran.push('simulate') },
    );
    schedule.run(new World(), 0.1, ['present']);
    expect(ran).toEqual(['present']);
    schedule.run(new World(), 0.1);
    expect(ran).toEqual(['present', 'input', 'simulate', 'present']);
  });
});
