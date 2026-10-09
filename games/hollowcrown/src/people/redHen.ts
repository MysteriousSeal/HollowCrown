// The Red Hen camp (docs/story/regions/brindle-vale.md, main-quest-1.md MQ03; characters.md): Brannoc Mabb, the band's
// chief; his five (level 2-3), each in mismatched leather and rags with the Red Hen's red feathers somewhere on them;
// and Hesper Rowe, chained in the back tent, then freed. Who uses it: people/index.ts (PEOPLE: Brannoc, Hesper),
// creatures/index.ts (the band, Brannoc, as foes).

import { cuff, gloves, hood, HUMAN_VOXEL_SIZE, knife, longbow, polearm, type FrameSpec, type Held } from '@voxel/engine/characters';
import { noise3 } from '@voxel/engine/math';
import { box, over, wrap, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { tornHem } from '../creatures/kit';
import { chain, cleaver, club, hatchet } from './carried';
import { body, C, folk, forearms, K, longSkirtLeg, right, shawl, shoes, skirt, sleeves, W } from './kit';

// A hen's feather standing up off the head at (x, z) from row `y`, `h` tall, its tip white.
const feather = (g: VoxelGrid, o: Size, x: number, y: number, z: number, h: number) =>
  box(g, o, x, y, z, x, y + h - 1, z, (_x, yy) => (yy === y + h - 1 ? K.white : yy === y ? K.redDark : K.red));
const ragged = (x: number, y: number, z: number, a: number, b: number) => (noise3(x, y, z, 5) < 0.3 ? b : a);
const UPRIGHT: [number, number, number] = [-1.35, 0, 0];

// ---- Brannoc "Red Hen" Mabb, 40 ----

// A big man gone soft round the belly, a red beard, a broad black hat with a red-dyed hen's feather standing tall in
// its band; a leather jerkin with a fur collar, a red sash across it, poppy vials at his belt; tall boots; a cleaver.
// The one the hero remembers from the road.
const BRANNOC = folk({ build: 'male', skin: 2, hair: 3, dye: 0, hairStyle: 'shaggy', beard: true, expression: 'cheerful' }, {
  head: (g, o) => {
    wrap(g, o, (_x, y) => (y >= 9 ? (y === 9 ? K.red : K.blackLight) : 0)); // the crown, a red band
    box(g, o, -2, 9, -2, 12, 9, 12, (x, _y, z) => (x <= -1 || x >= 11 || z <= -1 || z >= 11 ? K.black : 0)); // the brim
    for (const [x, z, h] of [[9, 4, 6], [10, 3, 5], [9, 2, 4]]) feather(g, o, x, 11, z, h); // the hen's feather, curling back
  },
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 3 ? (z === 4 && (x === 6 || x === 7) ? W.milk : K.leatherDark) : Math.abs(x - y) <= 1 ? K.red : (x + y) % 5 ? K.leather : K.leatherLight)); // the sash, shoulder to hip; two vials at the belt
    wrap(g, o, (_x, y) => (y === 8 || y === 9 ? ((_x + y) % 2 ? W.fur : K.leatherDark) : 0)); // the fur collar
    skirt(g, o, f, 3, (x, y) => (y === -3 && (x % 3 === 0) ? 0 : K.leather));
  },
  arm: (g, o, _f, j) => {
    sleeves(g, o, 3, (x, y, z) => ragged(x, y, z, K.rag, K.ragDark));
    forearms(g, o);
    cuff(g, o, 2, 3, () => (right(j) ? K.leatherDark : K.red)); // a bracer, and a red rag round the left
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 4 ? W.woolDark : 0));
    shoes(g, o, 3, (_x, y) => (y === 3 ? K.leatherLight : K.leatherDark));
  },
}, { held: { rightArm: cleaver }, gait: { lean: 0.04, sway: 0.03 } });

// ---- the band ----

