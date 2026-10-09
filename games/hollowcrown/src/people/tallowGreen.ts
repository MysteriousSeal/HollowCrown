// Tallow Green's folk (docs/story/regions/brindle-vale.md, Tallow Green): beekeepers and candle-makers round a green,
// the smell of wax; each dressed as the bible has them, in its order. Who uses it: people/index.ts (PEOPLE).

import type { FrameSpec } from '@voxel/engine/characters';
import { box } from '@voxel/engine/voxel';
import { skep } from './carried';
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

export const TALLOW_GREEN: Record<string, FrameSpec> = {
  'Goody Thatch': GOODY_THATCH,
  'Agna Bee': AGNA_BEE,
  'Little Brede': LITTLE_BREDE,
};
