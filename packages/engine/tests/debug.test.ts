import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { clockOf, debugLines } from '../src/app/debugOverlay';
import { World } from '../src/ecs';
import { ChunkStreamer, type ChunkLayer } from '../src/world';

describe('debug overlay', () => {
  const stats = { fps: 59.6, frameMs: 4.24, drawCalls: 212, triangles: 1_234_000, chunksLoaded: 30, chunksPending: 2, entities: 41 };

  it('reads frame rate, draws, chunks, the target\'s tile and the time', () => {
    expect(debugLines({ ...stats, at: { x: 120, z: 340, tier: 2, surface: 'road' }, hours: 17.5 })).toEqual([
      'fps: 60 · 4.2 ms',
      '212 draws · 1.23M tris',
      'chunks: 30 loaded · 2 pending · 41 entities',
      'tile 120, 340 · tier 2 · road',
      'time 17:30',
    ]);
  });

  it('leaves out the tile and time when there are none', () => {
    expect(debugLines({ ...stats, at: null, hours: null })).toHaveLength(3);
  });

  it('shows hours as a 24-hour clock', () => {
    expect(clockOf(0)).toBe('00:00');
    expect(clockOf(7.0834)).toBe('07:05');
    expect(clockOf(23.999)).toBe('23:59');
    expect(clockOf(25)).toBe('01:00');
  });

  it('counts the world\'s entities, and the streamer\'s chunks loaded and pending', () => {
    const world = new World();
    const e = world.spawn();
    world.spawn();
    world.despawn(e);
    expect(world.entityCount).toBe(1);

    let now = 0;
    const layer: ChunkLayer = { materials: [], chunkKeys: () => [], build: () => ((now += 10), [new THREE.Group()]) };
    const streamer = new ChunkStreamer(new THREE.Scene(), () => now);
    streamer.layer(layer);
    streamer.update(100, 100);
    const first = streamer.stats();
    expect(first.loaded).toBe(1);
    expect(first.pending).toBeGreaterThan(4);
    streamer.loadAround(100, 100);
    expect(streamer.stats().pending).toBe(0);
  });
});
