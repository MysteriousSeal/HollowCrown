// The bot's hands on the keyboard: the same keys a player presses (WASD, Shift, E, Space, 1-9), pressed and released
// as KeyboardEvents on the window, so the game hears them exactly as it hears a player. And which of WASD to hold to
// walk a way on the ground, given the camera's screen axes.

import type { Keyboard } from '@voxel/engine/input';

export type Code = 'KeyW' | 'KeyA' | 'KeyS' | 'KeyD' | 'ShiftLeft' | 'KeyE' | 'Space' | `Digit${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

// What the engine's keyboard binds each held key to (DEFAULT_BINDINGS): to tell when it has let one go.
const ACTION: Partial<Record<Code, 'up' | 'down' | 'left' | 'right' | 'sprint'>> = {
  KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right', ShiftLeft: 'sprint',
};

const send = (type: 'keydown' | 'keyup', code: Code) =>
  window.dispatchEvent(new KeyboardEvent(type, { code, key: code.replace(/^Key|^Digit/, '').toLowerCase(), bubbles: true, cancelable: true }));

export class BotKeys {
  private readonly held = new Set<Code>();

  // Holds exactly `codes` (pressing the new, releasing the rest); one the keyboard dropped (a pause, focus lost) is
  // pressed again.
  hold(codes: Iterable<Code>, keyboard?: Keyboard): void {
    const want = new Set(codes);
    for (const code of [...this.held]) {
      if (want.has(code)) continue;
      send('keyup', code);
      this.held.delete(code);
    }
    for (const code of want) {
      const action = ACTION[code];
      const dropped = keyboard && action && !keyboard.isHeld(action);
      if (this.held.has(code) && !dropped) continue;
      send('keydown', code);
      this.held.add(code);
    }
  }

  // A key pressed and let go.
  tap(code: Code): void {
    send('keydown', code);
    send('keyup', code);
  }

  releaseAll(): void {
    this.hold([]);
  }
}

export interface Axes {
  forward: { x: number; z: number };
  right: { x: number; z: number };
}

// The eight ways WASD can walk: [ahead, across] (up/down, right/left).
const WAYS: Array<[number, number]> = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

// The keys to hold to walk most nearly along (dx, dz) on the ground: none for no way at all.
export function keysToward(dx: number, dz: number, { forward, right }: Axes): Code[] {
  const length = Math.hypot(dx, dz);
  if (length < 1e-6) return [];
  let best: [number, number] = [0, 0];
  let bestCos = -Infinity;
  for (const [ahead, across] of WAYS) {
    const [x, z] = [forward.x * ahead + right.x * across, forward.z * ahead + right.z * across];
    const cos = (x * dx + z * dz) / (Math.hypot(x, z) * length);
    if (cos > bestCos) [best, bestCos] = [[ahead, across], cos];
  }
  const keys: Code[] = [];
  if (best[0] > 0) keys.push('KeyW');
  if (best[0] < 0) keys.push('KeyS');
  if (best[1] > 0) keys.push('KeyD');
  if (best[1] < 0) keys.push('KeyA');
  return keys;
}
