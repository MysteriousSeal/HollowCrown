// A model: anything the engine draws for an entity (a creature, a person, a building). Placed by its root (the
// visual system puts it where its entity stands and turns it the way it faces), posed each frame from the time and
// how much it's moving (0 still .. 1 full stride: a walk, a flight).

import type * as THREE from 'three';

export interface Model {
  readonly root: THREE.Object3D;
  readonly height: number; // world units, ground to top (as drawn)
  animate(time: number, motion: number): void;
}
