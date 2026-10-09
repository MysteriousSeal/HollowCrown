// The bot at the controls: each step it reads the game as a player would (the quest book, where people are, who's in
// reach, the conversation up) and works the keys a player would: WASD (and Shift on a long way) along a route to the
// next objective, E by whoever it's to talk to, E again to read on, 1-9 for a reply, Space at anything hostile.
// Every clock is game time, so it plays the same at any speed.

import type { Entity, System, World } from '@voxel/engine/ecs';
import { Hostile, InReach, Transform, isAlive } from '@voxel/engine/gameplay';
import { KeyboardResource, ScreenAxes } from '@voxel/engine/input';
import type { Obstacles, Point, WorldMap } from '@voxel/engine/world';
import { QUESTS } from '../data/quests';
import { Quests, openObjectives } from '../systems/quests';
import { Resident } from '../systems/villagerDay';
import { ConversationScreen } from '../ui/screens';
import type { BotBadge } from './badge';
import { BotKeys, keysToward, type Code } from './keys';
import { keyOf, nextObjective, pointOf, waitingFor, walkingTo, type Next } from './plan';
import { POLICY, chooseReply } from './policy';
import { Walker } from './walker';

const CLEARANCE = 0.4; // tiles the bot keeps from what's in the way (the hero's body and a little more)
const SPRINT_FROM = 14; // tiles: further than this, it runs
const PRESS_EVERY = 0.6; // seconds between presses of E (or Space), so each one counts
const SWING_REACH = 1.1; // tiles: this near a foe, it swings

// Whether a walker of the bot's clearance can stand at (x, z).
export const freeOn = (map: WorldMap, obstacles: Obstacles) => (x: number, z: number) =>
  map.walkable(x, z) && !obstacles.blocks(x, z, CLEARANCE);

// The labels of the replies up on the conversation screen (read off the page, as a player reads them).
const repliesShown = (): string[] => Array.from(document.querySelectorAll('.ui-talk-choice'), (li) => li.textContent ?? '');

export function autopilotSystem(map: WorldMap, obstacles: Obstacles, hero: Entity, badge: BotBadge): System {
  const keys = new BotKeys();
  const walker = new Walker(freeOn(map, obstacles));
  const skip = new Set<string>();
  let [working, onIt, sincePress, reading] = ['', 0, PRESS_EVERY, 0];

  const press = (code: Code, dt: number): void => {
    sincePress += dt;
    if (sincePress < PRESS_EVERY) return;
    sincePress = 0;
    keys.tap(code);
  };

  // Walks toward `goal` (null: arrived, keys let go).
  const walk = (world: World, at: Point, goal: Point, dt: number, arrive?: number): boolean => {
    const way = walker.step(at, goal, dt, arrive);
    if (!way) {
      keys.hold([], world.resource(KeyboardResource));
      return false;
    }
    const far = Math.hypot(goal[0] - at[0], goal[1] - at[1]);
    const held = keysToward(way[0], way[1], world.resource(ScreenAxes));
    keys.hold(far > SPRINT_FROM ? [...held, 'ShiftLeft'] : held, world.resource(KeyboardResource));
    return true;
  };

  // In a conversation: read each line a moment, then E; a question, a moment's thought, then the policy's reply.
  const converse = (world: World, dt: number): void => {
    keys.hold([], world.resource(KeyboardResource));
    const screen = world.resource(ConversationScreen);
    reading += dt;
    if (!screen.asking) {
      badge.set(`Talking`);
      if (reading >= POLICY.readLine) [reading] = [0, keys.tap('KeyE')];
      return;
    }
    const shown = repliesShown();
    const asking = openObjectives(world.resource(Quests), QUESTS).find(({ objective }) =>
      objective.options?.length === shown.length && objective.options.every((o, i) => o.label === shown[i]));
    const pick = asking ? chooseReply(asking.quest, asking.objective.id, asking.objective.options!) : 0;
    badge.set(`Answering: ${shown[pick] ?? '…'}`);
    if (reading >= POLICY.thinkReply) [reading] = [0, keys.tap(`Digit${pick + 1}` as Code)];
  };

  // The nearest live hostile within `range` of `at`.
  const foeNear = (world: World, at: Point, range: number): Entity | null => {
    let [best, nearest] = [null as Entity | null, range];
    for (const e of world.query(Hostile, Transform)) {
      if (!isAlive(world, e)) continue;
      const { x, z } = world.read(e, Transform);
      const d = Math.hypot(x - at[0], z - at[1]);
      if (d < nearest) [best, nearest] = [e, d];
    }
    return best;
  };

  const residentNamed = (world: World, name: string): Entity | null => {
    for (const e of world.query(Resident, Transform)) if (world.read(e, Resident).name === name) return e;
    return null;
  };

  // On to objective `next`: there, and whatever it asks done there.
  const play = (world: World, next: Next, at: Point, dt: number): void => {
    const { objective } = next;
    if (objective.who) {
      const them = residentNamed(world, objective.who);
      if (them === null) return void (skip.add(keyOf(next)), badge.set(`No ${objective.who} to be found`));
      const { x, z } = world.read(them, Transform);
      const inReach = world.hasResource(InReach) && world.resource(InReach).entity === them;
      if (inReach) {
        keys.hold([], world.resource(KeyboardResource));
        badge.set(`Talking to ${objective.who}`);
        return press('KeyE', dt);
      }
      badge.set(walkingTo(map, objective));
      walk(world, at, [x, z], dt, 0.3);
      return;
    }
    const spot = objective.at === undefined ? null : pointOf(map, objective.at);
    if (!spot) return void skip.add(keyOf(next));
    badge.set(walkingTo(map, objective));
    walk(world, at, spot, dt, 0.5);
  };

  return {
    name: 'bot',
    stage: 'input',
    update(world, dt) {
      const where = world.get(hero, Transform);
      if (!where || !world.hasResource(Quests)) return;
      const at: Point = [where.x, where.z];
      if (world.hasResource(ConversationScreen) && world.resource(ConversationScreen).isOpen) return converse(world, dt);
      reading = 0;
      const foe = foeNear(world, at, POLICY.fightRange);
      if (foe !== null) {
        const { x, z } = world.read(foe, Transform);
        badge.set('Fighting');
        walk(world, at, [x, z], dt, 0.5);
        if (Math.hypot(x - at[0], z - at[1]) <= SWING_REACH) press('Space', dt);
        return;
      }
      const book = world.resource(Quests);
      const next = nextObjective(book, QUESTS, { canFight: false, skip });
      if (!next) {
        keys.hold([], world.resource(KeyboardResource));
        const waiting = waitingFor(book, QUESTS);
        badge.set(waiting ? `Waiting — ${waiting}` : 'Nothing left to play: the story so far is done');
        return;
      }
      const key = keyOf(next);
      if (key !== working) [working, onIt] = [key, 0, walker.reset()];
      onIt += dt;
      const patience = next.objective.optional ? POLICY.giveUpAfter : POLICY.giveUpAfter * 4;
      if (onIt > patience) {
        skip.add(key);
        console.warn(`[bot] gave up on ${key} after ${Math.round(onIt)} s`);
        return;
      }
      play(world, next, at, dt);
    },
  };
}
