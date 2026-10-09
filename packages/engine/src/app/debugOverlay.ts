// A debug overlay (for development): small monospace labels in the bottom-left corner, refreshed twice a second so
// they're readable. Frames a second and the work a frame takes, what the GPU was asked to draw, the chunks streamed
// in, the entities, where the camera's target stands, and the time of day.

const REFRESH_SECONDS = 0.5;

// What the overlay shows, gathered by the app each refresh.
export interface DebugStats {
  fps: number;
  frameMs: number; // the frame's own work (systems and render), averaged
  drawCalls: number;
  triangles: number;
  chunksLoaded: number;
  chunksPending: number;
  entities: number;
  at: { x: number; z: number; tier: number; surface: string } | null; // the camera target's tile
  hours: number | null; // the time of day, if it moves
}

// The overlay's lines, one a label.
export function debugLines(s: DebugStats): string[] {
  const lines = [
    `fps: ${Math.round(s.fps)} · ${s.frameMs.toFixed(1)} ms`,
    `${s.drawCalls} draws · ${(s.triangles / 1e6).toFixed(2)}M tris`,
    `chunks: ${s.chunksLoaded} loaded · ${s.chunksPending} pending · ${s.entities} entities`,
  ];
  if (s.at) lines.push(`tile ${s.at.x}, ${s.at.z} · tier ${s.at.tier} · ${s.at.surface}`);
  if (s.hours !== null) lines.push(`time ${clockOf(s.hours)}`);
  return lines;
}

// Hours as a clock, 24-hour ("07:05").
export function clockOf(hours: number): string {
  const minutes = Math.floor((((hours % 24) + 24) % 24) * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export class DebugOverlay {
  private readonly root = document.createElement('div');
  private frames = 0;
  private workMs = 0;
  private windowStart = performance.now();

  constructor(private readonly gather: () => Omit<DebugStats, 'fps' | 'frameMs'>) {
    Object.assign(this.root.style, {
      position: 'fixed',
      bottom: '10px',
      left: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '4px',
      pointerEvents: 'none',
      zIndex: '1000',
    });
    document.body.appendChild(this.root);
  }

  // A frame ran, its own work taking `workMs`.
  frame(workMs: number): void {
    this.frames++;
    this.workMs += workMs;
    const now = performance.now();
    const elapsed = (now - this.windowStart) / 1000;
    if (elapsed < REFRESH_SECONDS) return;
    const lines = debugLines({ ...this.gather(), fps: this.frames / elapsed, frameMs: this.workMs / this.frames });
    while (this.root.children.length > lines.length) this.root.lastChild!.remove();
    while (this.root.children.length < lines.length) this.root.appendChild(label());
    lines.forEach((text, i) => (this.root.children[i].textContent = text));
    [this.frames, this.workMs, this.windowStart] = [0, 0, now];
  }
}

function label(): HTMLDivElement {
  const div = document.createElement('div');
  Object.assign(div.style, {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#e8e8e8',
    background: 'rgba(0, 0, 0, 0.35)',
    padding: '4px 8px',
    borderRadius: '4px',
  });
  return div;
}
