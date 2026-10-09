// Encounters: foes a quest's stage brings when it begins (MQ01's midnight: the famine dead come down into
// Brindleford). Each kind fights as the bestiary says (docs/story/bestiary.md): the Hungry don't attack first, they
// go to the houses; struck, they turn on whoever struck them.

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
};

// What a stage brings, by quest/stage: which creature, where each stands, the ground they wander (tiles round it).
export const ENCOUNTERS: Record<string, { creature: string; at: Point[]; roam: number }> = {
  // MQ01, Midnight: four of the Hungry walk in up the East Lane from the hill, going to the houses.
  'MQ01/midnight': { creature: 'hungry', at: [[944, 3353], [941, 3352], [938, 3354], [935, 3353]], roam: 6 },
};

// Spawns `creature` at (x, z), fighting as its kind does.
function spawnFoe(app: Parameters<Feature['install']>[0]['app'], map: WorldMap, creature: string, [x, z]: Point, roam: number): Entity {
  const entry = CREATURES.find((c) => c.id === creature);
  const foe = FOES[creature];
  if (!entry || !foe) throw new Error(`encounters: no creature or foe '${creature}'`);
  const entity = app.world.spawn(
    [Transform, { x, y: map.groundY(x, z), z, facing: Math.PI }],
    [MoveSpeed, foe.speed],
    [Wander, wander({ x, z }, { radius: roam, speed: foe.speed, pause: [1, 4] })],
    [Creature, { id: entry.id, name: entry.name }],
    [Health, health(foe.hp)],
    [Attack, attack(foe.damage, { cooldown: foe.cooldown })],
    [Faction, creature],
  );
  if (!foe.provoked) app.world.add(entity, Hostile, hostile({ speed: foe.speed * 2, home: { x, z } }));
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
          if (brings) for (const at of brings.at) spawnFoe(app, map, brings.creature, at, brings.roam);
        }
      },
    };
    app.addSystems(system, provokeSystem);
  },
};
