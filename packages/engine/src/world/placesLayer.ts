// A layer of the things placed on a map (buildings, props), built chunk by chunk as the camera comes near: each place
// in a chunk made into whatever the game draws it as (nothing, for a place that isn't drawn), positioned by the game.

import type * as THREE from 'three';
import { CHUNK_SIZE } from './chunks';
import type { ChunkLayer } from './chunkLayer';
import type { PlaceData } from './worldMap';

// `make`: a place drawn, placed in the world (null: not drawn); `materials`: everything it draws with, for the look
// to style up front.
export function placesLayer(places: readonly PlaceData[], make: (place: PlaceData) => THREE.Object3D | null, materials: THREE.Material[]): ChunkLayer {
  const byChunk = new Map<string, PlaceData[]>();
  for (const place of places) {
    const key = `${Math.floor(place.at[0] / CHUNK_SIZE)},${Math.floor(place.at[1] / CHUNK_SIZE)}`;
    const list = byChunk.get(key);
    if (list) list.push(place);
    else byChunk.set(key, [place]);
  }
  return {
    name: 'places',
    materials,
    chunkKeys: () => byChunk.keys(),
    build: (key) => (byChunk.get(key) ?? []).flatMap((p) => make(p) ?? []),
    buildSteps: (key) => (byChunk.get(key) ?? []).map((p) => () => { const made = make(p); return made ? [made] : []; }), // (a place a step)
  };
}
