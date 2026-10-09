// What hangs on the Vale's buildings and stands round them, as voxel grids (at the buildings' voxel: 16 a tile), and
// what's painted onto them: an inn's sign, lanterns, an anvil, a mill wheel, a bell-cote, window boxes, drying herbs,
// a chandler's sign, wax vats and drying candles, moss on a roof; a well and a notice board, standing on their own.

import { hashUnit } from '@voxel/engine/math';
import type { StructureLayout, StructureSpec } from '@voxel/engine/structures';
import { colorAt, createGrid, fillBox, fillEllipsoid, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { C } from './palette';

// The Ferryman's Rest's sign: an iron arm out from the wall (+z), the board hung from it, a boat's prow on red.
// (Its pivot: the arm's root, at the wall.)
export function innSign(): VoxelGrid {
  const g = createGrid([2, 11, 12]);
  fillBox(g, 0, 10, 0, 1, 10, 11, C.iron); // the arm
  fillBox(g, 0, 9, 0, 1, 9, 1, C.iron); // its brace
  fillBox(g, 0, 8, 2, 1, 9, 2, C.iron); // the chains
  fillBox(g, 0, 8, 10, 1, 9, 10, C.iron);
  fillBox(g, 0, 0, 2, 1, 7, 10, C.signRed); // the board
  fillBox(g, 0, 0, 2, 1, 0, 10, C.timberDark); // its frame
  fillBox(g, 0, 7, 2, 1, 7, 10, C.timberDark);
  fillBox(g, 0, 2, 3, 1, 3, 8, C.signCream); // the hull
  fillBox(g, 0, 4, 8, 1, 5, 9, C.signCream); // the prow, rising
  fillBox(g, 0, 6, 9, 1, 6, 9, C.signCream);
  return g;
}

// A lantern on a bracket: an iron cage round a flame. (Its pivot: the bracket's root, at the wall.)
export function lantern(): VoxelGrid {
  const g = createGrid([3, 6, 4]);
  fillBox(g, 1, 5, 0, 1, 5, 2, C.iron); // the bracket
  fillBox(g, 0, 0, 1, 2, 4, 3, C.iron);
  fillBox(g, 1, 1, 2, 1, 3, 2, C.window); // the flame (glows)
  setColor(g, 1, 2, 3, C.window);
  return g;
}

// An anvil on its oak stump. (Its pivot: the middle of its foot.)
export function anvil(): VoxelGrid {
  const g = createGrid([7, 7, 4]);
  fillBox(g, 2, 0, 0, 4, 3, 3, C.timberDark); // the stump
  fillBox(g, 1, 4, 1, 5, 4, 2, C.iron); // the waist
  fillBox(g, 0, 5, 0, 6, 6, 3, C.iron); // the face
  setColor(g, 6, 5, 1, 0); // the horn's taper
  setColor(g, 6, 5, 2, 0);
  return g;
}

// A water trough: planks round dark water. (Its pivot: the middle of its foot.)
export function trough(): VoxelGrid {
  const g = createGrid([10, 4, 4]);
  fillBox(g, 0, 0, 0, 9, 3, 3, C.timber);
  fillBox(g, 1, 1, 1, 8, 3, 2, C.water);
  return g;
}

// A mill wheel: rim, spokes and paddles round an iron hub, its axle into the wall (-z). Turns about its hub.
export function millWheel(): VoxelGrid {
  const R = 16;
  const g = createGrid([2 * R, 2 * R, 6]);
  for (let x = 0; x < 2 * R; x++) {
    for (let y = 0; y < 2 * R; y++) {
      const [dx, dy] = [x + 0.5 - R, y + 0.5 - R];
      const r = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const off = (step: number) => Math.abs(((angle + step / 2 + 2 * Math.PI) % step) - step / 2) * r; // (voxels off the nearest spoke)
      let c = 0;
      let [za, zb] = [1, 4];
      if (r < 2.5) [c, za, zb] = [C.iron, 0, 5]; // the hub and axle
      else if (r >= 12.5 && r < 14.5) c = C.timber; // the rim
      else if (r >= 14.5 && r < R && off(Math.PI / 6) < 1.1) [c, za, zb] = [C.timberDark, 0, 5]; // the paddles
      else if (r < 12.5 && off(Math.PI / 3) < 0.8) c = C.timber; // the spokes
      if (c) for (let z = za; z <= zb; z++) setColor(g, x, y, z, c);
    }
  }
  return g;
}

// A bell-cote for a gable's peak: two stone posts, a slate cap, the bell between. (Its pivot: the middle of its base.)
export function bellCote(): VoxelGrid {
  const g = createGrid([9, 13, 5]);
  fillBox(g, 0, 0, 0, 8, 1, 4, C.stoneDark); // the base
  fillBox(g, 0, 2, 1, 1, 9, 3, C.stone); // the posts
  fillBox(g, 7, 2, 1, 8, 9, 3, C.stoneLight);
  fillBox(g, 0, 10, 0, 8, 10, 4, C.slateDark); // the cap
  fillBox(g, 1, 11, 0, 7, 11, 4, C.slate);
  fillBox(g, 3, 12, 0, 5, 12, 4, C.slateDark);
  fillBox(g, 3, 9, 2, 5, 9, 2, C.iron); // the yoke
  fillEllipsoid(g, [4.5, 5.5, 2.5], [2.2, 3.2, 1.6], () => C.bronze); // the bell
  fillBox(g, 3, 3, 1, 5, 3, 3, C.bronze); // its lip
  return g;
}

// The village well: a ring of stone round dark water, two posts, a little shingled roof, a rope to the bucket.
export function well(): VoxelGrid {
  const g = createGrid([16, 24, 16]);
  for (let x = 0; x < 16; x++) {
    for (let z = 0; z < 16; z++) {
      const r = Math.hypot(x - 7.5, z - 7.5);
      if (r > 7.5) continue;
      for (let y = 0; y < 6; y++) setColor(g, x, y, z, r < 5 ? (y === 4 ? C.water : y < 4 ? C.inside : 0) : hashUnit(x + z * 3, y >> 1, 5) < 0.6 ? C.stone : C.stoneLight);
    }
  }
  fillBox(g, 0, 6, 6, 1, 17, 9, C.timber); // the posts
  fillBox(g, 14, 6, 6, 15, 17, 9, C.timber);
  fillBox(g, 0, 15, 7, 15, 15, 8, C.timberDark); // the winch
  for (let y = 18; y < 24; y++) {
    const half = 23 - y + 1; // a little gable, its ridge along x
    fillBox(g, 0, y, Math.max(0, 8 - half), 15, y, Math.min(15, 7 + half), y === 23 ? C.shingleDark : y % 2 ? C.shingle : C.shingleLight);
  }
  fillBox(g, 8, 9, 7, 8, 14, 7, C.rope); // the rope
  fillBox(g, 7, 7, 6, 9, 8, 8, C.timber); // the bucket
  return g;
}

// The notice board on the square: two posts, a board of pinned papers, a strip of roof over it.
export function noticeBoard(): VoxelGrid {
  const g = createGrid([16, 18, 4]);
  fillBox(g, 1, 0, 1, 2, 14, 2, C.timber);
  fillBox(g, 13, 0, 1, 14, 14, 2, C.timber);
  fillBox(g, 1, 5, 1, 14, 14, 1, C.timberDark); // the board
  for (const [x, y, w, h] of [[3, 7, 3, 4], [7, 9, 4, 4], [11, 6, 2, 3], [4, 12, 3, 2], [8, 6, 2, 2]]) fillBox(g, x, y, 2, x + w - 1, y + h - 1, 2, C.paper);
  fillBox(g, 0, 15, 0, 15, 15, 3, C.shingle); // the roof strip
  fillBox(g, 0, 16, 1, 15, 16, 2, C.shingleDark);
  return g;
}

// ---- painted on ----

// Window boxes of flowers under the ground storey's front windows.
export function windowBoxes(g: VoxelGrid, layout: StructureLayout, seed: number): void {
  const z = layout.z1 - 1; // (the windows' glass, set back a voxel)
  for (let x = layout.x0; x <= layout.x1; x++) {
    for (let y = 1; y < layout.eaves; y++) {
      if (colorAt(g, x, y, z) !== C.window || colorAt(g, x, y - 1, z) === C.window) continue;
      if (colorAt(g, x, y + 1, z) !== C.window && colorAt(g, x, y + 1, z) !== C.timberDark) continue;
      setColor(g, x, y - 2, layout.z1 + 1, C.timberDark); // the box, under the sill
      setColor(g, x, y - 1, layout.z1 + 2, hashUnit(x, y, seed) < 0.55 ? C.flower : hashUnit(x, y, seed + 1) < 0.5 ? C.flowerGold : C.leaf);
      break;
    }
  }
}

// Bunches of herbs drying under the front eaves (Nan Wicket's).
export function dryingHerbs(g: VoxelGrid, layout: StructureLayout): void {
  for (let x = layout.x0 + 3; x <= layout.x1 - 3; x += 4) {
    if (layout.door && x >= layout.door.x0 - 1 && x <= layout.door.x1 + 1) continue;
    const length = 2 + Math.floor(hashUnit(x, 0, 11) * 3);
    for (let y = layout.eaves - length; y < layout.eaves; y++) setColor(g, x, y, layout.z1 + 1, y === layout.eaves - 1 ? C.rope : hashUnit(x, y, 12) < 0.6 ? C.herb : C.leaf);
  }
}

// A stool by the door (Old Meg's, for watching the hill).
export function doorstepStool(g: VoxelGrid, layout: StructureLayout): void {
  if (!layout.door) return;
  const x = layout.door.x1 + 3;
  fillBox(g, x, 0, layout.z1 + 2, x + 2, 2, layout.z1 + 3, C.timber);
  fillBox(g, x, 0, layout.z1 + 2, x + 2, 1, layout.z1 + 3, 0);
  fillBox(g, x, 0, layout.z1 + 2, x, 1, layout.z1 + 2, C.timberDark); // (its legs)
  fillBox(g, x + 2, 0, layout.z1 + 3, x + 2, 1, layout.z1 + 3, C.timberDark);
}

// A grey heron on a plaque over the door (the reeve's: the Regency's bird).
export function heronPlaque(g: VoxelGrid, layout: StructureLayout): void {
  if (!layout.door) return;
  const cx = Math.round((layout.door.x0 + layout.door.x1) / 2);
  const y0 = layout.door.height + 2;
  const z = layout.z1 + 1;
  fillBox(g, cx - 3, y0, z, cx + 3, y0 + 6, z, C.timberDark);
  for (const [x, y] of [[0, 1], [0, 2], [0, 3], [-1, 3], [1, 2], [1, 3], [-1, 4], [-1, 5], [0, 5], [1, 5], [2, 5], [-2, 2], [1, 1]]) setColor(g, cx + x, y0 + y, z + 1, C.heron);
}

// A roof gone through in patches, the dark inside showing (the Holt house, empty since the Wet Years).
export function holedRoof(g: VoxelGrid, layout: StructureLayout): void {
  const [sx, , sz] = layout.size;
  for (const [hx, hz, r] of [[0.32, 0.38, 3.5], [0.62, 0.7, 2.5]]) {
    const [cx, cz] = [Math.round(sx * hx), Math.round(sz * hz)];
    for (let x = cx - 4; x <= cx + 4; x++) {
      for (let z = cz - 4; z <= cz + 4; z++) {
        if (Math.hypot(x - cx, z - cz) > r) continue;
        for (let y = layout.ridge; y >= layout.eaves; y--) {
          const c = colorAt(g, x, y, z);
          if (c === C.inside) break;
          if (c) setColor(g, x, y, z, 0);
        }
      }
    }
  }
}

// A hearth in an open forge: stone, and coals glowing on it, at the back of the way in.
export function forgeHearth(g: VoxelGrid, layout: StructureLayout): void {
  if (!layout.door) return;
  const back = layout.z1 - 5; // (the back of the way in)
  const [x0, x1] = [layout.door.x0 + 2, layout.door.x1 - 2];
  fillBox(g, x0, 0, back, x1, 3, back + 1, C.stoneDark);
  for (let x = x0 + 1; x < x1; x++) setColor(g, x, 4, back + 1, hashUnit(x, 4, 13) < 0.6 ? C.ember : C.emberDim);
  fillBox(g, x0 + 1, 6, back, x1 - 1, layout.door.height - 1, back, C.stoneDark); // the hood
}

// The chandlery's sign: an iron arm out from the wall (+z), a board hung from it, a lit candle painted on it.
// (Its pivot: the arm's root, at the wall.)
export function chandlerSign(): VoxelGrid {
  const g = createGrid([2, 11, 10]);
  fillBox(g, 0, 10, 0, 1, 10, 9, C.iron); // the arm
  fillBox(g, 0, 9, 0, 1, 9, 1, C.iron); // its brace
  fillBox(g, 0, 8, 2, 1, 9, 2, C.iron); // the chains
  fillBox(g, 0, 8, 8, 1, 9, 8, C.iron);
  fillBox(g, 0, 0, 2, 1, 7, 8, C.blue); // the board
  fillBox(g, 0, 1, 4, 1, 4, 6, C.wax); // the candle
  setColor(g, 0, 5, 5, C.ember); // its flame
  setColor(g, 1, 5, 5, C.ember);
  setColor(g, 0, 6, 5, C.window);
  setColor(g, 1, 6, 5, C.window);
  return g;
}

// A wax vat: a squat tub of staves bound in iron, full to the brim with pale wax. (Its pivot: the middle of its foot.)
export function waxVat(): VoxelGrid {
  const g = createGrid([6, 5, 6]);
  fillBox(g, 0, 0, 1, 5, 4, 4, C.timber);
  fillBox(g, 1, 0, 0, 4, 4, 5, C.timber);
  fillBox(g, 0, 1, 1, 5, 1, 4, C.iron); // its hoop
  fillBox(g, 1, 1, 0, 4, 1, 5, C.iron);
  fillBox(g, 1, 4, 1, 4, 4, 4, C.wax);
  return g;
}

// Candles hung to dry under the eaves along the front: pairs on their wicks from a rail, between the windows.
export function dryingCandles(g: VoxelGrid, layout: StructureLayout): void {
  for (let x = layout.x0 + 2; x <= layout.x1 - 2; x += 3) {
    if (layout.door && x >= layout.door.x0 - 1 && x <= layout.door.x1 + 1) continue;
    setColor(g, x, layout.eaves - 1, layout.z1 + 1, C.rope);
    for (let y = layout.eaves - 4; y < layout.eaves - 1; y++) setColor(g, x, y, layout.z1 + 1, C.wax);
  }
}

// Moss creeping up a roof from its eaves: on the roof's covering (`spec`'s roof colors) in its lowest courses, patchy,
// thinning as it climbs.
export function mossy(g: VoxelGrid, layout: StructureLayout, spec: StructureSpec): void {
  const roof = new Set([spec.colors.roof, spec.colors.roofLight, spec.colors.roofDark]);
  const [sx, , sz] = g.size;
  for (let y = layout.eaves - 2; y < layout.eaves + 5; y++) {
    const chance = 0.45 - (y - layout.eaves + 2) * 0.07;
    for (let x = 0; x < sx; x++) {
      for (let z = 0; z < sz; z++) {
        if (!roof.has(colorAt(g, x, y, z)) || colorAt(g, x, y + 1, z) !== 0) continue; // (its top face only)
        const h = hashUnit(Math.floor(x / 2), Math.floor(z / 2), 77 + y);
        if (h < chance) setColor(g, x, y, z, h < chance * 0.4 ? C.mossLight : C.moss);
      }
    }
  }
}
