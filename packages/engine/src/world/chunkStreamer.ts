// Keeps the world's meshes loaded around the hero, chunk by chunk (see
// chunkLayer.ts): every chunk within LOAD_RADIUS tiles is built, nearest
// first, a step at a time (a layer's chunk, or one building of it) for at
// most a few milliseconds a frame, so walking never hitches; chunks beyond
// UNLOAD_RADIUS are dropped (their instance buffers freed; shared model
// geometry stays cached for when the hero comes back).

import * as THREE from 'three';
import { CHUNK_SIZE } from './chunks';
import type { ChunkLayer } from './chunkLayer';

// The camera shows about 15 tiles from the hero at most (fog hides the
// rest), so chunks load comfortably before they come into view.
const LOAD_RADIUS = 28;
const UNLOAD_RADIUS = 44;
// Milliseconds of building a frame may take (a step started always finishes,
// so one slow step can run over).
export const FRAME_BUILD_BUDGET = 4;

interface Chunk {
  readonly group: THREE.Group;
  readonly built: Map<ChunkLayer, THREE.Object3D[]>;
}
type Step = () => void;

export class ChunkStreamer {
  private readonly layers: ChunkLayer[] = [];
  private readonly loaded = new Map<string, Chunk>();
  private building: { key: string; steps: Step[] } | null = null; // the chunk being built, its steps left

  private lastKey = '';
  private pending = true; // chunks near the camera still to build
  private waiting = 0; // how many chunks near the camera are still to build, as of the last update

  constructor(
    private readonly scene: THREE.Scene,
    private readonly clock: () => number = () => performance.now(),
  ) {}

  layer(layer: ChunkLayer): void {
    this.layers.push(layer);
    for (const [key, chunk] of this.loaded) for (const step of this.stepsOf(chunk, layer, key)) step(); // (a layer added late: into what's built)
  }

  // Every material any layer draws with, loaded or not.
  materials(): THREE.Material[] {
    return [...new Set(this.layers.flatMap((l) => l.materials))];
  }

  // Builds the missing chunks near (x, z), nearest first, for up to `budget`
  // milliseconds, and drops far ones. Returns how many steps it ran.
  update(x: number, z: number, budget = FRAME_BUILD_BUDGET): number {
    // Nothing to do while the camera stays in the same chunk and every chunk round it is built.
    const key = `${Math.floor(x / CHUNK_SIZE)},${Math.floor(z / CHUNK_SIZE)}`;
    if (key === this.lastKey && !this.pending) return 0;
    this.lastKey = key;
    for (const [key, chunk] of this.loaded) {
      if (distanceToChunk(key, x, z) > UNLOAD_RADIUS) this.unload(key, chunk.group);
    }
    const start = this.clock();
    let ran = 0;
    let wanted: string[] | null = null;
    while (ran === 0 || this.clock() - start < budget) {
      if (!this.building) {
        wanted ??= chunksWithin(x, z, LOAD_RADIUS)
          .filter((key) => !this.loaded.has(key))
          .sort((a, b) => distanceToChunk(b, x, z) - distanceToChunk(a, x, z)); // (nearest last, popped first)
        const next = wanted.pop();
        if (next === undefined) break;
        this.building = { key: next, steps: this.load(next) };
      }
      const step = this.building.steps.shift();
      if (step) {
        step();
        ran++;
      }
      if (this.building.steps.length === 0) this.building = null;
    }
    this.waiting = (this.building ? 1 : 0) + (wanted ?? chunksWithin(x, z, LOAD_RADIUS).filter((key) => !this.loaded.has(key))).length;
    this.pending = this.waiting > 0;
    return ran;
  }

  // How many chunks are built (or being built), and how many near the camera are still to build.
  stats(): { loaded: number; pending: number } {
    return { loaded: this.loaded.size, pending: this.pending ? this.waiting : 0 };
  }

  // Loads every chunk near (x, z) at once (startup).
  loadAround(x: number, z: number): void {
    this.update(x, z, Infinity);
  }

  // A chunk added to the scene, empty, and the steps that fill it.
  private load(key: string): Step[] {
    const chunk: Chunk = { group: new THREE.Group(), built: new Map() };
    this.loaded.set(key, chunk);
    this.scene.add(chunk.group);
    return this.layers.flatMap((layer) => this.stepsOf(chunk, layer, key));
  }

  private stepsOf(chunk: Chunk, layer: ChunkLayer, key: string): Step[] {
    const add = (objects: THREE.Object3D[]) => {
      if (objects.length === 0) return;
      chunk.group.add(...objects);
      const built = chunk.built.get(layer);
      if (built) built.push(...objects);
      else chunk.built.set(layer, objects);
    };
    const steps = layer.buildSteps?.(key) ?? [() => layer.build(key)];
    return steps.map((step) => () => add(step()));
  }

  private unload(key: string, group: THREE.Group): void {
    if (this.building?.key === key) this.building = null;
    this.scene.remove(group);
    group.traverse((o) => (o as THREE.InstancedMesh).isInstancedMesh && (o as THREE.InstancedMesh).dispose());
    this.loaded.delete(key);
  }
}

// Distance from (x, z) to the nearest point of a chunk's tile area.
function distanceToChunk(key: string, x: number, z: number): number {
  const [cx, cz] = key.split(',').map(Number);
  const nearestX = Math.max(cx * CHUNK_SIZE - 0.5, Math.min(x, (cx + 1) * CHUNK_SIZE - 0.5));
  const nearestZ = Math.max(cz * CHUNK_SIZE - 0.5, Math.min(z, (cz + 1) * CHUNK_SIZE - 0.5));
  return Math.hypot(x - nearestX, z - nearestZ);
}

function chunksWithin(x: number, z: number, radius: number): string[] {
  const keys: string[] = [];
  const reach = Math.ceil(radius / CHUNK_SIZE) + 1;
  const cx = Math.floor(x / CHUNK_SIZE);
  const cz = Math.floor(z / CHUNK_SIZE);
  for (let dx = -reach; dx <= reach; dx++) {
    for (let dz = -reach; dz <= reach; dz++) {
      const key = `${cx + dx},${cz + dz}`;
      if (distanceToChunk(key, x, z) <= radius) keys.push(key);
    }
  }
  return keys;
}
