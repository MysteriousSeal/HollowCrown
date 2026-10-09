// A building as a model, on the same base as every other: its grid (structureVoxels) standing centred on its origin,
// its front toward +z, its windows glowing; and whatever a game hangs on it (a sign, a wheel), moved each frame by
// its ticks.

import type * as THREE from 'three';
import { joint, RiggedModel, type PartLook } from '../models';
import type { Size, VoxelGrid } from '../voxel';
import { STRUCTURE_VOXEL as V, structureGrid, type StructureLayout, type StructureSpec } from './structureVoxels';

export class StructureModel extends RiggedModel {
  readonly layout: StructureLayout;
  readonly ticks: Array<(time: number) => void> = [];

  // `look`: the game's colors (spec.colors index its palette; its windows glow, and whatever else it says);
  // `extra`: anything more it hangs on (props, by `prop`).
  constructor(spec: StructureSpec, look: PartLook, extra?: (model: StructureModel) => void) {
    super({ ...look, glows: new Set([spec.colors.window, ...(look.glows ?? [])]) });
    const { grid, layout } = structureGrid(spec);
    this.layout = layout;
    this.part(this.frame, grid, [layout.size[0] / 2, 0, layout.size[2] / 2], V);
    extra?.(this);
    this.finish(layout.size[1] * V, 0);
  }

  // Where voxel (x, y, z) of the building's grid is, in the model's own space.
  at(x: number, y: number, z: number): [number, number, number] {
    const [sx, , sz] = this.layout.size;
    return [(x - sx / 2) * V, y * V, (z - sz / 2) * V];
  }

  // A prop: `grid` hung at voxel (x, y, z) of the building by its own voxel `pivot`, on a joint of its own (to turn,
  // swing); `look` its own colors, if not the building's.
  prop(grid: VoxelGrid, pivot: Size, [x, y, z]: Size, look?: PartLook): THREE.Group {
    const g = joint(this.frame, ...this.at(x, y, z));
    this.part(g, grid, pivot, V, look);
    return g;
  }

  animate(time: number): void {
    for (const tick of this.ticks) tick(time);
  }
}
