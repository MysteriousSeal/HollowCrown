// A world map drawn small, once, for a map screen: the bare land in one color and each surface painted over it in
// order (water, roads, marsh), at a few tiles a pixel. Thin shapes (a road, a stream) are kept at least a pixel wide so
// they don't vanish. And the view onto it: what's centred, how near, where a tile lands on the screen.

import type { Shape, WorldMapData } from '../world';
import { element } from './overlay';

export const MAP_TILES_PER_PIXEL = 4;

// A color as CSS (#rrggbb) from a 0xrrggbb number.
export const cssColor = (color: number): string => `#${color.toString(16).padStart(6, '0')}`;

// Draws `shape` (tiles) onto `g`, scaled so a tile is `scale` pixels, filled (a line: stroked) in `color`.
function paint(g: CanvasRenderingContext2D, shape: Shape, scale: number, color: string): void {
  g.fillStyle = g.strokeStyle = color;
  if ('rect' in shape) {
    const [x0, z0, x1, z1] = shape.rect;
    g.fillRect(Math.min(x0, x1) * scale, Math.min(z0, z1) * scale, (Math.abs(x1 - x0) + 1) * scale, (Math.abs(z1 - z0) + 1) * scale);
    return;
  }
  g.beginPath();
  if ('circle' in shape) {
    const [cx, cz, r] = shape.circle;
    g.arc((cx + 0.5) * scale, (cz + 0.5) * scale, Math.max(r * scale, 0.75), 0, Math.PI * 2);
    g.fill();
    return;
  }
  const points = 'polygon' in shape ? shape.polygon : shape.line;
  points.forEach(([x, z], i) => (i ? g.lineTo : g.moveTo).call(g, (x + 0.5) * scale, (z + 0.5) * scale));
  if ('polygon' in shape) {
    g.closePath();
    g.fill();
    return;
  }
  g.lineWidth = Math.max(shape.width * scale, 1.25);
  g.lineCap = g.lineJoin = 'round';
  g.stroke();
}

// The map's image: `ground` (0xrrggbb) wherever nothing's painted, then its surfaces in their colors, in order.
export function drawMapImage(data: WorldMapData, ground: number, tilesPerPixel = MAP_TILES_PER_PIXEL): HTMLCanvasElement {
  const canvas = element('canvas', 'ui-map-image');
  canvas.width = Math.ceil(data.size.width / tilesPerPixel);
  canvas.height = Math.ceil(data.size.depth / tilesPerPixel);
  const g = canvas.getContext('2d');
  if (!g) return canvas;
  const scale = 1 / tilesPerPixel;
  g.fillStyle = cssColor(ground);
  g.fillRect(0, 0, canvas.width, canvas.height);
  for (const patch of data.surfaces) paint(g, patch.shape, scale, cssColor(data.surfaceKinds[patch.surface]?.color ?? ground));
  return canvas;
}

// The view onto a map: the tile at its centre and its zoom (screen pixels a tile), kept between `min` and `max`.
export class MapView {
  constructor(
    public centerX: number,
    public centerZ: number,
    public zoom: number,
    readonly min = 0.25,
    readonly max = 4,
  ) {
    this.zoom = this.clamp(zoom);
  }

  // Nearer (factor > 1) or farther (< 1); the zoom it's at.
  zoomBy(factor: number): number {
    return (this.zoom = this.clamp(this.zoom * factor));
  }

  // Where tile (x, z) lands on a `width` x `height` screen.
  toScreen(x: number, z: number, width: number, height: number): [number, number] {
    return [width / 2 + (x - this.centerX) * this.zoom, height / 2 + (z - this.centerZ) * this.zoom];
  }

  private clamp(zoom: number): number {
    return Math.min(this.max, Math.max(this.min, zoom));
  }
}
