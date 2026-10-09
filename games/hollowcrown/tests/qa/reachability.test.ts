// QA: Brindle Vale can be walked. From the Pilgrim's Shrine, where a new game starts, a flood over the walkable tiles
// (the buildings' walls and fixtures in the way, for a walker of a person's size) reaches every place in the region:
// a building at its door, anything else where it stands or, for something solid (the well), right beside it; and so
// does every villager, animal, quest objective and spot of a villager's day. The fill stays inside the region's
// rectangle.

import { describe, expect, it } from 'vitest';
import { BODY_RADIUS } from '@voxel/engine/gameplay';
import { covers, loadWorldMap, type PlaceData } from '@voxel/engine/world';
import { obstaclesOf } from '../../src/buildings';
import { PLACE_KINDS, START_PLACE, WORLD_MAP } from '../../src/data/world';
import { footprint } from '../../src/data/world/kinds';
import { villagersOf } from '../../src/features/villagers';
import { WILDLIFE } from '../../src/features/wildlife';
import { PEOPLE, type Spot } from '../../src/data/people';
import { QUESTS } from '../../src/data/quests';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const obstacles = obstaclesOf(map);
const region = WORLD_MAP.areas.find((a) => a.id === 'brindle-vale')!;
const [x0, z0, x1, z1] = (region.shape as { rect: [number, number, number, number] }).rect;
const W = x1 - x0 + 1;

// Where a walker goes to reach a place: a building's door, or the spot itself.
const target = (p: PlaceData): [number, number] => (p.kind === 'building' ? footprint(p).door : [Math.round(p.at[0]), Math.round(p.at[1])]);

// Every tile of the region a walker can reach from (sx, sz), as a flag per tile.
function flood(sx: number, sz: number): Uint8Array {
  const seen = new Uint8Array(W * (z1 - z0 + 1));
  const free = (x: number, z: number) => map.walkable(x, z) && !obstacles.blocks(x, z, BODY_RADIUS);
  const queue = new Int32Array(seen.length);
  let head = 0;
  let tail = 0;
  seen[(sz - z0) * W + (sx - x0)] = 1;
  queue[tail++] = (sz - z0) * W + (sx - x0);
  while (head < tail) {
    const i = queue[head++];
    const x = (i % W) + x0;
    const z = Math.floor(i / W) + z0;
    for (const [nx, nz] of [[x + 1, z], [x - 1, z], [x, z + 1], [x, z - 1]]) {
      if (nx < x0 || nx > x1 || nz < z0 || nz > z1) continue;
      const j = (nz - z0) * W + (nx - x0);
      if (seen[j] || !free(nx, nz)) continue;
      seen[j] = 1;
      queue[tail++] = j;
    }
  }
  return seen;
}

// The shrine's flood, worked out once for every test.
let fromShrine: Uint8Array | undefined;
const reached = (x: number, z: number) => {
  fromShrine ??= flood(...target(map.place(START_PLACE)!));
  const [tx, tz] = [Math.round(x), Math.round(z)];
  return tx >= x0 && tx <= x1 && tz >= z0 && tz <= z1 && fromShrine[(tz - z0) * W + (tx - x0)] === 1;
};
// Reached, or a step or two from somewhere reached (beside something solid: the well, a stool).
const near = (x: number, z: number) => [-2, -1, 0, 1, 2].some((dx) => [-2, -1, 0, 1, 2].some((dz) => reached(x + dx, z + dz)));

describe('Brindle Vale reachability', () => {
  it("reaches every place in the region on foot from the Pilgrim's Shrine", () => {
    const places = map.places().filter((p) => covers(region.shape, ...p.at));
    expect(places.length).toBeGreaterThan(30);
    const unreached = places.filter((p) => {
      const [x, z] = target(p);
      return p.kind === 'building' ? !reached(x, z) : !near(x, z);
    });
    expect(unreached.map((p) => `${p.id} at (${target(p).join(', ')})`)).toEqual([]);
  });

  it("reaches every villager and every animal from the Pilgrim's Shrine", () => {
    const standing = [...villagersOf(map).map((v) => ({ who: v.name, x: v.x, z: v.z })), ...WILDLIFE.map((a) => ({ who: `${a.creature} (${a.note})`, x: a.at[0], z: a.at[1] }))];
    expect(standing.filter(({ x, z }) => !reached(x, z)).map((s) => s.who)).toEqual([]);
  });

  it("reaches every spot a quest sends the hero to, and every spot of a villager's day", () => {
    // A spot: a place by id (where a walker goes for it), or a tile. (An area's id: walked into, not to a spot.)
    const where = (spot: Spot): [number, number] | null => {
      if (typeof spot !== 'string') return spot;
      const place = map.place(spot);
      return place ? target(place) : null;
    };
    const spots = [
      ...Object.values(QUESTS).flatMap((q) => q.stages.flatMap((s) => s.objectives.flatMap((o) => (o.at ? [{ why: `${q.id} ${s.id}/${o.id}`, spot: o.at }] : [])))),
      ...PEOPLE.flatMap((v) => v.routine.map((r) => ({ why: `${v.name} from ${r.from}h`, spot: r.at }))),
    ];
    const unreached = spots.flatMap(({ why, spot }) => {
      const at = where(spot);
      return at && covers(region.shape, ...at) && !near(...at) ? [`${why}: ${String(spot)}`] : [];
    });
    expect(unreached).toEqual([]);
  });
});
