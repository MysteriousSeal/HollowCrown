// The Vale's trees that are known by name (docs/story/regions/brindle-vale.md), as voxel grids at the buildings' voxel:
// old oaks, broader and darker than the woods' ones, each with what makes it itself.

import { colorAt, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { N, OAK_BANDS } from './palette';
import { leaves, limb, seeded, treeGrid, trunk, type Volume } from './shaping';

// An old oak: a trunk five voxels thick leaning `lean`, under a broad low dome of puffs on thick limbs, no warm
// highlight on top (it's older, darker than the rest). `limbs`: any of its own, drawn before the leaves (so they show).
function oldOakGrid(seed: number, lean: [number, number], limbs?: (g: VoxelGrid, tx: number, tz: number) => void) {
  const { g, mid } = treeGrid([57, 50, 57]);
  const rand = seeded(seed);
  const top = 17;
  const [tx, tz] = trunk(g, mid, top, lean, 5);
  limbs?.(g, tx, tz);
  const [cx, cz] = [tx + lean[0] * 2, tz + lean[1] * 2];
  const puffs: Volume[] = [{ cx, cy: top + 15, cz, rx: 11, ry: 7, rz: 11 }];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + rand() * 0.4;
    const reach = 11 + rand() * 4;
    const r = 6 + rand() * 1.5;
    const p = { cx: cx + Math.cos(angle) * reach, cy: top + 6 + rand() * 6, cz: cz + Math.sin(angle) * reach, rx: r, ry: r * 0.75, rz: r };
    puffs.push(p);
    limb(g, [tx, top - 1, tz], [cx + (p.cx - cx) * 0.75, p.cy - 1, cz + (p.cz - cz) * 0.75], 1.4);
  }
  leaves(g, puffs, OAK_BANDS.slice(0, 6), seed, 0.07);
  return { g, tx: Math.floor(tx), tz: Math.floor(tz) };
}

// The Hanging Oak, where the South Road bends: its lowest bough reaching out over the road (+x) with a frayed rope
// still on it (the Wet Years: a family hanged themselves there together rather than starve), the hollow in its trunk
// (+z) where the Red Hen's drop-box is.
export function hangingOak(): VoxelGrid {
  let bough: [number, number, number] = [0, 0, 0];
  const { g, tx, tz } = oldOakGrid(0x4a6, [-1, 0], (g, x, z) => {
    bough = [Math.floor(x) + 21, 15, Math.floor(z) + 1]; // low, long, near level
    limb(g, [x, 11, z], bough, 1.6);
  });
  // the leaves stop short of the bough's end: clear round it, so the rope hangs in the open
  for (let x = bough[0] - 7; x <= bough[0] + 2; x++) {
    for (let y = bough[1] - 1; y <= bough[1] + 6; y++) {
      for (let z = bough[2] - 4; z <= bough[2] + 4; z++) if (OAK_BANDS.includes(colorAt(g, x, y, z))) setColor(g, x, y, z, 0);
    }
  }
  // the rope: from near the bough's end, frayed short of a man's height off the ground
  for (let y = bough[1] - 1; y >= 7; y--) setColor(g, bough[0] - 3, y, bough[2], N.rope);
  setColor(g, bough[0] - 4, 6, bough[2], N.rope);
  setColor(g, bough[0] - 2, 6, bough[2], N.rope);
  // the hollow: a dark mouth in the trunk at chest height, toward the lane
  for (let y = 7; y <= 10; y++) for (let x = tx - 1; x <= tx; x++) setColor(g, x, y, tz + 2, N.hollow);
  return g;
}

// Tallow Green's oak, in the middle of the green: upright, its crown the widest in the Vale, a bench of planks round
// its trunk where the village sits of an evening.
export function greenOak(): VoxelGrid {
  const { g, tx, tz } = oldOakGrid(0x96e, [0, 0]);
  for (let x = tx - 6; x <= tx + 6; x++) {
    for (let z = tz - 6; z <= tz + 6; z++) {
      const r = Math.max(Math.abs(x - tx), Math.abs(z - tz));
      if (r >= 5 && colorAt(g, x, 4, z) === 0) setColor(g, x, 4, z, N.barkLight); // the seat, square round the trunk
      if (r === 6 && (x - tx) % 4 === 0 && (z - tz) % 4 === 0) for (let y = 0; y < 4; y++) setColor(g, x, y, z, N.barkDark); // its legs
    }
  }
  return g;
}
