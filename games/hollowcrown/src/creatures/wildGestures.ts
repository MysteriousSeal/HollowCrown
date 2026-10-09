// What the Vale's ambient beasts and birds do when nothing's chasing them, as gestures on the engine's beast and bird
// rigs (played with Acting by name, `phase` 0..1, eased in and out so each starts and ends at rest). Beasts: graze
// (the head down to the grass, a chew), alert (the head snapped up, still), sitUp (a rabbit up on its haunches), bound
// (a leap, legs stretched fore and aft), sniff, tailWag. Birds: peck, preen, flutter, lookRound. Who uses it:
// smallBeasts.ts and the other wildlife specs.

import type { BeastModel, BirdModel } from '@voxel/engine/characters';

const ease = (p: number) => Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI);
const hold = (p: number) => Math.min(1, ease(p) * 2.5); // (in quickly, held, out quickly)

export const BEAST_GESTURES: Record<string, (m: BeastModel, phase: number) => void> = {
  graze: (m, p) => {
    const w = hold(p);
    m.head.rotation.x += (1.1 + Math.sin(p * 30) * 0.06) * w; // (down, chewing)
    m.head.rotation.y *= 1 - w;
  },
  alert: (m, p) => {
    const w = hold(p);
    m.head.rotation.x += -0.4 * w;
    m.head.rotation.y *= 1 - w; // (stock still, looking)
    m.tail.rotation.x += -0.4 * w;
  },
  sitUp: (m, p) => {
    const w = hold(p);
    m.body.rotation.x += -0.55 * w; // (up on its haunches)
    m.legs[0].rotation.x += 0.6 * w;
    m.legs[1].rotation.x += 0.6 * w;
    m.head.rotation.x += 0.35 * w; // (looking ahead, not at the sky)
  },
  bound: (m, p) => {
    const w = ease(p);
    m.body.position.y += w * 0.08;
    m.body.rotation.x += Math.cos(p * Math.PI) * -0.25 * w; // (nose up rising, down landing)
    m.legs[0].rotation.x += -0.9 * w;
    m.legs[1].rotation.x += -0.9 * w;
    m.legs[2].rotation.x += 0.9 * w;
    m.legs[3].rotation.x += 0.9 * w;
  },
  sniff: (m, p) => {
    const w = hold(p);
    m.head.rotation.x += (0.5 + Math.sin(p * 50) * 0.05) * w;
    m.head.rotation.y += Math.sin(p * Math.PI * 2) * 0.4 * w;
  },
  tailWag: (m, p) => {
    m.tail.rotation.y += Math.sin(p * 40) * 0.7 * hold(p);
    m.tail.rotation.x += -0.5 * hold(p);
  },
};

export const BIRD_GESTURES: Record<string, (m: BirdModel, phase: number) => void> = {
  peck: (m, p) => {
    m.head.rotation.x += Math.max(0, Math.sin(p * Math.PI * 4)) * 1.0; // (twice, sharp)
  },
  preen: (m, p) => {
    const w = hold(p);
    m.head.rotation.y += 2.2 * w;
    m.head.rotation.x += (0.5 + Math.sin(p * 30) * 0.1) * w;
  },
  flutter: (m, p) => {
    const w = ease(p);
    for (const wing of m.wings) {
      wing.spread.rotation.y += -wing.side * 0.9 * w;
      wing.flap.rotation.z += wing.side * Math.sin(p * 60) * 0.6 * w;
    }
    m.lift.position.y += w * 0.02;
  },
  lookRound: (m, p) => {
    m.head.rotation.y += Math.sin(p * Math.PI * 2) * 1.2 * ease(p);
  },
};
