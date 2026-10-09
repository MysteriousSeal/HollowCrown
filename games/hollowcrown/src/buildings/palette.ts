// The Vale's buildings' colors: limewashed plaster gone cream, oak gone grey-brown, river stone, late-summer thatch,
// the slate of the better houses, painted shutters (each house its own), lamplit windows; and their props' (a sign's
// paint, iron, embers, bronze, flowers). One palette for every building, each painting its parts from it.

import { namedPalette } from '@voxel/engine/voxel';
import type { RoofStyle, StructureColor, WallStyle } from '@voxel/engine/structures';

export const VILLAGE = namedPalette({
  // walls
  plaster: 0xe6d9bb, plasterShade: 0xccbd9a,
  daub: 0xc8b28a, daubShade: 0xab9671,
  timber: 0x5b3e2a, timberDark: 0x3d2a1d,
  stone: 0x9b958a, stoneLight: 0xb7b1a4, stoneDark: 0x75706a,
  // roofs
  thatch: 0xc39a55, thatchLight: 0xd9b871, thatchDark: 0x8c6a3b,
  slate: 0x56616c, slateLight: 0x6d7985, slateDark: 0x3e4651,
  shingle: 0x7b5b3f, shingleLight: 0x92704d, shingleDark: 0x5b432f,
  // openings
  door: 0x7a5233, doorDark: 0x573a23,
  window: 0xffc26a, // (glows)
  green: 0x4e6a57, blue: 0x4c5e77, red: 0x7b4034, // shutters
  inside: 0x1c1612,
  // props
  iron: 0x3b3b40, ember: 0xff7b2c, emberDim: 0xc2461d, // (embers glow)
  bronze: 0x6e8b60, signRed: 0x8a3a2e, signCream: 0xe9dcc0,
  flower: 0xb9443a, flowerGold: 0xe1b94c, leaf: 0x5b7a3a, herb: 0x7d8b4c,
  water: 0x3b6a86, rope: 0x9c8461, paper: 0xe7ddc6, heron: 0x8f98a0,
});

export const C = VILLAGE.C;
export const GLOWS = [C.window, C.ember];
export const LOOK = { palette: VILLAGE.colors, glows: new Set(GLOWS) };

export type Shutter = 'green' | 'blue' | 'red';

// A building's parts in the palette: its walls' plaster (limewash, or the daub of wattle), its roof's covering, its
// shutters' paint.
export function structureColors(walls: WallStyle, roof: RoofStyle, shutter: Shutter): Record<StructureColor, number> {
  const daub = walls === 'wattle';
  return {
    plaster: daub ? C.daub : C.plaster,
    plasterShade: daub ? C.daubShade : C.plasterShade,
    timber: C.timber, timberDark: C.timberDark,
    stone: C.stone, stoneLight: C.stoneLight, stoneDark: C.stoneDark,
    roof: C[roof], roofLight: C[`${roof}Light`], roofDark: C[`${roof}Dark`],
    door: C.door, doorDark: C.doorDark,
    window: C.window, shutter: C[shutter], inside: C.inside,
  };
}
