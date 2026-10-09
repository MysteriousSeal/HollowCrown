// Brindleford's named folk (docs/story/regions/brindle-vale.md, the people's table), each dressed as the bible has
// them, in the order it lists them. Who uses it: people/index.ts (PEOPLE).

import type { FrameSpec } from '@voxel/engine/characters';
import { apron, body, forearms, shoes, sleeves, folk, K, W } from './kit';

// Garrick Fenn, the innkeeper: an old ferryman gone to fat at the middle, his forearms still a ferryman's (the
// sleeves rolled off them), a long white apron, a woad kerchief knotted at the throat from the river days.
const GARRICK = folk({ build: 'male', skin: 0, hair: 4, dye: 3, hairStyle: 'short', beard: true, expression: 'stern' }, {
  torso: (g, o, f) => {
    body(g, o, (x, y, z) => (y === 8 && z >= 3 ? W.woad : y >= 6 || z === 4 ? ((x + y) % 4 ? W.linen : W.linenShade) : W.russetDark)); // the shirt, a russet waistcoat behind the apron
    apron(g, o, f, 6, 4, (_x, y) => (y === -4 ? W.apronHem : W.apron));
  },
  arm: (g, o) => {
    sleeves(g, o, 5, (_x, y) => (y === 5 ? W.roll : W.linen)); // rolled to the elbow
    forearms(g, o);
  },
  leg: (g, o) => {
    body(g, o, (_x, y) => (y >= 3 ? W.wool : 0));
    shoes(g, o, 2, (_x, y) => (y === 2 ? K.leather : K.leatherDark));
  },
});

export const FOLK: Record<string, FrameSpec> = {
  'Garrick Fenn': GARRICK,
};
