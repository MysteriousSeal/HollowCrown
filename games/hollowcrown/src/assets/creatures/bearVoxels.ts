// The brown bear as voxel parts (beastRig.ts puts them together), palette first, silhouette first, at the wolf's
// voxels (0.025) on a grid of its own (not a scaled wolf): massive, a hump high over its shoulders falling to a
// lower rump, every top edge rounded; the big head carried low before the hump; short thick legs; three browns of
// shaggy fur (lighter over the hump, darker down the legs), a pale blaze on its chest where it's seen from the
// front, a tan muzzle with the black nose on its top edge and a dark mouth line under, small round ears, pale
// claws; a stub of a tail angled down. Facing +Z, each part its own grid (the tail's root at +Z).

import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, fillBox, setColor } from '@voxel/engine/voxel/voxelShapes';
import { hashUnit, namedPalette } from '@voxel/engine/characters/creatures/creatureMesh';

const BEAR = namedPalette({ fur: 0x5a3e2c, furDark: 0x43301f, furLight: 0x7a583c, muzzle: 0x9a7a5a, nose: 0x1a1210, eye: 0x140e0c, claw: 0xd8cbb0, earIn: 0x3a2a1e, blaze: 0xcdb48c });
const { C } = BEAR;
export const BEAR_PALETTE = BEAR.colors;
export const BEAR_BODY: [number, number, number] = [13, 12, 20];
export const BEAR_HEAD: [number, number, number] = [9, 9, 10];
export const BEAR_LEG: [number, number, number] = [4, 8, 4];
export const BEAR_TAIL: [number, number, number] = [2, 2, 2];

// The back's height along the body: the rump low, rising to the hump over the shoulders, dropping at the neck.
const ridge = (z: number) => (z <= 4 ? 8 : z <= 9 ? 9 : z <= 16 ? 11 : 10);

export function bearBody(): VoxelGrid {
  const g = createGrid(BEAR_BODY);
  for (let x = 0; x < 13; x++) for (let z = 0; z < 20; z++) {
    const side = Math.min(x, 12 - x); // (0 at the flanks' outside)
    const end = Math.min(z, 19 - z);
    const top = ridge(z) - (side === 0 ? 3 : side === 1 ? 1 : 0) - (end === 0 ? 2 : end === 1 && side <= 1 ? 1 : 0);
    const low = side === 0 ? 2 : side === 1 || end === 0 ? 1 : 0;
    for (let y = low; y <= top; y++) {
      const shag = hashUnit(x * 3 + y, z, 501) < 0.16;
      const hump = z >= 11 && z <= 16 && y >= top - 1;
      setColor(g, x, y, z, hump ? C.furLight : y <= 2 ? C.furDark : shag ? C.furDark : C.fur);
    }
  }
  // The blaze: pale over the front of the chest and up under the neck, where the camera sees it.
  for (let x = 4; x <= 8; x++) for (let y = 3; y <= 8; y++) {
    if (Math.abs(x - 6) + Math.max(0, 5 - y) <= 3) setColor(g, x, y, 19, C.blaze);
  }
  fillBox(g, 5, 7, 18, 7, 9, 18, C.blaze);
  return g;
}

export function bearHead(): VoxelGrid {
  const g = createGrid(BEAR_HEAD);
  fillBox(g, 0, 0, 0, 8, 6, 5, (x, y) => (x === 0 || x === 8 || y === 0 ? C.furDark : C.fur)); // the skull, broad
  for (const x of [0, 8]) for (const y of [0, 6]) fillBox(g, x, y, 0, x, y, 5, 0); // (rounded)
  fillBox(g, 2, 0, 6, 6, 3, 9, (_x, y) => (y === 0 ? C.furDark : C.muzzle)); // the muzzle
  fillBox(g, 3, 3, 8, 5, 3, 9, C.nose); // the nose, on its top-front edge
  for (const x of [2, 6]) fillBox(g, x, 1, 7, x, 1, 9, C.nose); // the mouth's line
  setColor(g, 2, 4, 5, C.eye); // small eyes
  setColor(g, 6, 4, 5, C.eye);
  for (const x of [0, 7]) {
    fillBox(g, x, 7, 1, x + 1, 8, 2, C.furDark); // round ears
    setColor(g, x === 0 ? 1 : 7, 7, 2, C.earIn);
  }
  return g;
}

export function bearLeg(): VoxelGrid {
  const g = createGrid(BEAR_LEG);
  fillBox(g, 0, 1, 0, 3, 7, 3, (_x, y) => (y >= 6 ? C.fur : C.furDark));
  fillBox(g, 0, 0, 0, 3, 0, 3, C.furDark);
  for (const x of [0, 2, 3]) setColor(g, x, 0, 3, C.claw); // its claws, at the front of its paw
  return g;
}

export function bearTail(): VoxelGrid {
  const g = createGrid(BEAR_TAIL);
  fillBox(g, 0, 0, 0, 1, 1, 1, (_x, y) => (y ? C.fur : C.furDark));
  return g;
}
