// Walking: every entity with somewhere to go moves that way at its speed, turns to face it, keeps to the map (a
// margin from its edge), to what can be walked on (not into water) and out of what stands in the way (walls), and
// stands on the ground.

import type { System } from '../ecs';
import { ObstaclesResource, type Obstacles } from '../world/obstacles';
import { TerrainResource, type Terrain } from '../world/terrain';
import { BODY_RADIUS, BodyRadius, MoveIntent, MoveSpeed, Transform } from './components';

const EDGE_MARGIN = 0.4; // how close to the map's edge anyone may go

// Whether a body of `radius` can stand at (x, z): ground it can walk on, nothing in the way.
function isFree(terrain: Terrain, obstacles: Obstacles | null, x: number, z: number, radius: number): boolean {
  return (terrain.walkable?.(x, z) ?? true) && !obstacles?.blocks(x, z, radius);
}

export const movementSystem: System = {
  name: 'movement',
  stage: 'simulate',
  update(world, dt) {
    const terrain = world.resource(TerrainResource);
    const { width, depth } = terrain.size;
    const obstacles = world.hasResource(ObstaclesResource) ? world.resource(ObstaclesResource) : null;
    for (const entity of world.query(Transform, MoveIntent, MoveSpeed)) {
      const at = world.read(entity, Transform);
      const { x: dx, z: dz } = world.read(entity, MoveIntent);
      const length = Math.hypot(dx, dz);
      if (length > 1e-6) {
        const step = (world.read(entity, MoveSpeed) * dt) / length;
        const x = Math.min(width - 1 - EDGE_MARGIN, Math.max(EDGE_MARGIN, at.x + dx * step));
        const z = Math.min(depth - 1 - EDGE_MARGIN, Math.max(EDGE_MARGIN, at.z + dz * step));
        // Each axis on its own, so it slides along what can't be walked on (a shore) rather than stopping dead.
        const radius = world.get(entity, BodyRadius) ?? BODY_RADIUS;
        if (isFree(terrain, obstacles, x, at.z, radius)) at.x = x;
        if (isFree(terrain, obstacles, at.x, z, radius)) at.z = z;
        at.facing = Math.atan2(dx, dz);
      }
      at.y = terrain.groundY(at.x, at.z);
    }
  },
};
