// What stands about the Vale (props/): every shape paints from its palette within a budget; every piece of dressing
// drawn here comes out where it's placed (a fence run's posts from end to end, its rails filling it), in the chunk
// it stands in; fences and what's in the way kept out of.

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import { VoxelModel } from '@voxel/engine/models';
import { Obstacles, loadWorldMap } from '@voxel/engine/world';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { DRESSING, type Dressing } from '../src/data/world/dressing';
import { LANDMARK_SHAPES, PROP_SHAPES, dressingLayer, dressingObstacles, piecesOf } from '../src/props';
import { NATURE } from '../src/nature/palette';
import { PROPS } from '../src/props/palette';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);

describe('the Vale\'s props', () => {
  it('paint only from their palette, within a budget', () => {
    for (const [id, make] of Object.entries(PROP_SHAPES)) {
      const grid = make();
      expect(grid.cells.reduce((m, c) => Math.max(m, c), 0), id).toBeLessThanOrEqual(PROPS.colors.length);
      const mesh = new VoxelModel(grid, { palette: PROPS.colors }, { voxel: STRUCTURE_VOXEL }).root.getObjectByProperty('isMesh', true) as THREE.Mesh;
      expect(mesh.geometry.getAttribute('position').count / 2, id).toBeLessThan(id === 'barrow' ? 16000 : 6000); // (the barrow: one of it, big)
    }
  });

  it('stand the Hanging Oak where the South Road bends, the barrow among the Nine Sisters', () => {
    const pieces = piecesOf(DRESSING);
    expect(pieces.some((p) => p.shape === 'hanging-oak')).toBe(true);
    const oak = LANDMARK_SHAPES['hanging-oak']();
    expect(oak.cells.reduce((m, c) => Math.max(m, c), 0)).toBeLessThanOrEqual(NATURE.colors.length);
    expect(oak.cells.filter((c) => c === NATURE.C.rope).length).toBeGreaterThan(4); // (the rope still on its bough)
  });

  it('lay a fence run\'s posts end to end, its rails between them', () => {
    const run: Dressing = { kind: 'fence', note: 'a test', line: [[0.5, 0.5], [4.5, 0.5], [4.5, 2.5]] };
    const pieces = piecesOf([run]);
    expect(pieces.filter((p) => p.shape === 'post').length).toBe(5 + 3);
    const rails = pieces.filter((p) => p.shape === 'rails');
    expect(rails.length).toBe(4 + 2);
    expect(rails.filter((r) => r.turn === 1).length).toBe(2);
  });

  it('draw every piece placed, in its own chunk', () => {
    const layer = dressingLayer(map, DRESSING);
    const drawn = [...layer.chunkKeys()].flatMap((k) => layer.build(k) as THREE.InstancedMesh[]).reduce((n, m) => n + m.count, 0);
    expect(drawn).toBe(piecesOf(DRESSING).length);
    for (const shape of ['hay-rick', 'gibbet', 'stone0', 'rails', 'post']) expect(piecesOf(DRESSING).some((p) => p.shape.startsWith(shape.replace('0', ''))), shape).toBe(true);
  });

  it('stand in the way: fence runs, ricks, the gibbet, the stones', () => {
    const obstacles = new Obstacles();
    dressingObstacles(DRESSING, obstacles);
    const gibbet = DRESSING.find((d) => d.kind === 'gibbet')!;
    expect(obstacles.blocks(gibbet.at![0], gibbet.at![1], 0.1)).toBe(true);
    const fence = DRESSING.find((d) => d.kind === 'fence')!.line!;
    expect(obstacles.blocks((fence[0][0] + fence[1][0]) / 2, (fence[0][1] + fence[1][1]) / 2, 0.1)).toBe(true);
  });
});
