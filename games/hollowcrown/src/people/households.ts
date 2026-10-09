// The people of Brindleford's ten houses (docs/story/regions/brindle-vale.md, the houses' table), in the table's order
// (Old Meg, the first, is with the named folk in brindleford.ts; the Holt house stands empty). Who uses it:
// people/index.ts (PEOPLE).

import { hood, type FrameSpec } from '@voxel/engine/characters';
import { box } from '@voxel/engine/voxel';
import { apron, body, cap, coif, cup, folk, K, longSkirtLeg, shoes, skirt, sleeves, staff, strawHat, W } from './kit';

const linenCoif = (g: Parameters<typeof coif>[0], o: Parameters<typeof coif>[1]) => coif(g, o, (x, _y, z) => ((x + z) % 4 ? W.linen : W.linenShade), W.linenShade);

// ---- the Reedes' ----

// Rolf Reede, the thatcher, 38: a straw hat, a pale smock, and a bundle of reed bound on his back for someone else's
// roof (his own leaks).
const ROLF_REEDE = folk({ build: 'male', skin: 0, hair: 2, dye: 3, hairStyle: 'short', beard: true, expression: 'calm' }, {
  head: strawHat,
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 4 ? W.linenShade : W.linenDark));
    skirt(g, o, f, 2, () => W.linenShade);
    box(g, o, 1, -2, -2, f.w - 2, 10, -2, (x, y) => (y === 1 || y === 7 ? W.string : (x + y) % 3 ? W.straw : W.strawDark)); // the reed bundle, bound twice
  },
  arm: (g, o) => sleeves(g, o, 4, (_x, y) => (y === 4 ? W.linenDark : W.linenShade)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.wool : 0));
    shoes(g, o, 2, () => K.leatherDark);
  },
});

// Tamsin Reede, 35: black hair under a linen coif, a madder-red dress, her sleeves rolled, an apron; she'd go to
// Kingsmere tomorrow.
const TAMSIN = folk({ build: 'female', skin: 0, hair: 1, dye: 0, hairStyle: 'bun', beard: false, expression: 'wistful' }, {
  head: linenCoif,
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y >= 7 ? W.linen : (x + y) % 4 ? W.wine : W.wineDark));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 4 ? W.wine : W.wineDark));
    apron(g, o, f, 0, 4, (_x, y) => (y === -4 ? W.apronHem : W.apron));
  },
  arm: (g, o) => sleeves(g, o, 5, (_x, y) => (y === 5 ? W.roll : W.linen)),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.wine : W.wineDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
});

// ---- Joan Lusk's ----

// Joan Lusk, the carter, 50: grey, weathered, a brown wool hood against the road, a leather jerkin over her shift, a
// long wool skirt, her whip in hand.
const JOAN_LUSK = folk({ build: 'female', skin: 2, hair: 4, dye: 3, hairStyle: 'bun', beard: false, expression: 'stern' }, {
  head: (g, o) => hood(g, o, (x, y, z) => ((x + y + z) % 5 ? W.wool : W.woolDark)),
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 2 ? K.leatherDark : (x + y) % 5 ? K.leather : K.leatherLight));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 4 ? W.woolLight : W.wool));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.linenDark : W.linenShade)),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.woolLight : W.wool));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { rightArm: staff(11, 'plain', 4) } });

// ---- the Tidys' ----

// Edric Tidy, the hayward, 44: a felt cap, a moss-green tunic, the crook he keeps the hedges and the strays with.
const EDRIC_TIDY = folk({ build: 'male', skin: 1, hair: 2, dye: 2, hairStyle: 'short', beard: true, expression: 'wistful' }, {
  head: (g, o) => cap(g, o, W.woolDark, W.wool),
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 4 ? W.moss : W.mossDark));
    skirt(g, o, f, 3, (x, y) => (y === -3 ? W.mossDark : (x + y) % 4 ? W.moss : W.mossDark));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.mossDark : W.moss)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.wool : 0));
    shoes(g, o, 2, (_x, y) => (y === 2 ? K.leather : K.leatherDark));
  },
}, { held: { rightArm: staff(13, 'crook', 5) } });

// Wynn Tidy, 40: in dark wool for her children in the pit, a linen coif, the cup of milk she sets on the sill.
const WYNN = folk({ build: 'female', skin: 1, hair: 0, dye: 4, hairStyle: 'bun', beard: false, expression: 'wistful' }, {
  head: linenCoif,
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y >= 8 ? W.linenShade : (x + y) % 5 ? W.woolDark : W.wool));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 5 ? W.woolDark : W.wool));
  },
  arm: (g, o) => sleeves(g, o, 2, () => W.woolDark),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 5 ? W.woolDark : W.wool));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { rightArm: cup } });

export const HOUSEHOLDS: Record<string, FrameSpec> = {
  'Rolf Reede': ROLF_REEDE,
  'Tamsin': TAMSIN,
  'Joan Lusk': JOAN_LUSK,
  'Edric Tidy': EDRIC_TIDY,
  'Wynn': WYNN,
};
