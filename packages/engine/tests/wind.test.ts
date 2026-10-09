import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { WIND, addWindSway, setWind, updateWind } from '../src/render';

describe('wind', () => {
  it('is one set of uniforms, moved on and set for everyone', () => {
    updateWind(12.5);
    expect(WIND.uWindTime.value).toBe(12.5);
    setWind(3, { x: 0, z: 2 });
    expect(WIND.uWindStrength.value).toBe(1);
    expect(WIND.uWindDirection.value.toArray()).toEqual([0, 1]);
  });

  it('sways a material with the shared uniforms, its own program apart from the unswayed', () => {
    const material = new THREE.MeshStandardMaterial();
    const before = material.customProgramCacheKey();
    addWindSway(material, { amount: 0.1, height: 0.6 });
    expect(material.customProgramCacheKey()).not.toBe(before);
    const shader = { uniforms: {} as Record<string, unknown>, vertexShader: '#include <common>\n#include <begin_vertex>', fragmentShader: '' };
    material.onBeforeCompile(shader as unknown as THREE.WebGLProgramParametersWithUniforms, {} as THREE.WebGLRenderer);
    expect(shader.uniforms.uWindTime).toBe(WIND.uWindTime);
    expect(shader.vertexShader).toContain('windAt(');
  });
});
