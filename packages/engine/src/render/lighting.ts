import * as THREE from 'three';
import { GROUND_BOUNCE_COLOR, SKY_COLOR, SKY_INTENSITY, SUN_COLOR, SUN_DIRECTION, SUN_INTENSITY } from './constants';

// The scene's two lights, for whatever changes them (the day and night).
export interface Lights {
  readonly sky: THREE.HemisphereLight;
  readonly sun: THREE.DirectionalLight;
}

const SUN_DISTANCE = 30;

// Soft, diffuse daylight: a strong sky/ground hemisphere fill does most of
// the work, and a warm sun adds the cel-shaded bands on top.
export function addLights(scene: THREE.Scene): Lights {
  const sky = new THREE.HemisphereLight(SKY_COLOR, GROUND_BOUNCE_COLOR, SKY_INTENSITY);
  scene.add(sky);

  const sun = new THREE.DirectionalLight(SUN_COLOR, SUN_INTENSITY);
  placeSun(sun, SUN_DIRECTION);
  scene.add(sun);
  return { sky, sun };
}

// The sun put in the sky along `direction` (toward the sun; it shines on its target, the origin).
export function placeSun(sun: THREE.DirectionalLight, direction: THREE.Vector3): void {
  sun.position.copy(direction).multiplyScalar(SUN_DISTANCE);
}
