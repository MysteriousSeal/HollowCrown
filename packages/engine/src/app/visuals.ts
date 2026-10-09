// What an entity looks like on screen (a Model), and the entity the camera follows. The visual system puts each
// model where its entity stands, turns it the way it faces (smoothly, the short way round), and eases its motion
// (0 still .. 1 moving) from how far it actually went, for the model to animate with what it's acting out (a swing, a
// flinch); the dead topple onto their side.

import type * as THREE from 'three';
import { defineComponent, type System } from '../ecs';
import { Transform } from '../gameplay/components';
import { Acting } from '../gameplay/attack';
import { Dead } from '../gameplay/health';
import type { Model } from '../models';

const TURN_RATE = 14; // how fast a model turns toward its facing (per second)
const EASE = 12; // how fast its motion eases in and out (per second)
const FALL = 6; // how fast the dead topple (per second)
const STILL = 1e-4; // world units: moved less than this in a frame, it's standing

export interface Visual {
  readonly model: Model;
  readonly shade: THREE.Object3D | undefined; // the shade under it, kept square to the world
  heading: number; // the way it's turned now
  motion: number; // 0 still .. 1 moving, eased
  fallen: number; // 0 standing .. 1 lying on its side (dead), eased
  last: { x: number; z: number } | null; // where it stood last frame
}
export const VisualComponent = defineComponent<Visual>('Visual');

// A model as an entity's visual.
export const visualOf = (model: Model, facing = 0): Visual => ({ model, shade: model.root.getObjectByName('shade'), heading: facing, motion: 0, fallen: 0, last: null });

// The entity the camera follows (the first one found).
export const CameraTarget = defineComponent<true>('CameraTarget');

// Every visual placed, turned and animated (`clock`: the app's time, seconds).
export function visualSystem(clock: () => number): System {
  return {
    name: 'visuals',
    stage: 'present',
    update(world, dt) {
      const time = clock();
      for (const entity of world.query(VisualComponent, Transform)) {
        const visual = world.read(entity, VisualComponent);
        const { x, y, z, facing } = world.read(entity, Transform);
        const moved = visual.last ? Math.hypot(x - visual.last.x, z - visual.last.z) : 0;
        if (visual.last) [visual.last.x, visual.last.z] = [x, z];
        else visual.last = { x, z };
        visual.motion += ((moved > STILL ? 1 : 0) - visual.motion) * Math.min(1, EASE * dt);
        const turn = Math.atan2(Math.sin(facing - visual.heading), Math.cos(facing - visual.heading));
        visual.heading += turn * Math.min(1, TURN_RATE * dt);
        const { root } = visual.model;
        root.position.set(x, y, z);
        root.rotation.y = visual.heading;
        if (visual.shade) visual.shade.rotation.y = -visual.heading;
        // The dead topple onto their side and lie there.
        if (world.has(entity, Dead) || visual.fallen > 0) {
          visual.fallen += ((world.has(entity, Dead) ? 1 : 0) - visual.fallen) * Math.min(1, FALL * dt);
          root.rotation.z = visual.fallen * (Math.PI / 2);
          if (visual.shade) visual.shade.visible = visual.fallen < 0.5;
        }
        const acting = world.get(entity, Acting);
        visual.model.animate(time, visual.motion, acting && { name: acting.action, phase: Math.min(1, acting.time / acting.duration) });
      }
    },
  };
}
