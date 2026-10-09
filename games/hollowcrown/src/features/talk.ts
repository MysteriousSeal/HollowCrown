// Talking to villagers: E by one (the HUD shows "E Talk to <name>") opens the conversation screen (the HUD's
// ConversationScreen), the hero's portrait on the left and theirs on the right, each drawn from a model of their own,
// and their first words (src/data/people). The talk itself, who stops and who turns, is systems/talk.ts.

import { humanModel } from '@voxel/engine/characters';
import type { Entity } from '@voxel/engine/ecs';
import { releasePortrait, renderPortrait } from '@voxel/engine/render';
import type { ConversationLine } from '@voxel/engine/ui';
import { HERO } from '../data/hero';
import { PEOPLE_DATA } from '../data/people';
import { PEOPLE } from '../people';
import { endTalk, talkSystem, type Talk } from '../systems/talk';
import { Resident } from '../systems/villagerDay';
import { ConversationScreen } from '../ui/screens';
import type { Feature } from './context';
import { lookOf } from './villagers';

const HERO_NAME = 'You'; // (until the hero forge names them)

// What `name` says when first spoken to (none known: a look, and nothing).
export function linesOf(name: string): ConversationLine[] {
  return [{ side: 'right', text: PEOPLE_DATA[name]?.firstWords ?? '…' }];
}

export const talk: Feature = {
  name: 'talk',
  install: ({ app, hero }) => {
    const { world } = app;
    const state: Talk = { with: null, justEnded: false };
    const open = (npc: Entity) => {
      const { name } = world.read(npc, Resident);
      const you = renderPortrait(humanModel(HERO.look, HERO.gait), { facing: 'right', animate: true });
      const them = renderPortrait(PEOPLE[name]?.make() ?? humanModel(lookOf(name)), { facing: 'left', animate: true });
      world.resource(ConversationScreen).open({ name: HERO_NAME, portrait: you }, { name, portrait: them }, linesOf(name), () => {
        releasePortrait(you);
        releasePortrait(them);
        endTalk(world, state, hero);
      });
    };
    const canTalk = (entity: Entity) => world.has(entity, Resident) && world.hasResource(ConversationScreen);
    app.addSystems(talkSystem(state, hero, canTalk, open));
  },
};
