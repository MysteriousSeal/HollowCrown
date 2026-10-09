// Fighting: the hero has hit points and a blow (data/hero.ts), struck with Space (the engine's attack), landing on
// anything alive in reach that isn't on the hero's side. Not while talking: systems/talk.ts holds the swing back.

import { Attack, Faction, Health, attack, health } from '@voxel/engine/gameplay';
import { HERO } from '../data/hero';
import type { Feature } from './context';

export const HERO_SIDE = 'hero';

export const combat: Feature = {
  name: 'combat',
  install: ({ app, hero }) => {
    const { damage, ...blow } = HERO.blow;
    app.world.add(hero, Health, health(HERO.hp));
    app.world.add(hero, Attack, attack(damage, blow));
    app.world.add(hero, Faction, HERO_SIDE);
  },
};
