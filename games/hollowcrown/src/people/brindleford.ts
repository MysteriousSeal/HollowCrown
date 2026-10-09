// Brindleford's named folk (docs/story/regions/brindle-vale.md, the people's table), each dressed as the bible has
// them, in the order it lists them. Who uses it: people/index.ts (PEOPLE).

import { cuff, gloves, type FrameSpec } from '@voxel/engine/characters';
import { wrap } from '@voxel/engine/voxel';
import { apron, body, cap, coif, dusted, folk, forearms, hammer, K, ladle, lantern, ledger, longSkirtLeg, OLD, right, shawl, shoes, skirt, sleeves, staff, W } from './kit';

// Garrick Fenn, the innkeeper: an old ferryman gone to fat at the middle, his forearms still a ferryman's (the
// sleeves rolled off them), a long white apron, a woad kerchief knotted at the throat from the river days.
const GARRICK = folk({ build: 'male', skin: 0, hair: 4, dye: 3, hairStyle: 'short', beard: true, expression: 'stern' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 8 && z >= 3 ? W.woad : y >= 6 || z === 4 ? ((x + y) % 4 ? W.linen : W.linenShade) : W.russetDark)); // the shirt, a russet waistcoat behind the apron
    apron(g, o, f, 6, 4, (_x, y) => (y === -4 ? W.apronHem : W.apron));
  },
  arm: (g, o) => {
    sleeves(g, o, 5, (_x, y) => (y === 5 ? W.roll : W.linen)); // rolled to the elbow
    forearms(g, o);
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 3 ? W.wool : 0));
    shoes(g, o, 2, (_x, y) => (y === 2 ? K.leather : K.leatherDark));
  },
});

// Elsa Fenn, the cook, 24: a red kerchief over her hair, her sleeves rolled, a moss-green bodice laced at the front, a
// brown wool skirt to the ankle and a white apron tied over it, a ladle in hand.
const ELSA = folk({ build: 'female', skin: 0, hair: 3, dye: 0, hairStyle: 'bun', beard: false, expression: 'cheerful' }, {
  head: (g, o) => coif(g, o, (x, y, z) => (y === 11 && (x * 3 + z * 5) % 7 === 0 ? W.linen : z <= 2 ? W.kerchiefDark : W.kerchief), W.linen),
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y >= 7 ? W.linen : z === 4 && (x === 2 || x === 4) && y % 2 ? W.string : y === 0 ? W.mossDark : W.moss));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 5 ? W.wool : W.woolDark));
    apron(g, o, f, 0, 4, (_x, y) => (y === -4 ? W.apronHem : W.apron));
  },
  arm: (g, o) => sleeves(g, o, 5, (_x, y) => (y === 5 ? W.roll : W.linen)),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 5 ? W.wool : W.woolDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { rightArm: ladle } });

// Odo Pell, the Regency's reeve: pale and close-cropped, a black felt cap, a long heron-grey coat buttoned in brass
// to the throat, the white heron stitched on his breast, black hose and boots, his ledger under his arm.
const ODO_PELL = folk({ build: 'male', skin: 4, hair: 1, dye: 4, hairStyle: 'cropped', beard: false, expression: 'sly' }, {
  head: (g, o) => cap(g, o, K.black, K.blackLight),
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 3 ? K.black : z === 4 && x === 4 ? (y % 2 ? K.brass : W.heronDark) : z === 4 && x >= 6 && x <= 7 && y >= 5 && y <= 7 ? (y === 7 && x === 6 ? W.heronLight : K.white) : (x + y) % 6 ? W.heron : W.heronDark));
    skirt(g, o, f, 4, (x, y) => (x === 4 ? 0 : y === -4 ? W.heronDark : W.heron)); // the coat's skirts, open at the front
  },
  arm: (g, o) => {
    sleeves(g, o, 2, (_x, y) => (y === 2 ? W.heronDark : W.heron));
  },
  leg: (g, o) => {
    body(g, o, () => K.black);
    shoes(g, o, 2, (_x, y) => (y === 2 ? K.leather : K.leatherDark));
  },
}, { held: { leftArm: ledger } });

