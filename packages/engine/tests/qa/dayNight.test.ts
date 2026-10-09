// QA: the day and night never jump. Swept a game minute at a time round the whole day, the sky's light, colours and
// sun move only a little each step (no flash at a keyframe, none at midnight); the clock survives a long frame (a tab
// left in the background) and a clock run backward.

import { describe, expect, it } from 'vitest';
import { World } from '../../src/ecs';
import { TimeOfDay, timeOfDaySystem } from '../../src/gameplay';
import { skyAt } from '../../src/render';

const STEP = 1 / 60; // a game minute

describe('day and night, swept', () => {
  it('changes the sky only a little each game minute, round the whole day and past midnight', () => {
    let prev = skyAt(-STEP);
    for (let h = 0; h <= 24 + STEP; h += STEP) {
      const sky = skyAt(h);
      const at = `at ${h.toFixed(3)} h`;
      for (const v of [sky.sunIntensity, sky.skyIntensity, sky.daylight, sky.sunDirection.length()]) expect(Number.isFinite(v), at).toBe(true);
      expect(Math.abs(sky.sunIntensity - prev.sunIntensity), at).toBeLessThan(0.02);
      expect(Math.abs(sky.daylight - prev.daylight), at).toBeLessThan(0.02);
      expect(sky.sunDirection.angleTo(prev.sunDirection), at).toBeLessThan(0.05);
      expect(Math.abs(sky.fogColor.r - prev.fogColor.r) + Math.abs(sky.fogColor.g - prev.fogColor.g) + Math.abs(sky.fogColor.b - prev.fogColor.b), at).toBeLessThan(0.05);
      prev = sky;
    }
  });

  it('keeps the clock in 0..24 through a long frame and a clock run backward', () => {
    const world = new World();
    world.setResource(TimeOfDay, { hours: 23, rate: 1 / 60 });
    timeOfDaySystem.update(world, 3600 * 5); // five real hours in one frame
    const after = world.resource(TimeOfDay).hours;
    expect(after).toBeGreaterThanOrEqual(0);
    expect(after).toBeLessThan(24);
    expect(after).toBeCloseTo((23 + 5 * 60 * 60 / 60) % 24, 6);
    world.resource(TimeOfDay).rate = -1;
    timeOfDaySystem.update(world, 30);
    expect(world.resource(TimeOfDay).hours).toBeGreaterThanOrEqual(0);
    expect(world.resource(TimeOfDay).hours).toBeLessThan(24);
  });
});
