// The game's sound: one WebAudio context (made on the player's first key or click, as browsers require), a master
// volume and mute, sound effects placed in the world (panned and fading with distance from the listener), and the
// ambience bed: wind and a river as looping noise, birds, crickets and owls as calls now and then, mixed by the hour
// and the place.

import { RECIPES, noiseBed } from './sfx';
import { spatialMix, type AmbienceMix } from './mix';

export interface PlayOptions {
  at?: { x: number; z: number }; // where in the world (none: everywhere, as a UI sound)
  volume?: number; // 0 .. 1 (default 1)
  pitch?: number; // default 1, varied a little
}

const CALLS: ReadonlyArray<readonly [keyof AmbienceMix, string, number, number]> = [
  // layer, voice, seconds between calls (least, most) at full mix
  ['birds', 'chirp', 0.4, 2.5],
  ['crickets', 'cricket', 0.3, 0.9],
  ['owls', 'hoot', 7, 16],
];
const RAMP = 1.5; // seconds for the ambience to follow a new mix

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private beds: Partial<Record<'wind' | 'river', GainNode>> = {};
  private mix: AmbienceMix = { birds: 0, crickets: 0, owls: 0, wind: 0, river: 0 };
  private nextCall: Record<string, number> = {};
  private volumeNow = 0.8;
  private mutedNow = false;
  listener = { x: 0, z: 0 }; // where the ears are (the camera's target)
  right = { x: 1, z: 0 }; // the ground direction the screen's right points along

  // Listening for the player's first gesture to start, and `muteKey` (a KeyboardEvent code) to toggle mute.
  constructor(muteKey: string | null = 'KeyN') {
    if (typeof window === 'undefined') return;
    const start = () => {
      this.start();
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
    window.addEventListener('pointerdown', start);
    window.addEventListener('keydown', start);
    if (muteKey) window.addEventListener('keydown', (e) => e.code === muteKey && !e.repeat && this.setMuted(!this.mutedNow));
  }

  get started(): boolean {
    return this.ctx !== null;
  }

  get volume(): number {
    return this.volumeNow;
  }

  get muted(): boolean {
    return this.mutedNow;
  }

  setVolume(volume: number): void {
    this.volumeNow = Math.max(0, Math.min(1, volume));
    this.applyMaster();
  }

  setMuted(muted: boolean): void {
    this.mutedNow = muted;
    this.applyMaster();
  }

  // The context made and resumed (called on the first gesture; harmless again).
  start(): void {
    if (typeof AudioContext === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.applyMaster();
      this.beds.wind = noiseBed(this.ctx, this.master, 'lowpass', 420, 0.6, 180);
      this.beds.river = noiseBed(this.ctx, this.master, 'bandpass', 650, 0.5, 120);
    }
    void this.ctx.resume();
  }

  // A sound effect by name (sfx.ts RECIPES), placed in the world or everywhere. Silent before the start, out of
  // earshot or unknown.
  play(name: string, { at, volume = 1, pitch = 1 }: PlayOptions = {}): void {
    const { ctx, master } = this;
    const recipe = RECIPES[name];
    if (!ctx || !master || !recipe || this.mutedNow) return;
    const { pan, gain } = at ? spatialMix(this.listener, at, this.right) : { pan: 0, gain: 1 };
    if (gain <= 0.01) return;
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    panner.connect(master);
    recipe(ctx, panner, { pitch: pitch * (0.94 + Math.random() * 0.12), volume: volume * gain });
    setTimeout(() => panner.disconnect(), 3000);
  }

  // The ambience moved toward `mix`; its calls (birds, crickets, owls) made as they fall due. Called every frame.
  ambience(mix: AmbienceMix, dt: number): void {
    this.mix = mix;
    const { ctx } = this;
    if (!ctx) return;
    this.beds.wind?.gain.setTargetAtTime(mix.wind * 0.25, ctx.currentTime, RAMP);
    this.beds.river?.gain.setTargetAtTime(mix.river * 0.3, ctx.currentTime, RAMP);
    for (const [layer, voice, least, most] of CALLS) {
      const level = this.mix[layer];
      this.nextCall[voice] = (this.nextCall[voice] ?? least) - dt;
      if (this.nextCall[voice] > 0) continue;
      this.nextCall[voice] = (least + Math.random() * (most - least)) / Math.max(0.3, level);
      if (level > 0.05) this.play(voice, { volume: level, pitch: 0.9 + Math.random() * 0.2 });
    }
  }

  private applyMaster(): void {
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.mutedNow ? 0 : this.volumeNow, this.ctx.currentTime, 0.05);
  }
}
