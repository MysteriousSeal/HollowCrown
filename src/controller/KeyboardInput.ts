// Which way the player's pressing: WASD or the arrows.

export type Direction = 'up' | 'down' | 'left' | 'right';

const KEY_BINDINGS: Readonly<Record<string, Direction>> = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

export class KeyboardInput {
  private readonly pressed = new Set<Direction>();

  constructor() {
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    // keyup never fires if focus leaves the page mid-press (e.g. alt-tab), which would otherwise leave the hero
    // walking on their own.
    window.addEventListener('blur', () => this.pressed.clear());
  }

  isPressed(direction: Direction): boolean {
    return this.pressed.has(direction);
  }

  private onKey(event: KeyboardEvent, down: boolean): void {
    const direction = KEY_BINDINGS[event.code];
    if (!direction) return;
    event.preventDefault();
    if (down) this.pressed.add(direction);
    else this.pressed.delete(direction);
  }
}
