// The wind: one set of uniforms every swaying thing reads (grass, leaves, banners, smoke), kept moving by the app,
// so the whole land bends to the same gusts. A gust is a slow swell of strength rolling across the land along the
// wind's direction; the sway itself a quicker flutter on top.
//
// Materials sway with addWindSway (their vertices bent by height above their own base, more the higher), or a game's
// own shader reads the uniforms and WIND_GLSL's windAt(world position) itself.

import * as THREE from 'three';

export const WIND = {
  uWindTime: { value: 0 }, // seconds
  uWindStrength: { value: 0.6 }, // 0 calm .. 1 a gale
  uWindDirection: { value: new THREE.Vector2(0.8, 0.6).normalize() }, // along the ground (x, z)
};

// How the wind blows at a world position: its push along the ground (x, z), gusting as waves roll by.
export const WIND_GLSL = /* glsl */ `
uniform float uWindTime;
uniform float uWindStrength;
uniform vec2 uWindDirection;
vec2 windAt(vec3 p) {
  float along = dot(p.xz, uWindDirection);
  float gust = 0.55 + 0.45 * sin(along * 0.35 - uWindTime * 0.9) * sin(along * 0.13 + uWindTime * 0.4);
  float flutter = sin(uWindTime * 3.1 + p.x * 1.7 + p.z * 1.3) * 0.35 + sin(uWindTime * 5.3 + p.x * 3.1) * 0.15;
  return uWindDirection * uWindStrength * (gust + flutter * gust);
}`;

// The wind moved on to `time` seconds (the app does this each frame).
export function updateWind(time: number): void {
  WIND.uWindTime.value = time;
}

export function setWind(strength: number, direction?: { x: number; z: number }): void {
  WIND.uWindStrength.value = Math.max(0, Math.min(1, strength));
  if (direction) WIND.uWindDirection.value.set(direction.x, direction.z).normalize();
}

// `material` swaying in the wind: each vertex pushed along the wind by `amount` world units at full strength, times
// how high it stands above the mesh's base (`height`: the height that sways fully; below, less; the base, not at all).
// Chained after any patch it already has, and with its own program cache key.
export function addWindSway(material: THREE.Material, { amount = 0.08, height = 0.5 }: { amount?: number; height?: number } = {}): void {
  const previous = material.onBeforeCompile;
  const previousKey = material.customProgramCacheKey();
  material.onBeforeCompile = (shader, renderer) => {
    previous.call(material, shader, renderer);
    Object.assign(shader.uniforms, WIND);
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${WIND_GLSL}`).replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      {
        vec4 windBase = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          windBase = instanceMatrix * windBase;
        #endif
        vec3 windWorld = (modelMatrix * windBase).xyz;
        float windBend = clamp(transformed.y / ${height.toFixed(4)}, 0.0, 1.0);
        vec2 push = windAt(windWorld) * ${amount.toFixed(4)} * windBend * windBend;
        // The push is along the world's ground: turned back into the mesh's own space (it may be turned, scaled).
        mat3 windToWorld = mat3(modelMatrix);
        #ifdef USE_INSTANCING
          windToWorld = windToWorld * mat3(instanceMatrix);
        #endif
        transformed += inverse(windToWorld) * vec3(push.x, 0.0, push.y);
      }`,
    );
  };
  material.customProgramCacheKey = () => `${previousKey}|wind${amount}/${height}`;
  material.needsUpdate = true;
}
