// Controller: turns input into model updates and drives the frame loop.

import type { GameModel } from '../model/GameModel';
import type { GameView } from '../view/GameView';
import { KeyboardInput } from './KeyboardInput';

const MAX_FRAME_DT = 0.1; // seconds; avoids a huge jump after the tab was backgrounded

export class GameController {
  private readonly input = new KeyboardInput();
  private lastTime = 0;

  constructor(
    private readonly model: GameModel,
    private readonly view: GameView,
  ) {}

  start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    const dt = Math.min(MAX_FRAME_DT, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.step(dt);
    this.view.update(dt);
    this.view.render();
    requestAnimationFrame(this.frame);
  };

  // The hero walks the way pressed, lined up with the isometric view (WASD as seen on screen).
  private step(dt: number): void {
    const { forward, right } = this.view.movementAxes;
    const pressed = (direction: Parameters<KeyboardInput['isPressed']>[0]) => Number(this.input.isPressed(direction));
    const [ahead, across] = [pressed('up') - pressed('down'), pressed('right') - pressed('left')];
    this.model.moveHero(forward.x * ahead + right.x * across, forward.z * ahead + right.z * across, dt);
  }
}
