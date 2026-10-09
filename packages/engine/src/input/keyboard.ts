// The keyboard, as a resource: which actions are held. A game binds keys to actions (WASD and the arrows to the four
// directions by default).

import { defineResource } from '../ecs';

export type Action = 'up' | 'down' | 'left' | 'right';

export const DEFAULT_BINDINGS: Readonly<Record<string, Action>> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

export class Keyboard {
  private readonly held = new Set<Action>();

  constructor(private readonly bindings: Readonly<Record<string, Action>> = DEFAULT_BINDINGS) {
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    // keyup never fires if focus leaves the page mid-press (alt-tab): nothing stays held.
    window.addEventListener('blur', () => this.held.clear());
  }

  isHeld(action: Action): boolean {
    return this.held.has(action);
  }

  private onKey(event: KeyboardEvent, down: boolean): void {
    const action = this.bindings[event.code];
    if (!action) return;
    event.preventDefault();
    if (down) this.held.add(action);
    else this.held.delete(action);
  }
}

export const KeyboardResource = defineResource<Keyboard>('Keyboard');
