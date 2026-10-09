// What stands in the way on a map (a building's walls, a well): boxes on the ground, kept in a coarse grid of cells
// so a walker asks only the few near it. A walker is a circle; it's blocked where it would overlap a box.

import { defineResource } from '../ecs';

// A box on the ground, world units (x0 < x1, z0 < z1).
export interface Box {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

const CELL = 8; // world units a cell of the index: boxes are listed under every cell they touch

export class Obstacles {
  private readonly cells = new Map<number, Box[]>();
  private count = 0;

  get size(): number {
    return this.count;
  }

  add(box: Box): void {
    this.count++;
    for (let cx = Math.floor(box.x0 / CELL); cx <= Math.floor(box.x1 / CELL); cx++) {
      for (let cz = Math.floor(box.z0 / CELL); cz <= Math.floor(box.z1 / CELL); cz++) {
        const key = cellKey(cx, cz);
        const list = this.cells.get(key);
        if (list) list.push(box);
        else this.cells.set(key, [box]);
      }
    }
  }

  // Whether a circle of `radius` at (x, z) overlaps anything.
  blocks(x: number, z: number, radius: number): boolean {
    for (let cx = Math.floor((x - radius) / CELL); cx <= Math.floor((x + radius) / CELL); cx++) {
      for (let cz = Math.floor((z - radius) / CELL); cz <= Math.floor((z + radius) / CELL); cz++) {
        for (const b of this.cells.get(cellKey(cx, cz)) ?? []) {
          const nx = Math.max(b.x0, Math.min(x, b.x1));
          const nz = Math.max(b.z0, Math.min(z, b.z1));
          if ((x - nx) ** 2 + (z - nz) ** 2 < radius * radius) return true;
        }
      }
    }
    return false;
  }
}

const cellKey = (cx: number, cz: number) => cx * 65536 + cz;

export const ObstaclesResource = defineResource<Obstacles>('Obstacles');
