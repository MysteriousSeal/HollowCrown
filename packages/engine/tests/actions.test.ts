import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { VisualComponent, visualOf, visualSystem } from '../src/app/visuals';
import { humanModel } from '../src/characters';
import { World } from '../src/ecs';
import { Acting, Dead, Hit, Transform } from '../src/gameplay';
import type { Model, ModelAction } from '../src/models';

describe('acting out', () => {
  it('swings a person\'s arm up and through, and throws them back when hurt', () => {
    const person = humanModel();
    person.animate(1, 0);
    const rest = person.joints.rightArm.rotation.x;
    const upper = person.upper.rotation.x;
    person.animate(1, 0, { name: 'attack', phase: 0.35 });
    expect(person.joints.rightArm.rotation.x).toBeLessThan(rest - 1.5); // (raised)
    person.animate(1, 0, { name: 'attack', phase: 0.65 });
    expect(person.upper.rotation.x).toBeGreaterThan(upper); // (leaning into the blow)
    person.animate(1, 0, { name: 'hurt', phase: 0 });
    expect(person.upper.rotation.x).toBeLessThan(upper);
    person.animate(1, 0);
    expect(person.joints.rightArm.rotation.x).toBeCloseTo(rest);
  });

  it('flashes a model red a moment when it\'s hit, its own materials put back after, and no other model\'s touched', () => {
    const own = new THREE.MeshStandardMaterial();
    const makeModel = (): Model => {
      const root = new THREE.Group();
      root.add(new THREE.Mesh(new THREE.BoxGeometry(), own));
      return { root, height: 1, animate: () => {} };
    };
    const [hit, other] = [makeModel(), makeModel()];
    const world = new World();
    const spawnWith = (model: Model) => {
      const e = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
      world.add(e, VisualComponent, visualOf(model));
      return e;
    };
    const target = spawnWith(hit);
    spawnWith(other);
    const visuals = visualSystem(() => 0);
    const material = (m: Model) => (m.root.children[0] as THREE.Mesh).material;
    world.emit(Hit, { target, by: target, damage: 1 });
    visuals.update(world, 1 / 60);
    world.clearEvents();
    expect(material(hit)).not.toBe(own);
    expect(material(other)).toBe(own);
    for (let i = 0; i < 12; i++) visuals.update(world, 1 / 60);
    expect(material(hit)).toBe(own);
  });

  it('hands models what their entity is acting out, and topples the dead', () => {
    const seen: Array<ModelAction | undefined> = [];
    const model: Model = { root: new THREE.Group(), height: 1, animate: (_t, _m, action) => seen.push(action) };
    const world = new World();
    const e = world.spawn([Transform, { x: 0, y: 0, z: 0, facing: 0 }]);
    world.add(e, VisualComponent, visualOf(model));
    world.add(e, Acting, { action: 'attack', time: 0.1, duration: 0.4 });
    const visuals = visualSystem(() => 0);
    visuals.update(world, 1 / 60);
    expect(seen.at(-1)).toEqual({ name: 'attack', phase: 0.25 });
    world.remove(e, Acting);
    world.add(e, Dead, { since: 0 });
    for (let i = 0; i < 60; i++) visuals.update(world, 1 / 60);
    expect(seen.at(-1)).toBeUndefined();
    expect(model.root.rotation.z).toBeGreaterThan(1.5);
  });
});
