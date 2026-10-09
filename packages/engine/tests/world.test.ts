import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { CHUNK_SIZE, ChunkStreamer, chunkKeysIn, chunkTilesIn, flatTerrain, terrainLayer, tierRects, type ChunkLayer, type Terrain } from '../src/world';

const size = { width: 64, depth: 64 };

describe('terrain', () => {
  it('draws a flat chunk as one rectangle', () => {
    const rects = tierRects(flatTerrain(size, 1), { x0: 0, z0: 0, x1: 16, z1: 16 });
    expect(rects).toEqual([{ tier: 1, x: 0, z: 0, width: 16, depth: 16 }]);
  });

  it('covers every tile exactly once, each rectangle a single tier', () => {
    const terrain: Terrain = { size, tierAt: (x, z) => ((x >> 2) + (z >> 1)) % 3, groundY: () => 0 };
    const area = { x0: 16, z0: 16, x1: 32, z1: 32 };
    const rects = tierRects(terrain, area);
    const seen = new Set<string>();
    for (const r of rects) {
      for (let x = r.x; x < r.x + r.width; x++) for (let z = r.z; z < r.z + r.depth; z++) {
        expect(terrain.tierAt(x, z)).toBe(r.tier);
        expect(seen.has(`${x},${z}`)).toBe(false);
        seen.add(`${x},${z}`);
      }
    }
    expect(seen.size).toBe(16 * 16);
  });

  it('builds a flat chunk as a single instance, its tiles under the box', () => {
    const terrain = flatTerrain(size, 1);
    const [mesh] = terrainLayer(terrain, [1]).build('1,2') as THREE.InstancedMesh[];
    expect(mesh.count).toBe(1);
    const box = new THREE.Box3().setFromObject(mesh);
    expect(box.min.x).toBeCloseTo(16 - 0.5);
    expect(box.max.z).toBeCloseTo(48 - 0.5);
  });
});

describe('chunks', () => {
  it('lists the chunks over an area and their tiles, clipped', () => {
    expect([...chunkKeysIn({ x0: 0, z0: 0, x1: 20, z1: 10 })]).toEqual(['0,0', '1,0']);
    expect(chunkTilesIn('1,0', { x0: 0, z0: 0, x1: 20, z1: 10 })).toEqual({ x0: 16, z0: 0, x1: 20, z1: 10 });
    expect(chunkTilesIn('5,5', { x0: 0, z0: 0, x1: 20, z1: 10 })).toBeNull();
  });

  it('builds the chunks round the camera, and does nothing more while it stays in its chunk', () => {
    let built = 0;
    const layer: ChunkLayer = { materials: [], chunkKeys: () => [], build: () => (built++, [new THREE.Group()]) };
    const streamer = new ChunkStreamer(new THREE.Scene());
    streamer.layer(layer);
    streamer.loadAround(100, 100);
    const loaded = built;
    expect(loaded).toBeGreaterThan(4);
    expect(streamer.update(100 + CHUNK_SIZE / 4, 100)).toBe(0); // (same chunk, all built)
    expect(built).toBe(loaded);
    streamer.update(100 + CHUNK_SIZE * 2, 100); // (two chunks on: new ones to build)
    expect(built).toBeGreaterThan(loaded);
  });
});