// Father Cuthwin, the priest, once a Lantern: bald, a grey beard, a long undyed robe roped at the waist, its cowl down
// on his shoulders, a small brass lantern lit in his hand (the old order's, though he's left it).
const CUTHWIN = folk({ build: 'male', skin: 1, hair: 4, dye: 4, hairStyle: 'bald', beard: true, expression: 'wistful' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 3 ? (z === 4 && x === 3 ? W.strawDark : W.string) : (x + y + z) % 5 ? W.robe : W.robeDark));
    wrap(g, o, (_x, y) => (y >= 8 ? W.robeDark : 0)); // the cowl
    skirt(g, o, f, 5, (x, y) => (y === -5 ? W.robeDark : (x + y) % 5 ? W.robe : W.robeDark));
  },
  arm: (g, o) => {
    sleeves(g, o, 2, () => W.robe);
    cuff(g, o, 2, 3, () => W.robeDark); // wide sleeves
  },
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 5 ? W.robe : W.robeDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { leftArm: lantern }, gait: { speed: 1.1 } });

// Tobin Harrow, the smith: big and black-bearded, his arms bare and thick from the hammer, a long scorched leather
// apron from the chest to the shin, one glove, soot on everything, the hammer in his fist.
const TOBIN = folk({ build: 'male', skin: 2, hair: 1, dye: 4, hairStyle: 'cropped', beard: true, expression: 'calm' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => ((x + y) % 4 ? W.linenDark : W.linenShade));
    apron(g, o, f, 7, 5, (x, y) => (y === -5 ? K.leather : (x * 5 + y * 3) % 11 === 0 ? W.soot : K.leatherDark));
  },
  arm: (g, o, _f, j) => {
    sleeves(g, o, 7, () => W.linenDark); // (barely: a smith's arms bare)
    forearms(g, o);
    if (!right(j)) gloves(g, o, (_x, y) => (y === 1 ? K.leather : K.leatherDark));
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 3 ? W.woolDark : 0));
    shoes(g, o, 2, () => K.leatherDark);
  },
}, { held: { rightArm: hammer }, after: dusted(W.soot, K.charcoal, 0.06, 7) });

// Wat, the smith's apprentice, 16: not yet grown, a shaggy fair mop, a linen shirt with the sleeves rolled, a short
// leather apron, a smut of soot on him.
const WAT = folk({ build: 'male', skin: 0, hair: 2, dye: 3, hairStyle: 'shaggy', beard: false, expression: 'wistful' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => ((x + y) % 5 ? W.linen : W.linenShade));
    apron(g, o, f, 0, 3, () => K.leather);
  },
  arm: (g, o) => sleeves(g, o, 5, (_x, y) => (y === 5 ? W.roll : W.linen)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.wool : 0));
    shoes(g, o, 1, () => K.leatherDark);
  },
}, { scale: 0.92, after: dusted(W.soot, K.charcoal, 0.04, 11) });

// Nan Wicket, the herbalist, 70: bent nearly double over her stick, white hair under a linen coif, a moss-green dress
// to the ground, a madder shawl fringed round her shoulders, bunches of herbs hung at her belt.
const NAN_WICKET = folk({ build: 'female', skin: 0, hair: 7, dye: 2, hairStyle: 'bun', beard: false, expression: 'sly' }, {
  head: (g, o) => coif(g, o, (x, z) => ((x + z) % 4 ? W.linen : W.linenShade), W.linenShade),
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 2 ? K.leatherDark : (x + y) % 4 ? W.moss : W.mossDark));
    shawl(g, o, f, (x, y) => ((x + y) % 3 ? W.shawl : W.shawlDark));
    skirt(g, o, f, 5, (x, y, z) => (x === f.w && z >= 1 && z <= 3 && y >= -3 ? (y === -1 ? K.string : W.herb) : (x + y) % 4 ? W.moss : W.mossDark)); // the herbs at her right hip
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.mossDark : W.moss)),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.moss : W.mossDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { rightArm: staff(8, 'plain', 4) }, gait: OLD });

export const FOLK: Record<string, FrameSpec> = {
  'Garrick Fenn': GARRICK,
  'Elsa Fenn': ELSA,
  'Odo Pell': ODO_PELL,
  'Father Cuthwin': CUTHWIN,
  'Tobin Harrow': TOBIN,
  'Wat': WAT,
  'Nan Wicket': NAN_WICKET,
};
