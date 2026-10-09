// The sky through a day: the sun's direction, colour and strength, the sky and ground fill, the fog and background,
// and how much daylight there is, at any hour. Keyframes for night, dawn, day, dusk and night again, blended between.
// Noon is the look the constants give (render/constants.ts); night is dark blue, so glowing windows stand out.
//
// The sun stays on the camera's side of the sky all day (from the east at dawn, the south at dusk), so the faces the
// camera sees keep their cel bands; at night a dim blue moon takes its place.

import * as THREE from 'three';
import { FOG_COLOR, GROUND_BOUNCE_COLOR, SKY_COLOR, SKY_INTENSITY, SUN_COLOR, SUN_DIRECTION, SUN_INTENSITY } from './constants';

export interface SkyKey {
  readonly hour: number;
  readonly sunDirection: THREE.Vector3; // toward the sun (or moon), normalized
  readonly sunColor: number;
  readonly sunIntensity: number;
  readonly skyColor: number;
  readonly groundColor: number;
  readonly skyIntensity: number;
  readonly fogColor: number; // the fog and the background
  readonly daylight: number; // 0 night .. 1 full day (fades the light shafts; games may read it)
}

// The sky at one moment, ready to copy onto the lights and the scene.
export interface SkyState {
  readonly sunDirection: THREE.Vector3;
  readonly sunColor: THREE.Color;
  sunIntensity: number;
  readonly skyColor: THREE.Color;
  readonly groundColor: THREE.Color;
  skyIntensity: number;
  readonly fogColor: THREE.Color;
  daylight: number;
}

const MOON = new THREE.Vector3(10, 30, 20).normalize();
const night = (hour: number): SkyKey => ({
  hour,
  sunDirection: MOON,
  sunColor: 0xa8bcff, // (moonlight)
  sunIntensity: 0.55,
  skyColor: 0x6c86c8,
  groundColor: 0x2c3658,
  skyIntensity: 0.95,
  fogColor: 0x2a3a66,
  daylight: 0,
});

// In hour order, from 0 to 24 (the first and last alike, so the day wraps round).
export const SKY_KEYS: readonly SkyKey[] = [
  night(0),
  night(4.5),
  {
    hour: 6,
    sunDirection: new THREE.Vector3(30, 9, -4).normalize(),
    sunColor: 0xffae84,
    sunIntensity: 0.75,
    skyColor: 0xdcb4c0,
    groundColor: 0x6a5068,
    skyIntensity: 0.9,
    fogColor: 0xe0a8a0,
    daylight: 0.5,
  },
  {
    hour: 8.5,
    sunDirection: SUN_DIRECTION,
    sunColor: SUN_COLOR,
    sunIntensity: SUN_INTENSITY,
    skyColor: SKY_COLOR,
    groundColor: GROUND_BOUNCE_COLOR,
    skyIntensity: SKY_INTENSITY,
    fogColor: FOG_COLOR,
    daylight: 1,
  },
  {
    hour: 16,
    sunDirection: SUN_DIRECTION,
    sunColor: SUN_COLOR,
    sunIntensity: SUN_INTENSITY,
    skyColor: SKY_COLOR,
    groundColor: GROUND_BOUNCE_COLOR,
    skyIntensity: SKY_INTENSITY,
    fogColor: FOG_COLOR,
    daylight: 1,
  },
  {
    hour: 19,
    sunDirection: new THREE.Vector3(-2, 9, 30).normalize(),
    sunColor: 0xff9a5c,
    sunIntensity: 0.85,
    skyColor: 0xf2b496,
    groundColor: 0x7a4c3a,
    skyIntensity: 0.9,
    fogColor: 0xe0906a,
    daylight: 0.5,
  },
  {
    hour: 20.5,
    sunDirection: new THREE.Vector3(4, 20, 26).normalize(),
    sunColor: 0xa080c0,
    sunIntensity: 0.5,
    skyColor: 0x8a78b8,
    groundColor: 0x40345a,
    skyIntensity: 0.85,
    fogColor: 0x5e4e88,
    daylight: 0.15,
  },
  night(22),
  night(24),
];

export const emptySky = (): SkyState => ({
  sunDirection: new THREE.Vector3(),
  sunColor: new THREE.Color(),
  sunIntensity: 0,
  skyColor: new THREE.Color(),
  groundColor: new THREE.Color(),
  skyIntensity: 0,
  fogColor: new THREE.Color(),
  daylight: 0,
});

const [colorA, colorB] = [new THREE.Color(), new THREE.Color()];
const mix = (out: THREE.Color, a: number, b: number, t: number) => out.copy(colorA.set(a)).lerp(colorB.set(b), t);

// The sky at `hours` (any number: wrapped into 0..24), written into `out` (a fresh one if none given).
export function skyAt(hours: number, out: SkyState = emptySky()): SkyState {
  const h = ((hours % 24) + 24) % 24;
  let i = 0;
  while (i < SKY_KEYS.length - 2 && SKY_KEYS[i + 1].hour <= h) i++;
  const [a, b] = [SKY_KEYS[i], SKY_KEYS[i + 1]];
  const t = THREE.MathUtils.smoothstep(h, a.hour, b.hour);
  out.sunDirection.copy(a.sunDirection).lerp(b.sunDirection, t).normalize();
  mix(out.sunColor, a.sunColor, b.sunColor, t);
  mix(out.skyColor, a.skyColor, b.skyColor, t);
  mix(out.groundColor, a.groundColor, b.groundColor, t);
  mix(out.fogColor, a.fogColor, b.fogColor, t);
  out.sunIntensity = THREE.MathUtils.lerp(a.sunIntensity, b.sunIntensity, t);
  out.skyIntensity = THREE.MathUtils.lerp(a.skyIntensity, b.skyIntensity, t);
  out.daylight = THREE.MathUtils.lerp(a.daylight, b.daylight, t);
  return out;
}
