// The sums behind the sound, kept apart from WebAudio so they can be checked: where a sound sits in the stereo field
// and how loud it is from the listener, and how the ambience is mixed for an hour and a place.

// Pan (-1 left .. 1 right) and loudness (0 .. 1) of a sound at `at` heard from `listener`, along the screen's right
// (`right`: the ground direction the screen's right points along). Falls off past `near`, silent past `far`.
export function spatialMix(
  listener: { x: number; z: number },
  at: { x: number; z: number },
  right: { x: number; z: number },
  near = 3,
  far = 24,
): { pan: number; gain: number } {
  const [dx, dz] = [at.x - listener.x, at.z - listener.z];
  const distance = Math.hypot(dx, dz);
  if (distance >= far) return { pan: 0, gain: 0 };
  const across = dx * right.x + dz * right.z;
  const pan = Math.max(-1, Math.min(1, across / (near * 3)));
  const falloff = distance <= near ? 1 : near / distance;
  const edge = Math.min(1, (far - distance) / (far * 0.25)); // (fading to nothing at the far edge, not cut off)
  return { pan, gain: falloff * edge };
}

// The ambience's layers, each 0 .. 1.
export interface AmbienceMix {
  birds: number;
  crickets: number;
  owls: number;
  wind: number;
  river: number;
}

export interface AmbiencePlace {
  water?: number; // 0 .. 1: how much water is near (a river's murmur)
  wind?: number; // 0 .. 1: how exposed (default 0.35)
  indoors?: boolean; // (all but a little wind hushed)
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// How much of the day it is at `hours`: 0 at night, 1 by day, easing through dawn (5-7) and dusk (19-21).
export const daylightAt = (hours: number): number => {
  const h = ((hours % 24) + 24) % 24;
  return smooth(5, 7, h) * (1 - smooth(19, 21, h));
};

// The ambience for an hour and a place: birds by day, crickets and owls at night, wind, the river near water.
export function ambienceMix(hours: number, { water = 0, wind = 0.35, indoors = false }: AmbiencePlace = {}): AmbienceMix {
  const day = daylightAt(hours);
  const night = 1 - day;
  const hush = indoors ? 0 : 1;
  return {
    birds: day * 0.8 * hush,
    crickets: night * 0.7 * hush,
    owls: night * 0.6 * hush,
    wind: Math.max(0, Math.min(1, wind)) * (indoors ? 0.25 : 1),
    river: Math.max(0, Math.min(1, water)) * hush,
  };
}
