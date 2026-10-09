// Systems and the order they run in. A frame runs every system in its stage, stages in order (input, then
// simulation, then presentation), then lets the frame's events go. Time can run faster (a time scale): the input and
// simulation then run in several short steps a frame, so a fast game moves as a slow one would, only sooner.

import type { World } from './world';

export type Stage = 'input' | 'simulate' | 'present';
const STAGES: readonly Stage[] = ['input', 'simulate', 'present'];
const PLAY: readonly Stage[] = ['input', 'simulate'];
export const MAX_STEP = 1 / 60; // seconds of game time a step of input and simulation covers, at most...
export const MAX_STEPS = 32; // ...unless a frame would need more steps than this (then each is longer)

export interface FrameOptions {
  scale?: number; // game seconds a real second (default 1)
  paused?: boolean; // only presenting, no time passing (default false)
}

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

  // One frame of `dt` seconds (`stages`: only those, e.g. just presenting while the game is paused).
  run(world: World, dt: number, stages: readonly Stage[] = STAGES): void {
    for (const stage of STAGES) if (stages.includes(stage)) for (const system of this.systems) if (system.stage === stage) system.update(world, dt);
    world.clearEvents();
  }

  // One real frame of `dt` seconds, at a time scale: the input and simulation stepped through the game time it
  // covers (steps of MAX_STEP or less), each step's events read by its own systems once, then the presentation once,
  // with every event of the frame. Returns the game time that passed.
  frame(world: World, dt: number, { scale = 1, paused = false }: FrameOptions = {}): number {
    const time = paused ? 0 : dt * Math.max(0, scale);
    if (time > 0) {
      const steps = Math.min(MAX_STEPS, Math.ceil(time / MAX_STEP - 1e-9));
      for (let i = 0; i < steps; i++) {
        this.stages(world, time / steps, PLAY);
        world.endStep();
      }
    } else if (!paused) this.stages(world, 0, PLAY);
    world.beginPresent();
    this.stages(world, time, ['present']);
    world.clearEvents();
    return time;
  }

  private stages(world: World, dt: number, stages: readonly Stage[]): void {
    for (const stage of stages) for (const system of this.systems) if (system.stage === stage) system.update(world, dt);
  }
}
