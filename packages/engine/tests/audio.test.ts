import { describe, expect, it } from 'vitest';
import { PlaySound, SOUND_NAMES, ambienceMix, daylightAt, defaultStepSurface, footstepSystem, footsteps, Footsteps, spatialMix } from '../src/audio';
import { World } from '../src/ecs';
import { Transform } from '../src/gameplay';
import { TerrainResource, flatTerrain, type Terrain } from '../src/world';

describe('audio', () => {
  const right = { x: 1, z: 0 };

  it('pans a sound to the side it\'s on and fades it with distance, silent far off', () => {
    const ear = { x: 0, z: 0 };
    expect(spatialMix(ear, { x: 0, z: 1 }, right)).toEqual({ pan: 0, gain: 1 });
    expect(spatialMix(ear, { x: 5, z: 0 }, right).pan).toBeGreaterThan(0.3);
    expect(spatialMix(ear, { x: -5, z: 0 }, right).pan).toBeLessThan(-0.3);
    const [near, mid, far] = [2, 8, 16].map((d) => spatialMix(ear, { x: 0, z: d }, right).gain);
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(far);
    expect(spatialMix(ear, { x: 0, z: 30 }, right).gain).toBe(0);
  });

  it('mixes birds by day, crickets and owls at night, a river near water, hushed indoors', () => {
    expect(daylightAt(12)).toBe(1);
    expect(daylightAt(0)).toBe(0);
    const [noon, midnight] = [ambienceMix(12), ambienceMix(0)];
    expect(noon.birds).toBeGreaterThan(0.5);
    expect(noon.crickets).toBe(0);
    expect(midnight.birds).toBe(0);
    expect(midnight.crickets).toBeGreaterThan(0.5);
    expect(midnight.owls).toBeGreaterThan(0.3);
    expect(ambienceMix(12, { water: 0.8 }).river).toBeCloseTo(0.8);
    expect(ambienceMix(12, { water: 0.8, indoors: true })).toMatchObject({ birds: 0, river: 0 });
  });

  it('has every sound it promises', () => {
    for (const name of ['step-grass', 'step-road', 'step-wood', 'swing', 'hit', 'snarl', 'door', 'click', 'chirp', 'hoot', 'cricket']) {
      expect(SOUND_NAMES).toContain(name);
    }
  });

  it('sounds a step each stride walked, by what\'s underfoot', () => {
    const world = new World();
    const road: Terrain = { ...flatTerrain({ width: 50, depth: 50 }, 0), surfaceAt: (x) => (x > 20 ? 1 : 0), surfaceNames: ['road'] };
    world.setResource(TerrainResource, road);
    const walker = world.spawn([Transform, { x: 17, y: 0, z: 10, facing: 0 }], [Footsteps, footsteps(0.5)]);
    const steps = footstepSystem();
    const sounds: string[] = [];
    const at = world.read(walker, Transform);
    for (let i = 0; i < 40; i++) {
      at.x += 0.1;
      steps.update(world, 1 / 60);
      sounds.push(...world.eventsOf(PlaySound).map((s) => s.name));
      world.clearEvents();
    }
    expect(sounds.length).toBe(7); // (3.9 walked after the first frame: 7 strides of 0.5)
    expect(sounds[0]).toBe('step-grass');
    expect(sounds.at(-1)).toBe('step-road');
    expect(defaultStepSurface('plank bridge')).toBe('step-wood');
  });
});
