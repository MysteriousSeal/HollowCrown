// The Regency checkpoint at Hob's Tower (docs/story/regions/brindle-vale.md, Hob's Tower, CT-BV1): Sergeant Matthias
// Crow and his three, herons in kettle helms and grey tabards (as the bestiary has them): pressed farm boys and hard
// veterans. Who uses it: people/index.ts (PEOPLE: Crow), creatures/index.ts (the three).

import { crossbow, kettleHelm, polearm, roundShield, type FrameSpec, type Held } from '@voxel/engine/characters';
import { box, over, type Size, type VoxelGrid } from '@voxel/engine/voxel';
import { body, C, folk, K, shoes, skirt, sleeves, type Fit } from './kit';

const UPRIGHT: [number, number, number] = [-1.35, 0, 0];
const spear: Held = { grid: polearm(32, 'spear'), grip: [1, 1, 5], turn: UPRIGHT };
const mail = (x: number, y: number, z: number) => ((x + y + z) % 2 ? K.mail : K.mailDark);

// The grey tabard over mail, front and back, the heron in white on the breast (its neck and beak, its body), belted.
const tabard = (g: VoxelGrid, o: Size, f: Fit, under: (x: number, y: number, z: number) => number) => {
  const m = Math.floor(f.w / 2);
  body(g, o, (x, y, z) => (y === 3 ? K.leatherDark : x >= 1 && x <= f.w - 2 && (z === 4 || z === 0) ? (z === 4 && ((x === m && y >= 5 && y <= 7) || (y === 7 && x === m + 1) || (y === 5 && x === m - 1)) ? K.white : y === 8 ? K.greyDark : K.grey) : under(x, y, z)));
  skirt(g, o, f, 3, (x, y, z) => (x >= 1 && x <= f.w - 2 && (z === -1 || z === f.d) ? (y === -3 ? K.greyDark : K.grey) : y >= -1 ? under(x, y, z) : 0));
};
const greyLegs = (g: VoxelGrid, o: Size) => {
  body(g, o, (_x, y) => (y >= 2 ? (y === 6 ? K.greyDark : K.grey) : 0));
  shoes(g, o, 1, () => K.leatherDark);
};

// Sergeant Matthias Crow: a hard veteran gone grey, stubbled, a scar down his cheek, a black crow's feather in his
// helm's band, his tabard faded, a brass gorget at his throat (his rank), the spear he raises the bar with.
const CROW = folk({ build: 'male', skin: 1, hair: 4, dye: 4, hairStyle: 'cropped', beard: true, expression: 'stern' }, {
  head: (g, o) => {
    kettleHelm(g, o);
    box(g, o, 9, 10, 3, 9, 14, 3, (_x, y) => (y === 14 ? K.blackLight : K.black)); // the crow's feather
    over(g, o, (x, y, z, c) => (z === 10 && x === 8 && y >= 3 && y <= 6 && c === C.skin ? C.skinDeep : 0)); // the scar
  },
  torso: (g, o, f) => {
    tabard(g, o, f, mail);
    body(g, o, (x, y, z) => (y === 8 && z >= 3 && x >= 2 && x <= 6 ? (x === 4 ? K.brass : K.brassDark) : 0)); // the gorget
  },
  arm: (g, o) => {
    sleeves(g, o, 3, mail);
    over(g, o, (_x, y) => (y <= 1 ? K.leatherDark : 0)); // gloves
  },
  leg: greyLegs,
}, { held: { rightArm: spear }, gait: { speed: 1.3 } });

// A pressed farm boy: a helm too big for him, a padded coat, the heron sewn on crooked, a spear he holds too tight.
const RECRUIT = folk({ build: 'male', skin: 0, hair: 2, dye: 3, hairStyle: 'short', beard: false, expression: 'wistful' }, {
  head: kettleHelm,
  torso: (g, o, f) => tabard(g, o, f, (x) => (x % 2 ? K.padded : K.paddedDark)),
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y % 2 ? K.padded : K.paddedDark)),
  leg: greyLegs,
}, { held: { rightArm: spear }, scale: 0.93 });

// A veteran crossbowman: mail under the tabard, a crossbow, a face that has seen the Wet Years from the wrong side.
const VETERAN = folk({ build: 'male', skin: 2, hair: 1, dye: 4, hairStyle: 'cropped', beard: true, expression: 'stern' }, {
  head: kettleHelm,
  torso: (g, o, f) => tabard(g, o, f, mail),
  arm: (g, o) => sleeves(g, o, 3, mail),
  leg: greyLegs,
}, { held: { rightArm: { grid: crossbow(false), grip: [5, 1, 4], turn: [0.15, 0, 0] } } });

// A shieldman: spear and a round grey shield with a white bar across it, the tower's sign.
const SHIELDMAN = folk({ build: 'male', skin: 1, hair: 0, dye: 4, hairStyle: 'cropped', beard: false, expression: 'calm' }, {
  head: kettleHelm,
  torso: (g, o, f) => tabard(g, o, f, mail),
  arm: (g, o) => sleeves(g, o, 3, mail),
  leg: greyLegs,
}, {
  held: {
    rightArm: spear,
    leftArm: { grid: roundShield(K.grey, K.steelDark, (_x, y) => (y === 5 ? K.white : 0)), grip: [5, 5, 0], turn: [0, 0.35, 0] },
  },
});

export const HOBS_TOWER_FOLK: Record<string, FrameSpec> = { 'Matthias Crow': CROW };

// Crow's three, as the checkpoint's soldiers (CREATURES).
export const HOBS_TOWER_GUARD: Array<{ id: string; name: string; spec: FrameSpec }> = [
  { id: 'towerRecruit', name: "Hob's Tower recruit", spec: RECRUIT },
  { id: 'towerVeteran', name: "Hob's Tower crossbowman", spec: VETERAN },
  { id: 'towerShieldman', name: "Hob's Tower shieldman", spec: SHIELDMAN },
];
