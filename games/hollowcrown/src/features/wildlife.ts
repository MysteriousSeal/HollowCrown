// The Vale's wildlife (docs/story/regions/brindle-vale.md, "Enemies"): the Birchwood's wolves and boars, each drawn
// from its creature model (src/creatures), each wandering round where the bible puts it, with hit points to lose. Not hostile yet.

import { hashUnit } from '@voxel/engine/math';
import { Faction, Health, MoveSpeed, Transform, Wander, health, wander } from '@voxel/engine/gameplay';
import type { Point } from '@voxel/engine/world';
import { CREATURES } from '../creatures';
import { Creature } from '../systems/kills';
import type { Feature } from './context';

// An animal: which creature (src/creatures CREATURES' id), where it roams round, how far (tiles), its pace (tiles a
// second), its hit points.
export interface Animal {
  creature: string;
  at: Point;
  roam: number;
  speed: number;
  hp: number;
  note: string;
}

// Every animal out in the Vale, by where the bible puts them.
export const WILDLIFE: Animal[] = [
  // The Birchwood's north edge (650, 3420): two wolves, level 1 (MQ01).
  { creature: 'wolf', at: [649, 3421], roam: 4, speed: 1.4, hp: 12, note: "the Birchwood's north edge" },
  { creature: 'wolf', at: [652.5, 3419.5], roam: 4, speed: 1.4, hp: 12, note: "the Birchwood's north edge" },
  // The Birchwood's edges: three single boars, level 2.
  { creature: 'boar', at: [478, 3600], roam: 6, speed: 1.0, hp: 20, note: "the Birchwood's west edge" },
  { creature: 'boar', at: [786, 3590], roam: 6, speed: 1.0, hp: 20, note: "the Birchwood's east edge" },
  { creature: 'boar', at: [660, 3742], roam: 6, speed: 1.0, hp: 20, note: "the Birchwood's south edge" },
];

export const wildlife: Feature = {
  name: 'wildlife',
  install: ({ app, map }) => {
    WILDLIFE.forEach(({ creature, at: [x, z], roam, speed, hp }, i) => {
      const entry = CREATURES.find((c) => c.id === creature);
      if (!entry) throw new Error(`wildlife: no creature '${creature}'`);
      const animal = app.world.spawn(
        [Transform, { x, y: map.groundY(x, z), z, facing: hashUnit(x, z, i) * Math.PI * 2 }],
        [MoveSpeed, speed],
        [Wander, wander({ x, z }, { radius: roam, speed, pause: [1, 5] })],
        [Creature, { id: entry.id, name: entry.name }],
        [Health, health(hp)],
        [Faction, 'wild'],
      );
      app.show(animal, entry.make());
    });
  },
};
