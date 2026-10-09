// View: draws the model, owns nothing of the game's state. The land (its chunks streamed round the hero), the hero,
// EvenHold's look (cel shading, haze, light shafts and bloom), and the isometric camera following the hero.

import * as THREE from 'three';
import type { GameModel } from '../model/GameModel';
import { CAMERA_OFFSET } from './constants';
import { computeMovementAxes, createCamera, resizeCamera, type MovementAxes } from './render/camera';
import { addLights } from './render/lighting';
import { PostProcessing } from './render/postprocessing';
import { stylize, type Stylizer } from './render/stylize';
import { HumanRig } from './meshes/human/humanRig';
import { terrainLayer } from './meshes/terrain/terrainMesh';
import { ChunkStreamer } from './world/chunkStreamer';

// Rendering at 1x (instead of the screen's 2x on Retina displays) draws a quarter of the pixels, and the voxel art
// stays crisp upscaled pixelated.
const PIXEL_RATIO = 1;

export class GameView {
  readonly movementAxes: MovementAxes = computeMovementAxes();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = createCamera();
  private readonly world: ChunkStreamer;
  private readonly hero: HumanRig;
  private readonly stylizer: Stylizer;
  private readonly post: PostProcessing;
  private elapsed = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly model: GameModel,
  ) {
    // The scene renders into the post-processing's multisampled target, so canvas antialiasing would be wasted.
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.renderer.setPixelRatio(PIXEL_RATIO);
    // Upscaling by a whole factor (1x on a 2x screen) stays crisp, like the voxel art; a fractional one would shimmer.
    const upscale = window.devicePixelRatio / PIXEL_RATIO;
    canvas.style.imageRendering = upscale > 1 && Number.isInteger(upscale) ? 'pixelated' : 'auto';

    addLights(this.scene);
    this.world = new ChunkStreamer(this.scene);
    this.world.layer(terrainLayer(model));
    this.hero = new HumanRig(model.hero.look);
    this.scene.add(this.hero.root);
    // The stylized look patches every material in the scene, the world's chunks not built yet too.
    this.stylizer = stylize(this.scene, [...this.world.materials(), this.hero.material]);
    this.post = new PostProcessing(this.renderer, this.scene, this.camera);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.world.loadAround(model.hero.x, model.hero.z);
  }

  update(dt: number): void {
    this.elapsed += dt;
    const { hero } = this.model;
    this.hero.update(hero.x, hero.y, hero.z, dt);
    this.world.update(hero.x, hero.z);
    this.camera.position.set(hero.x + CAMERA_OFFSET.x, hero.y + CAMERA_OFFSET.y, hero.z + CAMERA_OFFSET.z);
    this.camera.lookAt(hero.x, hero.y, hero.z);
    this.stylizer.setFocusHeight(hero.y);
  }

  render(): void {
    this.post.render(this.elapsed);
  }

  private resize(): void {
    const [width, height] = [window.innerWidth, window.innerHeight];
    this.renderer.setSize(width, height);
    resizeCamera(this.camera, width, height);
    this.post.setSize(width, height, PIXEL_RATIO);
  }
}
