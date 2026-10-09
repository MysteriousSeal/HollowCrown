// Every creature of the Vale builds, poses, stands on the ground, and keeps its shape: its height, how many triangles
// it's drawn with, and its bounds, snapshotted (a change to a model shows up here, to be accepted on purpose).

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { CREATURES } from '../src/creatures';

const round = (n: number) => Math.round(n * 1000) / 1000;

function measure(root: THREE.Object3D): { triangles: number; min: number[]; max: number[] } {
  root.updateMatrixWorld(true);
  let triangles = 0;
  const box = new THREE.Box3();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    if (mesh.geometry.type === 'PlaneGeometry') return; // (the shade square under its feet)
    triangles += (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3;
    box.expandByObject(mesh);
  });
  return { triangles, min: box.min.toArray().map(round), max: box.max.toArray().map(round) };
}

describe('creatures', () => {
  it('has a unique id for every model', () => {
    const ids = CREATURES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const entry of CREATURES) {
    it(`${entry.id}: builds, poses and keeps its shape`, () => {
      const model = entry.make();
      expect(model.height).toBeGreaterThan(entry.id.startsWith('butterfly') || entry.id === 'moth' ? 0.03 : 0.1); // (the smallest life, small)
      model.animate(0, 0);
      const standing = measure(model.root);
      expect(standing.triangles).toBeGreaterThan(20);
      if (entry.id !== 'rook' && entry.id !== 'rookLeader' && entry.id !== 'rookFlock') expect(standing.min[1]).toBeGreaterThan(-0.06); // (on the ground, not in it)
      expect({ height: round(model.height), ...standing }).toMatchSnapshot();
      for (const t of [0.4, 1.3, 2.9]) model.animate(t, 1); // (walking: no throw, no NaN)
      for (const name of ['graze', 'alert', 'sitUp', 'bound', 'sniff', 'tailWag', 'peck', 'preen', 'flutter', 'lookRound']) for (const phase of [0.3, 0.7]) model.animate(1, 0, { name, phase }); // (its gestures, if it has them)
      model.root.updateMatrixWorld(true);
      model.root.traverse((o) => expect(Number.isFinite(o.matrixWorld.elements[13])).toBe(true));
    });
  }
});
