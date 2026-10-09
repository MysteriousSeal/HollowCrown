// Tallow Green's folk (docs/story/regions/brindle-vale.md, Tallow Green): beekeepers and candle-makers round a green,
// the smell of wax; each dressed as the bible has them, in its order. Who uses it: people/index.ts (PEOPLE).

import type { FrameSpec } from '@voxel/engine/characters';
import { box } from '@voxel/engine/voxel';
import { candle, posy, skep } from './carried';
import { apron, body, braids, coif, folk, K, longSkirtLeg, shoes, skirt, sleeves, strawHat, W } from './kit';

// Goody Thatch, the headwoman, 60: a starched white coif, a good woad dress, a clean apron, the green's keys on a brass
// ring at her hip.
const GOODY_THATCH = folk({ build: 'female', skin: 0, hair: 4, dye: 1, hairStyle: 'bun', beard: false, expression: 'stern' }, {
  head: (g, o) => coif(g, o, () => W.apron, W.apronHem),
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y >= 8 ? W.apron : y === 2 ? K.leatherDark : (x + y) % 4 ? W.woad : W.woadDark));
    skirt(g, o, f, 5, (x, y, z) => (x === -1 && z >= 2 && z <= 3 && y >= -3 ? (y === -1 ? K.brassDark : K.brass) : (x + y) % 4 ? W.woad : W.woadDark)); // the keys at her right hip
    apron(g, o, f, 0, 4, (_x, y) => (y === -4 ? W.apronHem : W.apron));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.apron : W.woad)),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.woad : W.woadDark));
    shoes(g, o, 0, () => K.black);
  },
}, { gait: { speed: 1.1 } });

// Agna Bee, the beekeeper, 45: a wide straw hat with a linen veil hung from its brim at the sides and back, a honey-
// coloured dress, an apron stained with it, a straw skep on her arm.
const AGNA_BEE = folk({ build: 'female', skin: 2, hair: 3, dye: 6, hairStyle: 'bun', beard: false, expression: 'calm' }, {
  head: (g, o) => {
    strawHat(g, o);
    box(g, o, -2, 4, -2, 12, 8, 7, (x, y, z) => (x === -2 || x === 12 || z === -2 ? ((x + y + z) % 3 ? W.linen : W.linenShade) : 0)); // the veil
  },
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 2 ? K.leatherDark : (x + y) % 4 ? W.ochre : W.ochreDark));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 4 ? W.ochre : W.ochreDark));
    apron(g, o, f, 0, 4, (x, y) => ((x * 3 + y) % 7 === 0 ? W.honey : W.apronHem));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.linenShade : W.linen)),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.ochre : W.ochreDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { leftArm: skep } });

// Little Brede, Agna's daughter, 8: fair braids, a little dress banded honey and brown like a bee's back, bare legs, two
// bees about her head (she follows them).
const LITTLE_BREDE = folk({ build: 'female', skin: 0, hair: 2, dye: 6, hairStyle: 'twinBraids', beard: false, expression: 'cheerful' }, {
  head: (g, o) => {
    braids(g, o);
    for (const [x, y, z] of [[0, 13, 8], [10, 12, 3]]) box(g, o, x, y, z, x + 1, y, z, (bx) => (bx === x ? W.honey : K.black)); // the bees
  },
  torso: (g, o, f) => {
    body(g, o, (_x, y) => (y >= 8 ? W.linen : y % 3 === 0 ? W.woolDark : W.honey));
    skirt(g, o, f, 3, (_x, y) => (y === -2 ? W.woolDark : W.honey));
  },
  arm: (g, o) => sleeves(g, o, 5, () => W.linen),
}, { scale: 0.62, gait: { speed: 1.8 } });

// Osmund Wicke, the chandler, 55: grey and close-cropped, a long apron stiff with tallow and dripped wax, his sleeves
// rolled, a lit candle held up ("Light's cheap. Darkness costs.").
const OSMUND_WICKE = folk({ build: 'male', skin: 0, hair: 4, dye: 3, hairStyle: 'cropped', beard: false, expression: 'sly' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 4 ? W.woolDark : W.wool));
    apron(g, o, f, 7, 4, (x, y) => ((x * 5 + y * 3) % 9 === 0 ? W.honey : y === -4 ? W.ochreDark : W.wax));
  },
  arm: (g, o) => sleeves(g, o, 5, (_x, y) => (y === 5 ? W.roll : W.linen)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 3 ? W.woolDark : 0));
    shoes(g, o, 2, () => K.leatherDark);
  },
}, { held: { rightArm: candle } });

// Hal Wicke, his son, 23, in love with Elsa: his best clean shirt, an ochre waistcoat, moss breeches, a posy of
// meadow flowers for her.
const HAL_WICKE = folk({ build: 'male', skin: 0, hair: 0, dye: 2, hairStyle: 'short', beard: false, expression: 'cheerful' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y >= 8 || (z === 4 && x >= 3 && x <= 5) ? W.linen : y === 3 ? K.leather : z === 4 && (x === 2 || x === 6) && y % 2 ? K.brass : (x + y) % 4 ? W.ochre : W.ochreDark));
    skirt(g, o, f, 1, () => W.linen);
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.linenShade : W.linen)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.moss : 0));
    shoes(g, o, 2, (_x, y) => (y === 2 ? K.leatherLight : K.leather));
  },
}, { held: { rightArm: posy } });

export const TALLOW_GREEN: Record<string, FrameSpec> = {
  'Goody Thatch': GOODY_THATCH,
  'Agna Bee': AGNA_BEE,
  'Osmund Wicke': OSMUND_WICKE,
  'Hal Wicke': HAL_WICKE,
  'Little Brede': LITTLE_BREDE,
};
