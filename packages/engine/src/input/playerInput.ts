// The player's walking: the directions held, turned to line up with the camera (up walks up the screen), as the
// player's move intent.

import { defineResource, type System } from '../ecs';
import type { MovementAxes } from '../render/camera';
import { MoveIntent, Player } from '../gameplay/components';
import { KeyboardResource } from './keyboard';

// The ground directions the screen's up and right point along (render/camera.ts computeMovementAxes).
export const ScreenAxes = defineResource<MovementAxes>('ScreenAxes');

export const playerInputSystem: System = {
  name: 'playerInput',
  stage: 'input',
  update(world) {
    const keys = world.resource(KeyboardResource);
    const { forward, right } = world.resource(ScreenAxes);
    const held = (action: Parameters<typeof keys.isHeld>[0]) => Number(keys.isHeld(action));
    const [ahead, across] = [held('up') - held('down'), held('right') - held('left')];
    for (const entity of world.query(Player)) {
      world.add(entity, MoveIntent, { x: forward.x * ahead + right.x * across, z: forward.z * ahead + right.z * across });
    }
  },
};
