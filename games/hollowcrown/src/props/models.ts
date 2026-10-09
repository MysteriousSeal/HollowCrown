// What stands about the Vale, as voxel grids at the buildings' voxel (16 a tile), each its foot on the floor of its
// grid, its front toward +z: a fence's rails (a tile of them) and its post, a hay rick, the Pilgrim Road's gibbet,
// standing stones, a vegetable bed. Silhouette first; few colors side by side (they're cheap to draw).

import { hashUnit } from '@voxel/engine/math';
import { colorAt, createGrid, fillBox, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { P } from './palette';

// A tile of fence rails along x: two rails, the upper at hand height, the lower at the knee. (Posts stand between.)
export function fenceRails(): VoxelGrid {
  const g = createGrid([16, 8, 1]);
  fillBox(g, 0, 3, 0, 15, 3, 0, P.rail);
  fillBox(g, 0, 7, 0, 15, 7, 0, P.rail);
  return g;
}

// A fence post: split oak, its top weathered pale.
export function fencePost(): VoxelGrid {
  const g = createGrid([2, 10, 2]);
  fillBox(g, 0, 0, 0, 1, 8, 1, P.post);
  fillBox(g, 0, 9, 0, 1, 9, 1, P.postTop);
  return g;
}

// A hay rick: a loaf of hay as tall as a man and a half, straight-sided low, domed above to a combed ridge along x,
// lit on its sunward sides, deep low down; twine over it, weighted at its foot.
export function hayRick(): VoxelGrid {
  const [sx, sy, sz] = [26, 28, 20];
  const g = createGrid([sx, sy, sz]);
  const [cx, cz] = [sx / 2, sz / 2];
  for (let y = 0; y < sy; y++) {
    const bulge = y < 12 ? 0.86 + 0.14 * Math.sin((y / 12) * (Math.PI / 2)) : Math.sqrt(Math.max(0, 1 - ((y - 12) / 16) ** 2));
    const [rx, rz] = [12.5 * Math.max(bulge, y < 12 ? 0 : 0.18 + 0.82 * bulge), 9.5 * bulge];
    for (let x = 0; x < sx; x++) {
      for (let z = 0; z < sz; z++) {
        const [dx, dz] = [(x + 0.5 - cx) / rx, (z + 0.5 - cz) / rz];
        if (dx * dx + dz * dz > 1) continue;
        const sun = dx + dz * 0.6 + (y - 12) / 16;
        setColor(g, x, y, z, y < 2 ? P.hayDeep : sun > 0.55 ? P.hayLight : sun < -0.7 ? P.hayShade : P.hay);
      }
    }
  }
  // the twine: two ropes over the top, across it, on its outside
  for (const x of [8, 17]) {
    for (let y = 4; y < sy; y++) {
      for (let z = 0; z < sz; z++) {
        const outside = colorAt(g, x, y, z - 1) === 0 || colorAt(g, x, y, z + 1) === 0 || colorAt(g, x, y + 1, z) === 0;
        if (colorAt(g, x, y, z) !== 0 && outside) setColor(g, x, y, z, P.twine);
      }
    }
  }
  return g;
}

// The Pilgrim Road's gibbet: a tarred post twice a man's height, an arm out over the road (+z) on its brace, and from
// it on a short chain an iron cage the size of a man, empty, rusted, a red hen's feathers tied to its bars.
export function gibbet(): VoxelGrid {
  const g = createGrid([10, 50, 24]);
  fillBox(g, 3, 0, 2, 6, 1, 5, P.tar); // the foot, wider
  fillBox(g, 4, 0, 3, 5, 47, 4, P.tar); // the post
  fillBox(g, 5, 2, 4, 5, 47, 4, P.tarLight); // (its sunward edge)
  fillBox(g, 4, 46, 3, 5, 47, 21, P.tar); // the arm
  for (let i = 0; i < 9; i++) fillBox(g, 4, 37 + i, 5 + i, 5, 37 + i, 5 + i, P.tar); // the brace
  fillBox(g, 4, 41, 19, 5, 45, 19, P.iron); // the chain
  // the cage: bars round a man's shape, banded top and bottom, a ring on top
  const [x0, x1, z0, z1, y0, y1] = [1, 8, 15, 22, 14, 40];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      for (let z = z0; z <= z1; z++) {
        const edge = x === x0 || x === x1 || z === z0 || z === z1;
        const band = y === y0 || y === y1 || y === y0 + 13;
        const bar = (x + z) % 2 === 0;
        if (edge && (band || bar)) setColor(g, x, y, z, hashUnit(x * 7 + z, y, 31) < 0.3 ? P.rust : P.iron);
      }
    }
  }
  fillBox(g, x0, y0, z0, x1, y0, z1, P.iron); // its floor
  fillBox(g, 4, 41, 18, 5, 41, 19, P.iron);
  setColor(g, x1, 30, z1, P.feather); // the Red Hen's feathers
  setColor(g, x1, 29, z1, P.feather);
  setColor(g, x1, 31, z1 - 1, P.feather);
  return g;
}