// A knife-thrower: a woman in a red hood, a bandolier of throwing knives across a patched jerkin, a long knife.
const KNIFE_THROWER = folk({ build: 'female', skin: 1, hair: 1, dye: 0, hairStyle: 'bun', beard: false, expression: 'sly' }, {
  head: (g, o) => {
    hood(g, o, (x, y, z) => ragged(x, y, z, K.red, K.redDark));
    feather(g, o, 3, 11, 3, 3);
  },
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (Math.abs(x + 1 - y) <= 0 ? (z === 4 && y % 2 ? K.steel : K.leatherDark) : ragged(x, y, z, K.leather, K.rag))); // the bandolier
    skirt(g, o, f, 3, (x, y, z) => (y < -1 - tornHem(x, z, 3) ? 0 : K.ragDark));
  },
  arm: (g, o) => {
    sleeves(g, o, 3, () => K.ragDark);
    gloves(g, o, () => K.leatherDark);
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? K.rag : 0));
    shoes(g, o, 2, () => K.leatherDark);
  },
}, { held: { rightArm: { grid: knife(7), grip: [1, 0.5, 1], turn: [-0.4, 0, 0] } }, gait: { lean: 0.08 } });

// A brute: bald, huge in the arms, a red rag tied round his head, a sleeveless leather vest, a nailed cudgel.
const BRUTE = folk({ build: 'male', skin: 0, hair: 1, dye: 3, hairStyle: 'bald', beard: true, expression: 'stern' }, {
  head: (g, o) => wrap(g, o, (_x, y, z) => (y === 8 || (y === 7 && z <= 1) ? K.red : 0)),
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (z === 4 && x === 4 ? C.skinShade : y === 3 ? K.leatherDark : (x * 3 + y) % 7 ? K.leatherDark : K.leather)); // open at the chest
    skirt(g, o, f, 2, () => K.leatherDark);
  },
  arm: (g, o) => forearms(g, o),
  leg: (g, o) => {
    body(g, o, (x, y) => (y >= 2 ? ((x + y) % 4 ? K.ragDark : K.rag) : 0));
    shoes(g, o, 1, () => K.leatherDark);
  },
}, { held: { rightArm: club }, scale: 1.08, gait: { lean: 0.1, speed: 1.2 } });

// A spearman: a brown hood stuck with red feathers, a rag cloak over a leather jerkin, a rusty boar-spear.
const SPEAR: Held = { grid: polearm(30, 'spear'), grip: [1, 1, 5], turn: UPRIGHT };
const SPEARMAN = folk({ build: 'male', skin: 1, hair: 0, dye: 3, hairStyle: 'short', beard: true, expression: 'stern' }, {
  head: (g, o) => {
    hood(g, o, (x, y, z) => ragged(x, y, z, W.wool, W.woolDark));
    feather(g, o, 4, 11, 4, 3);
    feather(g, o, 6, 11, 3, 2);
  },
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 4 ? K.leather : K.leatherLight));
    skirt(g, o, f, 3, (x, y, z) => (y < -1 - tornHem(x, z, 9) ? 0 : (z === -1 ? K.ragDark : K.leather)));
  },
  arm: (g, o) => sleeves(g, o, 2, (x, y, z) => ragged(x, y, z, K.rag, K.ragDark)),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? W.wool : 0));
    shoes(g, o, 2, () => K.leatherDark);
  },
}, { held: { rightArm: SPEAR } });

// A poppy-eater (milk in him: he won't feel the blow): hollow, red-eyed, a red scarf, a woodsman's hatchet.
const POPPY_EATER = folk({ build: 'male', skin: 4, hair: 2, dye: 0, hairStyle: 'shaggy', beard: false, expression: 'cheerful' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 8 && z >= 2 ? K.red : ragged(x, y, z, K.rag, K.ragDark)));
    skirt(g, o, f, 2, (x, y, z) => (y < -1 - tornHem(x, z, 4) ? 0 : K.rag));
  },
  arm: (g, o) => sleeves(g, o, 6, () => K.ragDark),
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 3 ? K.ragDark : 0));
    shoes(g, o, 1, () => K.leather);
  },
}, { held: { rightArm: hatchet }, swaps: { cheek: 0xb0605a, mouth: 0x7a3a3a }, gait: { lean: 0.12, sway: 0.06, speed: 1.6 } });

