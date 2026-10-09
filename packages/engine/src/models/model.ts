// A model: anything the engine draws for an entity (a creature, a person, a building). Placed by its root (the
// visual system puts it where its entity stands and turns it the way it faces), posed each frame from the time and
// how much it's moving (0 still .. 1 full stride: a walk, a flight), and what it's acting out, if anything (a swing,
// a flinch: rigs that know the action pose it, others ignore it).

import type * as THREE from 'three';

// An action being acted out: its name ('attack', 'hurt'...) and how far through it is (0 .. 1).
export interface ModelAction {
  readonly name: string;
  readonly phase: number;
}

export interface Model {
  readonly root: THREE.Object3D;
  readonly height: number; // world units, ground to top (as drawn)
  animate(time: number, motion: number, action?: ModelAction): void;
}
