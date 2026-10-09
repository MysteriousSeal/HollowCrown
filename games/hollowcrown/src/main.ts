// Hollowcrown: the engine's app, the Vale's land, and the hero walking it.

import { App } from '@voxel/engine/app/app';
import { CameraTarget, rigVisual } from '@voxel/engine/app/visuals';
import { HumanRig } from '@voxel/engine/characters/human/humanRig';
import { MoveSpeed, Player, Transform } from '@voxel/engine/gameplay/components';
import { TerrainResource, flatTerrain } from '@voxel/engine/world/terrain';
import { terrainLayer } from '@voxel/engine/world/terrainMesh';
import { HERO } from './data/hero';
import { WORLD } from './data/world';

const app = new App(document.getElementById('app') as HTMLCanvasElement);
const terrain = app.world.setResource(TerrainResource, flatTerrain(WORLD.size, WORLD.groundTier));
app.addLayer(terrainLayer(terrain, [WORLD.groundTier]));

const { x, z } = WORLD.start;
const hero = app.world.spawn(
  [Transform, { x, y: terrain.groundY(x, z), z, facing: 0 }],
  [MoveSpeed, HERO.speed],
  [Player, true],
  [CameraTarget, true],
);
app.show(hero, rigVisual(new HumanRig(HERO.look)));
app.start();
