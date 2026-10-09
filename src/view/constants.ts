import * as THREE from 'three';

// Fixed isometric offset: camera always sits here relative to the hero,
// and never rotates — Tunic-style pan-and-follow rather than orbit.
export const CAMERA_OFFSET = new THREE.Vector3(14, 18, 14);
export const FRUSTUM_SIZE = 9; // world units visible vertically; smaller = more zoomed in

// Lighting: warm, welcoming midday. A creamy sun over a strong, soft fill
// whose sky and ground colors are both warm, so shaded faces read as amber
// rather than cold or murky.
export const SUN_DIRECTION = new THREE.Vector3(20, 30, 10).normalize(); // toward the sun
export const SUN_COLOR = 0xffeccc;
export const SUN_INTENSITY = 1.0;
export const SKY_COLOR = 0xffe2c4;
export const GROUND_BOUNCE_COLOR = 0x8a6442;
export const SKY_INTENSITY = 0.95;

// Bloom: only light brighter than the threshold (glowing windows, lanterns,
// the brightest sunlit tops) bleeds a soft halo.
export const BLOOM_STRENGTH = 0.45;
export const BLOOM_RADIUS = 0.6;
export const BLOOM_THRESHOLD = 0.9;

// Light shafts: faint golden beams slanting along the sun's direction.
export const SHAFT_COLOR = 0xffd27a;
export const SHAFT_STRENGTH = 0.17;
export const SHAFT_SPACING = 1.8; // world units between beams, roughly
export const SHAFT_DRIFT = 0.15; // beam drift speed

// Cel shading ramp: [sun N·L threshold, sun light level]. With the sun's
// direction, voxel tops land in the last band, +X faces in the middle one
// and +Z faces in the first; faces turned away get only the sky light.
export const CEL_BANDS: ReadonlyArray<readonly [number, number]> = [
  [0.1, 0.35],
  [0.4, 0.6],
  [0.7, 0.85],
];

// Fog: haze by camera depth (the camera sits ~27 units away, so only the
// far top of the screen fades), plus mist on ground below the hero's level.
export const FOG_COLOR = 0xf2c9a8 // peach;
export const FOG_NEAR = 27;
export const FOG_FAR = 42;
export const MIST_START = 0.2; // mist begins this far below the camera focus...
export const MIST_DEPTH = 0.8; // ...and is thickest this far below
export const MIST_STRENGTH = 0.35;

// The ground's colour by tier: low ground dark grass, higher tiers shifting toward pale rock.
export const TERRAIN_COLORS = [0x4f8f3e, 0x62ad4c, 0x88bf5f, 0xb2cf76, 0xd6c99c]; // warm yellow-greens
