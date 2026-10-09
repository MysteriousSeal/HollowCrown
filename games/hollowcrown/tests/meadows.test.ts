// The Vale's meadows: every one the map draws grassed and flowered, on bare ground only, off what's built; each plant
// under three hundred triangles; a chunk drawn as one instanced mesh a shape.

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import { VoxelModel } from '@voxel/engine/models';
import { covers, loadWorldMap } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { MEADOW_SHAPES, meadowChunks, meadowGrowthIn, meadowLayer } from '../src/nature/meadows';
import { NATURE_LOOK } from '../src/nature/palette';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const built = obstaclesOf(map);
const byChunk = new Map([...meadowChunks(map)].map((k) => [k, meadowGrowthIn(map, k, built)]));
const all = [...byChunk.values()].flat();
const meadows = map.data.areas.filter((a) => a.kind === 'meadow');

describe('the Vale\'s meadows', () => {
  it('grass and flower every meadow drawn, on bare ground, off what\'s built', () => {
    for (const m of meadows) {
      const inside = all.filter((g) => covers(m.shape, Math.round(g.x), Math.round(g.z)));
      expect(inside.some((g) => g.shape.startsWith('tuft')), m.id).toBe(true);
      expect(inside.some((g) => g.shape.startsWith('flowers')), m.id).toBe(true);
    }
    for (const g of all) {
      expect(map.surfaceAt(g.x, g.z)).toBe(0);
      expect(built.blocks(g.x, g.z, 0.2)).toBe(false);
    }
  });

  it('keep each plant under three hundred triangles', () => {
    for (const [id, grid] of Object.entries(MEADOW_SHAPES)) {
      const mesh = new VoxelModel(grid(), NATURE_LOOK, { voxel: STRUCTURE_VOXEL }).root.getObjectByProperty('isMesh', true) as THREE.Mesh;
      expect(mesh.geometry.getAttribute('position').count / 2, id).toBeLessThan(300); // (two triangles a quad of four)
    }
  });

  it('draw a chunk as one instanced mesh a shape', () => {
    const [key, plants] = [...byChunk.entries()].sort((a, b) => b[1].length - a[1].length)[0];
    const meshes = meadowLayer(map, built).build(key) as THREE.InstancedMesh[];
    expect(meshes.length).toBeLessThanOrEqual(Object.keys(MEADOW_SHAPES).length);
    expect(meshes.reduce((n, m) => n + m.count, 0)).toBe(plants.length);
  });
});
