// Saving: the game's saves in the browser (systems/save.ts: what's kept), reached through the Saves resource by the
// pause menu; and autosaves every two minutes, on every quest stage begun and every night slept.

import { Persistent, SaveGame, autosaveSystem } from '@voxel/engine/save';
import { Saves, autosaveMoments, lastingName, saveSchema } from '../systems/save';
import type { Feature } from './context';

export const AUTOSAVE_EVERY = 120; // game seconds

export const saving: Feature = {
  name: 'saving',
  install: ({ app, hero }) => {
    app.world.add(hero, Persistent, lastingName.hero);
    const saves = app.world.setResource(Saves, new SaveGame(app.world, saveSchema(app.world), 'hollowcrown'));
    app.addSystems(autosaveMoments(), autosaveSystem(saves, { every: AUTOSAVE_EVERY }));
  },
};
