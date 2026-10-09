// The hero's death (made by features/hud.ts): a beat after they fall, the screen darkens to "You died", the game
// paused behind, and the choice to rise again where they last rested (if they have) or at the Pilgrim's Shrine. The
// rising itself is gameplay's (systems/respawn.ts, on the Respawn event).

import type { App } from '@voxel/engine/app';
import type { Entity, System } from '@voxel/engine/ecs';
import { Dead } from '@voxel/engine/gameplay';
import { EndScreen, type MenuItem } from '@voxel/engine/ui';
import { LastRest, Respawn } from '../systems/respawn';

const FALL_SECONDS = 1.2; // the hero seen falling before the screen comes

// The choices on the death screen: where the hero can rise.
export function riseChoices(rested: boolean): Array<{ label: string; at: 'rest' | 'shrine' }> {
  return [
    ...(rested ? [{ label: 'Rise where you last rested', at: 'rest' as const }] : []),
    { label: "Rise at the Pilgrim's Shrine", at: 'shrine' },
  ];
}

export function deathScreen(app: App, root: HTMLElement, hero: Entity): System {
  const screen = new EndScreen(root);
  const { world } = app;
  let fallen = 0; // seconds since the hero fell (0: alive)

  const rise = (at: 'rest' | 'shrine') => {
    world.emit(Respawn, { at });
    screen.close();
    app.resume();
  };
  return {
    name: 'death screen',
    stage: 'present',
    update(_, dt) {
      if (!world.has(hero, Dead)) {
        fallen = 0;
        return;
      }
      fallen += dt;
      if (screen.isOpen || fallen < FALL_SECONDS) return;
      const rested = world.hasResource(LastRest) && world.resource(LastRest) !== null;
      const items: MenuItem[] = riseChoices(rested).map(({ label, at }) => ({ label, pick: () => rise(at) }));
      screen.open('You died', 'The Vale keeps its dead. Not you, not yet.', items);
      app.pause();
    },
  };
}
