// The Vale's land: its terrain drawn round the camera.

import { terrainLayer } from '@voxel/engine/world';
import type { Feature } from './context';

export const land: Feature = {
  name: 'land',
  install: ({ app, map }) => app.addLayer(terrainLayer(map, map.tiers(), map.surfaceColors())),
};
