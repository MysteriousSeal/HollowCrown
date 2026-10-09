// The Vale's land: its terrain drawn round the camera, and its roads and paths worn into it.

import { roadLayer, terrainLayer } from '@voxel/engine/world';
import type { Feature } from './context';

export const land: Feature = {
  name: 'land',
  install: ({ app, map }) => {
    app.addLayer(terrainLayer(map, map.tiers(), map.surfaceColors()));
    app.addLayer(roadLayer(map));
  },
};
