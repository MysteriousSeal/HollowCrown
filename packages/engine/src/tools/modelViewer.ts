// A model viewer (a dev tool): every creature model of a game in a lineup, in the engine's light and look, a human
// beside the one in focus for scale. Left/right pick a model; W walks them; space stops the turning; Z zooms in and
// out; A frames the whole lineup.

import * as THREE from 'three';
import { CAMERA_OFFSET, TERRAIN_COLORS } from '../render/constants';
import { createCamera, resizeCamera } from '../render/camera';
import { addLights } from '../render/lighting';
import { PostProcessing } from '../render/postprocessing';
import { stylize } from '../render/stylize';
import { HumanRig } from '../characters/human/humanRig';
import type { CreatureModel } from '../characters/creatures/creatureMesh';

// A model the viewer shows: its name, the group it's listed under, and how it's made.
export interface ViewerEntry {
  name: string;
  group: string;
  make(): CreatureModel;
}

// Runs the viewer on `canvas`, its caption in `label`.
export function startModelViewer(canvas: HTMLCanvasElement, label: HTMLElement, entries: readonly ViewerEntry[]): void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(1);
  const scene = new THREE.Scene();
  const camera = createCamera();
  addLights(scene);

  // Along the screen's right, so the lineup reads left to right.
  const RIGHT = new THREE.Vector3(1, 0, -1).normalize();
  const GAP = 0.35;

  const ground = new THREE.Mesh(new THREE.BoxGeometry(60, 0.2, 60), new THREE.MeshStandardMaterial({ color: TERRAIN_COLORS[2], roughness: 1 }));
  ground.position.y = -0.1;
  scene.add(ground);

  interface Shown {
    model: CreatureModel;
    turn: THREE.Group;
    at: THREE.Vector3;
    name: string;
  }
  let along = 0;
  const shown: Shown[] = entries.map(({ name, make }) => {
    const model = make();
    const turn = new THREE.Group();
    turn.add(model.root);
    const width = Math.max(0.5, model.height * 0.9);
    along += width / 2;
    const at = RIGHT.clone().multiplyScalar(along);
    along += width / 2 + GAP;
    turn.position.copy(at);
    scene.add(turn);
    return { model, turn, at, name };
  });

  const hero = new HumanRig();
  scene.add(hero.root);
  const stylizer = stylize(scene);
  const post = new PostProcessing(renderer, scene, camera);

  let selected = 0;
  let walking = false;
  let turning = true;
  let zoom = 3.2;
  let whole = false;
  const focus = new THREE.Vector3();

  function showLabel(): void {
    const s = shown[selected];
    const entry = entries[selected];
    label.innerHTML = `${s.name} <small>${selected + 1} / ${shown.length} · ${entry.group}<br>` +
      `← → pick · W walk${walking ? ' (on)' : ''} · space turn · Z zoom · A all</small>`;
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') selected = (selected + 1) % shown.length;
    else if (e.key === 'ArrowLeft') selected = (selected + shown.length - 1) % shown.length;
    else if (e.key === 'w' || e.key === 'W') walking = !walking;
    else if (e.key === ' ') turning = !turning;
    else if (e.key === 'z' || e.key === 'Z') zoom = zoom > 2 ? 1.4 : zoom > 1.2 ? 5 : 3.2;
    else if (e.key === 'a' || e.key === 'A') whole = !whole;
    else return;
    e.preventDefault();
    showLabel();
  });

  function resize(): void {
    const [w, h] = [window.innerWidth, window.innerHeight];
    renderer.setSize(w, h);
    resizeCamera(camera, w, h);
    post.setSize(w, h, 1);
  }
  window.addEventListener('resize', resize);
  resize();
  showLabel();

  const clock = new THREE.Clock();
  let time = 0;
  let walk = 0;
  function frame(): void {
    const dt = Math.min(0.05, clock.getDelta());
    time += dt;
    walk += ((walking ? 1 : 0) - walk) * Math.min(1, dt * 6);
    for (const s of shown) {
      s.model.animate(time, walk);
      if (turning) s.turn.rotation.y += dt * 0.5;
    }
    // The hero stands just left of the one in focus, facing the camera.
    const s = shown[selected];
    const heroAt = s.at.clone().addScaledVector(RIGHT, -Math.max(0.35, s.model.height * 0.55)).add(new THREE.Vector3(0.15, 0, 0.15));
    hero.update(heroAt.x, 0, heroAt.z, dt);
    hero.root.rotation.y = Math.PI / 4;

    const target = whole ? RIGHT.clone().multiplyScalar(along / 2) : s.at.clone().setY(s.model.height * 0.4);
    focus.lerp(target, Math.min(1, dt * 5));
    if (focus.distanceTo(target) > 2) focus.copy(target); // (a far pick: there at once, not a long slide)
    const wantZoom = whole ? Math.min(3.2, 16 / along) : zoom / Math.max(0.6, s.model.height / 0.45) ** 0.6;
    camera.zoom += (wantZoom - camera.zoom) * Math.min(1, dt * 5);
    camera.updateProjectionMatrix();
    camera.position.copy(focus).add(CAMERA_OFFSET);
    camera.lookAt(focus);
    stylizer.setFocusHeight(focus.y);
    post.render(time);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
