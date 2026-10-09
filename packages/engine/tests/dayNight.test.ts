import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { TimeOfDay, hoursPerSecond, timeOfDaySystem } from '../src/gameplay';
import { FOG_COLOR, SKY_KEYS, SUN_DIRECTION, SUN_INTENSITY, skyAt } from '../src/render';

const brightness = (c: THREE.Color) => c.r + c.g + c.b;

describe('time of day', () => {
  it('moves on at its rate and wraps round at midnight', () => {
    const world = new World();
    const time = world.setResource(TimeOfDay, { hours: 23, rate: hoursPerSecond(24) });
    timeOfDaySystem.update(world, 60); // a real minute: a game hour
    expect(time.hours).toBeCloseTo(0);
    timeOfDaySystem.update(world, 90);
    expect(time.hours).toBeCloseTo(1.5);
  });

  it('does nothing without the resource', () => {
    expect(() => timeOfDaySystem.update(new World(), 1)).not.toThrow();
  });
});

describe('sky', () => {
  it('has its keyframes in hour order, from 0 to 24', () => {
    const hours = SKY_KEYS.map((k) => k.hour);
    expect(hours[0]).toBe(0);
    expect(hours.at(-1)).toBe(24);
    expect([...hours].sort((a, b) => a - b)).toEqual(hours);
  });

  it('is the constants\' daylight at noon', () => {
    const noon = skyAt(12);
    expect(noon.sunDirection.distanceTo(SUN_DIRECTION)).toBeCloseTo(0);
    expect(noon.sunIntensity).toBeCloseTo(SUN_INTENSITY);
    expect(noon.fogColor.getHex()).toBe(new THREE.Color(FOG_COLOR).getHex());
    expect(noon.daylight).toBe(1);
  });

  it('is dark blue at night, darker than dusk, darker than day', () => {
    const [night, dusk, day] = [skyAt(1), skyAt(19), skyAt(12)];
    expect(night.daylight).toBe(0);
    expect(night.fogColor.b).toBeGreaterThan(night.fogColor.r);
    expect(brightness(night.fogColor)).toBeLessThan(brightness(dusk.fogColor));
    expect(brightness(dusk.fogColor)).toBeLessThan(brightness(day.fogColor));
    expect(night.sunIntensity).toBeLessThan(day.sunIntensity);
  });

  it('wraps round any hour, and changes smoothly', () => {
    expect(skyAt(25).fogColor.getHex()).toBe(skyAt(1).fogColor.getHex());
    expect(skyAt(-6).fogColor.getHex()).toBe(skyAt(18).fogColor.getHex());
    for (let h = 0; h < 24; h += 0.25) {
      const [a, b] = [skyAt(h), skyAt(h + 0.25)];
      expect(Math.abs(brightness(a.fogColor) - brightness(b.fogColor))).toBeLessThan(0.35); // (a quarter hour: 15 real seconds)
      expect(a.sunDirection.length()).toBeCloseTo(1);
      expect(a.sunDirection.y).toBeGreaterThan(0);
    }
  });
});
