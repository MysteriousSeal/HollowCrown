// What stands along the Vale's roads (data/world/firstWalk.ts and the like), as voxel grids at the buildings' voxel in
// the props' palette, each its foot on the floor of its grid, its front toward +z: boulders (a rockslide's), a tile of
// worn flagstones, a milestone, an overturned handcart, a pilgrim's strewn things, a culvert's parapet, a tile of hedge.

import { hashUnit } from '@voxel/engine/math';
import { createGrid, fillBox, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { P } from './palette';

// A boulder, one of `variant` sizes (a tile and a half to near three across, at twice the voxel: drawn by the dozen):
// a rough lump, flat-bottomed, its top and sunward sides paler, lichen in patches, moss low on its shaded side.
export function boulder(variant: number): VoxelGrid {
  const [w, h, d] = [[12, 8, 10], [17, 11, 14], [22, 13, 17]][variant % 3];
  const g = createGrid([w, h, d]);
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < d; z++) {
      const [dx, dz] = [(x + 0.5 - w / 2) / (w / 2), (z + 0.5 - d / 2) / (d / 2)];
      const r = Math.hypot(dx, dz);
      if (r > 1) continue;
      // (lumpy: the height steps in blocks of two)
      const top = Math.round(h * Math.sqrt(1 - r * r) * (0.75 + hashUnit(x >> 1, z >> 1, 40 + variant) * 0.25));
      for (let y = 0; y < top; y++) {
        const patch = hashUnit(x >> 1, (y >> 1) + (z >> 1) * 7, 50 + variant);
        const lit = y >= top - 1 || dx + dz > 0.6;
        setColor(g, x, y, z, y < 2 && dx + dz < -0.3 && patch < 0.6 ? P.moss : patch < 0.08 ? P.lichen : lit ? P.stoneLight : y < h * 0.3 ? P.stoneDark : P.stone);
      }
    }
  }
  return g;
}

// A tile of worn flagstones: three or four slabs laid flat, grass in the joints between them, a few cracked or sunk.
export function flagstones(variant: number): VoxelGrid {
  const g = createGrid([16, 1, 16]);
  const cut = 6 + (variant % 3) * 2; // (where the slabs part, across and along)
  for (let x = 0; x < 16; x++) {
    for (let z = 0; z < 16; z++) {
      const joint = x === cut || x === 15 || z === 15 || (z === 7 && x < cut) || (z === (variant % 2 ? 4 : 10) && x > cut);
      if (joint) continue;
      const slab = (x < cut ? 0 : 1) + (z < 7 ? 0 : 2);
      setColor(g, x, 0, z, hashUnit(slab, variant, 61) < 0.3 ? P.stoneDark : hashUnit(slab, variant, 62) < 0.3 ? P.stoneLight : P.stone);
    }
  }
  return g;
}

// A milestone: a squat stone post, its top rounded, a number cut into its front and a heron chiselled over a crown.
export function milestone(): VoxelGrid {
  const g = createGrid([8, 14, 6]);
  fillBox(g, 0, 0, 0, 7, 10, 5, P.stone);
  fillBox(g, 1, 11, 0, 6, 12, 5, P.stone);
  fillBox(g, 2, 13, 1, 5, 13, 4, P.stoneLight);
  fillBox(g, 0, 0, 0, 7, 1, 5, P.moss); // (moss at its foot)
  fillBox(g, 2, 4, 5, 2, 7, 5, P.stoneDark); // II
  fillBox(g, 5, 4, 5, 5, 7, 5, P.stoneDark);
  fillBox(g, 3, 9, 5, 4, 10, 5, P.stoneDark); // the heron, over the crown
  return g;
}

// A handcart thrown on its side in the ditch: its bed of planks on edge, one wheel up in the air, its shafts in the
// grass.
export function handcart(): VoxelGrid {
  const g = createGrid([28, 14, 18]);
  fillBox(g, 4, 0, 4, 21, 11, 5, P.rail); // the bed, on edge
  fillBox(g, 4, 0, 6, 21, 1, 13, P.rail); // its side, flat on the ground
  fillBox(g, 4, 10, 6, 21, 11, 13, P.railDark); // the other side
  for (const x of [4, 21]) fillBox(g, x, 2, 6, x, 9, 13, P.railDark); // its ends
  // the wheel up in the air: a ring of spokes and felloes on its axle
  for (let a = 0; a < 16; a++) {
    const [x, y] = [12 + Math.round(Math.cos((a / 16) * Math.PI * 2) * 5), 7 + Math.round(Math.sin((a / 16) * Math.PI * 2) * 5)];
    setColor(g, x, y, 3, P.post);
  }
  fillBox(g, 11, 6, 2, 13, 8, 3, P.iron);
  fillBox(g, 22, 0, 8, 27, 0, 8, P.rail); // the shafts
  fillBox(g, 22, 0, 11, 27, 0, 11, P.rail);
  return g;
}

// One of a pilgrim's things, strewn: a torn bundle of cloth, a clay bowl, a shoe.
export function belonging(variant: number): VoxelGrid {
  const g = createGrid([6, 3, 6]);
  if (variant % 3 === 0) {
    fillBox(g, 0, 0, 1, 5, 1, 4, P.cloth); // the bundle, its cloth torn open
    fillBox(g, 2, 2, 2, 3, 2, 3, P.clothDark);
    setColor(g, 5, 1, 4, 0);
  } else if (variant % 3 === 1) {
    fillBox(g, 1, 0, 1, 4, 1, 4, P.clay); // the bowl
    fillBox(g, 2, 1, 2, 3, 1, 3, 0);
  } else {
    fillBox(g, 1, 0, 2, 4, 0, 3, P.leather); // the shoe
    fillBox(g, 1, 1, 2, 2, 1, 3, P.leather);
  }
  return g;
}

// A culvert's parapet: a low wall of dressed stone along the road's edge (x), over the brook's arch, its coping paler.
export function parapet(): VoxelGrid {
  const g = createGrid([32, 9, 4]);
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 8; y++) {
      const course = Math.floor(y / 3);
      setColor(g, x, y, 1, hashUnit(Math.floor((x + (course % 2) * 2) / 4), course, 71) < 0.25 ? P.stoneDark : P.stone);
      setColor(g, x, y, 2, P.stone);
    }
  }
  fillBox(g, 0, 8, 0, 31, 8, 3, P.stoneLight); // the coping
  fillBox(g, 0, 0, 0, 1, 7, 3, P.stoneDark); // its end piers
  fillBox(g, 30, 0, 0, 31, 7, 3, P.stoneDark);
  return g;
}

// A tile of hedge along x: a bank of hawthorn and hazel waist-high, its top ragged, darker low down, lit on top.
export function hedge(variant: number): VoxelGrid {
  const g = createGrid([16, 14, 10]);
  for (let x = 0; x < 16; x++) {
    for (let z = 0; z < 10; z++) {
      const r = Math.abs(z + 0.5 - 5) / 5;
      const top = Math.round(12 * Math.sqrt(1 - r * r) + (hashUnit(Math.floor(x / 2) + variant * 8, Math.floor(z / 2), 81) - 0.5) * 4);
      for (let y = 0; y < Math.min(14, top); y++) {
        const blossom = y === top - 1 && hashUnit(x, z + variant * 10, 82) < 0.05;
        setColor(g, x, y, z, blossom ? P.blossom : y >= top - 2 ? P.hedgeLight : y < 4 ? P.hedgeDark : P.hedge);
      }
    }
  }
  return g;
}
