// The Vale's trees: each species and shape builds, stands on the floor of its grid, every voxel in the
// palette, and keeps to a triangle budget (thousands stand in view). Its forests: every one the map draws filled, each
// tree inside one, off roads, water and buildings, a chunk's trees one instanced mesh a shape.

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { Obstacles, covers, loadWorldMap, type Shape } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { forestChunks, forestLayer, treesIn, type Tree } from '../src/nature/forests';
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

describe('the Vale\'s forests', () => {
  const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
  const built = obstaclesOf(map);
  const byChunk = new Map([...forestChunks(map)].map((k) => [k, treesIn(map, k, built)]));
  const all = [...byChunk.values()].flat();
  const forests = map.data.areas.filter((a) => a.kind === 'forest');
  const inside = (shape: Shape, t: Tree) => covers(shape, Math.round(t.x), Math.round(t.z));

  it('fill every forest drawn, each tree inside one, on bare ground, off what\'s built', () => {
    for (const f of forests) expect(all.some((t) => inside(f.shape, t)), f.id).toBe(true);
    for (const t of all) {
      expect(forests.some((f) => inside(f.shape, t))).toBe(true);
      expect(map.surfaceAt(t.x, t.z)).toBe(0);
      expect(built.blocks(t.x, t.z, 1)).toBe(false);
    }
  });

  it('grow the species each forest names', () => {
    const pines = forests.find((f) => f.id === 'mosshill-pines')!;
    expect(all.filter((t) => inside(pines.shape, t)).every((t) => t.species === 'pine')).toBe(true);
  });

  it('come out the same every time', () => {
    const [key] = byChunk.keys();
    expect(treesIn(map, key, built)).toEqual(byChunk.get(key));
  });

  it('draw a chunk as one instanced mesh a tree shape, quickly, its trunks in the way', () => {
    const trunks = new Obstacles();
    const layer = forestLayer(map, built, trunks);
    const [key] = [...byChunk.entries()].sort((a, b) => b[1].length - a[1].length)[0];
    layer.build(key); // (the shapes' meshes, built once)
    const t = performance.now();
    const meshes = layer.build(key) as THREE.InstancedMesh[];
    expect(performance.now() - t).toBeLessThan(20);
    expect(meshes.length).toBeLessThanOrEqual(VARIANTS * SPECIES.length);
    expect(meshes.reduce((n, m) => n + m.count, 0)).toBe(byChunk.get(key)!.length);
    expect(trunks.size).toBe(byChunk.get(key)!.length); // (each trunk in the way once, however often its chunk's built)
  });
});
