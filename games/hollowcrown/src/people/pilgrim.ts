// The old pilgrim woman dead in the ditch on the road east (main-quest-1.md MQ01; brindle-vale.md: Hesper Rowe's
// mother): white-haired, her throat cut, her shawl and padded jerkin still on her (the hero may take the jerkin, or
// cover her with it), her eyes closed. Laid on her back by creatures/lying.ts. Who uses it: creatures/index.ts.

import type { FrameModel } from '@voxel/engine/characters';
import { over } from '@voxel/engine/voxel';
import { body, C, coif, folk, K, longSkirtLeg, shawl, shoes, skirt, sleeves, W } from './kit';

export const DEAD_PILGRIM = folk({ build: 'female', skin: 0, hair: 7, dye: 3, hairStyle: 'bun', beard: false, expression: 'calm' }, {
  head: (g, o) => {
    coif(g, o, (x, _y, z) => ((x + z) % 4 ? W.linenShade : W.linenDark), W.linenDark);
    over(g, o, (_x, y, z, c) => (y === 0 && z >= 8 && (c === C.skin || c === C.skinShade) ? W.wound : 0)); // her throat
  },
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 8 && z >= 3 ? W.wound : x % 2 ? K.padded : K.paddedDark)); // the padded jerkin, blood at the collar
    shawl(g, o, f, (x, y) => ((x + y) % 3 ? W.robe : W.robeDark), W.linenDark);
    skirt(g, o, f, 5, (x, y) => ((x + y) % 4 ? W.robe : W.robeDark));
  },
  arm: (g, o) => sleeves(g, o, 2, () => K.paddedDark),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.robe : W.robeDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { swaps: { eye: 0xc8a888, glint: 0xc8a888 } }); // (her eyes closed)

// How she lies: one arm flung out, the other across her, her knees a little bent.
export function sprawl(m: FrameModel): void {
  m.joints.rightArm.rotation.z = -1.2;
  m.joints.leftArm.rotation.set(-0.25, 0, 0.35);
  m.joints.head.position.z += 0.045; // (its back level with her back: the head bigger than the body, it would hold her up off the ground)
  m.joints.leftLeg.rotation.x = -0.25;
}
