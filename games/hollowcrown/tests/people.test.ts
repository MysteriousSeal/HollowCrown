// Every named person of the Vale builds, poses, stands on the ground, and keeps their shape: height, triangles and
// bounds snapshotted (a change to a model shows up here, to be accepted on purpose), drawn in about what the
// fighting people are (creatures/peopleVoxels.ts).

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { PEOPLE, personId } from '../src/people';
import { RUSTY_KNIFE, strangerModel } from '../src/people/stranger';
import { GESTURES } from '../src/people/gestures';
import type { FrameModel } from '@voxel/engine/characters';

const round = (n: number) => Math.round(n * 1000) / 1000;

function measure(root: THREE.Object3D): { triangles: number; min: number[]; max: number[] } {
  root.updateMatrixWorld(true);
  let triangles = 0;
  const box = new THREE.Box3();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || mesh.geometry.type === 'PlaneGeometry') return; // (the shade square under the feet)
    triangles += (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3;
    box.expandByObject(mesh);
  });
  return { triangles, min: box.min.toArray().map(round), max: box.max.toArray().map(round) };
}

describe('people', () => {
  it('keys each person by their own name, every id unique', () => {
    for (const [key, person] of Object.entries(PEOPLE)) expect(person.name).toBe(key);
    const ids = Object.keys(PEOPLE).map(personId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  const models = Object.values(PEOPLE).flatMap((p) => [{ name: p.name, make: p.make }, ...Object.entries(p.variants ?? {}).map(([v, make]) => ({ name: `${p.name} (${v})`, make }))]);
  models.push({ name: 'The Stranger (the hero)', make: () => strangerModel() });
  models.push({ name: 'The Stranger, with the rusty knife', make: () => strangerModel(undefined, undefined, { rightArm: RUSTY_KNIFE }) });
  for (const person of models) {
    it(`${person.name}: builds, poses and keeps their shape`, () => {
      const model = person.make();
      expect(model.height).toBeGreaterThan(0.25);
      model.animate(0, 0);
      const standing = measure(model.root);
      expect(standing.triangles).toBeGreaterThan(600);
      expect(standing.triangles).toBeLessThan(2600); // (about the fighting people's)
      expect(standing.min[1]).toBeGreaterThan(-0.06); // (on the ground, not in it)
      expect({ height: round(model.height), ...standing }).toMatchSnapshot();
      for (const t of [0.4, 1.3, 2.9]) model.animate(t, 1); // (walking: no throw, no NaN)
      for (const phase of [0, 0.3, 0.7, 1]) model.animate(1, 0, { name: 'attack', phase }); // (and swinging)
      model.root.updateMatrixWorld(true);
      model.root.traverse((o) => expect(Number.isFinite(o.matrixWorld.elements[13])).toBe(true));
    });
  }

  for (const [name, gesture] of Object.entries(GESTURES)) {
    it(`gesture ${name}: starts and ends at rest, and never lifts a foot off the ground`, () => {
      const m = PEOPLE['Garrick Fenn'].make() as FrameModel;
      m.animate(1, 0);
      const rest = m.joints.rightArm.rotation.x;
      for (const phase of [0, 0.25, 0.5, 0.75, 1]) {
        m.animate(1, 0);
        gesture(m, phase);
        expect(measure(m.root).min[1]).toBeGreaterThan(-0.06);
      }
      m.animate(1, 0);
      gesture(m, 1);
      expect(m.joints.rightArm.rotation.x).toBeCloseTo(rest, 5);
      m.animate(1, 0, { name, phase: 0.5 }); // (and through the engine's action hook)
    });
  }
});
