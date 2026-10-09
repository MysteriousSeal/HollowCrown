// Sound effects made from nothing: noise and oscillators shaped by filters and envelopes, no sound files. Each
// recipe plays once into the node it's given (the spatial chain: a panner and a gain), `pitch` scaling its
// frequencies (a little variety each time keeps repeated steps from sounding mechanical).

export interface SfxOptions {
  pitch: number; // 1: as made
  volume: number; // 0 .. 1
}
export type Recipe = (ctx: BaseAudioContext, out: AudioNode, o: SfxOptions) => void;

const noises = new WeakMap<BaseAudioContext, AudioBuffer>();

// A second of white noise, made once a context.
function noiseOf(ctx: BaseAudioContext): AudioBuffer {
  let buffer = noises.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noises.set(ctx, buffer);
  }
  return buffer;
}

// A gain shaped as a quick rise and a fall to silence, starting now.
function envelope(ctx: BaseAudioContext, out: AudioNode, peak: number, attack: number, decay: number, delay = 0): GainNode {
  const gain = ctx.createGain();
  const t = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  gain.connect(out);
  return gain;
}

// A burst of filtered noise (a step, a rustle, the air of a swing).
function noiseBurst(ctx: BaseAudioContext, out: AudioNode, o: { type: BiquadFilterType; freq: number; q?: number; peak: number; attack: number; decay: number; delay?: number; sweepTo?: number }): void {
  const src = ctx.createBufferSource();
  src.buffer = noiseOf(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = o.type;
  const t = ctx.currentTime + (o.delay ?? 0);
  filter.frequency.setValueAtTime(o.freq, t);
  if (o.sweepTo) filter.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.attack + o.decay);
  filter.Q.value = o.q ?? 1;
  src.connect(filter).connect(envelope(ctx, out, o.peak, o.attack, o.decay, o.delay));
  src.start(t, Math.random() * 0.5);
  src.stop(t + o.attack + o.decay + 0.05);
}

// A tone (a thump, a ring, a call), its frequency gliding to `glideTo` if given.
function tone(ctx: BaseAudioContext, out: AudioNode, o: { type: OscillatorType; freq: number; peak: number; attack: number; decay: number; delay?: number; glideTo?: number }): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.type = o.type;
  const t = ctx.currentTime + (o.delay ?? 0);
  osc.frequency.setValueAtTime(o.freq, t);
  if (o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, t + o.attack + o.decay);
  osc.connect(envelope(ctx, out, o.peak, o.attack, o.decay, o.delay));
  osc.start(t);
  osc.stop(t + o.attack + o.decay + 0.05);
  return osc;
}

