// The model viewer (models.html, with `npm run dev`): every creature of the Vale (assets/creatures/creatures.ts) in
// the engine's viewer.

import { startModelViewer } from '@voxel/engine/tools/modelViewer';
import { CREATURES } from './assets/creatures/creatures';

startModelViewer(
  document.getElementById('app') as HTMLCanvasElement,
  document.getElementById('label') as HTMLElement,
  CREATURES.map(({ name, family, make }) => ({ name, group: family, make })),
);
