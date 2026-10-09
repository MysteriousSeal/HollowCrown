// Text that pops up over a spot in the world and floats away (damage dealt: "12"): it rises, held to its spot as the
// camera moves, and fades over its life. Each frame, update() moves them on and takes the spent ones down.

import * as THREE from 'three';
import { element } from './overlay';

export const FLOAT_SECONDS = 0.9;
const RISE = 46; // screen pixels over its life

// Where a floating text is at `age` of `life` seconds: how far it's risen (pixels) and how clear it is (0 to 1). It
// pops in a touch large, rises quickly then slows, and fades over its last half.
export function floatAt(age: number, life = FLOAT_SECONDS): { rise: number; alpha: number; scale: number } {
  const t = Math.min(1, Math.max(0, age / life));
  return { rise: RISE * (1 - (1 - t) ** 2), alpha: t < 0.5 ? 1 : 1 - (t - 0.5) * 2, scale: 1 + 0.35 * Math.max(0, 1 - t * 6) };
}

interface Floating {
  el: HTMLElement;
  at: THREE.Vector3;
  born: number;
  drift: number; // pixels to the side, so blows close together don't overlap
}

export class FloatingText {
  readonly el = element('div', 'ui-floating');
  private readonly live: Floating[] = [];
  private readonly screen = new THREE.Vector3();

  constructor(root: HTMLElement, private readonly camera: THREE.Camera, private readonly life = FLOAT_SECONDS) {
    root.append(this.el);
  }

  // `text` over world point (x, y, z), with the game's `className` (a hit on the hero, a strong blow).
  add(text: string, x: number, y: number, z: number, className = ''): void {
    const el = element('span', `ui-float ${className}`.trim(), text);
    this.el.append(el);
    this.live.push({ el, at: new THREE.Vector3(x, y, z), born: performance.now() / 1000, drift: (Math.random() - 0.5) * 28 });
  }

  // Each on to where it is now; the spent ones gone.
  update(): void {
    if (!this.live.length) return;
    const now = performance.now() / 1000;
    const [width, height] = [window.innerWidth, window.innerHeight];
    this.camera.updateMatrixWorld();
    for (let i = this.live.length - 1; i >= 0; i--) {
      const f = this.live[i];
      const age = now - f.born;
      if (age >= this.life) {
        f.el.remove();
        this.live.splice(i, 1);
        continue;
      }
      const { rise, alpha, scale } = floatAt(age, this.life);
      this.screen.copy(f.at).project(this.camera);
      const [sx, sy] = [((this.screen.x + 1) / 2) * width + f.drift, ((1 - this.screen.y) / 2) * height - rise];
      f.el.style.opacity = alpha.toFixed(2);
      f.el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%) scale(${scale.toFixed(2)})`;
    }
  }
}
