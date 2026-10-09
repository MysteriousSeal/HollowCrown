// The Vale's growing things' colors: bark (oak's brown, birch's white with its black marks), leaves in bands from the
// cool shade under a crown to the warm light on top (oak's deep green, birch's yellow-green already turning, pine's
// blue-green), pine cones; and the meadows' grass and flowers. One palette for all of nature, each model painting from
// it.

import { namedPalette } from '@voxel/engine/voxel';

export const NATURE = namedPalette({
  // bark (trees.ts)
  bark: 0x5c4030, barkDark: 0x3f2b1e, barkLight: 0x76553b,
  birchBark: 0xece6d6, birchShade: 0xc7c0ae, birchMark: 0x2f2b27,
  // oak leaves, shade to light (trees.ts)
  oak0: 0x1e4430, oak1: 0x285a34, oak2: 0x35703a, oak3: 0x468744, oak4: 0x5c9f4c, oak5: 0x7cb85a, oak6: 0xa5d06c,
  // birch leaves, shade to light, a few gone gold (trees.ts)
  birch0: 0x4d7d33, birch1: 0x5f933b, birch2: 0x76aa46, birch3: 0x90bf55, birch4: 0xadd46a, birch5: 0xcde487, birchGold: 0xd9b84e,
  // pine needles, shade to light, their fresh tips and cones (trees.ts)
  pine0: 0x173f3a, pine1: 0x1f5446, pine2: 0x286a50, pine3: 0x33805a, pine4: 0x459865, pine5: 0x62b170, pine6: 0x8fcb7f,
  pineTip: 0x74bd72, cone: 0x7a4e2c,
  // the Hanging Oak's rope and hollow (landmarks.ts)
  rope: 0x9c8461, hollow: 0x1c1410,
  // meadow grass, a shade either side of the ground's, gone to seed (meadows.ts)
  grassDark: 0x4a8239, grass: 0x62a44a, grassLight: 0x8cbf5c, seedHead: 0xc8b46a,
  // wildflowers: poppy, cornflower, oxeye daisy and its eye, buttercup, their stems (meadows.ts)
  poppy: 0xc0392f, cornflower: 0x5a72b8, daisy: 0xeee8d6, daisyEye: 0xe1b94c, buttercup: 0xf0c843, stem: 0x4f7f34,
});

export const N = NATURE.C;
export const NATURE_LOOK = { palette: NATURE.colors };

// The leaf bands, darkest first.
export const OAK_BANDS = [N.oak0, N.oak1, N.oak2, N.oak3, N.oak4, N.oak5, N.oak6];
export const BIRCH_BANDS = [N.birch0, N.birch1, N.birch2, N.birch3, N.birch4, N.birch5];
export const PINE_BANDS = [N.pine0, N.pine1, N.pine2, N.pine3, N.pine4, N.pine5, N.pine6];
