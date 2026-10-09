// The Vale's nature: the forests the map draws filled with trees (nature/forests.ts), their trunks in the way; its
// meadows with grass and wildflowers (nature/meadows.ts); all drawn as the hero comes near.

import { forestLayer, forestTrees, trunkOf } from '../nature/forests';
import { meadowGrowth, meadowLayer } from '../nature/meadows';
import type { Feature } from './context';

export const nature: Feature = {
  name: 'nature',
  install: ({ app, map, obstacles }) => {
    app.addLayer(meadowLayer(map, meadowGrowth(map, obstacles)));
    const trees = forestTrees(map, obstacles);
    app.addLayer(forestLayer(map, trees));
    for (const chunk of trees.values()) for (const tree of chunk) obstacles.add(trunkOf(tree));
  },
};
