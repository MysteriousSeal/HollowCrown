// The bot's legs: a route found to where it's going (bot/pathfind.ts), followed corner to corner, skipping ahead to any
// corner it can already see, planned again when the goal has moved off its end or the hero stops getting anywhere,
// and a short sidestep when planning again hasn't freed it. Every clock here is game time (the `dt` it's given), so
// it holds up at any speed the game runs.

import type { Point } from '@voxel/engine/world';
import { clearLine, findRoute, type IsFree } from './pathfind';

const CORNER = 0.7; // tiles: this near a corner, on to the next
const LOOK_EVERY = 0.25; // seconds between looks for a corner further on
const STUCK_EVERY = 0.75; // seconds between checks it's still getting somewhere
const STUCK_MOVED = 0.25; // tiles it must have moved since the last check
const SIDESTEP = 0.6; // seconds of a sidestep, after a few plans in a row haven't freed it
const DIRECT = 6; // tiles: this near the goal with nothing in between, straight at it
const MOVED_GOAL = 3; // tiles the goal may move from where it was planned to before it's planned again

export class Walker {
  route: Point[] | null = null;
  private corner = 0;
  private sinceLook = 0;
  private sinceCheck = 0;
  private lastAt: Point | null = null;
  private stuck = 0;
  private sidestep: { x: number; z: number; left: number } | null = null;
  private plannedFor: Point | null = null; // the goal the route was planned to
  private retryIn = 0; // seconds before trying again, after no route was found
  plans = 0; // routes planned (for the tests and the log)

  constructor(private readonly isFree: IsFree) {}

  // Forgets the route (a new goal).
  reset(): void {
    [this.route, this.corner, this.stuck, this.sidestep, this.lastAt] = [null, 0, 0, null, null];
  }

  // The way to walk from `at` toward `goal` this step ((dx, dz), not normalised), or null: within `arrive` of it.
  step(at: Point, goal: Point, dt: number, arrive = 0.8): [number, number] | null {
    const [gx, gz] = goal;
    const far = Math.hypot(gx - at[0], gz - at[1]);
    if (far <= arrive) {
      this.lastAt = null;
      return null;
    }
    if (this.sidestep) {
      this.sidestep.left -= dt;
      if (this.sidestep.left > 0) return [this.sidestep.x, this.sidestep.z];
      this.sidestep = null;
    }
    this.checkStuck(at, dt);
    if (far <= DIRECT && clearLine(this.isFree, at, goal)) return [gx - at[0], gz - at[1]];
    const was = this.plannedFor;
    this.retryIn -= dt;
    const offEnd = !this.route || !was || Math.hypot(was[0] - gx, was[1] - gz) > MOVED_GOAL;
    if (offEnd && this.retryIn <= 0) this.plan(at, goal);
    const route = offEnd && this.retryIn > 0 ? null : this.route;
    if (!route) return [gx - at[0], gz - at[1]]; // (no route found: straight at it, and hope)
    while (this.corner < route.length - 1 && Math.hypot(route[this.corner][0] - at[0], route[this.corner][1] - at[1]) < CORNER) this.corner++;
    this.sinceLook += dt;
    if (this.sinceLook >= LOOK_EVERY) {
      this.sinceLook = 0;
      while (this.corner < route.length - 1 && clearLine(this.isFree, at, route[this.corner + 1])) this.corner++;
    }
    const [cx, cz] = route[this.corner];
    return [cx - at[0], cz - at[1]];
  }

  private plan(at: Point, goal: Point): void {
    this.plans++;
    this.plannedFor = [goal[0], goal[1]];
    this.route = findRoute(this.isFree, at, goal) ?? findRoute(this.isFree, at, goal, { margin: 160, maxNodes: 900_000 });
    this.corner = 0;
    this.sinceLook = LOOK_EVERY;
    this.retryIn = this.route ? 0 : 2;
  }

  // Not getting anywhere: plan again; a few times in a row, sidestep a little first.
  private checkStuck(at: Point, dt: number): void {
    this.sinceCheck += dt;
    if (this.sinceCheck < STUCK_EVERY) return;
    this.sinceCheck = 0;
    const last = this.lastAt;
    this.lastAt = [at[0], at[1]];
    if (!last) return;
    if (Math.hypot(at[0] - last[0], at[1] - last[1]) >= STUCK_MOVED) {
      this.stuck = 0;
      return;
    }
    this.stuck++;
    this.route = null;
    if (this.stuck >= 3) {
      const angle = Math.random() * Math.PI * 2;
      this.sidestep = { x: Math.cos(angle), z: Math.sin(angle), left: SIDESTEP };
      this.stuck = 0;
    }
  }
}
