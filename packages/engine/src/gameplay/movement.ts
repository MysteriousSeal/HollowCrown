// Walking: every entity with somewhere to go moves that way at its speed, turns to face it, keeps to the map (a
// margin from its edge) and stands on the ground.

import type { System } from '../ecs';
import { TerrainResource } from '../world/terrain';
import { MoveIntent, MoveSpeed, Transform } from './components';

const EDGE_MARGIN = 0.4; // how close to the map's edge anyone may go

export const movementSystem: System = {
  name: 'movement',
  stage: 'simulate',
  update(world, dt) {
    const terrain = world.resource(TerrainResource);
    const { width, depth } = terrain.size;
    for (const entity of world.query(Transform, MoveIntent, MoveSpeed)) {
      const at = world.read(entity, Transform);
      const { x: dx, z: dz } = world.read(entity, MoveIntent);
      const length = Math.hypot(dx, dz);
      if (length > 1e-6) {
        const step = (world.read(entity, MoveSpeed) * dt) / length;
        at.x = Math.min(width - 1 - EDGE_MARGIN, Math.max(EDGE_MARGIN, at.x + dx * step));
        at.z = Math.min(depth - 1 - EDGE_MARGIN, Math.max(EDGE_MARGIN, at.z + dz * step));
        at.facing = Math.atan2(dx, dz);
      }
      at.y = terrain.groundY(at.x, at.z);
    }
  },
};
