// Sprinting: hold Shift to run (systems/sprint.ts). The hero's stride turns over quicker as they speed up: their
// model is animated on a clock of its own that runs faster with the pace, so the step never jumps.

import { VisualComponent } from '@voxel/engine/app';
import { HERO } from '../data/hero';
import { sprintSystem, type Sprint } from '../systems/sprint';
import type { Feature } from './context';

const SHIFT = new Set(['ShiftLeft', 'ShiftRight']);

export const sprint: Feature = {
  name: 'sprint',
  install: ({ app, hero }) => {
    const state: Sprint = { held: false, pace: 0 };
    window.addEventListener('keydown', (e) => SHIFT.has(e.code) && (state.held = true));
    window.addEventListener('keyup', (e) => SHIFT.has(e.code) && (state.held = false));
    window.addEventListener('blur', () => (state.held = false)); // (no keyup if focus leaves mid-press)
    app.addSystems(sprintSystem(state, HERO.speed, HERO.sprint.speed));

    const model = app.world.get(hero, VisualComponent)?.model;
    if (!model) return;
    const animate = model.animate.bind(model);
    let [last, clock] = [-1, 0];
    model.animate = (time, walk) => {
      clock += last < 0 ? 0 : (time - last) * (1 + (HERO.sprint.cadence - 1) * state.pace);
      last = time;
      animate(clock, walk);
    };
  },
};
