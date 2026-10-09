// The hero, until the hero forge exists: their look and their pace.

import type { BodyLook } from '@voxel/engine/characters/human/humanoid';

export const HERO: { look: BodyLook; speed: number } = {
  look: { build: 'male', skin: 0, hair: 0, dye: 1, hairStyle: 'short', beard: false },
  speed: 3.2, // tiles a second
};
