import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { Transform } from '../src/gameplay';
import { VisualComponent, visualOf, visualSystem } from '../src/app/visuals';
import { BODY_COLOR_COUNT, DEFAULT_LOOK, bodyPalette, humanModel } from '../src/characters';
import { VoxelModel, type Model } from '../src/models';
import { createGrid, fillBox } from '../src/voxel';

describe('models', () => {
  it('stands a voxel model on the ground, centred, its height as drawn', () => {
    const g = createGrid([4, 10, 2]);
    fillBox(g, 0, 0, 0, 3, 9, 1, 1);
    const model = new VoxelModel(g, { palette: [0x888888] }, { voxel: 0.1, shade: 1 });
    expect(model.height).toBeCloseTo(1);
    const box = new THREE.Box3().setFromObject(model.root.children[0]);
    expect(box.min.y).toBeCloseTo(0);
    expect(box.min.x).toBeCloseTo(-0.2);
    expect(model.root.getObjectByName('shade')).toBeDefined();
  });

  it('makes people of one look share their meshes', () => {
    const [a, b] = [humanModel(), humanModel()];
    const geometries = (m: Model) => {
      const list: THREE.BufferGeometry[] = [];
      m.root.traverse((o) => (o as THREE.Mesh).isMesh && list.push((o as THREE.Mesh).geometry));
      return list;
    };
    expect(geometries(a).filter((g) => geometries(b).includes(g)).length).toBeGreaterThan(5);
    expect(a.height).toBeCloseTo(0.45);
    expect(bodyPalette(DEFAULT_LOOK)).toHaveLength(BODY_COLOR_COUNT);
  });
});

describe('the visual system', () => {
  it('places a model, turns it toward its facing and eases its motion in as it moves', () => {
    const world = new World();
    const calls: number[] = [];
    const model: Model = { root: new THREE.Group(), height: 1, animate: (_t, motion) => calls.push(motion) };
    const e = world.spawn([Transform, { x: 3, y: 0.5, z: 4, facing: Math.PI / 2 }]);
    world.add(e, VisualComponent, visualOf(model));
    const system = visualSystem(() => 0);
    system.update(world, 1 / 60);
    expect(model.root.position.toArray()).toEqual([3, 0.5, 4]);
    expect(model.root.rotation.y).toBeGreaterThan(0); // (turning toward it)
    for (let i = 0; i < 60; i++) {
      world.read(e, Transform).x += 0.05;
      system.update(world, 1 / 60);
    }
    expect(model.root.rotation.y).toBeCloseTo(Math.PI / 2, 2);
    expect(calls.at(-1)!).toBeGreaterThan(0.95);
  });
});
