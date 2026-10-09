// The region's roaming foes (src/data/world/encounters.ts), decided: whether an encounter is out now (its hours, the
// quests and flags it waits on or ends with), where its foes stand, and whether a band killed is back yet (the days
// counted as the clock passes midnight). Its state lasts in the save (systems/save.ts): the day, and when each band
// was killed.

import { defineResource, type System } from '@voxel/engine/ecs';
import { TimeOfDay } from '@voxel/engine/gameplay';
import { hashUnit } from '@voxel/engine/math';
import { boundsOf, covers, type Point, type WorldMap } from '@voxel/engine/world';
import type { Encounter } from '../data/world/encounters';
import { WORLD_MAP } from '../data/world';
import type { QuestBook } from './quests';

// The day (counted from the first), and the day each band was killed, by encounter id.
export interface RoamingData {
  day: number;
  killed: Record<string, number>;
}
export const Roaming = defineResource<RoamingData>('Roaming');

// Whether `hours` falls in [from, until) (wrapping past midnight).
export function inHours(hours: number, [from, until]: [number, number]): boolean {
  return from <= until ? hours >= from && hours < until : hours >= from || hours < until;
}

// Whether `cond` has come to pass: a quest finished ('MQ01'), or a flag at a value ('famine_pit:blessed').
export function hasCome(book: QuestBook | undefined, cond: string): boolean {
  if (!book) return false;
  const [flag, value] = cond.split(':');
  if (value !== undefined) return String(book.flags[flag]) === value;
  return book.quests.some((q) => q.quest === cond && q.finished);
}

// Whether `enc` is out now: in its hours, after what it waits on, before what ends it, not ruled out.
export function isOut(enc: Encounter, hours: number, book: QuestBook | undefined): boolean {
  if (enc.hours && !inHours(hours, enc.hours)) return false;
  if (enc.after && !hasCome(book, enc.after)) return false;
  if (enc.until && hasCome(book, enc.until)) return false;
  return !(enc.unless && hasCome(book, enc.unless));
}

// Whether a band killed on `killedOn` is back by `day` (never, if it doesn't come back).
export const isBack = (enc: Encounter, killedOn: number | undefined, day: number): boolean =>
  killedOn === undefined || (enc.respawnDays !== undefined && day - killedOn >= enc.respawnDays);

// The middle of where `enc` roams, and how far round it.
export function rangeOf(enc: Encounter): { at: Point; radius: number; shape?: Parameters<typeof covers>[0] } {
  if ('at' in enc.where) return { at: enc.where.at, radius: enc.where.radius };
  const id = enc.where.area;
  const area = WORLD_MAP.areas.find((a) => a.id === id);
  if (!area) throw new Error(`roaming: no area '${id}'`);
  const b = boundsOf(area.shape);
  return { at: [(b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2], radius: Math.hypot(b.x1 - b.x0, b.z1 - b.z0) / 2, shape: area.shape };
}

// Where each of `enc`'s foes stands: walkable spots in its range, the same each time (the first ones near its
// middle, a pack together).
export function spotsOf(enc: Encounter, map: WorldMap): Point[] {
  const { at: [cx, cz], radius, shape } = rangeOf(enc);
  const spots: Point[] = [];
  const spread = Math.min(radius, 3 + enc.count); // (a pack keeps close)
  for (let i = 0; spots.length < enc.count && i < enc.count * 40; i++) {
    const angle = hashUnit(i, enc.count, 71) * Math.PI * 2;
    const r = Math.sqrt(hashUnit(i, enc.count, 72)) * spread;
    const [x, z] = [cx + Math.cos(angle) * r, cz + Math.sin(angle) * r];
    if (map.walkable(x, z) && (!shape || covers(shape, Math.round(x), Math.round(z)))) spots.push([x, z]);
  }
  return spots;
}

// The days counted: one more each time the clock passes midnight.
export const calendarSystem: System = (() => {
  let last: number | undefined;
  return {
    name: 'calendar',
    stage: 'simulate',
    update(world) {
      if (!world.hasResource(TimeOfDay) || !world.hasResource(Roaming)) return;
      const { hours } = world.resource(TimeOfDay);
      if (last !== undefined && hours < last - 12) world.resource(Roaming).day++;
      last = hours;
    },
  };
})();
