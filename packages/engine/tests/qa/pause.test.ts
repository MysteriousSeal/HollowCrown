// QA: pausing. A paused frame runs only the presenting systems (nothing moves, the clock stands still) and still
// lets the frame's events go; a key held or pressed when the game pauses doesn't carry on after it resumes.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { Schedule, World, defineEvent, type Stage } from '../../src/ecs';
import { Keyboard } from '../../src/input/keyboard';

const Ping = defineEvent<number>('QaPing');

afterEach(() => vi.unstubAllGlobals());

describe('pause', () => {
  it('runs only the present stage while paused, and still lets the events go', () => {
    const world = new World();
    const ran: Stage[] = [];
    const schedule = new Schedule().add(
      ...(['input', 'simulate', 'present'] as const).map((stage) => ({ name: stage, stage, update: (w: World) => (ran.push(stage), w.emit(Ping, 1)) })),
    );
    schedule.run(world, 1 / 60, ['present']);
    expect(ran).toEqual(['present']);
    expect(world.eventsOf(Ping)).toEqual([]);
    schedule.run(world, 1 / 60);
    expect(ran).toEqual(['present', 'input', 'simulate', 'present']);
  });

  it("lets go of every key on release: none held, no press left to take", () => {
    const listeners = new Map<string, (e: unknown) => void>();
    vi.stubGlobal('window', { addEventListener: (type: string, fn: (e: unknown) => void) => listeners.set(type, fn) });
    const keyboard = new Keyboard();
    const key = (code: string, down: boolean) => listeners.get(down ? 'keydown' : 'keyup')!({ code, repeat: false, preventDefault() {} });
    key('KeyW', true);
    key('KeyE', true);
    expect(keyboard.isHeld('up')).toBe(true);
    keyboard.release();
    expect(keyboard.isHeld('up')).toBe(false);
    expect(keyboard.takePress('interact')).toBe(false);
  });
});
