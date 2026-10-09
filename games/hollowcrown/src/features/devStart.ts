// Starting somewhere else, for the studio's screenshots and tests (dev builds only): `?at=x,z` stands the hero on that
// tile, `?time=13` sets the hour. A value that isn't a walkable tile or an hour 0..24 is ignored.

import { TimeOfDay, Transform } from '@voxel/engine/gameplay';
import type { WorldMap } from '@voxel/engine/world';
import type { Feature } from './context';

// What the URL's query asks for: a tile to start on, an hour; each only if it's valid.
export function devStartOf(query: string, map: WorldMap): { at?: [number, number]; hour?: number } {
  const params = new URLSearchParams(query);
  const out: { at?: [number, number]; hour?: number } = {};
  const at = params.get('at')?.split(',').map(Number);
  if (at?.length === 2 && at.every(Number.isFinite) && map.walkable(at[0], at[1])) out.at = [at[0], at[1]];
  const hour = Number(params.get('time') ?? NaN);
  if (params.has('time') && hour >= 0 && hour <= 24) out.hour = hour % 24;
  return out;
}

export const devStart: Feature = {
  name: 'devStart',
  install: ({ app, map, hero }) => {
    if (!import.meta.env.DEV) return;
    const { at, hour } = devStartOf(window.location.search, map);
    if (at) Object.assign(app.world.read(hero, Transform), { x: at[0], y: map.groundY(...at), z: at[1] });
    if (hour !== undefined && app.world.hasResource(TimeOfDay)) app.world.resource(TimeOfDay).hours = hour;
  },
};
