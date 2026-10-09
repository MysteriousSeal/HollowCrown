// The region's roaming foes (design's BRINDLE_VALE_ENCOUNTERS): the Birchwood's wolves and boars, Mosshill's packs,
// the rooks at dusk, the Hungry on Chapel Hill at night, the marsh's ghost. Each band is brought in when it's out
// (systems/roaming.ts) and the hero comes within reach of it, and taken out again when it's over or far behind.
// A band killed stays gone until its days are up (some never come back).

import type { Entity, System } from '@voxel/engine/ecs';
import { Dead, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { BRINDLE_VALE_ENCOUNTERS, type Encounter } from '../data/world/encounters';
import { despawn, spawnFoe } from '../systems/foes';
import { Quests } from '../systems/quests';
import { Roaming, calendarSystem, isBack, isOut, rangeOf, spotsOf } from '../systems/roaming';
import type { Feature } from './context';

export const BRING_IN = 45; // tiles beyond a band's range at which it's brought in as the hero comes
export const TAKE_OUT = 70; // ...and taken out again as they go
const EVERY = 0.5; // game seconds between looks

export const roaming: Feature = {
  name: 'roaming',
  install: ({ app, map, hero }) => {
    const { world } = app;
    world.setResource(Roaming, { day: 0, killed: {} });
    const bands = new Map<string, Entity[]>();
    const spots = new Map<string, ReturnType<typeof spotsOf>>();
    const spotsFor = (enc: Encounter) => spots.get(enc.id) ?? spots.set(enc.id, spotsOf(enc, map)).get(enc.id)!;
    let wait = 0;

    const bringIn = (enc: Encounter) =>
      spotsFor(enc).map((spot, i) => {
        const model = i === 0 && enc.leader ? enc.leader : enc.foe;
        return spawnFoe(app, map, enc.foe, model, spot, Math.min(rangeOf(enc).radius, 6), enc.hostile === 'if-disturbed' ? true : undefined);
      });
    const takeOut = (id: string) => {
      for (const e of bands.get(id) ?? []) if (world.isAlive(e)) despawn(app, e);
      bands.delete(id);
    };

    const system: System = {
      name: 'roaming',
      stage: 'simulate',
      update(world, dt) {
        if ((wait -= dt) > 0) return;
        wait = EVERY;
        const at = world.get(hero, Transform);
        if (!at) return;
        const hours = world.hasResource(TimeOfDay) ? world.resource(TimeOfDay).hours : 12;
        const book = world.hasResource(Quests) ? world.resource(Quests) : undefined;
        const state = world.resource(Roaming);
        for (const enc of BRINDLE_VALE_ENCOUNTERS) {
          const { at: [cx, cz], radius } = rangeOf(enc);
          const far = Math.hypot(at.x - cx, at.z - cz) - radius;
          const band = bands.get(enc.id);
          if (band) {
            if (state.killed[enc.id] === undefined && band.every((e) => !world.isAlive(e) || world.has(e, Dead))) state.killed[enc.id] = state.day;
            if (far > TAKE_OUT || !isOut(enc, hours, book)) takeOut(enc.id);
            continue;
          }
          if (far > BRING_IN || !isOut(enc, hours, book) || !isBack(enc, state.killed[enc.id], state.day)) continue;
          delete state.killed[enc.id];
          bands.set(enc.id, bringIn(enc));
        }
      },
    };
    app.addSystems(calendarSystem, system); // (struck, the provoked turn: encounters.ts runs provokeSystem)
  },
};
