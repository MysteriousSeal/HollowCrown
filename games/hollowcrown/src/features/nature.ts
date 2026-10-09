// The Vale's nature: the forests the map draws filled with trees (nature/forests.ts), drawn as the hero comes near,
// their trunks in the way.

import { forestLayer, forestTrees, trunkOf } from '../nature/forests';
import type { Feature } from './context';

export const nature: Feature = {
  name: 'nature',
  install: ({ app, map, obstacles }) => {
    const trees = forestTrees(map, obstacles);
    app.addLayer(forestLayer(map, trees));
    for (const chunk of trees.values()) for (const tree of chunk) obstacles.add(trunkOf(tree));
  },
};
