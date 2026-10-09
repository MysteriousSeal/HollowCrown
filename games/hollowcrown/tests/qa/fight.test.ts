// QA: MQ01's first fight can be won. The Birchwood's two wolves (as wildlife.ts makes them) against the hero (as
// combat.ts makes them), through the engine's real systems on open ground: a player who stands and swings at the
// nearest wolf kills both and lives; one who stands still and doesn't fight dies.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import {
  Attack, AttackIntent, Dead, Faction, Health, Hostile, MoveSpeed, Player, Transform, Wander, actingSystem, attack, attackSystem, healthSystems,
  health, hostile, hostileSystem, movementSystem, wander, wanderSystem,
} from '@voxel/engine/gameplay';
import { TerrainResource, flatTerrain } from '@voxel/engine/world';
import { HERO } from '../../src/data/hero';
import { HERO_SIDE } from '../../src/features/combat';
import { WILDLIFE } from '../../src/features/wildlife';

function fight(swings: boolean) {
  const world = new World();
  world.setResource(TerrainResource, flatTerrain({ width: 200, depth: 200 }, 1));
  const { damage, ...blow } = HERO.blow;
  const hero = world.spawn([Player, true], [Transform, { x: 100, y: 0, z: 100, facing: 0 }], [Health, health(HERO.hp)], [Attack, attack(damage, blow)], [Faction, HERO_SIDE]);
  const wolves = WILDLIFE.filter((a) => a.creature === 'wolf').map((w, i) => {
    const [x, z] = [100 + i * 1.5, 104];
    const f = w.fights!;
    return world.spawn(
      [Transform, { x, y: 0, z, facing: Math.PI }], [MoveSpeed, w.speed], [Wander, wander({ x, z }, { radius: w.roam, speed: w.speed })],
      [Health, health(w.hp)], [Faction, w.creature], [Hostile, hostile({ sight: f.sight, speed: f.run, home: { x, z } })], [Attack, attack(f.damage, { cooldown: f.cooldown })],
    );
  });
  const [health1, health2] = healthSystems();
  const alive = (e: number) => !world.has(e, Dead);
  for (let t = 0; t < 30 && alive(hero) && wolves.some(alive); t += 1 / 30) {
    if (swings) {
      const at = world.read(hero, Transform);
      const near = wolves.filter(alive).map((w) => world.read(w, Transform)).sort((a, b) => Math.hypot(a.x - at.x, a.z - at.z) - Math.hypot(b.x - at.x, b.z - at.z))[0];
      at.facing = Math.atan2(near.x - at.x, near.z - at.z);
      world.add(hero, AttackIntent, true);
    }
    for (const s of [wanderSystem, hostileSystem, movementSystem, attackSystem, health1, actingSystem, health2]) s.update(world, 1 / 30);
    world.clearEvents();
  }
  return { heroAlive: alive(hero), heroHp: world.read(hero, Health).hp, wolvesAlive: wolves.filter(alive).length };
}

describe("MQ01's wolves", () => {
  it('fall to a hero who stands and swings, the hero living', () => {
    const r = fight(true);
    expect(r.wolvesAlive).toBe(0);
    expect(r.heroAlive).toBe(true);
    expect(r.heroHp).toBeLessThan(HERO.hp); // (a real fight: the hero is bitten)
  });

  it('kill a hero who doesn\'t fight', () => {
    expect(fight(false).heroAlive).toBe(false);
  });
});
