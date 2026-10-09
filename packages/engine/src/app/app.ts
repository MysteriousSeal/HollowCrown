// An engine app: the renderer and its stylized look, the scene and its world layers streamed in chunk by chunk, the
// ECS world and its systems, and the frame loop. A game makes one, adds its layers and entities, and starts it.

import * as THREE from 'three';
import { Schedule, World, type Entity, type System } from '../ecs';
import { CAMERA_OFFSET, PostProcessing, type Lights, addLights, computeMovementAxes, createCamera, resizeCamera, stylize, type Stylizer } from '../render';
import { ChunkStreamer, type ChunkLayer } from '../world';
import { TimeOfDay, Transform, facingSystem, hoursPerSecond, interactionSystem, movementSystem, timeOfDaySystem, wanderSystem } from '../gameplay';
import { Keyboard, KeyboardResource, ScreenAxes, playerInputSystem } from '../input';
import type { Model } from '../models';
import { dayNightSystem, type DayNightOptions } from './dayNight';
import { CameraTarget, VisualComponent, visualOf, visualSystem } from './visuals';

const PRESENT_ONLY = ['present'] as const; // (while paused: drawn, nothing moving on)
const MAX_FRAME_DT = 0.1; // seconds: no huge jump after the tab was in the background

export interface AppOptions {
  pixelRatio?: number; // render resolution (1: crisp voxels upscaled pixelated on a 2x screen, a quarter the pixels)
}

export class App {
  readonly world = new World();
  readonly schedule = new Schedule();
  readonly scene = new THREE.Scene();
  readonly camera = createCamera();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly streamer: ChunkStreamer;
  private readonly pixelRatio: number;
  private readonly lights: Lights;
  private stylizer: Stylizer | null = null;
  private post: PostProcessing | null = null;
  private elapsed = 0;
  private pausedNow = false;
  private last = 0;

  constructor(canvas: HTMLCanvasElement, { pixelRatio = 1 }: AppOptions = {}) {
    // The scene renders into the post-processing's multisampled target: canvas antialiasing would be wasted.
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.pixelRatio = pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);
    const upscale = window.devicePixelRatio / pixelRatio;
    canvas.style.imageRendering = upscale > 1 && Number.isInteger(upscale) ? 'pixelated' : 'auto';
    this.lights = addLights(this.scene);
    this.streamer = new ChunkStreamer(this.scene);
    this.world.setResource(KeyboardResource, new Keyboard());
    this.world.setResource(ScreenAxes, computeMovementAxes());
    this.schedule.add(playerInputSystem, interactionSystem, wanderSystem, movementSystem, facingSystem, visualSystem(() => this.elapsed), this.cameraSystem);
  }

  // A layer of the world drawn chunk by chunk round the camera (terrain, trees...).
  addLayer(layer: ChunkLayer): void {
    this.streamer.layer(layer);
  }

  // More systems, run in their stage after the engine's own.
  addSystems(...systems: System[]): void {
    this.schedule.add(...systems);
  }

  // Time moving on (the TimeOfDay resource) and the world lit for the hour: dawn, day, dusk and a dark blue night.
  enableDayNight({ startHour = 17, dayMinutes = 24 }: DayNightOptions = {}): void {
    if (!(dayMinutes > 0)) throw new Error(`enableDayNight: dayMinutes must be above 0, not ${dayMinutes}`);
    this.world.setResource(TimeOfDay, { hours: ((startHour % 24) + 24) % 24, rate: hoursPerSecond(dayMinutes) });
    this.schedule.add(timeOfDaySystem, dayNightSystem(this.lights, this.scene, () => this.post));
  }

  // Paused (a menu open): the input and simulation stop, the time of day with them, while the world stays drawn.
  get paused(): boolean {
    return this.pausedNow;
  }

  pause(): void {
    this.pausedNow = true;
    this.world.resource(KeyboardResource).release();
  }

  resume(): void {
    this.world.resource(KeyboardResource).release(); // (keys pressed in the menu don't carry into the game)
    this.pausedNow = false;
  }

  // `entity` drawn as `model`, placed, turned and animated from its Transform each frame. Shown after the start, its
  // materials are styled as it comes in.
  show(entity: Entity, model: Model): void {
    const facing = this.world.get(entity, Transform)?.facing ?? 0;
    this.world.add(entity, VisualComponent, visualOf(model, facing));
    this.scene.add(model.root);
    if (this.stylizer) this.stylizer.patch(materialsOf(model.root));
  }

  // Everything added is styled (every material patched once, the chunks not built yet too), the first chunks built
  // round the camera's target, and the loop started.
  start(): void {
    this.stylizer = stylize(this.scene, this.streamer.materials()); // (the scene's own, and the chunks' not built yet)
    this.post = new PostProcessing(this.renderer, this.scene, this.camera);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    const target = this.targetTransform();
    if (target) this.streamer.loadAround(target.x, target.z);
    this.last = performance.now();
    requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    const dt = Math.min(MAX_FRAME_DT, (now - this.last) / 1000);
    this.last = now;
    this.elapsed += dt;
    this.schedule.run(this.world, dt, this.pausedNow ? PRESENT_ONLY : undefined);
    this.post?.render(this.elapsed);
    requestAnimationFrame(this.frame);
  };

  // The camera over its target, at the fixed isometric offset; the chunks round it kept built.
  private readonly cameraSystem: System = {
    name: 'camera',
    stage: 'present',
    update: () => {
      const target = this.targetTransform();
      if (!target) return;
      this.camera.position.set(target.x + CAMERA_OFFSET.x, target.y + CAMERA_OFFSET.y, target.z + CAMERA_OFFSET.z);
      this.camera.lookAt(target.x, target.y, target.z);
      this.stylizer?.setFocusHeight(target.y);
      this.streamer.update(target.x, target.z);
    },
  };

  private targetTransform() {
    const target = this.world.first(CameraTarget, Transform);
    return target === undefined ? undefined : this.world.read(target, Transform);
  }

  private resize(): void {
    const [width, height] = [window.innerWidth, window.innerHeight];
    this.renderer.setSize(width, height);
    resizeCamera(this.camera, width, height);
    this.post?.setSize(width, height, this.pixelRatio);
  }
}

// Every material under `root`.
function materialsOf(root: THREE.Object3D): THREE.Material[] {
  const found = new Set<THREE.Material>();
  root.traverse((o) => {
    const material = (o as THREE.Mesh).material;
    for (const m of Array.isArray(material) ? material : material ? [material] : []) found.add(m);
  });
  return [...found];
}
