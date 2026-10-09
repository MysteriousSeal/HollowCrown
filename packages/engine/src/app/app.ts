// An engine app: the renderer and its stylized look, the scene and its world layers streamed in chunk by chunk, the
// ECS world and its systems, and the frame loop. A game makes one, adds its layers and entities, and starts it.

import * as THREE from 'three';
import { Schedule, World, type Entity, type System } from '../ecs';
import { CAMERA_OFFSET } from '../render/constants';
import { computeMovementAxes, createCamera, resizeCamera } from '../render/camera';
import { addLights } from '../render/lighting';
import { PostProcessing } from '../render/postprocessing';
import { stylize, type Stylizer } from '../render/stylize';
import type { ChunkLayer } from '../world/chunkLayer';
import { ChunkStreamer } from '../world/chunkStreamer';
import { Transform } from '../gameplay/components';
import { movementSystem } from '../gameplay/movement';
import { Keyboard, KeyboardResource } from '../input/keyboard';
import { ScreenAxes, playerInputSystem } from '../input/playerInput';
import { CameraTarget, VisualComponent, type Visual } from './visuals';

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
  private readonly materials: THREE.Material[] = [];
  private readonly pixelRatio: number;
  private stylizer: Stylizer | null = null;
  private post: PostProcessing | null = null;
  private elapsed = 0;
  private last = 0;

  constructor(canvas: HTMLCanvasElement, { pixelRatio = 1 }: AppOptions = {}) {
    // The scene renders into the post-processing's multisampled target: canvas antialiasing would be wasted.
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.pixelRatio = pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);
    const upscale = window.devicePixelRatio / pixelRatio;
    canvas.style.imageRendering = upscale > 1 && Number.isInteger(upscale) ? 'pixelated' : 'auto';
    addLights(this.scene);
    this.streamer = new ChunkStreamer(this.scene);
    this.world.setResource(KeyboardResource, new Keyboard());
    this.world.setResource(ScreenAxes, computeMovementAxes());
    this.schedule.add(playerInputSystem, movementSystem, this.visualSystem, this.cameraSystem);
  }

  // A layer of the world drawn chunk by chunk round the camera (terrain, trees...).
  addLayer(layer: ChunkLayer): void {
    this.streamer.layer(layer);
  }

  // More systems, run in their stage after the engine's own.
  addSystems(...systems: System[]): void {
    this.schedule.add(...systems);
  }

  // `entity` drawn as `visual`, placed from its Transform each frame.
  show(entity: Entity, visual: Visual): void {
    this.world.add(entity, VisualComponent, visual);
    this.scene.add(visual.object);
    this.materials.push(...visual.materials);
  }

  // Everything added is styled (every material patched once, the chunks not built yet too), the first chunks built
  // round the camera's target, and the loop started.
  start(): void {
    this.stylizer = stylize(this.scene, [...this.streamer.materials(), ...this.materials]);
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
    this.schedule.run(this.world, dt);
    this.post?.render(this.elapsed);
    requestAnimationFrame(this.frame);
  };

  // Every visual placed where its entity stands.
  private readonly visualSystem: System = {
    name: 'visuals',
    stage: 'present',
    update: (world, dt) => {
      for (const entity of world.query(VisualComponent, Transform)) {
        const { x, y, z } = world.read(entity, Transform);
        world.read(entity, VisualComponent).update(x, y, z, dt);
      }
    },
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