// A standing stone, one of `variant` shapes: a rough slab taller than a man, tapering, leaning a little, grey, its
// sunward face paler, lichen in patches, moss at its foot.
export function standingStone(variant: number): VoxelGrid {
  const [w, h, d] = [[9, 30, 6], [11, 24, 7], [8, 34, 6]][variant % 3];
  const g = createGrid([w + 4, h, d + 4]);
  const lean = [1, -1, 0][variant % 3];
  for (let y = 0; y < h; y++) {
    const t = y / h;
    const half = (w / 2) * (1 - 0.35 * t * t) - (y > h - 3 ? (y - (h - 3)) * 1.2 : 0); // tapering, its top rounded off
    const thick = (d / 2) * (1 - 0.25 * t);
    const shift = lean * Math.floor(t * 2.5);
    for (let x = 0; x < w + 4; x++) {
      for (let z = 0; z < d + 4; z++) {
        const [dx, dz] = [x + 0.5 - (w + 4) / 2 - shift, z + 0.5 - (d + 4) / 2];
        const rough = hashUnit(Math.floor(y / 3), x + z * 13, 70 + variant) * 0.8;
        if (Math.abs(dx) > half - rough * 0.5 || Math.abs(dz) > thick) continue;
        const sunward = dx > half - 2 || dz > thick - 1;
        const patch = hashUnit(Math.floor(x / 2), Math.floor(y / 3), 80 + variant);
        setColor(g, x, y, z, y < 3 && patch < 0.5 ? P.moss : patch < 0.12 ? P.lichen : sunward ? P.stoneLight : y < h * 0.3 ? P.stoneDark : P.stone);
      }
    }
  }
  return g;
}

// A vegetable bed, three tiles along its rows (x), two across: dug soil in ridges, cabbages, leeks and a row of beans
// on their sticks.
export function gardenBed(): VoxelGrid {
  const g = createGrid([46, 12, 30]);
  for (let row = 0; row < 5; row++) {
    const z = 3 + row * 6;
    fillBox(g, 1, 1, z - 1, 44, 1, z + 1, P.soil); // the ridge
    fillBox(g, 1, 1, z + 2, 44, 1, z + 2, 0);
    for (let x = 3; x < 44; x += 6) {
      if (row < 2) fillBox(g, x - 1, 2, z - 1, x + 1, 3, z + 1, (x + row) % 4 ? P.cabbage : P.cabbageDark); // cabbages
      else if (row < 4) fillBox(g, x, 2, z, x, 5, z, P.leek); // leeks
      else {
        fillBox(g, x, 2, z, x, 10, z, P.post); // bean sticks, the beans up them
        fillBox(g, x - 1, 3, z, x - 1, 9, z, P.bean);
        fillBox(g, x + 1, 5, z, x + 1, 10, z, P.bean);
      }
    }
  }
  fillBox(g, 0, 0, 0, 45, 0, 29, P.furrow); // (the dug earth between the ridges)
  return g;
}
