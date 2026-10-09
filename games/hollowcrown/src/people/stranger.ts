// The hero, "the Stranger", as the story opens (docs/story/characters.md, main-quest-1.md): over the western mountains
// on the pilgrim road, robbed by the Red Hen's men at dusk and left in their smalls. Whatever look the player gives
// them: a linen shirt torn and grubby from the road, the sleeves ripped at odd lengths, their braies (the look's own
// dye), barefoot (the boots taken), mud to the shins, a bruise by the eye, and the one thing the robbers didn't want: a
// pewter pilgrim's token on a string at the neck. Who uses it: the hero's model (main.ts, features/talk.ts; the look
// is data/hero.ts's).

import { FrameModel, MARCH, type BodyLook, type FrameSpec, type Gait } from '@voxel/engine/characters';
import { noise3 } from '@voxel/engine/math';
import { box, over } from '@voxel/engine/voxel';
import { tornHem } from '../creatures/kit';
import { body, C, folk, skirt, sleeves, W } from './kit';

// The look the story suggests (the hero forge will choose its own): weary, unshaven, the hair grown out on the road.
export const STRANGER_LOOK: BodyLook = { build: 'male', skin: 0, hair: 0, dye: 3, hairStyle: 'shaggy', beard: true, expression: 'wistful' };

const shirt = (x: number, y: number, z: number) => (noise3(x, y, z, 51) < 0.22 ? W.mudLight : (x + y) % 5 ? W.linenShade : W.linenDark);

export function stranger(look: BodyLook = STRANGER_LOOK, gait: Gait = MARCH): FrameSpec {
  return folk(look, {
    head: (g, o) => over(g, o, (x, y, z, c) => (z === 10 && x === 2 && y === 5 && c === C.skin ? W.bruise : 0)), // a bruise by the eye
    torso: (g, o, f) => {
      const m = Math.floor(f.w / 2);
      body(g, o, (x, y, z) => (z === 4 && y >= 6 && Math.abs(x - m) <= y - 6 ? C.skinShade : shirt(x, y, z)), 1); // open at the throat
      skirt(g, o, f, 2, (x, y, z) => (y < -1 - tornHem(x, z, 51) % 2 ? 0 : shirt(x, y, z))); // its tail, torn
      box(g, o, m - 2, 8, f.d - 1, m + 2, 8, f.d - 1, (x) => (Math.abs(x - m) === 2 ? W.string : 0)); // the token's string
      box(g, o, m, 5, f.d, m, 6, f.d, (_x, y) => (y === 6 ? W.string : W.pewter)); // the pilgrim's token
    },
    arm: (g, o, _f, j) => sleeves(g, o, j.startsWith('right') ? 4 : 6, (x, y, z) => (y === (j.startsWith('right') ? 4 : 6) && (x + z) % 2 ? 0 : shirt(x, y, z))), // ripped
    leg: (g, o) => over(g, o, (x, y, z, c) => (y <= 2 && (c === C.skin || c === C.skinShade || c === C.skinLight || c === C.skinDeep) ? (y === 0 || noise3(x, y, z, 52) < 0.5 ? W.mud : W.mudLight) : 0)), // bare feet, mud to the shins
  }, { gait });
}

export const strangerModel = (look?: BodyLook, gait?: Gait): FrameModel => new FrameModel(stranger(look, gait));
