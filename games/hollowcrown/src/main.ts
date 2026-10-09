// Hollowcrown: the engine's app, the Vale's land, and the hero walking it.

import { App, CameraTarget } from '@voxel/engine/app';
import { humanModel } from '@voxel/engine/characters';
import { MoveSpeed, Player, Transform } from '@voxel/engine/gameplay';
import { TerrainResource, flatTerrain, terrainLayer } from '@voxel/engine/world';
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
app.show(hero, humanModel(HERO.look, HERO.gait));
app.start();
