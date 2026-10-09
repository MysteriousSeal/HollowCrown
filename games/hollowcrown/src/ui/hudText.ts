// What the HUD says, and when, worked out from the map alone (no page): the region the hero is in and its banner,
// the named place the hero is near.

import type { AreaData, PlaceData } from '@voxel/engine/world';

// Places too small or too many to name on the screen (a house, the well): left to their village's name.
const UNNAMED_KINDS = new Set(['building', 'fixture']);

// How near the hero must be to a place for its name to show, tiles, by kind (any other kind: PLACE_RADIUS).
export const PLACE_RADIUS = 12;
const RADIUS_BY_KIND: Record<string, number> = { village: 30, town: 50 };

export interface BannerText {
  title: string;
  sub: string;
}

// The region among `areas` (the areas at the hero), if any.
export function regionOf(areas: AreaData[]): AreaData | undefined {
  return areas.find((a) => a.kind === 'region');
}

// A region's banner: its name in capitals, its level range under it ("Levels 1–6").
export function regionBanner(region: AreaData): BannerText {
  const levels = region.props?.levels;
  const sub = Array.isArray(levels) && levels.length === 2 ? `Levels ${levels[0]}–${levels[1]}` : '';
  return { title: (region.name ?? region.id).toUpperCase(), sub };
}

// The name of the nearest named place within its reach of (x, z), tiles (none: null).
export function nearPlaceName(places: PlaceData[], x: number, z: number): string | null {
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const place of places) {
    if (!place.name || UNNAMED_KINDS.has(place.kind)) continue;
    const distance = Math.hypot(place.at[0] - x, place.at[1] - z);
    if (distance <= (RADIUS_BY_KIND[place.kind] ?? PLACE_RADIUS) && distance < bestDistance) {
      best = place.name;
      bestDistance = distance;
    }
  }
  return best;
}
