// The bot's thinking, without a browser: its routes over the Vale (round what's built and stood about), which
// objective it plays next, the reply it picks, and the keys it holds to walk a way.

import { describe, expect, it } from 'vitest';
import { Obstacles, loadWorldMap, type Point } from '@voxel/engine/world';
import { obstaclesOf } from '../src/buildings';
import { clearLine, findRoute } from '../src/bot/pathfind';
import { keysToward } from '../src/bot/keys';
import { nameOf, nextObjective, pointOf, walkingTo, whoFor } from '../src/bot/plan';
import { chooseReply } from '../src/bot/policy';
import { Walker } from '../src/bot/walker';
import { freeOn } from '../src/bot/autopilot';
import { QUESTS } from '../src/data/quests';
import { DRESSING } from '../src/data/world/dressing';
import { PLACE_KINDS, START_PLACE, WORLD_MAP } from '../src/data/world';
import { villagersOf } from '../src/features/villagers';
import { speedOf } from '../src/features/bot';
import { dressingObstacles } from '../src/props';
import { Quests, completeObjective, newBook, startQuest } from '../src/systems/quests';

const map = loadWorldMap(WORLD_MAP, PLACE_KINDS);
const obstacles = obstaclesOf(map, new Obstacles());
dressingObstacles(DRESSING, obstacles);
const isFree = freeOn(map, obstacles);
const shrine = map.place(START_PLACE)!.at;

const mq01 = () => {
  const book = newBook();
  startQuest(book, QUESTS, 'MQ01');
  return book;
};

describe('the bot', () => {
  it('finds a route from the shrine to Garrick\'s door, every leg of it clear', () => {
    const garrick = villagersOf(map).find((v) => v.name === 'Garrick Fenn')!;
    const door: Point = [garrick.x, garrick.z];
    const route = findRoute(isFree, shrine, door)!;
    expect(route).not.toBeNull();
    const end = route[route.length - 1];
    expect(Math.hypot(end[0] - door[0], end[1] - door[1])).toBeLessThan(2);
    for (let i = 1; i < route.length; i++) expect(clearLine(isFree, route[i - 1], route[i])).toBe(true);
  });

  it('walks a route there, step by step, as the movement would', () => {
    const walker = new Walker(isFree);
    const goal = map.place('brindleford')!.at;
    let at: Point = [...shrine];
    for (let t = 0; t < 400 && walker.step(at, goal, 1 / 10, 2); t += 0.1) {
      const [dx, dz] = walker.step(at, goal, 0, 2) ?? [0, 0];
      const length = Math.hypot(dx, dz) || 1;
      const [x, z] = [at[0] + (dx / length) * 0.6, at[1] + (dz / length) * 0.6]; // (3 tiles a second, sprinting)
      at = [isFree(x, at[1]) ? x : at[0], at[1]];
      if (isFree(at[0], z)) at = [at[0], z];
    }
    expect(Math.hypot(at[0] - goal[0], at[1] - goal[1])).toBeLessThanOrEqual(2);
  });

  it('plays the shrine first, then the road, passing a fight with no foe about', () => {
    const book = mq01();
    expect(nextObjective(book, QUESTS)?.objective.id).toBe('feather');
    for (const id of ['feather', 'bowl', 'first-words']) completeObjective(book, QUESTS, 'MQ01', id);
    expect(nextObjective(book, QUESTS)?.objective.id).toBe('pilgrim');
    completeObjective(book, QUESTS, 'MQ01', 'pilgrim');
    expect(nextObjective(book, QUESTS)?.objective.id).toBe('brindleford');
    expect(nextObjective(book, QUESTS, { canFight: true })?.objective.id).toBe('wolves');
  });

  it('plays an optional talk before the one that ends its stage, and leaves what it gave up', () => {
    const book = mq01();
    Object.assign(book.quests[0], { stage: 'the-inn', done: [] });
    expect(nextObjective(book, QUESTS)?.objective.id).toBe('elsa');
    expect(nextObjective(book, QUESTS, { skip: new Set(['MQ01/elsa']) })?.objective.id).toBe('garrick');
  });

  it('sleeps through a wait in the bed of whoever keeps one there', () => {
    const book = mq01();
    Object.assign(book.quests[0], { stage: 'the-inn', done: ['garrick', 'why-here', 'elsa'] });
    const next = nextObjective(book, QUESTS)!;
    expect(next.objective.id).toBe('midnight');
    expect(whoFor(next.objective)).toBe('Garrick Fenn');
    expect(walkingTo(map, next.objective)).toBe("Walking to The Ferryman's Rest — ask Garrick Fenn for a bed");
  });

  it('has nothing left once MQ01 is over', () => {
    const book = mq01();
    book.quests[0].finished = true;
    expect(nextObjective(book, QUESTS)).toBeNull();
    expect(Quests.name ?? 'Quests').toBeTruthy();
  });

  it('picks the policy\'s reply, else by tone, else the first', () => {
    const pilgrim = QUESTS.MQ01.stages[1].objectives[0];
    expect(pilgrim.options![chooseReply('MQ01', 'pilgrim', pilgrim.options!)].id).toBe('cover');
    const why = QUESTS.MQ01.stages[3].objectives[1];
    expect(why.options![chooseReply('XX', 'why', why.options!)].tone).toBe('kind');
    expect(chooseReply('XX', 'none', [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }])).toBe(0);
  });

  it('knows where every MQ01 objective is, and says where it\'s going', () => {
    for (const stage of QUESTS.MQ01.stages) for (const o of stage.objectives) if (o.at) expect(pointOf(map, o.at)).not.toBeNull();
    expect(walkingTo(map, QUESTS.MQ01.stages[3].objectives[0])).toBe("Walking to The Ferryman's Rest — talk to Garrick Fenn");
    expect(nameOf(map, [560, 3374])).not.toBe('the road'); // (a tile: named by its area, or the place nearest it)
  });

  it('holds the keys that walk most nearly the way it wants', () => {
    const axes = { forward: { x: 0, z: -1 }, right: { x: 1, z: 0 } };
    expect(keysToward(0, -1, axes)).toEqual(['KeyW']);
    expect(keysToward(1, 1, axes)).toEqual(['KeyS', 'KeyD']);
    expect(keysToward(0, 0, axes)).toEqual([]);
  });

  it('reads the speed from the address', () => {
    expect(speedOf('?bot&speed=5')).toBe(5);
    expect(speedOf('?bot')).toBe(10);
    expect(speedOf('?bot&speed=nope')).toBe(10);
  });
});
