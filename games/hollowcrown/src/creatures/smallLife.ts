// The smallest life in the Vale's empty land (an ambient system: gameplay): butterflies over the meadows, a moth at
// dusk, a frog in the marsh. Cheap: a handful of voxels each, the colour doing the work at the camera's distance.
// Butterflies and the moth on the engine's bird rig, drawn small: at rest their wings folded up over the back, in the
// air spread flat and beating (a cabbage white, a peacock with its eye-spots, a brimstone's yellow; the moth dusky,
// furred). The frog on the beast rig: squat, green, its eyes bulging up off its head.

import { beastPart, type BeastSpec, type BirdSpec } from '@voxel/engine/characters';
import { createGrid, fillBox, namedPalette, setColor, type VoxelGrid } from '@voxel/engine/voxel';
import { BEAST_GESTURES, BIRD_GESTURES } from './wildGestures';

// ---- butterflies and the moth ----

interface Wings { wing: number; wingDark: number; spot: number; body: number }

function butterfly(c: Wings, moth = false): BirdSpec {
  const P = namedPalette(c);
  const body = (): VoxelGrid => {
    const g = createGrid([1, 1, moth ? 4 : 3]);
    fillBox(g, 0, 0, 0, 0, 0, moth ? 3 : 2, P.C.body);
    return g;
  };
  const head = (): VoxelGrid => {
    const g = createGrid([1, 2, 1]);
    setColor(g, 0, 0, 0, P.C.body);
    setColor(g, 0, 1, 0, moth ? 0 : P.C.body); // (a feeler)
    return g;
  };
  // A wing (its left), laid along the back at rest; spread, its x runs fore and aft and its z out from the body.
  const wing = (): VoxelGrid => {
    const g = createGrid([4, 1, 5]);
    fillBox(g, 0, 0, 0, 3, 0, 4, (x, _y, z) => (z === 0 && (x === 0 || x === 3) ? 0 : (x === 1 || x === 2) && z === 1 ? P.C.spot : z === 0 || x === 3 ? P.C.wingDark : P.C.wing)); // (rounded at the tips, an eye-spot, a dark edge)
    return g;
  };
  const leg = (): VoxelGrid => {
    const g = createGrid([1, 1, 1]);
    setColor(g, 0, 0, 0, P.C.body);
    return g;
  };
  return {
    palette: P.colors,
    body: { grid: body, pivot: [0.5, 0, 1.5] },
    head: { grid: head, pivot: [0.5, 0, 0], at: [0, 0, moth ? 2 : 1.5] },
    wing: { grid: wing, pivot: [2, 0, 5], at: [0.5, 1, 0.5] },
    leg: { grid: leg, pivot: [0.5, 0.5, 0.5], at: [0, 0, 0], length: 0.5 },
    height: 3,
    shade: 0.15,
    scale: moth ? 0.75 : 0.7,
    gestures: BIRD_GESTURES,
  };
}

export const CABBAGE_WHITE = butterfly({ wing: 0xf4f0e4, wingDark: 0x3a3634, spot: 0x3a3634, body: 0x2a2624 });
export const PEACOCK = butterfly({ wing: 0xb8382a, wingDark: 0x3a2622, spot: 0x5a7ad8, body: 0x2a2220 });
export const BRIMSTONE = butterfly({ wing: 0xf0d860, wingDark: 0xd8b840, spot: 0xc87a2a, body: 0x6a6040 });
export const MOTH = butterfly({ wing: 0x9a8a72, wingDark: 0x6e6050, spot: 0x4e4438, body: 0x7a6a56 }, true);

// ---- the frog ----

const F = namedPalette({ skin: 0x5a7a3a, skinDark: 0x3e5a28, belly: 0xc8c08a, eye: 0xd8b84a, pupil: 0x141210 });

function frogBody(): VoxelGrid {
  const g = createGrid([4, 2, 4]);
  fillBox(g, 0, 0, 0, 3, 1, 3, (x, y, z) => (y === 0 ? F.C.belly : (x + z) % 3 === 0 ? F.C.skinDark : F.C.skin));
  return g;
}
function frogHead(): VoxelGrid {
  const g = createGrid([4, 3, 3]);
  fillBox(g, 0, 0, 0, 3, 1, 2, (_x, y) => (y === 0 ? F.C.belly : F.C.skin));
  for (const x of [0, 3]) {
    setColor(g, x, 2, 1, F.C.eye); // the eyes, bulging up
    setColor(g, x, 2, 2, F.C.pupil);
  }
  return g;
}
function frogLeg(): VoxelGrid {
  const g = createGrid([2, 1, 2]);
  fillBox(g, 0, 0, 0, 1, 0, 1, F.C.skinDark);
  return g;
}
function frogTail(): VoxelGrid {
  return createGrid([1, 1, 1]); // (none)
}

export const FROG: BeastSpec = {
  palette: F.colors,
  body: beastPart(frogBody, [4, 2, 4]),
  head: beastPart(frogHead, [4, 3, 3]),
  leg: beastPart(frogLeg, [2, 1, 2]),
  tail: beastPart(frogTail, [1, 1, 1]),
  headDrop: 1,
  legsAt: [[-2, 1.5], [2, 1.5], [-2, -1.5], [2, -1.5]],
  stride: 2.5,
  gestures: BEAST_GESTURES,
};
