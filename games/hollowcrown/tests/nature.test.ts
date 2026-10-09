// The Vale's trees: each species and shape builds, stands on the floor of its grid, every voxel in the
// palette, and keeps to a triangle budget (thousands stand in view).

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { NATURE } from '../src/nature/palette';
import { SPECIES, VARIANTS, treeModel, treeVoxels } from '../src/nature/trees';

const triangles = (root: THREE.Object3D) => {
  let n = 0;
  root.traverse((o) => {
    const g = (o as THREE.Mesh).isMesh && (o as THREE.Mesh).geometry;
    if (g) n += (g.index?.count ?? g.getAttribute('position').count) / 3;
  });
  return n;
};
const trees = SPECIES.flatMap((s) => Array.from({ length: VARIANTS }, (_, v) => [s, v] as const));

describe('the Vale\'s trees', () => {
  it('paint only from the palette, and stand on their foot', () => {
    for (const [s, v] of trees) {
      const g = treeVoxels(s, v);
      expect(Math.max(...g.cells), `${s}${v}`).toBeLessThanOrEqual(NATURE.colors.length);
      const [sx, sy, sz] = g.size;
      const feet = Array.from({ length: sx * sz }, (_, i) => g.cells[(i % sx) + sx * sy * Math.floor(i / sx)]).filter((c) => c);
      expect(feet.length, `${s}${v}`).toBeGreaterThanOrEqual(4); // (its foot on the floor of its grid)
    }
  });

  it('keep to a triangle budget', () => {
    const counts = Object.fromEntries(trees.map(([s, v]) => [`${s}${v}`, triangles(treeModel(s, v).root)]));
    for (const [id, n] of Object.entries(counts)) expect(n, id).toBeLessThan(5500);
  });
});
