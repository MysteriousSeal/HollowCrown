// How the land's small life behaves (the ambient feature brings it in): grazing and pecking where it stands or
// strolling round its spot, startled by the hero coming too near. A walker runs (a rabbit bounds, sheep scatter a
// little and settle); a bird lifts off and flies away, gone for good; a butterfly never stops, never minds.

import { defineComponent, type Entity, type System, type World } from '@voxel/engine/ecs';
import { Acting, MoveIntent, MoveSpeed, Transform, Wander, wander } from '@voxel/engine/gameplay';
import { hashUnit } from '@voxel/engine/math';
import type { Wildlife } from '../data/world/life';

// How a kind behaves: how near the hero may come (tiles; 0: it doesn't mind), its pace strolling and running (tiles a
// second), how far it strolls (0: it stays put), whether it flies off when startled, and its gestures while it stands.
export interface Trait {
  scare: number;
  walk: number;
  run: number;
  roam: number;
  flies?: boolean;
  gestures: string[];
}
export const TRAITS: Partial<Record<Wildlife['kind'], Trait>> = {
  rabbit: { scare: 5, walk: 0.8, run: 4.5, roam: 2, gestures: ['graze', 'sitUp', 'sniff'] },
  deer: { scare: 10, walk: 0.9, run: 5, roam: 4, gestures: ['graze', 'alert'] },
  fox: { scare: 7, walk: 1.2, run: 4.5, roam: 6, gestures: ['sniff', 'alert'] },
  duck: { scare: 2.5, walk: 0, run: 0, roam: 0, flies: true, gestures: ['preen', 'peck'] },
  frog: { scare: 1.5, walk: 0, run: 2, roam: 0, gestures: [] },
  rook: { scare: 4, walk: 0, run: 0, roam: 0, flies: true, gestures: ['peck', 'lookRound'] },
  crow: { scare: 4, walk: 0, run: 0, roam: 0, flies: true, gestures: ['peck', 'lookRound'] },
  songbird: { scare: 3, walk: 0, run: 0, roam: 0, flies: true, gestures: ['peck', 'preen', 'flutter'] },
  butterfly: { scare: 0, walk: 0.6, run: 0, roam: 3, gestures: [] },
  hen: { scare: 1.5, walk: 0, run: 2, roam: 0, gestures: ['peck', 'flutter', 'lookRound'] },
  dog: { scare: 0, walk: 1.4, run: 0, roam: 6, gestures: ['sniff', 'tailWag'] },
  sheep: { scare: 3, walk: 0.5, run: 2.5, roam: 4, gestures: ['graze'] },
  cow: { scare: 2, walk: 0.4, run: 1.8, roam: 3, gestures: ['graze'] },
};

export const FLY_SPEED = 5; // tiles a second, flying off
export const FLY_FOR = 3; // seconds before a bird flown is gone
const CALM = 2.5; // a runner calms down this many times its scare distance away
const GESTURE_ODDS = 0.004; // a frame's chance of a gesture, standing (about one every few seconds)

// One of the land's small life: what it is, where it keeps to (a tame one goes back there), its state.
export interface CritterData {
  kind: Wildlife['kind'];
  home: { x: number; z: number };
  tame: boolean;
  state: 'calm' | 'running' | 'flying';
  flown: number; // seconds flying
}
export const Critter = defineComponent<CritterData>('Critter');

const settle = (world: World, e: Entity, t: Trait, home: { x: number; z: number }) => {
  world.add(e, MoveIntent, { x: 0, z: 0 });
  if (t.roam > 0) world.add(e, Wander, wander(home, { radius: t.roam, speed: t.walk, pause: t.walk && !t.scare && !t.gestures.length ? [0, 0.5] : [2, 6] }));
};

// The critters as the hero comes and goes; `gone` told of every bird that has flown out of sight (to be taken out).
export function critterSystem(hero: Entity, gone: (e: Entity) => void): System {
  let frame = 0;
  return {
    name: 'critters',
    stage: 'simulate',
    update(world, dt) {
      frame++;
      const you = world.get(hero, Transform);
      if (!you) return;
      for (const e of world.query(Critter, Transform)) {
        const c = world.read(e, Critter);
        const t = TRAITS[c.kind];
        if (!t) continue;
        const at = world.read(e, Transform);
        const [dx, dz] = [at.x - you.x, at.z - you.z];
        const far = Math.hypot(dx, dz) || 0.01;
        if (c.state === 'flying') {
          c.flown += dt;
          const step = (FLY_SPEED * dt) / far;
          [at.x, at.z, at.y] = [at.x + dx * step, at.z + dz * step, at.y + dt * 1.2];
          at.facing = Math.atan2(dx, dz);
          if (c.flown > FLY_FOR) gone(e);
          continue;
        }
        if (c.state === 'calm' && t.scare > 0 && far < t.scare) {
          world.remove(e, Wander);
          if (t.flies) {
            Object.assign(c, { state: 'flying', flown: 0 });
            world.remove(e, MoveIntent); // (it flies itself: over walls and water)
            world.add(e, Acting, { action: 'flutter', time: 0, duration: 0.6 });
          } else {
            c.state = 'running';
            world.add(e, MoveSpeed, t.run);
            if (c.kind === 'rabbit' || c.kind === 'deer') world.add(e, Acting, { action: 'bound', time: 0, duration: 1.2 });
          }
        }
        if (c.state === 'running') {
          if (far > t.scare * CALM) {
            c.state = 'calm';
            if (!c.tame) c.home = { x: at.x, z: at.z };
            settle(world, e, t, c.home);
          } else world.add(e, MoveIntent, { x: dx / far, z: dz / far });
          continue;
        }
        if (!world.has(e, Wander) && t.roam > 0) settle(world, e, t, c.home);
        const standing = !world.get(e, Wander)?.target;
        if (standing && t.gestures.length && !world.has(e, Acting) && hashUnit(e, frame, 41) < GESTURE_ODDS) {
          const action = t.gestures[Math.floor(hashUnit(e, frame, 42) * t.gestures.length)];
          world.add(e, Acting, { action, time: 0, duration: 1 + hashUnit(e, frame, 43) * 2 });
        }
      }
    },
  };
}
