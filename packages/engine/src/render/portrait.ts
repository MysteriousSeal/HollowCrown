// Portraits: a model drawn alone on its own canvas, for a dialogue screen. Head and shoulders (or the full body),
// turned three-quarters to the right (the hero) or the left (who they're talking to), in the engine's light and
// stylized look, on a transparent background. One shared offscreen renderer draws every portrait, then each is
// copied onto its own canvas; a living portrait is redrawn each frame so its idle animation breathes, but only
// while its canvas is on the page and the page is visible.
//
// The model must be one made for the portrait: a model's root has one parent, so one already in the game's scene
// would be taken out of it.

import * as THREE from 'three';
import type { Model } from '../models';
import { addLights } from './lighting';
import { stylize } from './stylize';

export type PortraitFraming = 'head' | 'full';

export interface PortraitOptions {
  width?: number; // pixels (default 512)
  height?: number; // pixels (default 768)
  framing?: PortraitFraming; // default 'head': head and shoulders
  facing?: 'right' | 'left'; // which way it's turned on screen (default 'right')
  animate?: boolean; // keep redrawing it so it breathes (default false: drawn once)
}

const TURN = 0.6; // radians: a three-quarter view
const TILT = 0.12; // radians: the camera a little above, looking slightly down
const HEAD_SHARE = 0.5; // head and shoulders: the top half of the model
const MARGIN = 0.06; // of the view's height, above its head (and round a full body)
const WIDTH_MARGIN = 1.15; // the model's width times this must fit across

// What the view takes in: its height (world units) and the height its centre is at.
export interface Framing {
  viewHeight: number;
  centerY: number;
}

// The view framing a model `height` tall and `width` across, on a canvas of `aspect` (width / height).
export function portraitFraming(height: number, width: number, aspect: number, framing: PortraitFraming): Framing {
  if (!(height > 0) || !(aspect > 0)) throw new Error(`portraitFraming: height and aspect must be above 0`);
  const shown = framing === 'head' ? height * HEAD_SHARE : height;
  let viewHeight = shown * (1 + MARGIN * (framing === 'head' ? 1 : 2));
  viewHeight = Math.max(viewHeight, (width * WIDTH_MARGIN) / aspect);
  const top = height + viewHeight * MARGIN;
  return { viewHeight, centerY: framing === 'head' ? top - viewHeight / 2 : Math.max(top - viewHeight / 2, height / 2) };
}

interface Portrait {
  model: Model;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  animate: boolean;
}

let renderer: THREE.WebGLRenderer | null = null;
const living = new Set<Portrait>();
const byCanvas = new WeakMap<HTMLCanvasElement, Portrait>();
let looping = false;
let started = performance.now();

function sharedRenderer(): THREE.WebGLRenderer {
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ canvas: document.createElement('canvas'), alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    started = performance.now();
  }
  return renderer;
}

function draw(p: Portrait, time: number): void {
  const r = sharedRenderer();
  const { width, height } = p.canvas;
  const size = r.getSize(new THREE.Vector2());
  if (size.x !== width || size.y !== height) r.setSize(width, height, false);
  p.model.animate(time, 0);
  r.render(p.scene, p.camera);
  p.context.clearRect(0, 0, width, height);
  p.context.drawImage(r.domElement, 0, 0);
}

function loop(): void {
  if (living.size === 0) {
    looping = false;
    return;
  }
  const time = (performance.now() - started) / 1000;
  if (!document.hidden) for (const p of living) if (p.canvas.isConnected) draw(p, time);
  requestAnimationFrame(loop);
}

// Every mesh's bounds, but the shade under it.
function boundsOf(root: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (o.name === 'shade' || !(o as THREE.Mesh).isMesh) return;
    let skip = false;
    for (let a: THREE.Object3D | null = o; a; a = a.parent) if (a.name === 'shade') skip = true;
    if (!skip) box.expandByObject(o);
  });
  return box;
}

// `model` drawn on a new canvas (see PortraitOptions). Release it with releasePortrait when it's no longer needed.
export function renderPortrait(model: Model, { width = 512, height = 768, framing = 'head', facing = 'right', animate = false }: PortraitOptions = {}): HTMLCanvasElement {
  if (!(width > 0 && height > 0)) throw new Error(`renderPortrait: size must be above 0, not ${width}x${height}`);
  const scene = new THREE.Scene();
  addLights(scene);
  scene.add(model.root);
  stylize(scene); // the cel bands (its haze and mist need fog, which a portrait has none of)
  scene.fog = null;
  scene.background = null;
  model.root.position.set(0, 0, 0);
  model.root.rotation.set(0, facing === 'right' ? TURN : -TURN, 0);
  const shade = model.root.getObjectByName('shade');
  if (shade) shade.visible = false;

  const box = boundsOf(model.root);
  const across = Math.max(box.max.x - box.min.x, 0.1);
  const { viewHeight, centerY } = portraitFraming(model.height, across, width / height, framing);
  const viewWidth = viewHeight * (width / height);
  const camera = new THREE.OrthographicCamera(-viewWidth / 2, viewWidth / 2, viewHeight / 2, -viewHeight / 2, 0.1, 100);
  const centerX = (box.max.x + box.min.x) / 2;
  camera.position.set(centerX, centerY + Math.tan(TILT) * 20, 20);
  camera.lookAt(centerX, centerY, 0);

  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [width, height];
  const context = canvas.getContext('2d');
  if (!context) throw new Error('renderPortrait: no 2D context');
  const portrait: Portrait = { model, scene, camera, canvas, context, animate };
  byCanvas.set(canvas, portrait);
  draw(portrait, 0);
  if (animate) {
    living.add(portrait);
    if (!looping) {
      looping = true;
      requestAnimationFrame(loop);
    }
  }
  return canvas;
}

// A portrait no longer redrawn, its model let go.
export function releasePortrait(canvas: HTMLCanvasElement): void {
  const portrait = byCanvas.get(canvas);
  if (!portrait) return;
  living.delete(portrait);
  byCanvas.delete(canvas);
  portrait.scene.remove(portrait.model.root);
}
