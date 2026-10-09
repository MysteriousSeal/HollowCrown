// Sprinting: while it's held and the player is moving, their pace eases up from a walk to a run, and back down when
// it's let go or they stop. No stamina yet.

import type { System } from '@voxel/engine/ecs';
import { MoveIntent, MoveSpeed, Player } from '@voxel/engine/gameplay';

const EASE = 6; // how fast the pace eases between a walk and a run (per second)

// Whether sprint is held (set by the feature's keys), and the pace now: 0 walking .. 1 running.
export interface Sprint {
  held: boolean;
  pace: number;
}

// The player's MoveSpeed eased between `walk` and `run` (tiles a second) by `sprint`, before they move.
export function sprintSystem(sprint: Sprint, walk: number, run: number): System {
  return {
    name: 'sprint',
    stage: 'input',
    update(world, dt) {
      for (const entity of world.query(Player)) {
        const intent = world.get(entity, MoveIntent);
        const moving = !!intent && (intent.x !== 0 || intent.z !== 0);
        sprint.pace += ((sprint.held && moving ? 1 : 0) - sprint.pace) * Math.min(1, EASE * dt);
        world.add(entity, MoveSpeed, walk + (run - walk) * sprint.pace);
      }
    },
  };
}
