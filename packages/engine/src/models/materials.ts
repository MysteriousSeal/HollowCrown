// What models are drawn in: lit (warm rim, a touch brighter than the ground, so figures stand out from it), glowing
// (unlit: eyes, embers), or spectral (faded, see-through, giving off their own cold light).

import * as THREE from 'three';

// A warm rim of light round a figure's edges, where its surface turns away from the eye (strongest at the silhouette,
// none face on): figures read as soft lit volumes against the ground, not cut-outs.
const RIM = { color: new THREE.Color(0xffd2a0), strength: 0.32, falloff: 2.6 };
export function withRimLight<M extends THREE.MeshStandardMaterial>(material: M): M {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.rimColor = { value: RIM.color };
    shader.fragmentShader = `uniform vec3 rimColor;\n${shader.fragmentShader}`.replace(
      '#include <opaque_fragment>',
      `float rim = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), ${RIM.falloff.toFixed(2)});
      outgoingLight += rimColor * rim * ${RIM.strength.toFixed(2)} * diffuseColor.rgb;
      #include <opaque_fragment>`,
    );
  };
  material.customProgramCacheKey = () => 'person-rim';
  return material;
}

// A new lit material (vertex colors, rim light).
export function createLitMaterial(): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, emissive: 0x2a1e14 });
  material.color.setRGB(1.12, 1.1, 1.06);
  return withRimLight(material);
}

// The lit material models share.
let lit: THREE.MeshStandardMaterial | null = null;
export const litMaterial = (): THREE.MeshStandardMaterial => (lit ??= createLitMaterial());

// Unlit, so it burns in the dark (and blooms).
let glow: THREE.MeshBasicMaterial | null = null;
export const glowMaterial = (): THREE.MeshBasicMaterial => (glow ??= new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));

// Faded and see-through, giving off a cold light of its own (`glow`).
export function spectralMaterial(opacity: number, glow = 0x6688bb): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, transparent: true, opacity, depthWrite: false, emissive: glow, emissiveIntensity: 0.35 });
}
