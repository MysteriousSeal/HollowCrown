// Encounters: the dead left lying where a quest finds them (MQ01's pilgrim in the ditch, the wolves' mule), foes that
// keep a place (the Red Hen's band at their camp), and foes a quest's stage brings when it begins (MQ01's midnight:
// the famine dead come down into Brindleford). Each kind fights as systems/foes.ts says: the band on sight; the
// Hungry don't attack first, they go to the houses, and struck, they turn on whoever struck them.

import type { System } from '@voxel/engine/ecs';
import { Transform } from '@voxel/engine/gameplay';
import { Persistent } from '@voxel/engine/save';
import type { Point } from '@voxel/engine/world';
import { CREATURES } from '../creatures';
import { provokeSystem, spawnFoe } from '../systems/foes';
import { Quests } from '../systems/quests';
import { lastingName } from '../systems/save';
import type { Feature } from './context';

// A band of foes: what kind they are (systems/foes.ts FOES), where each stands, the ground they wander (tiles round it), and each
// one's own model (CREATURES' id, in order; none: the kind's own).
export interface Band {
  creature: string;
  at: Point[];
  roam: number;
  models?: string[];
}

// The dead lying out from the start: which body (CREATURES' id), where, which way it lies (radians).
export const BODIES: Array<{ model: string; at: Point; facing: number; note: string }> = [
  { model: 'deadPilgrim', at: [560, 3374], facing: 0.4, note: "MQ01: the old pilgrim woman in the Pilgrim Road's ditch" },
  { model: 'deadMule', at: [650.5, 3420.5], facing: 2.1, note: "MQ01: the wolves' mule, at the Birchwood's edge" },
];

// Foes keeping a place from the start.
export const KEEPERS: Array<Band & { note: string }> = [
  // The Red Hen camp (620, 3560): Brannoc's five in the birch clearing, round the fire. Brannoc himself (CREATURES'
  // brannoc) is held back for MQ03.
  {
    creature: 'bandit', at: [[617, 3557], [623, 3557], [616, 3562], [624, 3563], [620, 3565]], roam: 2, note: 'the Red Hen camp',
    models: ['redHenKnifeThrower', 'redHenBrute', 'redHenSpearman', 'redHenPoppyEater', 'redHenLookout'],
  },
];

// What a stage brings, by quest/stage.
export const ENCOUNTERS: Record<string, Band> = {
  // MQ01, Midnight: four of the Hungry walk in up the East Lane from the pit, going to the houses: a man with a
  // poppy in his hair, Bet (Old Meg's sister), a child, a mother carrying hers.
  'MQ01/midnight': {
    creature: 'hungry', at: [[944, 3353], [941, 3352], [938, 3354], [935, 3353]], roam: 6,
    models: ['pitRisen', 'pitRisenWoman', 'pitRisenChild', 'hungryMother'],
  },
};

export const encounters: Feature = {
  name: 'encounters',
  install: ({ app, map }) => {
    const spawnBand = ({ creature, at, roam, models }: Band) =>
      at.forEach((spot, i) => spawnFoe(app, map, creature, models?.[i] ?? creature, spot, roam));
    for (const { model, at: [x, z], facing } of BODIES) {
      const entry = CREATURES.find((c) => c.id === model);
      if (!entry) throw new Error(`encounters: no body '${model}'`);
      app.show(app.world.spawn([Transform, { x, y: map.groundY(x, z), z, facing }]), entry.make());
    }
    for (const { creature, at, roam, models, note } of KEEPERS) {
      at.forEach((spot, i) => app.world.add(spawnFoe(app, map, creature, models?.[i] ?? creature, spot, roam), Persistent, lastingName.keeper(note, i)));
    }
    const seen = new Set<string>(); // stages begun so far, by quest/stage
    const system: System = {
      name: 'encounters',
      stage: 'simulate',
      update(world) {
        if (!world.hasResource(Quests)) return;
        for (const { quest, stage, finished } of world.resource(Quests).quests) {
          const key = `${quest}/${stage}`;
          if (finished || seen.has(key)) continue;
          seen.add(key);
          const brings = ENCOUNTERS[key];
          if (brings) spawnBand(brings);
        }
      },
    };
    app.addSystems(system, provokeSystem);
  },
};