export const RECIPES: Readonly<Record<string, Recipe>> = {
  // Footsteps, by what's underfoot.
  'step-grass': (ctx, out, { pitch, volume }) =>
    noiseBurst(ctx, out, { type: 'lowpass', freq: 900 * pitch, q: 0.7, peak: 0.35 * volume, attack: 0.01, decay: 0.09 }),
  'step-road': (ctx, out, { pitch, volume }) => {
    noiseBurst(ctx, out, { type: 'bandpass', freq: 2400 * pitch, q: 1.2, peak: 0.3 * volume, attack: 0.004, decay: 0.05 });
    noiseBurst(ctx, out, { type: 'lowpass', freq: 500 * pitch, peak: 0.25 * volume, attack: 0.005, decay: 0.06 });
  },
  'step-wood': (ctx, out, { pitch, volume }) => {
    tone(ctx, out, { type: 'sine', freq: 170 * pitch, glideTo: 110 * pitch, peak: 0.4 * volume, attack: 0.004, decay: 0.1 });
    noiseBurst(ctx, out, { type: 'bandpass', freq: 1200 * pitch, q: 2, peak: 0.15 * volume, attack: 0.003, decay: 0.04 });
  },
  // A blade cutting the air: noise swept up and back down.
  swing: (ctx, out, { pitch, volume }) =>
    noiseBurst(ctx, out, { type: 'bandpass', freq: 500 * pitch, sweepTo: 1800 * pitch, q: 1.5, peak: 0.4 * volume, attack: 0.09, decay: 0.16 }),
  // A blade striking: a bright metallic ring over a short crack.
  hit: (ctx, out, { pitch, volume }) => {
    noiseBurst(ctx, out, { type: 'highpass', freq: 1800 * pitch, peak: 0.45 * volume, attack: 0.002, decay: 0.06 });
    for (const [f, p] of [[1720, 0.16], [2630, 0.1], [3910, 0.07]] as const) tone(ctx, out, { type: 'triangle', freq: f * pitch, peak: p * volume, attack: 0.002, decay: 0.35 });
    tone(ctx, out, { type: 'sine', freq: 140 * pitch, glideTo: 70 * pitch, peak: 0.35 * volume, attack: 0.003, decay: 0.12 });
  },
  // A wolf's snarl: a low rasping saw, wavering, with breath.
  snarl: (ctx, out, { pitch, volume }) => {
    const growl = tone(ctx, out, { type: 'sawtooth', freq: 95 * pitch, glideTo: 75 * pitch, peak: 0.22 * volume, attack: 0.06, decay: 0.55 });
    const wobble = ctx.createOscillator();
    const depth = ctx.createGain();
    wobble.frequency.value = 28;
    depth.gain.value = 18 * pitch;
    wobble.connect(depth).connect(growl.frequency);
    wobble.start();
    wobble.stop(ctx.currentTime + 0.7);
    noiseBurst(ctx, out, { type: 'bandpass', freq: 700 * pitch, q: 1, peak: 0.2 * volume, attack: 0.05, decay: 0.5 });
  },
  // A door: a creak of the hinge, then the knock of it shutting.
  door: (ctx, out, { pitch, volume }) => {
    tone(ctx, out, { type: 'sawtooth', freq: 160 * pitch, glideTo: 260 * pitch, peak: 0.08 * volume, attack: 0.08, decay: 0.45 });
    tone(ctx, out, { type: 'sine', freq: 90 * pitch, glideTo: 55 * pitch, peak: 0.5 * volume, attack: 0.004, decay: 0.18, delay: 0.5 });
    noiseBurst(ctx, out, { type: 'lowpass', freq: 600 * pitch, peak: 0.25 * volume, attack: 0.003, decay: 0.08, delay: 0.5 });
  },
  // A UI click: a tiny bright tick.
  click: (ctx, out, { pitch, volume }) => tone(ctx, out, { type: 'sine', freq: 1300 * pitch, peak: 0.25 * volume, attack: 0.002, decay: 0.035 }),
  // Ambience voices, played by the ambience bed (ambience.ts).
  chirp: (ctx, out, { pitch, volume }) => {
    const f = 2600 + Math.random() * 2200;
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
      tone(ctx, out, { type: 'sine', freq: f * pitch, glideTo: f * pitch * (1.2 + Math.random() * 0.4), peak: 0.06 * volume, attack: 0.01, decay: 0.06, delay: i * 0.11 });
    }
  },
  hoot: (ctx, out, { pitch, volume }) => {
    tone(ctx, out, { type: 'sine', freq: 390 * pitch, glideTo: 360 * pitch, peak: 0.12 * volume, attack: 0.08, decay: 0.35 });
    tone(ctx, out, { type: 'sine', freq: 370 * pitch, glideTo: 330 * pitch, peak: 0.1 * volume, attack: 0.1, decay: 0.5, delay: 0.55 });
  },
  cricket: (ctx, out, { pitch, volume }) => {
    for (let i = 0; i < 3; i++) tone(ctx, out, { type: 'square', freq: 4400 * pitch, peak: 0.018 * volume, attack: 0.004, decay: 0.03, delay: i * 0.05 });
  },
};

export const SOUND_NAMES = Object.keys(RECIPES);

// A recipe-made sound looping forever (the wind, a river): noise through a filter, its loudness on `gain`.
export function noiseBed(ctx: BaseAudioContext, out: AudioNode, type: BiquadFilterType, freq: number, q: number, wander: number): GainNode {
  const src = ctx.createBufferSource();
  src.buffer = noiseOf(ctx);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  [filter.type, filter.frequency.value, filter.Q.value] = [type, freq, q];
  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  [lfo.frequency.value, depth.gain.value] = [0.08 + Math.random() * 0.05, wander]; // (gusts, the water's swell)
  lfo.connect(depth).connect(filter.frequency);
  const gain = ctx.createGain();
  gain.gain.value = 0;
  src.connect(filter).connect(gain).connect(out);
  src.start();
  lfo.start();
  return gain;
}
