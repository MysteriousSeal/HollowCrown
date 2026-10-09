// The colors of what stands about the Vale (props/models.ts): weathered fence wood, hay (sunlit, shaded, deep), the
// rick's twine, the gibbet's tarred oak and rusted iron (and the Red Hen's feathers), standing stone with its lichen
// and moss, garden soil and what grows in it, the barrow's turf and the earth dug out of it.

import { namedPalette } from '@voxel/engine/voxel';

export const PROPS = namedPalette({
  // fences (fence, post)
  rail: 0x7a5433, railDark: 0x5c3f26, post: 0x5c3f26, postTop: 0x8a6a48,
  // hay ricks
  hay: 0xd9b95a, hayLight: 0xecd27e, hayShade: 0xb89440, hayDeep: 0x96762f, twine: 0x6e4a2a,
  // the gibbet
  tar: 0x3a2a1e, tarLight: 0x54402c, iron: 0x3d3d42, rust: 0x6b4a34, feather: 0xa8332a,
  // standing stones
  stone: 0x8e8a80, stoneLight: 0xaaa597, stoneDark: 0x6a665e, lichen: 0xb7b27a, moss: 0x5d7a3a,
  // garden beds
  soil: 0x6b4a2e, furrow: 0x523822, cabbage: 0x7da05a, cabbageDark: 0x557a3e, leek: 0x9cbf74, bean: 0x4f7f34,
  // the barrow
  turf: 0x5f9a46, turfLight: 0x7cb256, turfDark: 0x467a37, earth: 0x5e4630, earthDark: 0x3e2e20,
});

export const P = PROPS.C;
