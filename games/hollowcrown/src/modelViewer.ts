// The model viewer (models.html, with `npm run dev`): every creature of the Vale (creatures/index.ts), every
// building of Brindleford (buildings/index.ts) and its folk (people/index.ts), every tree (nature/trees.ts), meadow
// plant (nature/meadows.ts) and prop (props/) in the engine's viewer. `?only=wolf,smithy` shows just those.

import { startModelViewer } from '@voxel/engine/tools';
import { CREATURES } from './creatures';
import { PEOPLE, personId } from './people';
import { RUSTY_KNIFE, strangerModel } from './people/stranger';
import { placeModel } from './buildings';
import { BRINDLEFORD } from './data/world/brindleford';
import { SPECIES, VARIANTS, treeModel } from './nature/trees';
import { MEADOW_SHAPES } from './nature/meadows';
import { LANDMARK_SHAPES, PROP_SHAPES } from './props';
import { PROPS } from './props/palette';
import { NATURE_LOOK } from './nature/palette';
import { VoxelModel } from '@voxel/engine/models';
import { STRUCTURE_VOXEL } from '@voxel/engine/structures';

const only = new URLSearchParams(window.location.search).get('only')?.split(',');
startModelViewer(
  document.getElementById('app') as HTMLCanvasElement,
  document.getElementById('label') as HTMLElement,
  [
    ...CREATURES.map(({ id, name, family, make }) => ({ id, name, group: family, make })),
    ...Object.values(PEOPLE).flatMap(({ name, home, make, variants }) => [
      { id: personId(name), name, group: `${home} folk`, make },
      ...Object.entries(variants ?? {}).map(([v, made]) => ({ id: `${personId(name)}-${v}`, name: `${name} (${v})`, group: `${home} folk`, make: made })),
    ]),
    { id: 'stranger', name: 'The Stranger (the hero)', group: 'Hero', make: () => strangerModel() },
    { id: 'strangerKnife', name: 'The Stranger, with the rusty knife', group: 'Hero', make: () => strangerModel(undefined, undefined, { rightArm: RUSTY_KNIFE }) },
    ...(BRINDLEFORD.places ?? []).filter((p) => p.kind === 'building' || p.kind === 'fixture').map((p) => ({ id: p.id, name: p.name ?? p.id, group: 'Brindleford', make: () => placeModel(p)! })),
    ...SPECIES.flatMap((s) => Array.from({ length: VARIANTS }, (_, v) => ({ id: `${s}${v}`, name: `${s} ${v + 1}`, group: 'Trees', make: () => treeModel(s, v) }))),
    ...Object.entries(MEADOW_SHAPES).map(([id, grid]) => ({ id, name: id, group: 'Meadows', make: () => new VoxelModel(grid(), NATURE_LOOK, { voxel: STRUCTURE_VOXEL }) })),
    ...Object.entries(PROP_SHAPES).map(([id, grid]) => ({ id, name: id, group: 'Props', make: () => new VoxelModel(grid(), { palette: PROPS.colors }, { voxel: STRUCTURE_VOXEL }) })),
    ...Object.entries(LANDMARK_SHAPES).map(([id, grid]) => ({ id, name: id, group: 'Landmarks', make: () => new VoxelModel(grid(), NATURE_LOOK, { voxel: STRUCTURE_VOXEL }) })),
  ].filter(({ id }) => !only || only.includes(id)),
);
