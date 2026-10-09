// Brindleford's folk as the main quest shows them at a turn of the story (main-quest-1.md), each a variant of the
// person (PEOPLE[name].variants): Garrick going out into MQ01's midnight with an oar; Odo Pell holding the well in his
// nightcap and nightshirt, a sword shaking in his hand; Wat in the Red Hen's camp (MQ03), his wrists roped, bruised, his
// apron gone. Who uses it: people/index.ts.

import { cuff, knife, type FrameSpec, type Held } from '@voxel/engine/characters';
import { box, createGrid, fillBox, over, wrap } from '@voxel/engine/voxel';
import { FOLK } from './brindleford';
import { body, C, folk, K, shoes, skirt, sleeves, W } from './kit';

// A ferry oar, held upright: a long ash loom, the blade broad at the foot.
const oar: Held = {
  grid: () => {
    const g = createGrid([3, 1, 24]);
    fillBox(g, 1, 0, 6, 1, 0, 23, (_x, _y, z) => (z >= 21 ? K.leatherDark : K.wood)); // the loom, a grip at the top
    fillBox(g, 0, 0, 0, 2, 0, 6, (x, _y, z) => (z === 0 || x !== 1 ? K.woodDark : K.wood)); // the blade
    return g;
  },
  grip: [1, 0.5, 5], turn: [-1.35, 0, 0],
};

// Pell at the well: a linen nightcap drooping to one side, a nightshirt to the knee, bare shins, the reeve's sword.
const PELL_NIGHTCAP = folk({ build: 'male', skin: 4, hair: 1, dye: 4, hairStyle: 'cropped', beard: false, expression: 'stern' }, {
  head: (g, o) => {
    wrap(g, o, (_x, y) => (y >= 8 ? (y === 8 ? W.linenShade : W.linen) : 0)); // the cap over the crown
    box(g, o, 10, 9, 4, 12, 10, 5, (x) => (x === 12 ? W.string : W.linenShade)); // its point, flopped over to one side
  },
  torso: (g, o, f) => {
    body(g, o, (x, y) => ((x + y) % 5 ? W.linen : W.linenShade));
    skirt(g, o, f, 4, (x, y) => (y === -4 ? W.linenShade : (x + y) % 5 ? W.linen : W.linenShade));
  },
  arm: (g, o) => sleeves(g, o, 2, () => W.linen),
  leg: (g, o) => shoes(g, o, 0, () => K.leatherDark),
}, { held: { rightArm: { grid: knife(14), grip: [1, 0.5, 1], turn: [-0.5, 0, 0] } }, gait: { sway: 0.05, headBow: -0.1 } });

// Wat in the camp: the soot and the shirt, no apron, his wrists bound with rope, a bruise by his eye, his head down.
const WAT = FOLK['Wat'];
const WAT_CAPTIVE: FrameSpec = {
  ...folk({ build: 'male', skin: 0, hair: 2, dye: 3, hairStyle: 'shaggy', beard: false, expression: 'wistful' }, {
    head: (g, o) => over(g, o, (x, y, z, c) => (z === 10 && x === 7 && y === 5 && c === C.skin ? W.bruise : 0)),
    torso: (g, o) => body(g, o, (x, y) => ((x + y) % 4 ? W.linenShade : W.mudLight)),
    arm: (g, o) => {
      sleeves(g, o, 5, () => W.linenShade);
      cuff(g, o, 2, 2, () => W.string); // the rope
    },
    leg: (g, o) => {
      body(g, o, (_x, y) => (y >= 2 ? W.wool : 0));
      shoes(g, o, 1, () => K.leatherDark);
    },
  }, { gait: { headBow: 0.3, armSwing: 0.05, reach: 0.25, speed: 1.0 } }),
  scale: WAT.scale,
};

export const MOMENTS: Record<string, Record<string, FrameSpec>> = {
  'Garrick Fenn': { oar: { ...FOLK['Garrick Fenn'], held: { rightArm: oar } } },
  'Odo Pell': { nightcap: PELL_NIGHTCAP },
  'Wat': { captive: WAT_CAPTIVE },
};
