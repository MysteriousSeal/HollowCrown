// The Vale's nature: the forests the map draws filled with trees (nature/forests.ts), their trunks in the way; its
// meadows with grass and wildflowers (nature/meadows.ts); each chunk's worked out and drawn as the hero comes near,
// nothing growing on what's built; and what the designers stood about it (props: fences, hay ricks, the gibbet,
// standing stones), in the way too.

import { obstaclesOf } from '../buildings';
import { DRESSING } from '../data/world/dressing';
import { dressingLayer, dressingObstacles } from '../props';
import { forestLayer } from '../nature/forests';
import { meadowLayer } from '../nature/meadows';
import type { Feature } from './context';

export const nature: Feature = {
  name: 'nature',
  install: ({ app, map, obstacles }) => {
    const built = obstaclesOf(map); // (the buildings alone: what grows doesn't hang on what's loaded first)
    app.addLayer(meadowLayer(map, built));
    app.addLayer(forestLayer(map, built, obstacles));
    app.addLayer(dressingLayer(map, DRESSING));
    dressingObstacles(DRESSING, obstacles);
  },
};
