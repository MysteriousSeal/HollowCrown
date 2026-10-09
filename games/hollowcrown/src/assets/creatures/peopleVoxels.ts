// The Vale's fighting people, each the human body dressed in its faction's gear (gearVoxels.ts):
// - a bandit of the Red Hen: a ragged hood with red feathers in it, a patched leather jerkin over a linen shirt, one
//   leather pauldron, a red rag at the throat, a long knife;
// - Regency herons: kettle helms and grey tabards with the white heron over mail; the spearman with a round shield
//   (the heron on it), the crossbowman in a quilted coat;
// - a Greenhood archer: a green hood and cloak, charcoal smeared across the eyes, a leather jerkin, a bracer, a
//   quiver on the back, a longbow;
// - a Lantern knight: full plate under a grey surcoat, the visor down, a brass lantern burning on the breast, a
//   long-hafted mace;
// - Carrow mercenaries: Duke Ferrand's blue and black, parti-coloured and counterchanged, steel half-plate, a plumed
//   sallet; the pikeman's pike, the arbalester's heavy crossbow.

import type { BodyLook } from '@voxel/engine/characters/human/humanoid';
import { HUMAN_VOXEL_SIZE, bodyPalette, type Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { box, over } from '@voxel/engine/characters/creatures/dress';
import { hashUnit, type Size } from '@voxel/engine/characters/creatures/creatureMesh';
import { MARCH, type FrameSpec, type Held } from '@voxel/engine/characters/creatures/frameRig';
import {
  GEAR_COLORS, GEAR_GLOW, K, bascinet, boots, brow, cloak, crossbow, cuff, gloves, hood, kettleHelm, knife, lanternOnBreast,
  legCover, longbow, mail, plate, polearm, roundShield, sallet, skirt, sleeves, torsoCover,
} from '@voxel/engine/characters/creatures/gearVoxels';

type Painters = Partial<Record<'head' | 'torso' | 'arm' | 'leg', (g: VoxelGrid, o: Size, joint: Joint) => void>>;
const part = (j: Joint) => (j.endsWith('Arm') ? 'arm' : j.endsWith('Leg') ? 'leg' : j) as keyof Painters;
const right = (j: Joint) => j.startsWith('right');
const noise = (x: number, y: number, z: number, salt: number) => hashUnit(x * 7 + y * 31, z, salt);

function person(look: BodyLook, paint: Painters, more: Partial<FrameSpec> = {}): FrameSpec {
  return {
    palette: [...bodyPalette(look), ...GEAR_COLORS],
    base: look,
    paint: (joint, g, o) => paint[part(joint)]?.(g, o, joint),
    glows: GEAR_GLOW,
    gait: MARCH,
    ...more,
  };
}

const UPRIGHT: [number, number, number] = [-1.35, 0, 0]; // (a polearm held near upright, leaning forward)
const pole = (grid: () => VoxelGrid): Held => ({ grid, grip: [1, 1, 5], turn: UPRIGHT }); // (gripped low, its butt at the ground)

// ---- a Red Hen bandit ----

export const BANDIT = person({ build: 'male', skin: 2, hair: 3, dye: 3, hairStyle: 'shaggy', beard: true, expression: 'sly' }, {
  head: (g, o) => {
    hood(g, o, (x, y, z) => (noise(x, y, z, 1) < 0.3 ? K.ragDark : K.rag));
    box(g, o, 10, 10, 3, 11, 13, 3, (_x, y) => (y >= 12 ? K.red : K.redDark)); // the Red Hen's feathers
    box(g, o, 11, 11, 4, 11, 12, 4, K.red);
  },
  torso: (g, o) => {
    torsoCover(g, o, (x, y, z) => (y === 3 ? (x === 4 && z === 4 ? K.steelMid : K.leatherDark) : y === 8 && z >= 3 ? K.red : noise(x, y, z, 2) < 0.15 ? K.rag : (x + y) % 5 ? K.leather : K.leatherLight));
    skirt(g, o, 2, (x, y, z) => (y === -2 && (x + z) % 3 === 0 ? 0 : K.leather));
  },
  arm: (g, o, j) => {
    sleeves(g, o, 2, (_x, y) => (y === 2 ? K.ragDark : K.rag));
    if (right(j)) cuff(g, o, 6, 8, (_x, y) => (y === 8 ? K.leatherLight : K.leather)); // one pauldron
    else gloves(g, o, () => K.leatherDark);
  },
  leg: (g, o) => {
    legCover(g, o, 1, 6, (x, y) => ((x + y) % 4 ? K.ragDark : K.rag));
    boots(g, o, 2, (_x, y) => (y === 2 ? K.leather : K.leatherDark));
  },
}, { held: { rightArm: { grid: knife(9), grip: [1, 0.5, 1], turn: [-0.4, 0, 0] } }, gait: { ...MARCH, lean: 0.06 } });

// ---- Regency herons ----

const HERON_LOOK: BodyLook = { build: 'male', skin: 0, hair: 0, dye: 4, hairStyle: 'cropped', beard: false, expression: 'stern' };
// The heron: standing, its long neck up, its beak to the right, white on the grey.
const heron = (x: number, y: number) => ((x === 4 && y >= 4 && y <= 7) || (y === 7 && x === 5) || (y >= 2 && y <= 4 && x >= 3 && x <= 4) || (x === 3 && y <= 1) ? K.white : 0);
const tabardFront = (x: number, y: number, z: number) => (x >= 2 && x <= 6 && (z === 4 || z === 0) ? (z === 4 && heron(x, y + 1) ? K.white : y === 8 ? K.greyDark : K.grey) : 0);

const heronLegs = (g: VoxelGrid, o: Size) => {
  legCover(g, o, 1, 6, (_x, y) => (y === 6 ? K.greyDark : K.grey));
  boots(g, o, 1, () => K.leatherDark);
};

export const HERON_SPEARMAN = person(HERON_LOOK, {
  head: kettleHelm,
  torso: (g, o) => {
    torsoCover(g, o, mail);
    torsoCover(g, o, tabardFront);
    over(g, o, (_x, y, z) => (y === 3 && (z === 1 || z === 3) ? K.leatherDark : 0)); // the belt at its sides
    skirt(g, o, 3, (x, y, z) => (x >= 2 && x <= 6 && (z === -1 || z === 5) ? K.grey : y >= -2 ? mail(x, y, z) : 0));
  },
  arm: (g, o) => {
    sleeves(g, o, 3, mail);
    gloves(g, o, () => K.leather);
  },
  leg: heronLegs,
}, {
  held: {
    rightArm: pole(polearm(34, 'spear')),
    leftArm: { grid: roundShield(K.grey, K.steelDark, (x, y) => heron(x - 1, y - 1)), grip: [5, 5, 0], turn: [0, 0.35, 0] },
  },
});

export const HERON_CROSSBOWMAN = person({ ...HERON_LOOK, skin: 1, hair: 2 }, {
  head: kettleHelm,
  torso: (g, o) => {
    torsoCover(g, o, (x, y) => (y === 3 ? K.leatherDark : x % 2 ? K.padded : K.paddedDark)); // the quilted coat
    torsoCover(g, o, (x, y, z) => (z === 4 && heron(x, y + 1) && x >= 2 && x <= 6 ? K.greyLight : 0)); // the heron, stitched
    skirt(g, o, 3, (x) => (x % 2 ? K.padded : K.paddedDark));
  },
  arm: (g, o) => sleeves(g, o, 2, (_x, y) => (y % 2 ? K.padded : K.paddedDark)),
  leg: heronLegs,
}, { held: { rightArm: { grid: crossbow(false), grip: [5, 1, 4], turn: [0.15, 0, 0] } } });

// ---- a Greenhood archer ----

export const GREENHOOD = person({ build: 'male', skin: 2, hair: 0, dye: 2, hairStyle: 'short', beard: true, expression: 'calm' }, {
  head: (g, o) => {
    hood(g, o, (x, y, z) => ((x + y + z) % 5 === 0 ? K.greenDark : K.green));
    brow(g, o, () => K.greenDark);
    over(g, o, (x, y, z) => (z === 10 && y >= 4 && y <= 6 && x >= 1 && x <= 9 && (x + y) % 3 !== 0 ? K.charcoal : 0)); // smeared across the eyes
  },
  torso: (g, o) => {
    torsoCover(g, o, (x, y, z) => (y === 3 ? K.leatherDark : y === 8 ? K.green : (x + z) % 4 === 0 ? K.leatherLight : K.leather));
    skirt(g, o, 2, () => K.leather);
    cloak(g, o, 4, (x, y) => (x >= 5 && x <= 7 && y >= 2 ? (y === 9 ? K.fletch : K.leatherDark) : (x + y) % 4 ? K.green : K.greenDark)); // the quiver on it
    box(g, o, 5, 10, -2, 7, 10, -2, (x) => (x === 6 ? K.red : K.fletch)); // the fletchings over the shoulder
  },
  arm: (g, o, j) => {
    sleeves(g, o, 4, () => K.green);
    if (!right(j)) cuff(g, o, 2, 3, () => K.leatherDark); // the bracer
  },
  leg: (g, o) => {
    legCover(g, o, 1, 6, (x) => (x % 3 ? K.greenDark : K.leatherDark));
    boots(g, o, 2, () => K.leather);
  },
}, {
  held: { leftArm: { grid: longbow(27, K.wood), grip: [0, 7.5, 2], voxel: HUMAN_VOXEL_SIZE } },
  gait: { ...MARCH, lean: 0.08 },
});

// ---- a Lantern knight ----

export const LANTERN_KNIGHT = person({ build: 'male', skin: 0, hair: 4, dye: 4, hairStyle: 'cropped', beard: true, expression: 'stern' }, {
  head: bascinet,
  torso: (g, o) => {
    torsoCover(g, o, (x, y, z) => (y === 8 ? K.steel : x === 0 || x === 8 ? K.steelDark : z === 4 ? K.steel : K.steelMid));
    torsoCover(g, o, (x, y, z) => (x >= 1 && x <= 7 && y <= 7 && (z === 4 || z === 0) ? (y === 3 ? K.leatherDark : (x + y) % 6 === 0 ? K.grey : K.greyLight) : 0)); // the surcoat
    lanternOnBreast(g, o);
    skirt(g, o, 4, (x, y, z) => (x >= 1 && x <= 7 && (z === -1 || z === 5) ? (y === -4 ? K.greyDark : K.greyLight) : y >= -2 ? K.steelMid : 0)); // its skirts, steel at the hips
  },
  arm: (g, o) => {
    plate(g, o, 0, 8, 4);
    over(g, o, (_x, y) => (y <= 1 ? K.steelDark : 0));
  },
  leg: (g, o) => {
    plate(g, o, 1, 6, 3);
    boots(g, o, 0, () => K.steelDark);
  },
}, {
  held: { rightArm: pole(polearm(30, 'mace')) },
  gait: { ...MARCH, speed: 1.2, legSwing: 0.5, armSwing: 0.3, bob: 0.016 },
});

// ---- Carrow mercenaries ----

const CARROW_LOOK: BodyLook = { build: 'male', skin: 1, hair: 1, dye: 4, hairStyle: 'cropped', beard: false, expression: 'stern' };
const parti = (x: number, flip = false) => ((x < 4) !== flip ? K.blue : K.black); // (its right half blue)

const carrow = (held: Partial<FrameSpec['held']>) =>
  person(CARROW_LOOK, {
    head: (g, o) => sallet(g, o, K.plume),
    torso: (g, o) => {
      torsoCover(g, o, (x) => parti(x));
      torsoCover(g, o, (x, y, z) => (y >= 4 && (z === 4 || z === 0 || x === 0 || x === 8) ? (y === 8 || x === 4 ? K.steel : K.steelMid) : y === 3 ? K.leatherDark : 0)); // the breastplate
      skirt(g, o, 3, (x, y, z) => (y >= -1 && (z === 5 || z === -1) ? K.steelMid : parti(x < 4 ? 0 : 8, z < 0)));
    },
    arm: (g, o, j) => {
      sleeves(g, o, 2, (_x, y) => (y % 2 ? (right(j) ? K.blue : K.black) : right(j) ? K.blueDark : K.blackLight)); // slashed sleeves
      cuff(g, o, 7, 8, (_x, y) => (y === 8 ? K.steel : K.steelMid)); // pauldrons
      gloves(g, o, () => K.leatherDark);
    },
    leg: (g, o, j) => {
      legCover(g, o, 1, 6, () => (right(j) ? K.black : K.blue)); // counterchanged
      boots(g, o, 1, () => K.black);
    },
  }, { held });

export const CARROW_PIKEMAN = carrow({ rightArm: pole(polearm(46, 'pike')) });
export const CARROW_ARBALESTER = carrow({ rightArm: { grid: crossbow(true), grip: [6, 1, 4], turn: [0.15, 0, 0] } });
