// QA: the world builds fast enough to stream as the hero walks. Working out a chunk of the map (its tiers merged into
// rectangles), building a terrain chunk's meshes, and building Brindleford's busiest places chunk (its buildings
// modelled for the first time) each stay under a budget: measured on the studio's machine, with 5-10x headroom.
// Timings mean nothing on a busy machine, so these run only when asked: PERF=1 npx vitest run tests/qa/performance.test.ts

import { describe, expect, it } from 'vitest';
import { CHUNK_SIZE, chunkTilesIn, loadWorldMap, terrainLayer, tierRects } from '@voxel/engine/world';
import { placesOf } from '../../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../../src/data/world';

const BUDGET_MS = {
  workOutChunk: 3, // measured ~0.3 ms
  terrainChunk: 3, // measured ~0.2 ms
  placesChunk: 500, // measured ~100 ms
};

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const WHOLE = { x0: 0, z0: 0, x1: 4096, z1: 4096 };
const BRINDLEFORD_CHUNK = `${Math.floor(900 / CHUNK_SIZE)},${Math.floor(3350 / CHUNK_SIZE)}`; // the well, the green

// The best of a few runs of `fn`, in ms (the first one warms up).
function timed(fn: () => void, runs = 5): number {
  let best = Infinity;
  for (let i = 0; i < runs; i++) {
    const t = performance.now();
    fn();
    best = Math.min(best, performance.now() - t);
  }
  return best;
}

// The chunk with the most buildings and fixtures in it.
function busiestPlacesChunk(): string {
  const counts = new Map<string, number>();
  for (const p of map.places().filter((p) => p.kind === 'building' || p.kind === 'fixture')) {
    const key = `${Math.floor(p.at[0] / CHUNK_SIZE)},${Math.floor(p.at[1] / CHUNK_SIZE)}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

describe.runIf(process.env.PERF)('world-build performance', () => {
  it(`works out a chunk of the world map in under ${BUDGET_MS.workOutChunk} ms`, () => {
    const tiles = chunkTilesIn(BRINDLEFORD_CHUNK, WHOLE)!;
    expect(timed(() => tierRects(map, tiles))).toBeLessThan(BUDGET_MS.workOutChunk);
  });

  it(`builds a terrain chunk in under ${BUDGET_MS.terrainChunk} ms`, () => {
    const layer = terrainLayer(map, map.tiers(), map.surfaceColors());
    expect(timed(() => layer.build(BRINDLEFORD_CHUNK))).toBeLessThan(BUDGET_MS.terrainChunk);
  });

  it(`builds Brindleford's busiest places chunk in under ${BUDGET_MS.placesChunk} ms`, () => {
    const key = busiestPlacesChunk();
    // Each run on a fresh layer: the first build of a chunk models its buildings, later ones reuse them.
    expect(timed(() => placesOf(map).build(key), 3)).toBeLessThan(BUDGET_MS.placesChunk);
  });
});
