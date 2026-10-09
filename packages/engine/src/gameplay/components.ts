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

// How far round an entity it takes up room, world units (none given: a person's, BODY_RADIUS).
export const BodyRadius = defineComponent<number>('BodyRadius');
export const BODY_RADIUS = 0.15;

// The entity the player controls.
export const Player = defineComponent<true>('Player');
