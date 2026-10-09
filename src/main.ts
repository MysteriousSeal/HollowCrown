// Boots the game: the model, its view and the controller driving them.

import { GameModel } from './model/GameModel';
import { GameView } from './view/GameView';
import { GameController } from './controller/GameController';

const model = new GameModel();
const view = new GameView(document.getElementById('app') as HTMLCanvasElement, model);
new GameController(model, view).start();
