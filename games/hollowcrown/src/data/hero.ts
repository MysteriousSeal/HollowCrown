// The hero, until the hero forge exists: their look, their pace, and the stride that matches it; how fast they run
// with Shift held, and how much quicker their stride turns over then (features/sprint.ts).

import { MARCH, type BodyLook, type Gait } from '@voxel/engine/characters';

export const HERO: { look: BodyLook; speed: number; gait: Gait; sprint: { speed: number; cadence: number } } = {
  look: { build: 'male', skin: 0, hair: 0, dye: 1, hairStyle: 'short', beard: false },
  speed: 3.2, // tiles a second
  gait: { ...MARCH, speed: 2.3 }, // (strides a second: about 0.7 tiles each, matching the pace)
  sprint: {
    speed: 5.4, // tiles a second
    cadence: 1.45, // strides that much quicker (3.3 a second: each about 0.8 tiles, a little longer than walking's)
  },
};
