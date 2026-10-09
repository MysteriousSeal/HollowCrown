// The Vale's trees that are known by name (docs/story/regions/brindle-vale.md), as voxel grids at the buildings' voxel.
// The Hanging Oak, where the South Road bends: old, broad, darker than the woods' oaks, its lowest bough reaching out
// over the road (+x) with a frayed rope still on it (the Wet Years: a family hanged themselves there together rather
// than starve), the hollow in its trunk (+z) where the Red Hen's drop-box is.

import { colorAt, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { N, OAK_BANDS } from './palette';
import { leaves, limb, seeded, treeGrid, trunk, type Volume } from './shaping';

export function hangingOak(): VoxelGrid {
  const { g, mid } = treeGrid([57, 50, 57]);
  const rand = seeded(0x4a6);
  const top = 17;
  const [tx, tz] = trunk(g, mid, top, [-1, 0], 5);
  // the hanging bough: low, long, near level, out over the road
  const bough: [number, number, number] = [Math.floor(tx) + 21, 15, Math.floor(tz) + 1];
  limb(g, [tx, 11, tz], bough, 1.6);
  // the crown: a broad low dome of puffs, thrown back from the bough so it shows bare under them
  const puffs: Volume[] = [{ cx: tx - 2, cy: top + 15, cz: tz, rx: 11, ry: 7, rz: 11 }];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + rand() * 0.4;
    const reach = 11 + rand() * 4;
    const r = 6 + rand() * 1.5;
    const p = { cx: tx - 2 + Math.cos(angle) * reach, cy: top + 6 + rand() * 6, cz: tz + Math.sin(angle) * reach, rx: r, ry: r * 0.75, rz: r };
    puffs.push(p);
    limb(g, [tx, top - 1, tz], [tx - 2 + (p.cx - tx + 2) * 0.75, p.cy - 1, tz + (p.cz - tz) * 0.75], 1.4);
  }
  leaves(g, puffs, OAK_BANDS.slice(0, 6), 0x4a6, 0.07); // (no warm top highlight: it's older and darker than the rest)
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
  for (let y = 7; y <= 10; y++) for (let x = Math.floor(tx) - 1; x <= Math.floor(tx); x++) setColor(g, x, y, Math.floor(tz) + 2, N.hollow);
  return g;
}
