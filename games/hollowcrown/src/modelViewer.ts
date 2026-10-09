// The model viewer (models.html, with `npm run dev`): every creature of the Vale (creatures/index.ts) and every
// building of Brindleford (buildings/index.ts), and its folk (people/index.ts), in the engine's viewer. `?only=wolf,smithy` shows just those.

import { startModelViewer } from '@voxel/engine/tools';
import { CREATURES } from './creatures';
import { PEOPLE, personId } from './people';
import { placeModel } from './buildings';
import { BRINDLEFORD } from './data/world/brindleford';

const only = new URLSearchParams(window.location.search).get('only')?.split(',');
startModelViewer(
  document.getElementById('app') as HTMLCanvasElement,
  document.getElementById('label') as HTMLElement,
  [
    ...CREATURES.map(({ id, name, family, make }) => ({ id, name, group: family, make })),
    ...Object.values(PEOPLE).map(({ name, make }) => ({ id: personId(name), name, group: 'Brindleford folk', make })),
    ...(BRINDLEFORD.places ?? []).filter((p) => p.kind === 'building' || p.kind === 'fixture').map((p) => ({ id: p.id, name: p.name ?? p.id, group: 'Brindleford', make: () => placeModel(p)! })),
  ].filter(({ id }) => !only || only.includes(id)),
);
