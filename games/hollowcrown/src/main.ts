// Hollowcrown: the engine's app, the Vale's land, and the hero walking it.

import { App, CameraTarget } from '@voxel/engine/app';
import { humanModel } from '@voxel/engine/characters';
import { MoveSpeed, Player, Transform } from '@voxel/engine/gameplay';
import { ObstaclesResource, TerrainResource, loadWorldMap, terrainLayer } from '@voxel/engine/world';
import { obstaclesOf, placesOf } from './buildings';
import { HERO } from './data/hero';
import { PLACE_KINDS, START_PLACE, WORLD_MAP } from './data/world';

const app = new App(document.getElementById('app') as HTMLCanvasElement);
const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
app.world.setResource(TerrainResource, map);
app.world.setResource(ObstaclesResource, obstaclesOf(map));
app.addLayer(terrainLayer(map, map.tiers(), map.surfaceColors()));
app.addLayer(placesOf(map));

const [x, z] = map.place(START_PLACE)!.at;
const hero = app.world.spawn(
  [Transform, { x, y: map.groundY(x, z), z, facing: 0 }],
  [MoveSpeed, HERO.speed],
  [Player, true],
  [CameraTarget, true],
);
app.show(hero, humanModel(HERO.look, HERO.gait));
app.start();
