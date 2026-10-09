// Sprinting: hold sprint (Shift, the engine's keyboard) to run (systems/sprint.ts). The hero's stride turns over
// quicker as they speed up: their model (whichever it is now: it changes when they take up a weapon) is animated on a
// clock of its own that runs faster with the pace, so the step never jumps.

import { VisualComponent } from '@voxel/engine/app';
import type { System } from '@voxel/engine/ecs';
import { KeyboardResource } from '@voxel/engine/input';
import type { Model } from '@voxel/engine/models';
import { HERO } from '../data/hero';
import { sprintSystem, type Sprint } from '../systems/sprint';
import type { Feature } from './context';

export const sprint: Feature = {
  name: 'sprint',
  install: ({ app, hero }) => {
    const state: Sprint = { held: false, pace: 0 };
    let [last, clock] = [-1, 0];
    const paced = new WeakSet<Model>();
    // `model` animated on the hero's own clock (its actions, a swing, passed on as they come).
    const pace = (model: Model) => {
      const animate = model.animate.bind(model);
      model.animate = (time, ...rest) => {
        clock += last < 0 ? 0 : (time - last) * (1 + (HERO.sprint.cadence - 1) * state.pace);
        last = time;
        animate(clock, ...rest);
      };
      paced.add(model);
    };
    const keys: System = {
      name: 'sprintKey',
      stage: 'input',
      update(world) {
        state.held = world.resource(KeyboardResource).isHeld('sprint');
        const model = world.get(hero, VisualComponent)?.model;
        if (model && !paced.has(model)) pace(model);
      },
    };
    app.addSystems(keys, sprintSystem(state, HERO.speed, HERO.sprint.speed));
  },
};
