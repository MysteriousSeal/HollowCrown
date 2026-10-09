// Labels floating over things in the world (a villager's name over their head): each frame, the ones to show and
// where they are in the world, put on the screen through the camera, faded as given. A label's element is kept while
// it's shown and dropped once it's not.

import * as THREE from 'three';
import { element } from './overlay';

export interface WorldLabel {
  key: string | number; // the same thing's label keeps its key from frame to frame
  text: string;
  x: number;
  y: number;
  z: number;
  alpha: number; // 0 (gone) to 1
}

// How clear a label is at `distance`: whole up to `near`, fading to nothing at `far`.
export function fadeByDistance(distance: number, near: number, far: number): number {
  if (distance <= near) return 1;
  if (distance >= far) return 0;
  return 1 - (distance - near) / (far - near);
}

export class WorldLabels {
  readonly el = element('div', 'ui-world-labels');
  private readonly shown = new Map<string | number, HTMLElement>();
  private readonly at = new THREE.Vector3();

  constructor(root: HTMLElement, private readonly camera: THREE.Camera, private readonly className = 'ui-world-label') {
    root.append(this.el);
  }

  // This frame's labels (any not given: taken down).
  show(labels: WorldLabel[]): void {
    const [width, height] = [window.innerWidth, window.innerHeight];
    const seen = new Set<string | number>();
    this.camera.updateMatrixWorld(); // (where it is this frame, not as last drawn)
    for (const label of labels) {
      this.at.set(label.x, label.y, label.z).project(this.camera);
      if (label.alpha <= 0 || this.at.z > 1 || Math.abs(this.at.x) > 1.1 || Math.abs(this.at.y) > 1.1) continue;
      seen.add(label.key);
      let el = this.shown.get(label.key);
      if (!el) {
        el = element('div', this.className);
        this.el.append(el);
        this.shown.set(label.key, el);
      }
      if (el.textContent !== label.text) el.textContent = label.text;
      el.style.opacity = label.alpha.toFixed(2);
      el.style.transform = `translate(${((this.at.x + 1) / 2) * width}px, ${((1 - this.at.y) / 2) * height}px) translate(-50%, -100%)`;
    }
    for (const [key, el] of this.shown) {
      if (seen.has(key)) continue;
      el.remove();
      this.shown.delete(key);
    }
  }
}
