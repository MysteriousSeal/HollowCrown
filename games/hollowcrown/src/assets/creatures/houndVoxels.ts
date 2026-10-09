// A barrow-hound: the barrow-dead's hunting dog, buried with its master. A wolf's frame (wolfVoxels.ts' grids, so
// it moves as a wolf does) gone to bone: a spine of knobbed vertebrae, ribs as hoops with the dark between, the
// pelvis and shoulder blades; scraps of black hide still clinging to flank and thigh; a rusted iron collar at the
// neck; a long skull with a row of teeth, the jaw hanging, cold light burning in its sockets (unlit, it glows).

import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, fillBox, setColor } from '@voxel/engine/voxel/voxelShapes';
import { hashUnit, namedPalette } from '@voxel/engine/characters/creatures/creatureMesh';
import { BODY_GRID, HEAD_GRID, LEG_GRID, TAIL_GRID } from './wolfVoxels';

const P = namedPalette({
  bone: 0xe4e8e8,
  boneShade: 0xb4bcbe,
  boneDark: 0x767e82,
  hide: 0x2e2622,
  hideDark: 0x1e1816,
  iron: 0x5e6268,
  rust: 0xb8bec6, // (the collar's bright rim)
  void: 0x120e0d,
  eye: 0x9ff0ff,
});
const { C } = P;
export const HOUND_PALETTE = P.colors;
export const HOUND_GLOW: ReadonlySet<number> = new Set([C.eye]);
export const [HOUND_BODY, HOUND_HEAD, HOUND_LEG, HOUND_TAIL] = [BODY_GRID, HEAD_GRID, LEG_GRID, TAIL_GRID];

// The body, 7 x 6 x 14, its front at +Z: pelvis behind, ribs in hoops, shoulder blades, the collar at the neck.
export function houndBody(): VoxelGrid {
  const g = createGrid(BODY_GRID);
  fillBox(g, 3, 5, 0, 3, 5, 13, C.bone); // the spine
  for (let z = 0; z <= 13; z += 2) fillBox(g, 2, 5, z, 4, 5, z, C.boneShade); // its knobs
  fillBox(g, 1, 2, 0, 5, 4, 2, C.boneShade); // the pelvis
  fillBox(g, 2, 3, 0, 4, 3, 1, C.void);
  fillBox(g, 2, 2, 3, 4, 4, 11, C.void); // the dark inside it, seen between the ribs
  for (let z = 4; z <= 10; z += 2) {
    const drop = z >= 6 && z <= 8 ? 0 : 1; // (the chest deepest in the middle)
    fillBox(g, 0, drop, z, 6, 4, z, C.bone); // a rib hoop...
    fillBox(g, 1, drop + 1, z, 5, 4, z, C.void); // ...dark within
  }
  fillBox(g, 3, 0, 5, 3, 0, 9, C.boneDark); // the breastbone
  // Scraps of hide still on its flanks: a torn sheet on each side, ragged at its lower edge.
  for (const [x, z0, z1] of [[0, 7, 10], [6, 3, 6]]) for (let z = z0; z <= z1; z++) {
    const low = 2 + Math.floor(hashUnit(x, z, 77) * 2);
    fillBox(g, x, low, z, x, 4, z, (_x, y) => (y === 4 ? C.hideDark : C.hide));
  }
  fillBox(g, 0, 2, 11, 6, 5, 12, (x, y) => (y === 5 || x === 0 || x === 6 ? C.bone : C.boneShade)); // the shoulder blades
  // The collar: a band of rusted iron round the neck, a ring hanging under it.
  fillBox(g, 0, 1, 13, 6, 5, 13, (_x, y) => (y === 5 ? C.rust : C.iron));
  fillBox(g, 1, 2, 13, 5, 4, 13, C.void);
  setColor(g, 3, 0, 13, C.rust);
  return g;
}

// The skull, 6 x 8 x 9: the cranium behind, the burning sockets, a long snout of teeth, the jaw hanging open; a
// tatter of an ear left on one side.
export function houndHead(): VoxelGrid {
  const g = createGrid(HEAD_GRID);
  fillBox(g, 1, 2, 0, 4, 4, 4, (_x, y) => (y === 4 ? C.bone : C.boneShade));
  fillBox(g, 0, 2, 2, 5, 3, 3, C.bone); // the cheekbones
  for (const x of [1, 4]) {
    setColor(g, x, 3, 4, C.eye);
    setColor(g, x, 4, 4, C.void); // (the socket's brow, in shadow)
  }
  fillBox(g, 1, 1, 5, 4, 2, 8, (_x, y) => (y === 2 ? C.bone : C.boneShade)); // the snout
  for (let z = 5; z <= 8; z++) for (const x of [1, 4]) setColor(g, x, 1, z, z % 2 ? C.bone : C.void); // its teeth
  fillBox(g, 2, 2, 8, 3, 2, 8, C.void); // the nose's hole
  fillBox(g, 1, 0, 3, 4, 0, 7, C.boneDark); // the jaw, hanging
  fillBox(g, 2, 0, 4, 3, 0, 6, C.void);
  fillBox(g, 0, 5, 1, 0, 6, 1, C.hide); // what's left of an ear
  setColor(g, 0, 7, 1, C.hideDark);
  return g;
}

// A leg, 2 x 6 x 2: a thin bone, knobbed at the knee, a scrap of hide at the thigh, the paw's bones.
export function houndLeg(): VoxelGrid {
  const g = createGrid(LEG_GRID);
  fillBox(g, 0, 1, 0, 0, 4, 0, C.bone);
  fillBox(g, 0, 3, 0, 1, 3, 1, C.boneShade); // the knee
  fillBox(g, 0, 5, 0, 1, 5, 1, C.hide); // the thigh
  fillBox(g, 0, 0, 0, 1, 0, 1, C.boneDark); // the paw
  return g;
}

// The tail: a string of vertebrae, its root at +Z.
export function houndTail(): VoxelGrid {
  const g = createGrid(TAIL_GRID);
  for (let z = 0; z <= 6; z++) setColor(g, 1, 1, z, z % 2 ? C.bone : C.boneShade);
  return g;
}
