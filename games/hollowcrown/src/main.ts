// Hollowcrown: the engine's app, the Vale's map, the hero at the Pilgrim's Shrine, and every feature of the game
// (features/index.ts) installed over them.

import { App, CameraTarget } from '@voxel/engine/app';
import { humanModel } from '@voxel/engine/characters';
import { MoveSpeed, Player, Transform } from '@voxel/engine/gameplay';
import { Obstacles, ObstaclesResource, TerrainResource, loadWorldMap } from '@voxel/engine/world';
import { HERO } from './data/hero';
import { PLACE_KINDS, START_PLACE, WORLD_MAP } from './data/world';
import { FEATURES } from './features';

const app = new App(document.getElementById('app') as HTMLCanvasElement);
const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const obstacles = new Obstacles();
app.world.setResource(TerrainResource, map);
app.world.setResource(ObstaclesResource, obstacles);

const [x, z] = map.place(START_PLACE)!.at;
const hero = app.world.spawn(
  [Transform, { x, y: map.groundY(x, z), z, facing: 0 }],
  [MoveSpeed, HERO.speed],
  [Player, true],
  [CameraTarget, true],
);
app.show(hero, humanModel(HERO.look, HERO.gait));

for (const feature of FEATURES) feature.install({ app, map, obstacles, hero });
app.start();
