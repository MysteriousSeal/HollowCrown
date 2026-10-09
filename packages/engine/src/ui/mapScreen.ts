// A map screen over the scene: a framed panel with the map's image (drawMapImage), areas named across it, places as
// small marks (and their names once near enough), and the hero as an arrow the way they face; centred on the hero,
// zoomed with the wheel (or zoomBy). What's marked and how is the game's; opening it (a key) too.

import { MapView, cssColor } from './mapImage';
import { element } from './overlay';

export type MarkShape = 'circle' | 'square' | 'diamond' | 'triangle';

// A place's mark: its shape and color (0xrrggbb), and its name.
export interface MapMark {
  x: number;
  z: number;
  shape: MarkShape;
  color: number;
  name?: string;
}

// A name written across an area (a region), at its middle.
export interface MapLabel {
  x: number;
  z: number;
  text: string;
}

export const NAMES_FROM_ZOOM = 1; // places' names are written from this zoom in (screen pixels a tile)
const FONT = "'Fredoka', system-ui, sans-serif";
const INK = '#2e1f14';

export class MapScreen {
  readonly el = element('div', 'ui-map');
  readonly view: MapView;
  private readonly canvas = element('canvas', 'ui-map-canvas');
  private readonly title = element('b', 'ui-map-title');
  private labels: MapLabel[] = [];
  private marks: MapMark[] = [];
  private hero: [number, number, number] = [0, 0, 0];

  constructor(root: HTMLElement, private readonly image: HTMLCanvasElement, private readonly tilesPerPixel: number, zoom = 0.5) {
    const panel = element('div', 'ui-map-panel');
    const hint = element('small', 'ui-map-hint', 'Wheel · zoom    M · close');
    panel.append(this.title, this.canvas, hint);
    this.el.append(panel);
    this.el.hidden = true;
    root.append(this.el);
    this.view = new MapView(0, 0, zoom);
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.zoomBy(event.deltaY < 0 ? 1.25 : 0.8);
    }, { passive: false });
  }

  get isOpen(): boolean {
    return !this.el.hidden;
  }

  // What's on it: the areas' names and the places' marks.
  setContent(labels: MapLabel[], marks: MapMark[]): void {
    [this.labels, this.marks] = [labels, marks];
    if (this.isOpen) this.draw();
  }

  // The heading over the map (the region the hero's in, say).
  setTitle(text: string): void {
    this.title.textContent = text;
  }

  // Where the hero is (tiles) and faces (radians, 0 toward +z); the view follows.
  setHero(x: number, z: number, facing: number): void {
    const [hx, hz, hf] = this.hero;
    if (hx === x && hz === z && hf === facing) return;
    this.hero = [x, z, facing];
    [this.view.centerX, this.view.centerZ] = [x, z];
    if (this.isOpen) this.draw();
  }

  open(): void {
    this.el.hidden = false;
    this.draw();
  }

  close(): void {
    this.el.hidden = true;
  }

  toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  zoomBy(factor: number): void {
    this.view.zoomBy(factor);
    if (this.isOpen) this.draw();
  }

  // The map redrawn at the canvas's size on the page.
  private draw(): void {
    const { canvas, view } = this;
    const ratio = window.devicePixelRatio || 1;
    const [width, height] = [canvas.clientWidth, canvas.clientHeight];
    if (!width || !height) return;
    [canvas.width, canvas.height] = [Math.round(width * ratio), Math.round(height * ratio)];
    const g = canvas.getContext('2d');
    if (!g) return;
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.fillStyle = '#1e140d';
    g.fillRect(0, 0, width, height);

    // The image, a pixel of it `tilesPerPixel` tiles: kept blocky when near.
    g.imageSmoothingEnabled = view.zoom * this.tilesPerPixel < 2;
    const [ox, oz] = view.toScreen(0, 0, width, height);
    const s = view.zoom * this.tilesPerPixel;
    g.drawImage(this.image, ox, oz, this.image.width * s, this.image.height * s);

    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    // Areas' names, large and spaced, in gold.
    g.font = `700 ${Math.round(Math.min(26, Math.max(13, view.zoom * 40)))}px ${FONT}`;
    for (const { x, z, text } of this.labels) {
      const [sx, sz] = view.toScreen(x, z, width, height);
      this.text(g, text.toUpperCase().split('').join(' '), sx, sz, '#e8c27a', 4);
    }
    // Places' marks, and their names once near enough.
    g.font = `600 13px ${FONT}`;
    for (const mark of this.marks) {
      const [sx, sz] = view.toScreen(mark.x + 0.5, mark.z + 0.5, width, height);
      if (sx < -20 || sz < -20 || sx > width + 20 || sz > height + 20) continue;
      this.mark(g, mark, sx, sz);
      if (mark.name && view.zoom >= NAMES_FROM_ZOOM) this.text(g, mark.name, sx, sz + 14, '#f8ecd4', 3);
    }
    this.arrow(g, ...view.toScreen(this.hero[0] + 0.5, this.hero[1] + 0.5, width, height), this.hero[2]);
  }

  private text(g: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, outline: number): void {
    g.lineWidth = outline;
    g.strokeStyle = INK;
    g.strokeText(text, x, y);
    g.fillStyle = color;
    g.fillText(text, x, y);
  }

  private mark(g: CanvasRenderingContext2D, { shape, color }: MapMark, x: number, y: number): void {
    const r = 5;
    g.beginPath();
    if (shape === 'circle') g.arc(x, y, r, 0, Math.PI * 2);
    else if (shape === 'square') g.rect(x - r, y - r, r * 2, r * 2);
    else if (shape === 'diamond') [[0, -r - 1], [r + 1, 0], [0, r + 1], [-r - 1, 0]].forEach(([dx, dy], i) => (i ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy)));
    else [[0, -r - 1], [r + 1, r], [-r - 1, r]].forEach(([dx, dy], i) => (i ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy)));
    g.closePath();
    g.fillStyle = cssColor(color);
    g.fill();
    g.lineWidth = 2;
    g.strokeStyle = INK;
    g.stroke();
  }

  // The hero: an ember arrow pointing the way they face.
  private arrow(g: CanvasRenderingContext2D, x: number, y: number, facing: number): void {
    const [dx, dy] = [Math.sin(facing), Math.cos(facing)];
    const tip = (a: number, b: number): [number, number] => [x + dx * a - dy * b, y + dy * a + dx * b];
    g.beginPath();
    g.moveTo(...tip(11, 0));
    g.lineTo(...tip(-7, 7));
    g.lineTo(...tip(-3, 0));
    g.lineTo(...tip(-7, -7));
    g.closePath();
    g.fillStyle = '#ffb347';
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = INK;
    g.stroke();
  }
}
