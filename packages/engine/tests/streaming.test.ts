// Chunk streaming spread over frames, and what a chunk costs to build: the terrain's, and a places chunk of buildings.

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { StructureModel, type StructureColor, type StructureSpec } from '../src/structures';
import { CHUNK_SIZE, ChunkStreamer, FRAME_BUILD_BUDGET, placesLayer, terrainLayer, type ChunkLayer, type PlaceData, type Terrain } from '../src/world';

// A layer whose every chunk is `steps` steps, each taking `cost` ms on a clock the test moves.
function slowLayer(clock: { now: number }, steps: number, cost: number) {
  let ran = 0;
  const layer: ChunkLayer = {
    materials: [],
    chunkKeys: () => [],
    build: () => [],
    buildSteps: () => Array.from({ length: steps }, () => () => ((clock.now += cost), ran++, [new THREE.Group()])),
  };
  return { layer, ran: () => ran };
}

describe('chunk streaming', () => {
  it('builds for no more than its budget a frame (one step at least), until every chunk round is built', () => {
    const clock = { now: 0 };
    const { layer, ran } = slowLayer(clock, 10, 1.5);
    const streamer = new ChunkStreamer(new THREE.Scene(), () => clock.now);
    streamer.layer(layer);
    let frames = 0;
    for (;;) {
      const before = clock.now;
      const steps = streamer.update(100, 100);
      if (steps === 0) break;
      expect(clock.now - before).toBeLessThan(FRAME_BUILD_BUDGET + 1.5); // (the last step may run over)
      frames++;
    }
    expect(frames).toBeGreaterThan(10);
    expect(ran() % 10).toBe(0); // (every chunk built whole)
    expect(streamer.update(100, 100)).toBe(0);
  });

  it('runs one slow step a frame rather than none', () => {
    const clock = { now: 0 };
    const { layer } = slowLayer(clock, 2, 50);
    const streamer = new ChunkStreamer(new THREE.Scene(), () => clock.now);
    streamer.layer(layer);
    expect(streamer.update(100, 100)).toBe(1);
    expect(streamer.update(100, 100)).toBe(1);
  });

  it('loads everything round at once on startup', () => {
    const clock = { now: 0 };
    const { layer, ran } = slowLayer(clock, 3, 5);
    const streamer = new ChunkStreamer(new THREE.Scene(), () => clock.now);
    streamer.layer(layer);
    streamer.loadAround(100, 100);
    expect(ran()).toBeGreaterThan(3 * 4);
    expect(streamer.update(100, 100)).toBe(0);
  });

  it('drops a chunk half built when the camera leaves it far behind', () => {
    const clock = { now: 0 };
    const { layer } = slowLayer(clock, 4, 10);
    const scene = new THREE.Scene();
    const streamer = new ChunkStreamer(scene, () => clock.now);
    streamer.layer(layer);
    streamer.update(100, 100);
    streamer.update(100 + CHUNK_SIZE * 8, 100);
    expect(() => {
      for (let i = 0; i < 400 && streamer.update(100 + CHUNK_SIZE * 8, 100) > 0; i++);
    }).not.toThrow();
    for (const group of scene.children) for (const o of group.children) expect(o).toBeInstanceOf(THREE.Group);
  });

  it('leaves out what a layer builds that isn\'t a 3D object, warning once with its name', () => {
    const warned: string[] = [];
    const warn = console.warn;
    console.warn = (message: string) => warned.push(message);
    try {
      const layer: ChunkLayer = { name: 'meadows', materials: [], chunkKeys: () => [], build: () => [new THREE.Group(), undefined as unknown as THREE.Object3D] };
      const scene = new THREE.Scene();
      const streamer = new ChunkStreamer(scene, () => 0);
      streamer.layer(layer);
      streamer.loadAround(100, 100);
      for (const chunk of scene.children) for (const o of chunk.children) expect(o).toBeInstanceOf(THREE.Group);
      expect(warned).toHaveLength(1);
      expect(warned[0]).toContain('"meadows"');
    } finally {
      console.warn = warn;
    }
  });

  it('splits a places chunk into a step per place', () => {
    const places = Array.from({ length: 3 }, (_, i) => ({ kind: 'prop', at: [2 + i, 2] }) as unknown as PlaceData);
    const layer = placesLayer(places, () => new THREE.Group(), []);
    const steps = layer.buildSteps!('0,0');
    expect(steps).toHaveLength(3);
    expect(steps[0]()).toHaveLength(1);
    expect(layer.buildSteps!('5,5')).toEqual([]);
  });
});

// Timings in node, on the CPU only (no GPU upload): generous budgets, there to catch a build growing many times over.
// They mean nothing on a busy machine, so they run only when asked: PERF=1 npx vitest run packages/engine/tests/streaming.test.ts
describe.runIf(process.env.PERF)('chunk build cost', () => {
  const time = (run: () => unknown, times = 5) => {
    for (let i = 0; i < 3; i++) run(); // (warm up: the first builds run cold, before the JIT has optimized them)
    const start = performance.now();
    for (let i = 0; i < times; i++) run();
    return (performance.now() - start) / times;
  };

  it('builds a terrain chunk of rolling, mixed ground within a frame\'s budget', () => {
    const terrain: Terrain = {
      size: { width: 256, depth: 256 },
      tierAt: (x, z) => Math.floor(2 + 2 * Math.sin(x * 0.3) + 2 * Math.cos(z * 0.23)),
      groundY: () => 0,
      surfaceAt: (x, z) => (x + z * 3) % 5 === 0 ? 1 : 0,
    };
    const layer = terrainLayer(terrain, [0, 1, 2, 3, 4, 5, 6], [0x998866]);
    const ms = time(() => layer.build('3,3'));
    expect(ms).toBeLessThan(FRAME_BUILD_BUDGET * 2);
  });

  it('builds a chunk of buildings a building a step, each step within a few frames', () => {
    const roles: StructureColor[] = ['plaster', 'plasterShade', 'timber', 'timberDark', 'stone', 'stoneLight', 'stoneDark', 'roof', 'roofLight', 'roofDark', 'door', 'doorDark', 'window', 'shutter', 'inside'];
    const colors = Object.fromEntries(roles.map((r, i) => [r, i + 1])) as Record<StructureColor, number>;
    const palette = roles.map((_, i) => 0x101010 * (i + 1));
    const spec: StructureSpec = {
      width: 30, depth: 24, storeys: 2, storeyHeight: 12, walls: 'timber', roof: 'thatch', colors,
      door: { width: 5, height: 9 }, windows: { width: 4, height: 4, sill: 4, every: 12 }, chimney: 1,
    };
    const places = Array.from({ length: 6 }, (_, i) => ({ kind: 'building', at: [2 + i * 2, 2] }) as unknown as PlaceData);
    const layer = placesLayer(places, () => new StructureModel(spec, { palette }).root, []);
    const steps = layer.buildSteps!('0,0');
    expect(steps).toHaveLength(6);
    const ms = time(() => steps[0](), 5);
    expect(ms).toBeLessThan(80);
  });
});
