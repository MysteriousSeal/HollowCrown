// A layer of the world's meshes, built chunk by chunk (chunks.ts) as the hero nears them (chunkStreamer.ts).

import type * as THREE from 'three';

export interface ChunkLayer {
  readonly materials: THREE.Material[];
  chunkKeys(): Iterable<string>;
  build(chunkKey: string): THREE.Object3D[];
  // A chunk's build in small steps (a building each), for the streamer to spread over frames; none given: build
  // makes the chunk in one step.
  buildSteps?(chunkKey: string): Array<() => THREE.Object3D[]>;
}
