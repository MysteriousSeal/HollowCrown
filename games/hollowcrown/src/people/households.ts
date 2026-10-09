// The people of Brindleford's ten houses (docs/story/regions/brindle-vale.md, the houses' table), in the table's order
// (Old Meg, the first, is with the named folk in brindleford.ts; the Holt house stands empty). Who uses it:
// people/index.ts (PEOPLE).

import { cloak, cuff, hood, HUMAN_VOXEL_SIZE, longbow, type FrameSpec } from '@voxel/engine/characters';
import { noise3 } from '@voxel/engine/math';
import { box } from '@voxel/engine/voxel';
import { apron, body, cap, coif, cup, eelTrap, folk, K, longSkirtLeg, OLD, right, shawl, shoes, skirt, sleeves, staff, strawHat, stump, W } from './kit';

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

// ---- Sibyl Hask's ----

// Sibyl Hask, the weaver, 48: a linen coif, a madder bodice, and a skirt of her own weaving, banded madder, ochre and
// woad.
const weave = (_x: number, y: number) => [W.wine, W.ochre, W.wine, W.woad][((y % 4) + 4) % 4];
const SIBYL_HASK = folk({ build: 'female', skin: 0, hair: 4, dye: 0, hairStyle: 'bun', beard: false, expression: 'calm' }, {
  head: linenCoif,
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y >= 8 ? W.linen : (x + y) % 4 ? W.wine : W.wineDark));
    skirt(g, o, f, 5, weave);
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.linenShade : W.linen)),
  leg: (g, o) => {
    longSkirtLeg(g, o, weave);
    shoes(g, o, 0, () => K.leatherDark);
  },
});

// ---- the Orrs' ----

// Gammer Orr, 78: stooped over a stick, white hair under a coif, a faded russet dress, a dark shawl.
const GAMMER_ORR = folk({ build: 'female', skin: 1, hair: 7, dye: 3, hairStyle: 'bun', beard: false, expression: 'stern' }, {
  head: linenCoif,
  torso: (g, o, f) => {
    body(g, o, (x, y) => ((x + y) % 4 ? W.russet : W.russetDark));
    shawl(g, o, f, (x, y) => ((x + y) % 3 ? W.woolDark : W.wool));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 4 ? W.russet : W.russetDark));
  },
  arm: (g, o) => sleeves(g, o, 2, () => W.russetDark),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.russet : W.russetDark));
    shoes(g, o, 0, () => K.leatherDark);
  },
}, { held: { rightArm: staff(8, 'plain', 4) }, gait: OLD });

// Simkin Orr, 80, nearly blind: bald, a long white beard, his eyes clouded, bent over a stick in an old brown coat.
const SIMKIN_ORR = folk({ build: 'male', skin: 1, hair: 7, dye: 3, hairStyle: 'bald', beard: true, expression: 'wistful' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 5 ? W.woolLight : W.wool));
    skirt(g, o, f, 4, (x, y) => (y === -4 ? W.wool : (x + y) % 5 ? W.woolLight : W.wool));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.wool : W.woolLight)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.woolDark : 0));
    shoes(g, o, 1, () => K.leatherDark);
  },
}, { held: { rightArm: staff(8, 'plain', 4) }, gait: { ...OLD, lean: 0.36, speed: 0.7 }, swaps: { eye: 0xa8a8a0 } });

// ---- the old ferry cottage ----

// Ned Tolley, the drover, 30: shaggy and unshaven, a leather jerkin, a short brown cloak, tall boots for the mud, the
// long goad he drives the beasts with.
const NED_TOLLEY = folk({ build: 'male', skin: 1, hair: 1, dye: 2, hairStyle: 'shaggy', beard: true, expression: 'sly' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 5 ? K.leather : K.leatherLight));
    skirt(g, o, f, 2, () => K.leather);
    cloak(g, o, 2, (x, y) => ((x + y) % 4 ? W.wool : W.woolDark));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y === 2 ? W.linenDark : W.linenShade)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 4 ? W.moss : 0));
    shoes(g, o, 3, (_x, y) => (y === 3 ? K.leatherLight : K.leatherDark));
  },
}, { held: { rightArm: staff(15, 'plain', 5) } });

// ---- the Fletchers' ----

