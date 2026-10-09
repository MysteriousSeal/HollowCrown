// A soft square of shade on the ground under a model (two squares, the inner one darker), square to the world: where
// nothing else casts a shadow, it sets a figure apart from the ground.

import * as THREE from 'three';

export const SHADE = [
  { size: 0.36, opacity: 0.16 },
  { size: 0.24, opacity: 0.2 },
].map(({ size, opacity }) => ({
  geometry: new THREE.PlaneGeometry(size, size).rotateX(-Math.PI / 2),
  material: new THREE.MeshBasicMaterial({ color: 0x1a1008, transparent: true, opacity, depthWrite: false }),
}));

// The shade under `root`, `scale` times as wide (in a group of its own, kept square to the world: shadeOf).
export function addShade(root: THREE.Object3D, scale = 1): THREE.Group {
  const shade = new THREE.Group();
  shade.name = 'shade';
  SHADE.forEach(({ geometry, material }, i) => {
    const square = new THREE.Mesh(geometry, material);
    square.position.y = 0.004 + i * 0.002;
    square.scale.setScalar(scale);
    shade.add(square);
  });
  root.add(shade);
  return shade;
}
