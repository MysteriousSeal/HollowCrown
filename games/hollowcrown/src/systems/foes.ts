// Foes: how each kind fights (docs/story/bestiary.md), one brought into the world as a creature's model, and one
// taken out again. A foe attacks on sight, or only once struck (the Hungry, the Hollowed, the rooks): struck, it turns
// on whoever struck it. Who uses it: the encounters (scripted bands) and the roaming (the region's foes).

import type { App } from '@voxel/engine/app';
import { VisualComponent } from '@voxel/engine/app';
import type { Entity, System } from '@voxel/engine/ecs';
import { Attack, Faction, Health, Hit, Hostile, MoveSpeed, Transform, Wander, attack, health, hostile, wander } from '@voxel/engine/gameplay';
import type { Point, WorldMap } from '@voxel/engine/world';
import { CREATURES } from '../creatures';
import { Creature } from './kills';

// How a kind of foe fights: its hit points, its blow (damage, seconds between), its pace wandering and running at
// the hero, how far it sees, and whether it only fights back.
export interface Foe {
  hp: number;
  damage: number;
  cooldown: number;
  speed: number;
  run: number;
  sight: number;
  provoked: boolean;
}
export const FOES: Record<string, Foe> = {
  wolf: { hp: 12, damage: 3, cooldown: 1, speed: 1.4, run: 3.2, sight: 6, provoked: false }, // (as fast as the hero walks)
  alphaWolf: { hp: 20, damage: 5, cooldown: 1, speed: 1.4, run: 3.4, sight: 7, provoked: false },
  boar: { hp: 20, damage: 5, cooldown: 1.4, speed: 1, run: 3, sight: 4, provoked: false },
  rook: { hp: 3, damage: 1, cooldown: 1, speed: 1.5, run: 3.5, sight: 5, provoked: true },
  rookLeader: { hp: 6, damage: 2, cooldown: 1, speed: 1.5, run: 3.5, sight: 6, provoked: true },
  hungry: { hp: 10, damage: 3, cooldown: 1.2, speed: 1.4, run: 2.8, sight: 8, provoked: true }, // (they go to the houses)
  hollowed: { hp: 18, damage: 5, cooldown: 1.3, speed: 1.2, run: 2.6, sight: 8, provoked: true }, // (only if stopped)
  ghost: { hp: 20, damage: 5, cooldown: 1.5, speed: 1, run: 2.4, sight: 7, provoked: false },
  skeleton: { hp: 24, damage: 6, cooldown: 1.3, speed: 1.1, run: 2.6, sight: 6, provoked: false },
  bandit: { hp: 16, damage: 4, cooldown: 1.1, speed: 1.6, run: 3.2, sight: 6, provoked: false }, // (the Red Hen camp)
};

const hostileOf = (foe: Foe, home: { x: number; z: number }) => hostile({ sight: foe.sight, leash: foe.sight * 2, speed: foe.run, home });

// One of `kind` brought in at (x, z) as `model` (CREATURES' id), wandering `roam` tiles round it, fighting as its kind
// does (`provoked` to say otherwise) and counted as its kind for quests.
export function spawnFoe(app: App, map: WorldMap, kind: string, model: string, [x, z]: Point, roam: number, provoked?: boolean): Entity {
  const entry = CREATURES.find((c) => c.id === model);
  const foe = FOES[kind];
  if (!entry || !foe) throw new Error(`spawnFoe: no creature '${model}' or foe '${kind}'`);
  const entity = app.world.spawn(
    [Transform, { x, y: map.groundY(x, z), z, facing: Math.PI }],
    [MoveSpeed, foe.speed],
    [Wander, wander({ x, z }, { radius: roam, speed: foe.speed, pause: [1, 4] })],
    [Creature, { id: kind, name: entry.name }],
    [Health, health(foe.hp)],
    [Attack, attack(foe.damage, { cooldown: foe.cooldown })],
    [Faction, kind],
  );
  if (!(provoked ?? foe.provoked)) app.world.add(entity, Hostile, hostileOf(foe, { x, z }));
  app.show(entity, entry.make());
  return entity;
}

// `entity` taken out of the world, its model with it.
export function despawn(app: App, entity: Entity): void {
  const model = app.world.get(entity, VisualComponent)?.model;
  if (model) app.scene.remove(model.root);
  app.world.despawn(entity);
}

// A foe that only fights back, struck: it turns on its attacker (Hostile from then on).
export const provokeSystem: System = {
  name: 'provoke',
  stage: 'simulate',
  update(world) {
    for (const { target } of world.eventsOf(Hit)) {
      const kind = world.get(target, Creature)?.id;
      const foe = kind ? FOES[kind] : undefined;
      if (!foe || world.has(target, Hostile)) continue;
      const at = world.read(target, Transform);
      world.add(target, Hostile, hostileOf(foe, { x: at.x, z: at.z }));
    }
  },
};
