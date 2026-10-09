// A model of one voxel grid, standing still (a building, a rock, a prop): the simplest model, on the same base as
// every rigged one.

import type { Size, VoxelGrid } from '../voxel';
import { MODEL_VOXEL, type PartLook } from './parts';
import { RiggedModel } from './riggedModel';

export class VoxelModel extends RiggedModel {
  // `grid` drawn standing on the ground, its base centred under the root; `voxel` world units a voxel.
  constructor(grid: VoxelGrid, look: PartLook, { voxel = MODEL_VOXEL, scale = 1, shade = 0 }: { voxel?: number; scale?: number; shade?: number } = {}) {
    super(look, scale);
    const [sx, sy, sz] = grid.size;
    const pivot: Size = [sx / 2, 0, sz / 2];
    this.part(this.frame, grid, pivot, voxel);
    this.finish(sy * voxel * scale, shade);
  }

  animate(): void {}
}
