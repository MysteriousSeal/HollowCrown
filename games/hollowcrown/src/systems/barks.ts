// Barks: a villager the hero walks past says one of their lines in passing (src/data/people), in turn, now and then.
// A line `after` something is only said once it has happened: a story flag set, or a quest of that id finished. Each
// is told as a Barked event, for the HUD to show over them.

import { defineEvent, type Entity, type System } from '@voxel/engine/ecs';
import { Transform } from '@voxel/engine/gameplay';
import { PEOPLE_DATA, barkLine } from '../data/people';
import { Quests, type QuestBook } from './quests';
import { Talking } from './talk';
import { Resident } from './villagerDay';

export const BARK_RANGE = 3; // tiles: how near the hero must pass to overhear
export const BARK_EVERY = 25; // seconds before the same villager says something again

// `entity` said `line` in passing (who uses it: the HUD, to show it over them).
export const Barked = defineEvent<{ entity: Entity; name: string; line: string }>('Barked');

// Whether `key` has happened: a flag set, or a quest finished.
export function hasHappened(book: QuestBook | undefined, key: string): boolean {
  if (!book) return false;
  return !!book.flags[key] || book.quests.some((q) => q.quest === key && q.finished);
}

// What `name` may say in passing now.
export function barksOf(name: string, book: QuestBook | undefined): string[] {
  return (PEOPLE_DATA[name]?.barks ?? []).filter((b) => typeof b === 'string' || hasHappened(book, b.after)).map(barkLine);
}

// The newest of `name`'s lines first (one just unlocked by the story), then the rest in turn.
export function nextBark(lines: string[], said: number): string | undefined {
  return lines.length ? lines[(lines.length - 1 + said) % lines.length] : undefined;
}

// Each villager the hero is near (not in a talk, quiet a while) says their next line.
export function barkSystem(hero: Entity): System {
  const quietTill = new Map<Entity, number>();
  const said = new Map<Entity, number>();
  let clock = 0;
  return {
    name: 'barks',
    stage: 'simulate',
    update(world, dt) {
      clock += dt;
      const at = world.get(hero, Transform);
      if (!at) return;
      const book = world.hasResource(Quests) ? world.resource(Quests) : undefined;
      for (const entity of world.query(Resident, Transform)) {
        const { x, z } = world.read(entity, Transform);
        if (Math.hypot(x - at.x, z - at.z) > BARK_RANGE || world.has(entity, Talking) || clock < (quietTill.get(entity) ?? 0)) continue;
        const { name } = world.read(entity, Resident);
        const line = nextBark(barksOf(name, book), said.get(entity) ?? 0);
        if (!line) continue;
        world.emit(Barked, { entity, name, line });
        said.set(entity, (said.get(entity) ?? 0) + 1);
        quietTill.set(entity, clock + BARK_EVERY);
      }
    },
  };
}
