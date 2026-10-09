// Fighting: the hero has hit points and a blow (data/hero.ts), struck with Space (the engine's attack), landing on
// anything alive in reach that isn't on the hero's side. Not while talking: systems/talk.ts holds the swing back.
// Taking up a weapon (the rusty knife from the shrine's bowl) puts it in their hand and makes the blow its own.
// Killed, the HUD's death screen offers Retry, and the hero rises again (systems/respawn.ts).

import { VisualComponent } from '@voxel/engine/app';
import type { Held } from '@voxel/engine/characters';
import type { System } from '@voxel/engine/ecs';
import { Attack, Faction, Health, attack, health } from '@voxel/engine/gameplay';
import { HERO } from '../data/hero';
import { START_PLACE } from '../data/world';
import { RUSTY_KNIFE, strangerModel } from '../people/stranger';
import { Quests } from '../systems/quests';
import { LastRest, respawnSystem } from '../systems/respawn';
import type { Feature } from './context';

export const HERO_SIDE = 'hero';

// Each weapon's look in the hand (its blow: data/hero.ts weapons).
const IN_HAND: Record<string, Held> = { 'rusty knife': RUSTY_KNIFE };

// The best weapon among `items` (the one that hits hardest), or none.
export function weaponOf(items: readonly string[]): string | undefined {
  const weapons = items.filter((i) => HERO.weapons[i]);
  return weapons.sort((a, b) => HERO.weapons[b].damage - HERO.weapons[a].damage)[0];
}

export const combat: Feature = {
  name: 'combat',
  install: ({ app, map, hero }) => {
    const { damage, ...blow } = HERO.blow;
    app.world.add(hero, Health, health(HERO.hp));
    app.world.add(hero, Attack, attack(damage, blow));
    app.world.add(hero, Faction, HERO_SIDE);
    app.world.setResource(LastRest, null);

    let wielded: string | undefined;
    const arm: System = {
      name: 'arm',
      stage: 'present',
      update(world) {
        const weapon = world.hasResource(Quests) ? weaponOf(world.resource(Quests).items) : undefined;
        if (weapon === wielded || !weapon) return;
        wielded = weapon;
        world.read(hero, Attack).damage = HERO.weapons[weapon].damage;
        const old = world.get(hero, VisualComponent)?.model;
        if (old) app.scene.remove(old.root);
        app.show(hero, strangerModel(HERO.look, HERO.gait, { rightArm: IN_HAND[weapon] }));
      },
    };
    app.addSystems(respawnSystem(hero, map, map.place(START_PLACE)!.at), arm);
  },
};
