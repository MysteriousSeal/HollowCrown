// A layer of the world's meshes, built chunk by chunk (chunks.ts) as the hero nears them (chunkStreamer.ts).

import type * as THREE from 'three';

export interface ChunkLayer {
  readonly materials: THREE.Material[];
  chunkKeys(): Iterable<string>;
  build(chunkKey: string): THREE.Object3D[];
}
