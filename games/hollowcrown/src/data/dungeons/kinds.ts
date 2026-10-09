// What a dungeon is, as data (a proposal for the engine to load and draw as a small map of its own): its halls as
// rects of tiles in its own space, each at a floor tier; the doors between them; its features by kind (a pit, a
// sarcophagus, a niche), like the world map's places; what waits in it; and its way in, tied to its place on the
// world map. Used by the dungeons' loading (engine), their dressing (environment) and encounters (gameplay).

import type { Point } from '@voxel/engine/world';

export type Rect = [number, number, number, number]; // [x0, z0, x1, z1], tiles, inclusive

// A hall or chamber: open floor at `tier` over its rect (walls round whatever no room covers).
export interface DungeonRoom {
  id: string;
  name: string;
  rect: Rect;
  tier: number;
}

// A way between two rooms, at a tile on the edge of both: an open arch, a run of stairs (from one tier to the other),
// a grate (closed until `opens`, a story flag or a key), or a gap.
export interface DungeonDoor {
  from: string;
  to: string;
  at: Point;
  kind: 'arch' | 'stairs' | 'grate' | 'gap';
  opens?: string;
}

// Something in a room, by kind, with its own properties: a pit (not walkable: `size`), a rope bridge across one
// (`length`, `facing` along it), a sarcophagus, a niche in a wall, an altar, a bone pile, a hanging bell, loot.
export interface DungeonFeature {
  id: string;
  kind: 'pit' | 'rope-bridge' | 'sarcophagus' | 'niche' | 'altar' | 'bones' | 'bell' | 'chest' | 'torch';
  at: Point;
  facing?: number;
  props?: Record<string, unknown>;
}

// What waits: `count` of a creature (src/creatures' ids) at a tile, at a level; `when` a story flag says so (else
// always, the first time).
export interface DungeonSpawn {
  foe: string;
  at: Point;
  count: number;
  level: number;
  when?: string;
  boss?: boolean;
}

export interface Dungeon {
  id: string;
  name: string;
  place: string; // its place on the world map (a crypt or cave, whose facing is the way in)
  size: { width: number; depth: number };
  entrance: { room: string; at: Point; facing: number }; // where the hero arrives, and looks
  rooms: DungeonRoom[];
  doors: DungeonDoor[];
  features: DungeonFeature[];
  spawns: DungeonSpawn[];
}

const inRect = ([x0, z0, x1, z1]: Rect, [x, z]: Point) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
const roomAt = (d: Dungeon, p: Point) => d.rooms.find((r) => inRect(r.rect, p));

// The problems with a dungeon's data (none: it's sound): rooms inside its size and not overlapping, every door
// between the two rooms it names (on or next to both), everything else inside a room.
export function checkDungeon(d: Dungeon): string[] {
  const problems: string[] = [];
  const all: Rect = [0, 0, d.size.width - 1, d.size.depth - 1];
  for (const r of d.rooms) {
    if (!inRect(all, [r.rect[0], r.rect[1]]) || !inRect(all, [r.rect[2], r.rect[3]])) problems.push(`${r.id}: outside the dungeon`);
    for (const o of d.rooms) {
      if (o === r) continue;
      const [a, b] = [r.rect, o.rect];
      if (a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]) problems.push(`${r.id} overlaps ${o.id}`);
    }
  }
  const ids = new Set(d.rooms.map((r) => r.id));
  for (const door of d.doors) {
    const near = (id: string) => {
      const r = d.rooms.find((x) => x.id === id);
      if (!r) return false;
      const [x0, z0, x1, z1] = r.rect;
      return inRect([x0 - 1, z0 - 1, x1 + 1, z1 + 1], door.at);
    };
    if (!ids.has(door.from) || !ids.has(door.to)) problems.push(`a door names a room that isn't there: ${door.from}, ${door.to}`);
    else if (!near(door.from) || !near(door.to)) problems.push(`the door from ${door.from} to ${door.to} isn't between them`);
  }
  if (!ids.has(d.entrance.room) || !inRect(d.rooms.find((r) => r.id === d.entrance.room)!.rect, d.entrance.at)) problems.push('the entrance is not in its room');
  for (const f of d.features) if (!roomAt(d, f.at)) problems.push(`${f.id}: in no room`);
  for (const s of d.spawns) if (!roomAt(d, s.at)) problems.push(`${s.foe} at (${s.at}): in no room`);
  return problems;
}
