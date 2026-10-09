// Systems and the order they run in. A frame runs every system in its stage, stages in order (input, then
// simulation, then presentation), then lets the frame's events go.

import type { World } from './world';

export type Stage = 'input' | 'simulate' | 'present';
const STAGES: readonly Stage[] = ['input', 'simulate', 'present'];

export interface System {
  readonly name: string;
  readonly stage: Stage;
  update(world: World, dt: number): void;
}

export class Schedule {
  private readonly systems: System[] = [];

  add(...systems: System[]): this {
    this.systems.push(...systems);
    return this;
  }

  // One frame of `dt` seconds.
  run(world: World, dt: number): void {
    for (const stage of STAGES) for (const system of this.systems) if (system.stage === stage) system.update(world, dt);
    world.clearEvents();
  }
}
