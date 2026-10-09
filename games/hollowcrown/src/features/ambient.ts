// The land alive round the hero (design's LIFE): rabbits in the grass, deer at the wood edges at dawn and dusk,
// butterflies by day and moths by night, ducks on the pond and frogs in the marsh, hens about the villages, sheep and
// cows in the Cobbes' fields, a dog. Brought in a cell at a time within reach of the hero (systems/ambient.ts plans a
// cell), behaving as their kind does (systems/critters.ts), taken out again behind them, and changed with the hour.

import type { App } from '@voxel/engine/app';
import type { Entity, System } from '@voxel/engine/ecs';
import { MoveSpeed, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import type { WorldMap } from '@voxel/engine/world';
import { CREATURES } from '../creatures';
import { LIFE, type RegionLife } from '../data/world/life';
import { CELL, MOTHS, cellsNear, planCell } from '../systems/ambient';
import { Critter, TRAITS, critterSystem } from '../systems/critters';
import { despawn } from '../systems/foes';
import { inHours } from '../systems/roaming';
import type { Feature } from './context';

export const REACH = 30; // tiles round the hero the land is alive
const LET_GO = REACH + CELL * 1.5; // a cell this far is taken out
const MOST = 90; // critters at once, at most
const EVERY = 0.5; // game seconds between looks

// Which of `life`'s kinds are out at `hours`, as a key (a change: the cells planned again).
const outAt = (life: RegionLife, hours: number) => [...life.wildlife, MOTHS].map((w) => (!w.hours || inHours(hours, w.hours) ? 1 : 0)).join('');

function bringIn(app: App, map: WorldMap, life: RegionLife, cx: number, cz: number, hours: number, room: number): Entity[] {
  const brought: Entity[] = [];
  for (const { entry, model, at: [x, z] } of planCell(map, life, cx, cz, hours).slice(0, Math.max(0, room))) {
    const w = entry < 0 ? MOTHS : life.wildlife[entry];
    const make = CREATURES.find((c) => c.id === (entry < 0 ? 'moth' : model))?.make;
    const trait = TRAITS[w.kind];
    if (!make || !trait) continue;
    const e = app.world.spawn(
      [Transform, { x, y: map.groundY(x, z), z, facing: (x * 7 + z * 3) % (Math.PI * 2) }],
      [MoveSpeed, trait.walk || 1],
      [Critter, { kind: w.kind, home: { x, z }, tame: !!w.tame, state: 'calm', flown: 0 }],
    );
    app.show(e, make());
    brought.push(e);
  }
  return brought;
}

export const ambient: Feature = {
  name: 'ambient',
  install: ({ app, map, hero }) => {
    const life = LIFE['brindle-vale'];
    const cells = new Map<string, Entity[]>();
    let out = '';
    let wait = 0;
    const count = () => [...cells.values()].reduce((n, es) => n + es.length, 0);
    const takeOut = (e: Entity) => {
      if (!app.world.isAlive(e)) return;
      despawn(app, e);
      for (const es of cells.values()) {
        const i = es.indexOf(e);
        if (i >= 0) es.splice(i, 1);
      }
    };
    const look: System = {
      name: 'ambient',
      stage: 'simulate',
      update(world, dt) {
        if ((wait -= dt) > 0) return;
        wait = EVERY;
        const at = world.get(hero, Transform);
        if (!at) return;
        const hours = world.hasResource(TimeOfDay) ? world.resource(TimeOfDay).hours : 12;
        const now = outAt(life, hours);
        if (now !== out) {
          for (const es of cells.values()) es.forEach((e) => app.world.isAlive(e) && despawn(app, e));
          cells.clear();
          out = now;
        }
        const middle = (c: number) => (c + 0.5) * CELL;
        for (const [key, es] of [...cells]) {
          const [cx, cz] = key.split(',').map(Number);
          if (Math.hypot(middle(cx) - at.x, middle(cz) - at.z) <= LET_GO) continue;
          es.forEach((e) => app.world.isAlive(e) && despawn(app, e));
          cells.delete(key);
        }
        for (const [cx, cz] of cellsNear(at.x, at.z, REACH)) {
          const key = `${cx},${cz}`;
          if (cells.has(key) || Math.hypot(middle(cx) - at.x, middle(cz) - at.z) > REACH + CELL / 2) continue;
          cells.set(key, bringIn(app, map, life, cx, cz, hours, MOST - count()));
        }
      },
    };
    app.addSystems(look, critterSystem(hero, takeOut));
  },
};
