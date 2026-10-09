// Side quests found in the wild (systems/discovery.ts): the things to examine set out where design put them, each
// with its prompt ("E · Examine the cart") until its quest is found, and the spots and things watched for.

import { Interactable, TimeOfDay, Transform, interactable } from '@voxel/engine/gameplay';
import { CREATURES } from '../creatures';
import { QUESTS } from '../data/quests';
import { Examinable, discoverySystem } from '../systems/discovery';
import { foundOf } from '../systems/questStarts';
import { Quests } from '../systems/quests';
import type { Feature } from './context';

export const discovery: Feature = {
  name: 'discovery',
  install: ({ app, map, hero }) => {
    const { world } = app;
    const things = new Map<string, number>(); // the thing to examine, by its quest
    for (const quest of Object.values(QUESTS)) {
      const found = foundOf(quest);
      if (!found || !('examine' in found)) continue;
      const { at: [x, z], prop, label } = found.examine;
      const thing = world.spawn(
        [Transform, { x, y: map.groundY(x, z), z, facing: 0 }],
        [Interactable, interactable(label)],
        [Examinable, { quest: quest.id }],
      );
      const model = prop && CREATURES.find((c) => c.id === prop);
      if (model) app.show(thing, model.make());
      things.set(quest.id, thing);
    }
    app.addSystems(discoverySystem(hero, QUESTS, (stage) => {
      if (stage.hour !== undefined && world.hasResource(TimeOfDay)) world.resource(TimeOfDay).hours = stage.hour;
    }), {
      name: 'examined',
      stage: 'simulate',
      update() {
        // (a thing whose quest is under way has nothing more to examine)
        if (!world.hasResource(Quests)) return;
        for (const { quest } of world.resource(Quests).quests) {
          const thing = things.get(quest);
          if (thing !== undefined && world.has(thing, Interactable)) world.remove(thing, Interactable);
        }
      },
    });
  },
};
