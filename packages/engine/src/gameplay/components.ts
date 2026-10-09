// The components every game's entities are made of, for where they are and how they move.

import { defineComponent } from '../ecs';

// Where an entity stands (world units: x east, z south, y up) and the way it faces (radians about y, 0 toward +z).
export interface TransformData {
  x: number;
  y: number;
  z: number;
  facing: number;
}
export const Transform = defineComponent<TransformData>('Transform');

// The way it means to move this frame (any length: only its direction counts; zero to stand).
export const MoveIntent = defineComponent<{ x: number; z: number }>('MoveIntent');

// How fast it walks, in tiles a second.
export const MoveSpeed = defineComponent<number>('MoveSpeed');

// The entity the player controls.
export const Player = defineComponent<true>('Player');
