// The Vale's buildings and fixtures: drawn as the hero comes near, their walls in the way.

import { obstaclesOf, placesOf } from '../buildings';
import type { Feature } from './context';

export const buildings: Feature = {
  name: 'buildings',
  install: ({ app, map, obstacles }) => {
    app.addLayer(placesOf(map));
    obstaclesOf(map, obstacles);
  },
};
