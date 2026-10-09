// The Vale's wildlife (docs/story/regions/brindle-vale.md, "Enemies"): the Birchwood's wolves and boars, each drawn
// from its creature model (src/creatures), stood where the bible puts it. Not hostile yet.

import { hashUnit } from '@voxel/engine/math';
import { MoveSpeed, Transform } from '@voxel/engine/gameplay';
import type { Point } from '@voxel/engine/world';
import { CREATURES } from '../creatures';
import type { Feature } from './context';

// An animal: which creature (src/creatures CREATURES' id), where it stands, its pace (tiles a second).
export interface Animal {
  creature: string;
  at: Point;
  speed: number;
  note: string;
}

// Every animal out in the Vale, by where the bible puts them.
export const WILDLIFE: Animal[] = [
  // The Birchwood's north edge (650, 3420): two wolves, level 1 (MQ01).
  { creature: 'wolf', at: [649, 3421], speed: 2.2, note: "the Birchwood's north edge" },
  { creature: 'wolf', at: [652.5, 3419.5], speed: 2.2, note: "the Birchwood's north edge" },
  // The Birchwood's edges: three single boars, level 2.
  { creature: 'boar', at: [478, 3600], speed: 1.6, note: "the Birchwood's west edge" },
  { creature: 'boar', at: [786, 3590], speed: 1.6, note: "the Birchwood's east edge" },
  { creature: 'boar', at: [660, 3742], speed: 1.6, note: "the Birchwood's south edge" },
];

export const wildlife: Feature = {
  name: 'wildlife',
  install: ({ app, map }) => {
    WILDLIFE.forEach(({ creature, at: [x, z], speed }, i) => {
      const entry = CREATURES.find((c) => c.id === creature);
      if (!entry) throw new Error(`wildlife: no creature '${creature}'`);
      const animal = app.world.spawn(
        [Transform, { x, y: map.groundY(x, z), z, facing: hashUnit(x, z, i) * Math.PI * 2 }],
        [MoveSpeed, speed],
      );
      app.show(animal, entry.make());
    });
  },
};
