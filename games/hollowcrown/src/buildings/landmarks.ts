// The Vale's landmarks that are places on the map (data/world: kind 'landmark'), as voxel grids at the buildings' voxel
// in the village palette, by their ids, each with the room it takes. The Pilgrim's Shrine, where the game starts: a
// stone post taller than a man, a lantern burning in a niche near its top, a little slate cap; candles and an offering
// bowl at its foot, votive ribbons tied to an iron hook; a bench of a plank on two stones beside it. Its front (+z)
// looks down the road east.

import { hashUnit } from '@voxel/engine/math';
import { createGrid, fillBox, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { C } from './palette';

export function pilgrimShrine(): VoxelGrid {
  const g = createGrid([40, 36, 30]);
  const [cx, cz] = [20, 15]; // the post's middle
  // the footing: two broad steps of worn stone
  fillBox(g, cx - 6, 0, cz - 6, cx + 6, 0, cz + 7, (x, _y, z) => (hashUnit(x, z, 3) < 0.25 ? C.stoneDark : C.stone));
  fillBox(g, cx - 4, 1, cz - 4, cx + 4, 1, cz + 5, (x, _y, z) => (hashUnit(x, z, 4) < 0.2 ? C.stoneLight : C.stone));
  // the post: coursed stone, paler on its sunward faces, moss low on its back
  for (let y = 2; y < 30; y++) {
    for (let x = cx - 3; x <= cx + 3; x++) {
      for (let z = cz - 3; z <= cz + 3; z++) {
        if (Math.abs(x - cx) === 3 && Math.abs(z - cz) === 3) continue; // (its corners worn round)
        const course = Math.floor(y / 3);
        const block = hashUnit(Math.floor((x + z + (course % 2) * 2) / 3), course, 5);
        setColor(g, x, y, z, y < 6 && z === cz - 3 && block < 0.6 ? C.moss : x === cx + 3 || z === cz + 3 ? C.stoneLight : block < 0.2 ? C.stoneDark : C.stone);
      }
    }
  }
  // its cap: a slab wider than the post, a little slate roof on it
  fillBox(g, cx - 4, 30, cz - 4, cx + 4, 30, cz + 4, C.stoneDark);
  for (let i = 0; i < 4; i++) fillBox(g, cx - 4 + i, 31 + i, cz - 4, cx + 4 - i, 31 + i, cz + 4, i === 3 ? C.slateLight : C.slate);
  // the lantern niche near the top of its front: dark, the flame in it, an iron grille across
  fillBox(g, cx - 1, 22, cz + 1, cx + 1, 26, cz + 3, C.inside);
  fillBox(g, cx, 23, cz + 2, cx, 24, cz + 2, C.window); // (glows)
  setColor(g, cx, 25, cz + 2, C.ember);
  fillBox(g, cx - 1, 22, cz + 3, cx + 1, 22, cz + 3, C.iron);
  setColor(g, cx, 25, cz + 3, C.iron);
  // the votive ribbons, tied to an iron hook on its east side
  fillBox(g, cx + 4, 20, cz, cx + 5, 20, cz, C.iron);
  const ribbons = [C.signRed, C.signCream, C.blue, C.flowerGold, C.signRed];
  ribbons.forEach((color, i) => fillBox(g, cx + 5, 19 - (i % 3) * 2 - 6, cz - 2 + i, cx + 5, 19, cz - 2 + i, color));
  // at its foot: the offering bowl (bronze, a few coins and a flower in it) and candles, some burnt down
  fillBox(g, cx - 2, 2, cz + 5, cx + 2, 3, cz + 7, C.bronze);
  fillBox(g, cx - 1, 3, cz + 6, cx + 1, 3, cz + 6, C.flowerGold);
  setColor(g, cx, 3, cz + 6, C.flower);
  for (const [x, z, h] of [[cx - 4, cz + 5, 3], [cx + 4, cz + 5, 2], [cx + 3, cz + 6, 1], [cx - 3, cz + 6, 2]]) {
    fillBox(g, x, 2, z, x, 1 + h, z, C.wax);
    setColor(g, x, 2 + h, z, C.ember);
  }
  // the bench: a plank on two stones, to the post's west, facing the road
  fillBox(g, 3, 0, cz + 6, 5, 2, cz + 8, C.stone);
  fillBox(g, 11, 0, cz + 6, 13, 2, cz + 8, C.stoneDark);
  fillBox(g, 2, 3, cz + 5, 14, 3, cz + 9, C.timber);
  return g;
}

// Each landmark drawn here, by its place's id: its grid, and the room it takes (half its size, tiles, x and z).
export const LANDMARKS: Record<string, { grid: () => VoxelGrid; half: [number, number] }> = {
  'pilgrims-shrine': { grid: pilgrimShrine, half: [0.3, 0.3] },
};