// A lookout: young, a felt cap with a red feather in it, a green-dyed jerkin (stolen from a Greenhood), a short bow.
const LOOKOUT = folk({ build: 'male', skin: 0, hair: 2, dye: 2, hairStyle: 'short', beard: false, expression: 'sly' }, {
  head: (g, o) => {
    wrap(g, o, (_x, y, z) => (y >= 8 && !(y === 8 && z >= 9) ? W.woolDark : 0));
    feather(g, o, 9, 10, 2, 4);
  },
  torso: (g, o, f) => {
    body(g, o, (x, y) => (y === 3 ? K.leatherDark : (x + y) % 4 ? W.moss : W.mossDark));
    skirt(g, o, f, 2, () => W.mossDark);
  },
  arm: (g, o, _f, j) => {
    sleeves(g, o, 2, () => K.rag);
    if (!right(j)) cuff(g, o, 2, 3, () => K.leatherDark);
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 2 ? K.ragDark : 0));
    shoes(g, o, 2, () => K.leather);
  },
}, { held: { leftArm: { grid: longbow(22, K.wood), grip: [0, 6, 2], voxel: HUMAN_VOXEL_SIZE } }, scale: 0.95 });

// ---- Hesper Rowe ----

// A pilgrim woman taken from the road a week ago: her pilgrim's grey dress torn and filthy, her hair loose and
// tangled down her back, a bruise on her cheek. Chained: iron at both wrists and a length of chain from each, her head
// down. Freed: the irons off (the marks still on her wrists), a borrowed shawl round her.
const HESPER_LOOK = { build: 'female', skin: 0, hair: 0, dye: 3, hairStyle: 'long', beard: false, expression: 'wistful' } as const;
const hesperDress = (wrists: number) => ({
  head: (g: VoxelGrid, o: Size) => {
    box(g, o, 0, 1, -1, 10, 9, -1, (x: number, y: number) => (y < 2 + tornHem(x, 0, 6) ? 0 : (x + y) % 3 ? C.hair : C.hairDark)); // loose down her back
    over(g, o, (x: number, y: number, z: number, c: number) => (z === 10 && x === 2 && (y === 3 || y === 4) && c === C.skin ? W.bruise : 0)); // a bruise on her cheek
  },
  torso: (g: VoxelGrid, o: Size, f: { w: number; d: number; arm: number; leg: number }) => {
    body(g, o, (x, y) => ((x + y) % 4 ? W.robe : W.robeDark));
    skirt(g, o, f, 5, (x, y, z) => (y < -2 - tornHem(x, z, 8) ? 0 : ((x + y) % 4 ? W.robe : W.robeDark)));
  },
  arm: (g: VoxelGrid, o: Size) => {
    sleeves(g, o, 4, (x, y) => ((x + y) % 4 ? W.robe : W.robeDark));
    cuff(g, o, 2, 2, () => wrists);
  },
  leg: (g: VoxelGrid, o: Size) => longSkirtLeg(g, o, (x, y) => ((x + y) % 4 ? W.robeDark : W.robe), 4),
});
const HESPER_FREED: FrameSpec = folk(HESPER_LOOK, {
  ...hesperDress(W.bruise),
  torso: (g, o, f) => {
    hesperDress(0).torso(g, o, f);
    shawl(g, o, f, (x, y) => ((x + y) % 3 ? W.shawl : W.shawlDark));
  },
}, { gait: { headBow: 0.1, speed: 1.1 } });
const HESPER_CHAINED: FrameSpec = folk(HESPER_LOOK, hesperDress(W.iron), {
  held: { leftArm: chain, rightArm: chain },
  gait: { headBow: 0.35, lean: 0.08, armSwing: 0.05, speed: 0.8 },
});

// The camp's people with names (PEOPLE); Hesper freed, and chained as the hero finds her.
export const RED_HEN_FOLK = {
  'Brannoc Mabb': BRANNOC,
  'Hesper Rowe': { spec: HESPER_FREED, variants: { chained: HESPER_CHAINED } },
};

// The band as foes (CREATURES): Brannoc, their chief, and his five.
export const RED_HEN_BAND: Array<{ id: string; name: string; spec: FrameSpec }> = [
  { id: 'brannoc', name: 'Brannoc Mabb (Red Hen chief)', spec: BRANNOC },
  { id: 'redHenKnifeThrower', name: 'Red Hen knife-thrower', spec: KNIFE_THROWER },
  { id: 'redHenBrute', name: 'Red Hen brute', spec: BRUTE },
  { id: 'redHenSpearman', name: 'Red Hen spearman', spec: SPEARMAN },
  { id: 'redHenPoppyEater', name: 'Red Hen poppy-eater', spec: POPPY_EATER },
  { id: 'redHenLookout', name: 'Red Hen lookout', spec: LOOKOUT },
];
