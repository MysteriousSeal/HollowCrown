// What the map screen shows of the Vale (made by features/hud.ts): its bare land's color, the regions' names, and a
// mark for each named place by its kind.

import { boundsOf, type WorldMapData } from '@voxel/engine/world';
import type { MapLabel, MapMark, MarkShape } from '@voxel/engine/ui';

// The bare land on the map: a muted grass, under the surfaces' own colors.
export const MAP_GROUND = 0x6f9a4c;

// Each kind of place's mark (a kind not listed has none: buildings, fixtures).
export const MARKS: Record<string, { shape: MarkShape; color: number }> = {
  town: { shape: 'square', color: 0xf8ecd4 },
  village: { shape: 'square', color: 0xefdcb8 },
  keep: { shape: 'square', color: 0xb98a46 },
  farm: { shape: 'circle', color: 0xd6bb8e },
  landmark: { shape: 'diamond', color: 0xe8c27a },
  ruin: { shape: 'diamond', color: 0xa89a88 },
  camp: { shape: 'triangle', color: 0xe8903a },
  crypt: { shape: 'triangle', color: 0xb4a0c8 },
  cave: { shape: 'triangle', color: 0x8c7a66 },
};

// The regions' names, each at its middle.
export function mapLabels(data: WorldMapData): MapLabel[] {
  return data.areas
    .filter((a) => a.kind === 'region')
    .map((a) => {
      const { x0, z0, x1, z1 } = boundsOf(a.shape);
      return { x: (x0 + x1) / 2, z: (z0 + z1) / 2, text: a.name ?? a.id };
    });
}

// A mark for each place of a kind with one.
export function mapMarks(data: WorldMapData): MapMark[] {
  return data.places.flatMap((p) => {
    const mark = MARKS[p.kind];
    return mark ? [{ x: p.at[0], z: p.at[1], ...mark, name: p.name }] : [];
  });
}
