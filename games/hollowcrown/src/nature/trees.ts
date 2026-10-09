// The Vale's trees as voxel grids, at the buildings' voxel (16 a tile), silhouette first. Oaks: broad and dark, separate
// leaf puffs on visible limbs over a short leaning trunk. Birches: slender white stems, small airy puffs climbing them,
// leaves already turning. Pines: tall, lobed tiers stacked up a trunk, each its own cone, its dark skirt over the next
// one's lit top. Three of each, each its own outline at a glance. Built once each (forests.ts draws them by the
// thousand, instanced), so they're kept cheap: few colors side by side, shading in blocks.

import { VoxelModel } from '@voxel/engine/models';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';
import { colorAt, forEachVoxel, inGrid, nibble, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { BIRCH_BANDS, N, NATURE_LOOK, OAK_BANDS, PINE_BANDS } from './palette';
import { birchStem, leaves, limb, marked, seeded, shadeMarked, treeGrid, trunk, type Volume } from './shaping';

export type Species = 'oak' | 'birch' | 'pine';
export const SPECIES: Species[] = ['oak', 'birch', 'pine'];

// ---- oaks ----

// An oak's outline: its trunk's height, its crown's top puff (how far over the trunk, how wide, how tall, thrown how
// far the way it leans), its side puffs (how many, how far out, how big, how high over the trunk's top, how squat, how
// much of the way round they go, centred on the lean).
interface OakForm {
  trunk: number;
  crown: { up: number; rx: number; ry: number; shift: number };
  sides: number;
  reach: number;
  r: number;
  rise: [number, number];
  flat: number;
  arc: number;
}
const OAK_FORMS: OakForm[] = [
  // broad and spreading: a short trunk under a low crown far wider than it's tall
  { trunk: 11, crown: { up: 10, rx: 7.5, ry: 4.8, shift: 0 }, sides: 6, reach: 8.5, r: 4.8, rise: [2, 3], flat: 0.65, arc: 1 },
  // tall and round: puffs stacked up a long trunk
  { trunk: 16, crown: { up: 12, rx: 5.5, ry: 5.5, shift: 0 }, sides: 5, reach: 5, r: 4.4, rise: [-1, 10], flat: 0.9, arc: 1 },
  // lopsided: its crown thrown out to one side, reaching for the light
  { trunk: 13, crown: { up: 10, rx: 6, ry: 5, shift: 3 }, sides: 4, reach: 7, r: 4.8, rise: [2, 6], flat: 0.8, arc: 0.45 },
];

function oak(variant: number): VoxelGrid {
  const form = OAK_FORMS[variant];
  const { g, mid } = treeGrid([37, 36, 37]);
  const rand = seeded(0x0a4 + variant * 131);
  const lean: [number, number] = ([[1, 0], [0, 1], [-1, 0]] as Array<[number, number]>)[variant];
  const [tx, tz] = trunk(g, mid, form.trunk, lean);
  const toward = Math.atan2(lean[1], lean[0]);
  const { crown } = form;
  const puffs: Volume[] = [{ cx: tx + lean[0] * crown.shift, cy: form.trunk + crown.up, cz: tz + lean[1] * crown.shift, rx: crown.rx, ry: crown.ry, rz: crown.rx }];
  for (let i = 0; i < form.sides; i++) {
    const angle = toward + ((i + 0.5) / form.sides - 0.5) * form.arc * Math.PI * 2 + (rand() - 0.5) * 0.5;
    const reach = form.reach * (0.9 + rand() * 0.2);
    const r = form.r * (0.85 + rand() * 0.3);
    const p = { cx: tx + Math.cos(angle) * reach, cy: form.trunk + form.rise[0] + rand() * form.rise[1], cz: tz + Math.sin(angle) * reach, rx: r, ry: r * form.flat, rz: r };
    puffs.push(p);
    limb(g, [tx, form.trunk - 1, tz], [tx + (p.cx - tx) * 0.75, p.cy - 1, tz + (p.cz - tz) * 0.75], 1.1);
  }
  leaves(g, puffs, OAK_BANDS, 0x0a4 + variant, 0.06);
  return g;
}

// ---- birches ----

// A birch's stems: where each one's foot is (off the middle), how tall, which way it kinks, and its puffs (how many,
// from how far up it, as a share of its height).
interface Stem {
  at: [number, number];
  height: number;
  kink: [number, number];
  puffs: number;
  from: number;
}
const BIRCH_FORMS: Stem[][] = [
  // a lone birch, leafy most of the way up
  [{ at: [0, 0], height: 29, kink: [1, 0], puffs: 6, from: 0.4 }],
  // twin stems forking from one foot, each with its own crown
  [{ at: [-3, -1], height: 27, kink: [-1, 0], puffs: 4, from: 0.45 }, { at: [3, 2], height: 21, kink: [1, 1], puffs: 3, from: 0.45 }],
  // tall and bare-stemmed, its leaves only up top
  [{ at: [0, 0], height: 33, kink: [0, 1], puffs: 5, from: 0.62 }],
];

function birch(variant: number): VoxelGrid {
  const { g, mid } = treeGrid([23, 40, 23]);
  const rand = seeded(0xb1c + variant * 131);
  const puffs: Volume[] = [];
  for (const stem of BIRCH_FORMS[variant]) {
    const [tx, tz] = birchStem(g, [mid - 1 + stem.at[0], mid - 1 + stem.at[1]], stem.height, stem.kink, rand);
    puffs.push({ cx: tx, cy: stem.height + 2, cz: tz, rx: 4, ry: 4.2, rz: 4 });
    const low = stem.height * stem.from;
    for (let i = 0; i < stem.puffs; i++) {
      const angle = i * 2.4 + rand() * 0.5; // (round the stem by the golden angle)
      const reach = 2.6 + rand() * 1.4;
      const r = 3 + rand() * 1;
      const p = { cx: tx + Math.cos(angle) * reach, cy: low + ((stem.height - low) * i) / stem.puffs + rand() * 2, cz: tz + Math.sin(angle) * reach, rx: r, ry: r * 1.15, rz: r };
      puffs.push(p);
      limb(g, [tx, p.cy - 3, tz], [p.cx, p.cy - 1, p.cz], 0.6, N.birchShade);
    }
  }
  leaves(g, puffs, BIRCH_BANDS, 0xb1c + variant, 0.12, { color: N.birchGold, chance: 0.08 }); // (airy, see-through crowns)
  return g;
}

// ---- pines ----

// A pine's tiers, bottom up: each [where it starts, how tall, how wide at its base], voxels.
const PINE_FORMS: Array<Array<[number, number, number]>> = [
  // a tall, narrow spruce
  [[4, 9, 8], [10, 9, 7.2], [16, 8, 6.2], [22, 8, 5.2], [28, 7, 4], [33, 7, 2.8]],
  // a broad fir, low and wide
  [[5, 10, 11.5], [12, 10, 9], [19, 9, 6.5], [25, 9, 4.2]],
  // a windswept pine: its tiers apart, the trunk showing between them
  [[8, 6, 9], [16, 6, 7], [23, 5, 5], [29, 5, 3.2]],
];

function pine(variant: number): VoxelGrid {
  const tiers = PINE_FORMS[variant];
  const { g, mid } = treeGrid([27, 44, 27]);
  const rand = seeded(0x914 + variant * 131);
  const [lastBase, lastHeight] = tiers[tiers.length - 1];
  const crown = lastBase + lastHeight - 1;
  const [cx, cz] = trunk(g, mid, crown - 3, [0, 0]);
  // Each tier a cone, its outline lobed like clumps of branches, its branch tips drooping below its base. Each higher
  // tier overwrites the top of the one below, so its dark skirt sits over the other's lit top.
  const tips: Array<[number, number, number]> = [];
  tiers.forEach(([base, height, radius], i) => {
    const lobes = 6 + Math.floor(rand() * 2);
    const phase = rand() * Math.PI * 2;
    forEachVoxel(g, (x, y, z) => {
      if (y < base || y >= base + height) return;
      const t = (y - base) / (height - 1);
      const r = radius * (1 - t) + 0.8 * t;
      const [dx, dz] = [x + 0.5 - cx, z + 0.5 - cz];
      if (Math.hypot(dx, dz) <= r * (1 + 0.14 * Math.sin(lobes * Math.atan2(dz, dx) + phase))) setColor(g, x, y, z, marked(i));
    });
    for (let l = 0; l < lobes; l++) {
      const angle = (l / lobes) * Math.PI * 2 + (Math.PI / 2 - phase) / lobes;
      const [x, z] = [Math.floor(cx + Math.cos(angle) * radius), Math.floor(cz + Math.sin(angle) * radius)];
      if (inGrid(g, x, base - 1, z)) tips.push([x, base - 1, z]);
    }
  });
  for (let y = crown + 1; y <= crown + 3; y++) setColor(g, Math.floor(cx), y, Math.floor(cz), marked(tiers.length - 1)); // the leader
  tiers.forEach(([base], i) => nibble(g, rand, 0.04, base + 1, marked(i)));
  const tierVolume = (i: number): Volume => {
    const [base, height, radius] = tiers[i];
    return { cx, cy: base + height * 0.35, cz, rx: radius, ry: height * 0.65, rz: radius };
  };
  shadeMarked(g, tierVolume, PINE_BANDS, 0x914 + variant, 0.6, -0.7);
  for (const [x, y, z] of tips) setColor(g, x, y, z, N.pineTip);
  // a few cones hanging under the lower tiers, half hidden near the trunk
  tiers.slice(0, -1).forEach(([base, , radius]) => {
    const angle = rand() * Math.PI * 2;
    const [x, z] = [Math.floor(cx + Math.cos(angle) * radius * 0.55), Math.floor(cz + Math.sin(angle) * radius * 0.55)];
    if (colorAt(g, x, base - 1, z) === 0 && colorAt(g, x, base, z) !== 0) setColor(g, x, base - 1, z, N.cone);
  });
  return g;
}

// ---- every tree ----

const BUILD: Record<Species, (variant: number) => VoxelGrid> = { oak, birch, pine };
export const VARIANTS = 3; // shapes of each species

const grids = new Map<string, VoxelGrid>();

// A tree's grid (built once).
export function treeVoxels(species: Species, variant: number): VoxelGrid {
  const key = `${species}${variant}`;
  if (!grids.has(key)) grids.set(key, BUILD[species](variant % VARIANTS));
  return grids.get(key)!;
}

// A tree standing on its own (the model viewer, a landmark).
export const treeModel = (species: Species, variant: number): VoxelModel => new VoxelModel(treeVoxels(species, variant), NATURE_LOOK, { voxel: STRUCTURE_VOXEL });
