// The day and night: each frame the sky for the hour (render/sky.ts) copied onto the sun, the sky fill, the fog and
// background, and the light shafts, which fade out with the daylight.

import * as THREE from 'three';
import type { System } from '../ecs';
import { TimeOfDay } from '../gameplay/time';
import { emptySky, placeSun, skyAt, type Lights, type PostProcessing } from '../render';

export interface DayNightOptions {
  startHour?: number; // the hour the game starts at (default 17: late afternoon, dusk soon)
  dayMinutes?: number; // real minutes a game day lasts (default 24: an hour a minute)
}

export function dayNightSystem(lights: Lights, scene: THREE.Scene, post: () => PostProcessing | null): System {
  const sky = emptySky();
  return {
    name: 'dayNight',
    stage: 'present',
    update(world) {
      if (!world.hasResource(TimeOfDay)) return;
      skyAt(world.resource(TimeOfDay).hours, sky);
      placeSun(lights.sun, sky.sunDirection);
      lights.sun.color.copy(sky.sunColor);
      lights.sun.intensity = sky.sunIntensity;
      lights.sky.color.copy(sky.skyColor);
      lights.sky.groundColor.copy(sky.groundColor);
      lights.sky.intensity = sky.skyIntensity;
      if (scene.fog) scene.fog.color.copy(sky.fogColor);
      if (scene.background instanceof THREE.Color) scene.background.copy(sky.fogColor);
      post()?.setShaftLight(sky.daylight * sky.daylight); // (gone well before dark)
    },
  };
}
