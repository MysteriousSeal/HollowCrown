// The Vale's buildings and fixtures: on level ground, drawn as the hero comes near, their walls in the way.

import { levelGround, obstaclesOf, placesOf } from '../buildings';
import type { Feature } from './context';

export const buildings: Feature = {
  name: 'buildings',
  install: ({ app, map, obstacles }) => {
    levelGround(map);
    app.addLayer(placesOf(map));
    obstaclesOf(map, obstacles);
  },
};
