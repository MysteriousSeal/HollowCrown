// Talking to villagers: E by one (the HUD shows "E Talk to <name>") opens the conversation screen (the HUD's
// ConversationScreen), the hero's portrait on the left and theirs on the right, each drawn from a model of their own,
// and what they say: their first words, and what the quests ask of them (features/quests.ts). The talk itself, who
// stops and who turns, is systems/talk.ts.

import { humanModel } from '@voxel/engine/characters';
import type { Entity } from '@voxel/engine/ecs';
import { releasePortrait, renderPortrait } from '@voxel/engine/render';
import { HERO } from '../data/hero';
import { PEOPLE } from '../people';
import { strangerModel } from '../people/stranger';
import { endTalk, talkSystem, type Talk } from '../systems/talk';
import { Resident } from '../systems/villagerDay';
import { ConversationScreen } from '../ui/screens';
import type { Feature } from './context';
import { talkWith } from './quests';
import { lookOf } from './villagers';

const HERO_NAME = 'You'; // (until the hero forge names them)

export const talk: Feature = {
  name: 'talk',
  install: ({ app, hero }) => {
    const { world } = app;
    const state: Talk = { with: null, justEnded: false };
    const open = (npc: Entity) => {
      const { name } = world.read(npc, Resident);
      const you = renderPortrait(strangerModel(HERO.look, HERO.gait), { facing: 'right', animate: true });
      const them = renderPortrait(PEOPLE[name]?.make() ?? humanModel(lookOf(name)), { facing: 'left', animate: true });
      const { lines, onChoice, onClose } = talkWith(world, name);
      world.resource(ConversationScreen).open({ name: HERO_NAME, portrait: you }, { name, portrait: them }, lines, () => {
        releasePortrait(you);
        releasePortrait(them);
        endTalk(world, state, hero);
        onClose();
      }, onChoice);
    };
    const canTalk = (entity: Entity) => world.has(entity, Resident) && world.hasResource(ConversationScreen);
    app.addSystems(talkSystem(state, hero, canTalk, open));
  },
};
