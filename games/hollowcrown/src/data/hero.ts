// The hero, until the hero forge exists: their look, their pace, and the stride that matches it.

import { MARCH, type BodyLook, type Gait } from '@voxel/engine/characters';

export const HERO: { look: BodyLook; speed: number; gait: Gait } = {
  look: { build: 'male', skin: 0, hair: 0, dye: 1, hairStyle: 'short', beard: false },
  speed: 3.2, // tiles a second
  gait: { ...MARCH, speed: 2.3 }, // (strides a second: about 0.7 tiles each, matching the pace)
};
