// Captives: someone held away from home (design's people data `away`: Wat, in the Red Hen's stock), stood where
// they're held in their captive look, to be talked to. Freed (found in MQ03, or their quest over), they're
// themselves again, and once the hero is well away they're back at their door, strolling with the rest.

import type { App } from '@voxel/engine/app';
import { VisualComponent } from '@voxel/engine/app';
import type { Entity, System, World } from '@voxel/engine/ecs';
import { Interactable, MoveSpeed, Transform, interactable } from '@voxel/engine/gameplay';
import { Persistent } from '@voxel/engine/save';
import type { Point, WorldMap } from '@voxel/engine/world';
import { doorOf } from '../buildings';
import { PEOPLE_DATA } from '../data/people';
import { QUESTS } from '../data/quests';
import { PEOPLE } from '../people';
import { Quests, type QuestBook } from '../systems/quests';
import { hasCome } from '../systems/roaming';
import { lastingName } from '../systems/save';
import { Resident } from '../systems/villagerDay';
import type { Feature } from './context';
import { figureOf, lookOf } from './villagers';

export const HELD_OFF = 2; // tiles from the middle of the place they're held, if no tile's given (off the fire)
const HOME_WHEN_AWAY = 30; // tiles: the hero this far off, a freed captive is back home

// The flag a captive's being found sets (MQ03's 'wat' objective done).
export const freedFlag = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '_')}_freed`;

// Whether `name`, held until `until`, is free: found, or that quest over.
export const isFree = (book: QuestBook | undefined, name: string, until: string) => !!book?.flags[freedFlag(name)] || hasCome(book, until);

// Whether a quest has found `name` (an objective naming them, done: MQ03's 'wat', talking to him in the stock).
function foundIn(book: QuestBook, name: string): boolean {
  return book.quests.some((p) => QUESTS[p.quest]?.stages.find((s) => s.id === p.stage)?.objectives.some((o) => o.who === name && p.done.includes(o.id)));
}

// `name`'s figure on `entity`: captive, or themselves.
function show(app: App, entity: Entity, name: string, captive: boolean): void {
  const old = app.world.get(entity, VisualComponent)?.model;
  if (old) app.scene.remove(old.root);
  const own = PEOPLE[name];
  const model = (captive ? own?.variants?.captive?.() : undefined) ?? own?.make() ?? figureOf({ name, x: 0, z: 0, facing: 0, look: lookOf(name), scale: 1, seated: false });
  app.show(entity, model);
}

// One held: who, until what, where home is and which way they face there, whether they're still a captive.
interface Held {
  entity: Entity;
  name: string;
  until: string;
  home: Point;
  facing: number;
  captive: boolean;
}

export const captives: Feature = {
  name: 'captives',
  install: ({ app, map, hero }) => {
    const held: Held[] = [];
    for (const person of Object.values(PEOPLE_DATA)) {
      if (!person.away) continue;
      const spot = person.away.at;
      const where = typeof spot === 'string' ? map.place(spot)?.at.map((v, i) => v - (i === 0 ? HELD_OFF : 0)) : spot;
      const house = map.place(person.home);
      if (!where || !house) continue;
      const [x, z] = where;
      const entity = app.world.spawn(
        [Persistent, lastingName.villager(person.name)],
        [Transform, { x, y: map.groundY(x, z), z, facing: Math.PI / 2 }],
        [MoveSpeed, 1.2],
        [Interactable, interactable(`Talk to ${person.name}`)],
        [Resident, { name: person.name, home: { x, z }, facing: Math.PI / 2, seated: true }],
      );
      show(app, entity, person.name, true);
      held.push({ entity, name: person.name, until: person.away.until, home: doorOf(house), facing: house.facing ?? 0, captive: true });
    }
    app.addSystems(freeingSystem(app, map, hero, held));
  },
};

// Each frame: a captive found is freed (their look their own); free, and the hero far off, they're home.
function freeingSystem(app: App, map: WorldMap, hero: Entity, held: Held[]): System {
  return {
    name: 'freeing',
    stage: 'simulate',
    update(world) {
      const book = world.hasResource(Quests) ? world.resource(Quests) : undefined;
      for (const h of held) {
        if (book && foundIn(book, h.name)) book.flags[freedFlag(h.name)] = true;
        if (!isFree(book, h.name, h.until)) continue;
        if (h.captive) {
          h.captive = false;
          show(app, h.entity, h.name, false);
        }
        release(world, map, hero, h);
      }
    },
  };
}

// A freed captive back at their door once the hero's well away: strolling with the rest by day.
function release(world: World, map: WorldMap, hero: Entity, h: Held): void {
  const resident = world.read(h.entity, Resident);
  if (!resident.seated) return;
  const at = world.read(h.entity, Transform);
  const you = world.read(hero, Transform);
  if (Math.hypot(you.x - at.x, you.z - at.z) < HOME_WHEN_AWAY) return;
  const [x, z] = h.home;
  Object.assign(at, { x, y: map.groundY(x, z), z, facing: h.facing });
  Object.assign(resident, { home: { x, z }, facing: h.facing, seated: false });
}
