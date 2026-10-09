// Red deer for the Vale's woods and meadows (an ambient system: gameplay): the doe and the stag, on the engine's beast
// rig at 0.025 voxels, palette first: a warm red-brown coat, a darker line down the back, a pale belly, the white rump
// and its scut that flash as they bound away; long thin legs, dark at the shins; the head high on its neck, big ears,
// a dark nose. The stag darker and bigger, his antlers stepped out and up with their tines. Faces +Z.

import { beastPart, type BeastSpec } from '@voxel/engine/characters';
import { createGrid, fillBox, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { BEAST_GESTURES } from './wildGestures';

const SHARED = { belly: 0xe6d8bc, rump: 0xf3ede0, hoof: 0x2e241c, nose: 0x241c18, eye: 0x17110d, antler: 0xd6c49c, antlerTip: 0xf0e6cc };
const DOE = namedPalette({ coat: 0xa8703f, coatDark: 0x80542e, ...SHARED });
const STAG = namedPalette({ coat: 0x8c5a32, coatDark: 0x6a4224, ...SHARED });
const C = DOE.C; // (the same names, in the same order, for both)

const BODY: [number, number, number] = [5, 6, 11];
const LEG: [number, number, number] = [2, 10, 2];
const TAIL: [number, number, number] = [2, 2, 2];

function body(): VoxelGrid {
  const g = createGrid(BODY);
  fillBox(g, 0, 0, 0, 4, 5, 10, (x, y, z) => {
    if (y === 5 && (x === 0 || x === 4 || z === 0 || z === 10)) return 0; // (its back rounded)
    if (z <= 1 && y >= 2) return C.rump;
    if (y === 0) return C.belly;
    return y === 5 && x === 2 ? C.coatDark : x === 0 || x === 4 || y === 1 ? C.coatDark : C.coat;
  });
  return g;
}

// The neck rising from the shoulders, the head on it (looking forward), the ears; the stag's antlers above.
function head(stag: boolean): () => VoxelGrid {
  return () => {
    const W = stag ? 10 : 4;
    const ox = stag ? 3 : 0; // (the head's x in a grid widened for antlers)
    const g = createGrid([W, stag ? 16 : 11, 7]);
    fillBox(g, ox + 1, 0, 0, ox + 2, 5, 2, (_x, y, z) => (z === 2 && y <= 3 ? C.belly : C.coat)); // the neck
    fillBox(g, ox, 5, 1, ox + 3, 8, 4, (x, y) => (y === 5 ? C.belly : x === ox || x === ox + 3 ? C.coatDark : C.coat)); // the head
    fillBox(g, ox + 1, 5, 5, ox + 2, 6, 6, (_x, _y, z) => (z === 6 ? C.nose : C.coat)); // the muzzle
    setColor(g, ox, 7, 3, C.eye);
    setColor(g, ox + 3, 7, 3, C.eye);
    for (const x of [ox, ox + 3]) fillBox(g, x, 9, 1, x, 10, 2, (_x, y) => (y === 10 ? C.coatDark : C.coat)); // the ears
    if (stag) {
      for (const side of [-1, 1]) {
        const at = (dx: number) => (side < 0 ? ox + 1 - dx : ox + 2 + dx);
        fillBox(g, at(0), 9, 2, at(0), 10, 2, C.antler); // the beam's root
        fillBox(g, Math.min(at(1), at(2)), 11, 2, Math.max(at(1), at(2)), 11, 2, C.antler); // out
        fillBox(g, at(3), 12, 2, at(3), 15, 2, (_x, y) => (y === 15 ? C.antlerTip : C.antler)); // and up
        fillBox(g, at(2), 13, 3, at(2), 13, 4, (_x, _y, z) => (z === 4 ? C.antlerTip : C.antler)); // a brow tine forward
        fillBox(g, at(3), 14, 1, at(3), 14, 1, C.antlerTip); // a tine back
      }
    }
    return g;
  };
}

function leg(): VoxelGrid {
  const g = createGrid(LEG);
  fillBox(g, 0, 0, 0, 1, 9, 1, (x, y) => (y === 0 ? C.hoof : y <= 4 ? (x ? C.coatDark : C.coat) : C.coat));
  return g;
}

function tail(): VoxelGrid {
  const g = createGrid(TAIL);
  fillBox(g, 0, 0, 0, 1, 1, 1, (_x, y) => (y === 0 ? C.rump : C.coatDark));
  return g;
}

const deer = (stag: boolean): BeastSpec => ({
  palette: (stag ? STAG : DOE).colors,
  body: beastPart(body, BODY),
  head: beastPart(head(stag), stag ? [10, 16, 7] : [4, 11, 7]),
  leg: beastPart(leg, LEG),
  tail: beastPart(tail, TAIL),
  headDrop: 2,
  tailDrop: 1,
  tailDroop: 0.6,
  legsAt: [[-1.5, 4], [1.5, 4], [-1.5, -4], [1.5, -4]],
  stride: 1.5,
  scale: stag ? 1.12 : 1,
  gestures: BEAST_GESTURES,
});

export const DEER_DOE = deer(false);
export const DEER_STAG = deer(true);