// Alys Fletcher, the fletcher, 33, the vale's best shot: auburn hair, a moss jerkin, a quiver of her own arrows on
// her back, a bracer on her bow arm, the longbow.
const ALYS_FLETCHER = folk({ build: 'female', skin: 1, hair: 6, dye: 2, hairStyle: 'bun', beard: false, expression: 'calm' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 4 ? W.moss : W.mossDark));
    skirt(g, o, f, 3, (x, y) => (y === -3 ? W.mossDark : (x + y) % 4 ? W.moss : W.mossDark));
    box(g, o, 2, 1, -2, 4, 10, -2, (x, y) => (y === 10 ? (x === 3 ? K.red : K.fletch) : y === 1 || y === 9 ? K.leatherDark : K.leather)); // the quiver
  },
  arm: (g, o, _f, j) => {
    sleeves(g, o, 2, (_x, y) => (y === 2 ? W.linenShade : W.linen));
    if (!right(j)) cuff(g, o, 2, 3, () => K.leatherDark); // the bracer
  },
  leg: (g, o) => {
    body(g, o, () => W.woolDark);
    shoes(g, o, 2, (_x, y) => (y === 2 ? K.leatherLight : K.leather));
  },
}, { held: { leftArm: { grid: longbow(27, K.wood), grip: [0, 7.5, 2], voxel: HUMAN_VOXEL_SIZE } } });

// Cob Fletcher, 36: back from the Regency's levy in its faded heron-grey coat, stained, his right hand gone at the
// wrist, the stump bound in rag.
const COB = folk({ build: 'male', skin: 0, hair: 0, dye: 3, hairStyle: 'short', beard: true, expression: 'stern' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 3 ? K.leatherDark : noise3(x, y, z, 31) < 0.2 ? W.heronDark : W.heron));
    skirt(g, o, f, 3, (x, y) => (x === 4 ? 0 : y === -3 ? W.heronDark : W.heron));
  },
  arm: (g, o, f, j) => {
    sleeves(g, o, 2, (_x, y) => (y === 2 ? W.heronDark : W.heron));
    if (right(j)) stump(g, o, f);
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.wool : 0));
    shoes(g, o, 2, () => K.leatherDark);
  },
});

// ---- the Hollins' ----

// Bran Hollin, the eel-trapper, 25: a shirt with the sleeves rolled, breeches rolled to the knee, bare wet shins and
// feet, a wicker eel trap under his arm.
const BRAN_HOLLIN = folk({ build: 'male', skin: 0, hair: 2, dye: 1, hairStyle: 'short', beard: false, expression: 'calm' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? W.string : (x + y) % 4 ? W.linenShade : W.linenDark));
    skirt(g, o, f, 1, () => W.linenShade);
  },
  arm: (g, o) => sleeves(g, o, 5, (_x, y) => (y === 5 ? W.linenDark : W.linenShade)),
  leg: (g, o) => body(g, o, (_x, y) => (y >= 4 ? (y === 4 ? W.wool : W.woolDark) : 0)),
}, { held: { leftArm: eelTrap } });

// Gert Hollin, his mother, 60, who tells everyone everything: grey hair under a red kerchief, a brown dress, an apron.
const GERT = folk({ build: 'female', skin: 0, hair: 4, dye: 0, hairStyle: 'bun', beard: false, expression: 'sly' }, {
  head: (g, o) => coif(g, o, (_x, _y, z) => (z <= 2 ? W.kerchiefDark : W.kerchief), W.kerchiefDark),
  torso: (g, o, f) => {
    body(g, o, (x, y) => ((x + y) % 4 ? W.woolLight : W.wool));
    skirt(g, o, f, 5, (x, y) => ((x + y) % 4 ? W.woolLight : W.wool));
    apron(g, o, f, 0, 4, (_x, y) => (y === -4 ? W.apronHem : W.apron));
  },
  arm: (g, o) => sleeves(g, o, 2, () => W.woolLight),
  leg: (g, o) => {
    longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.woolLight : W.wool));
    shoes(g, o, 0, () => K.leatherDark);
  },
});

export const HOUSEHOLDS: Record<string, FrameSpec> = {
  'Rolf Reede': ROLF_REEDE,
  'Tamsin Reede': TAMSIN,
  'Joan Lusk': JOAN_LUSK,
  'Edric Tidy': EDRIC_TIDY,
  'Wynn Tidy': WYNN,
  'Sibyl Hask': SIBYL_HASK,
  'Gammer Orr': GAMMER_ORR,
  'Simkin Orr': SIMKIN_ORR,
  'Ned Tolley': NED_TOLLEY,
  'Alys Fletcher': ALYS_FLETCHER,
  'Cob Fletcher': COB,
  'Bran Hollin': BRAN_HOLLIN,
  'Gert Hollin': GERT,
};
