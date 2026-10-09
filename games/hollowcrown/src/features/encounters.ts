// Encounters: the dead left lying where a quest finds them (MQ01's pilgrim in the ditch, the wolves' mule), foes that
// keep a place (the Red Hen's band at their camp), and foes a quest's stage brings when it begins (MQ01's midnight:
// the famine dead come down into Brindleford). Each kind fights as the bestiary says
// (docs/story/bestiary.md): the band on sight; the Hungry don't attack first, they go to the houses, and struck, they
// turn on whoever struck them.

import type { Entity, System } from '@voxel/engine/ecs';
import { Attack, Faction, Health, Hit, Hostile, MoveSpeed, Transform, Wander, attack, health, hostile, wander } from '@voxel/engine/gameplay';
import type { Point, WorldMap } from '@voxel/engine/world';
import { CREATURES } from '../creatures';
import { Creature } from '../systems/kills';
import { Quests } from '../systems/quests';
import type { Feature } from './context';

// How a kind of foe fights: its hit points, its blow, its pace, and whether it attacks on sight or only once struck.
interface Foe {
  hp: number;
  damage: number;
  cooldown: number;
  speed: number;
  provoked: boolean; // only fights back
}
const FOES: Record<string, Foe> = {
  hungry: { hp: 10, damage: 3, cooldown: 1.2, speed: 1.4, provoked: true }, // (MQ01's midnight)
  bandit: { hp: 16, damage: 4, cooldown: 1.1, speed: 1.6, provoked: false }, // (the Red Hen camp)
};

// A band of foes: what kind they are (FOES), where each stands, the ground they wander (tiles round it), and each
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

// Spawns one of `creature`'s kind at (x, z) as `model`, fighting as its kind does (and counted as it, for quests).
function spawnFoe(app: Parameters<Feature['install']>[0]['app'], map: WorldMap, creature: string, model: string, [x, z]: Point, roam: number): Entity {
  const entry = CREATURES.find((c) => c.id === model);
  const foe = FOES[creature];
  if (!entry || !foe) throw new Error(`encounters: no creature '${model}' or foe '${creature}'`);
  const entity = app.world.spawn(
    [Transform, { x, y: map.groundY(x, z), z, facing: Math.PI }],
    [MoveSpeed, foe.speed],
    [Wander, wander({ x, z }, { radius: roam, speed: foe.speed, pause: [1, 4] })],
    [Creature, { id: creature, name: entry.name }],
    [Health, health(foe.hp)],
    [Attack, attack(foe.damage, { cooldown: foe.cooldown })],
    [Faction, creature],
  );
  if (!foe.provoked) app.world.add(entity, Hostile, hostile({ sight: 6, leash: 12, speed: foe.speed * 2, home: { x, z } }));
  app.show(entity, entry.make());
  return entity;
}

// A foe that only fights back, struck: it turns on its attacker (Hostile from then on).
export const provokeSystem: System = {
  name: 'provoke',
  stage: 'simulate',
  update(world) {
    for (const { target } of world.eventsOf(Hit)) {
      const creature = world.get(target, Creature);
      const foe = creature && FOES[creature.id];
      if (!foe?.provoked || world.has(target, Hostile)) continue;
      const at = world.read(target, Transform);
      world.add(target, Hostile, hostile({ sight: 8, leash: 16, speed: foe.speed * 2, home: { x: at.x, z: at.z } }));
    }
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
    KEEPERS.forEach(spawnBand);
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
