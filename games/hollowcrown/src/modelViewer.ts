// The model viewer (models.html, with `npm run dev`): every creature of the Vale (creatures/index.ts) in
// the engine's viewer. `?only=wolf,bear` shows just those.

import { startModelViewer } from '@voxel/engine/tools';
import { CREATURES } from './creatures';

const only = new URLSearchParams(window.location.search).get('only')?.split(',');
startModelViewer(
  document.getElementById('app') as HTMLCanvasElement,
  document.getElementById('label') as HTMLElement,
  CREATURES.filter(({ id }) => !only || only.includes(id)).map(({ name, family, make }) => ({ name, group: family, make })),
);
