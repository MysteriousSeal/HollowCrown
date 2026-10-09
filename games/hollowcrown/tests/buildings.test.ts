// Every building of Brindleford builds, stands inside the footprint the map gives it (its props may reach out: a sign
// over the street, the mill's wheel over the river), keeps to a triangle budget, and comes out the same as before.

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { loadWorldMap } from '@voxel/engine/world';
import { placeModel, placesOf } from '../src/buildings';
import { PLACE_KINDS, WORLD_MAP } from '../src/data/world';
import { BRINDLEFORD } from '../src/data/world/brindleford';
import { footprint } from '../src/data/world/kinds';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const drawn = (BRINDLEFORD.places ?? []).filter((p) => p.kind === 'building' || p.kind === 'fixture');
const triangles = (root: THREE.Object3D) => {
  let n = 0;
  root.traverse((o) => {
    const g = (o as THREE.Mesh).isMesh && (o as THREE.Mesh).geometry;
    if (g) n += (g.index?.count ?? g.getAttribute('position').count) / 3;
  });
  return n;
};

describe('Brindleford\'s buildings', () => {
  it('each build into a model', () => {
    for (const p of drawn) expect(placeModel(p), p.id).not.toBeNull();
  });

  it('stand inside their footprints in the world, on the ground', () => {
    const layer = placesOf(map);
    const keys = new Set(drawn.map((p) => `${Math.floor(p.at[0] / 16)},${Math.floor(p.at[1] / 16)}`));
    const objects = [...keys].flatMap((k) => layer.build(k));
    expect(objects.length).toBe(drawn.length);
    for (const p of drawn.filter((d) => d.kind === 'building')) {
      const root = objects.find((o) => o.position.distanceTo(new THREE.Vector3(p.at[0], o.position.y, p.at[1])) < 1.5 && o.rotation.y === (p.facing ?? 0))!;
      root.updateMatrixWorld(true);
      const body = new THREE.Box3().setFromObject((root.children[0] as THREE.Group).children[0]); // (its grid, not its props)
      const f = footprint(p);
      expect(body.min.x, p.id).toBeGreaterThanOrEqual(f.x0 - 0.5 - 0.02);
      expect(body.max.x, p.id).toBeLessThanOrEqual(f.x1 + 0.5 + 0.02);
      expect(body.min.z, p.id).toBeGreaterThanOrEqual(f.z0 - 0.5 - 0.02);
      expect(body.max.z, p.id).toBeLessThanOrEqual(f.z1 + 0.5 + 0.02);
      expect(body.min.y, p.id).toBeCloseTo(map.groundY(...p.at));
    }
  });

  it('keep to a triangle budget, and come out as they did', () => {
    const counts = Object.fromEntries(drawn.map((p) => [p.id, triangles(placeModel(p)!.root)]));
    for (const [id, n] of Object.entries(counts)) expect(n, id).toBeLessThan(14000);
    expect(counts).toMatchSnapshot();
  });

  it('share their meshes where they look alike: fewer builds than buildings', () => {
    const layer = placesOf(map);
    const keys = new Set(drawn.map((p) => `${Math.floor(p.at[0] / 16)},${Math.floor(p.at[1] / 16)}`));
    const geometries = new Set<THREE.BufferGeometry>();
    for (const o of [...keys].flatMap((k) => layer.build(k))) o.traverse((m) => (m as THREE.Mesh).isMesh && geometries.add((m as THREE.Mesh).geometry));
    const meshes = drawn.reduce((n, p) => {
      let count = 0;
      placeModel(p)!.root.traverse((m) => (count += (m as THREE.Mesh).isMesh ? 1 : 0));
      return n + count;
    }, 0);
    expect(geometries.size).toBeLessThan(meshes * 0.8);
  });

  it('turn the mill\'s wheel', () => {
    const mill = placeModel(drawn.find((p) => p.id === 'brindle-mill')!)!;
    const wheel = mill.root.children[0].children.at(-1)!;
    mill.animate(2, 0);
    expect(wheel.rotation.z).toBeCloseTo(-1.8);
  });
});
