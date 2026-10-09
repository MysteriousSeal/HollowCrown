// Worn ways (WorldMap.wornWays): roads and footpaths drawn as a ribbon laid along their line over the grass, not as
// whole tiles. The ribbon's shader wears it in, voxel by voxel at the ground's 0.04 grain: a road two darker wheel
// ruts with a grassy crown between, a footpath one trodden line; pebbles scattered; and its edges ragged, fraying
// into the grass in a scatter of grass voxels, so no tile's square edge shows. Built a chunk at a time: each chunk
// draws the stretches of ribbon whose middles fall in it.

import * as THREE from 'three';
import { TERRAIN_COLORS } from '../render/constants';
import type { ChunkLayer } from './chunkLayer';
import { CHUNK_SIZE } from './chunks';
import type { Point } from './shapes';
import type { WorldMap } from './worldMap';

const STEP = 0.5; // world units between the ribbon's cross-sections
const LIFT = 0.012; // how far above the ground it lies (no fighting with the tile tops under it)
const VOXEL = 0.04;

export interface WornWay {
  points: Point[];
  width: number;
  style: 'road' | 'path';
  color: number;
}

// A cross-section of a ribbon: its middle, the way across (unit, to its right), how far along the line it is.
export interface Section {
  x: number;
  z: number;
  across: { x: number; z: number };
  along: number;
}

// A line's cross-sections every STEP, and at every corner, the way across mitred at the corners (kept from flaring
// past twice the width at a sharp turn).
export function sectionsOf(points: Point[]): Section[] {
  const out: Section[] = [];
  let along = 0;
  const normal = (a: Point, b: Point) => {
    const [dx, dz] = [b[0] - a[0], b[1] - a[1]];
    const l = Math.hypot(dx, dz) || 1;
    return { x: -dz / l, z: dx / l };
  };
  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i], points[i + 1]];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (length === 0) continue;
    const n = normal(a, b);
    const steps = Math.max(1, Math.ceil(length / STEP));
    for (let k = i === 0 ? 0 : 1; k <= steps; k++) {
      const t = k / steps;
      let across = n;
      if (k === steps && i < points.length - 2) {
        // A corner: the average of the two ways across, lengthened so the ribbon keeps its width round it.
        const m = normal(b, points[i + 2]);
        const [sx, sz] = [n.x + m.x, n.z + m.z];
        const l = Math.hypot(sx, sz);
        if (l > 1e-6) {
          const cos = Math.max(0.5, (sx * n.x + sz * n.z) / l);
          across = { x: sx / l / cos, z: sz / l / cos };
        }
      }
      out.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t, across, along: along + length * t });
    }
    along += length;
  }
  return out;
}

const ROAD_FRAGMENT = /* glsl */ `
float roadHash(vec2 p) {
  p = fract(p * vec2(0.1031, 0.1030));
  p += dot(p, p.yx + 33.33);
  return fract((p.x + p.y) * p.x);
}
vec3 wornColor(vec3 base) {
  vec2 cell = floor(vRoadWorld / ${VOXEL.toFixed(3)});
  float across = max(abs(vRoad.x), 1.0 - vRoadEnd / 0.8); // 0 its middle .. 1 its edge (its ends fray too)
  float wobble = roadHash(floor(vec2(vRoad.y * 3.0, sign(vRoad.x))) + 11.0); // (the edge wanders, a third of a tile at a time)
  float edge = 0.78 + wobble * 0.14;
  float fray = (across - edge + 0.18) / 0.26; // 0 inside the fraying .. 1 past the edge
  float h = roadHash(cell);
  if (across > edge + 0.08 || h < fray) discard; // (ragged: the grass shows through, more toward the edge)
  vec3 color = base * (0.92 + roadHash(cell + 3.0) * 0.14);
  #ifdef ROAD_RUTS
    // Two wheel ruts, darker, and a grassy crown between them.
    float rut = 1.0 - smoothstep(0.07, 0.13, abs(across - 0.45));
    color *= 1.0 - rut * 0.22;
    if (across < 0.16 && roadHash(cell + 7.0) < 0.55 - across * 2.5) color = uRoadGrass * (0.9 + h * 0.15);
  #else
    // A footpath: one trodden line down its middle, grassier toward its sides.
    color *= 1.0 - (1.0 - smoothstep(0.0, 0.35, across)) * 0.12;
    if (roadHash(cell + 7.0) < (across - 0.3) * 0.9) color = uRoadGrass * (0.9 + h * 0.15);
  #endif
  // Grass creeping in from the edges; and pebbles.
  if (roadHash(cell + 13.0) < (across - 0.55) * 0.9) color = uRoadGrass * (0.88 + h * 0.15);
  float pebble = roadHash(cell + 29.0);
  if (pebble > 0.985) color = vec3(0.62, 0.6, 0.55) * (0.85 + h * 0.3);
  else if (pebble > 0.975) color *= 0.7;
  return color;
}`;

// The material a worn way of `style` is drawn in: lit like the ground, worn by its shader.
function wornMaterial(style: 'road' | 'path', grass: THREE.Color): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
  const uRoadGrass = { value: grass };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRoadGrass = uRoadGrass;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 aRoad;\nvarying vec2 vRoad;\nvarying float vRoadEnd;\nvarying vec2 vRoadWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRoad = aRoad.xy;\nvRoadEnd = aRoad.z;\nvRoadWorld = (modelMatrix * vec4(transformed, 1.0)).xz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${style === 'road' ? '#define ROAD_RUTS\n' : ''}uniform vec3 uRoadGrass;\nvarying vec2 vRoad;\nvarying float vRoadEnd;\nvarying vec2 vRoadWorld;\n${ROAD_FRAGMENT}`)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = wornColor(diffuseColor.rgb);');
  };
  material.customProgramCacheKey = () => `worn|${style}`;
  return material;
}

// The ribbon of `way` through `sections` (a run of its own), lying on the ground, with its across (-1..1), along
// (world units) and how far from the way's nearer end (world units) in aRoad.
function ribbon(map: WorldMap, way: WornWay, sections: Section[], length: number): THREE.BufferGeometry {
  const half = way.width / 2;
  const color = new THREE.Color(way.color);
  const [positions, roads, colors, normals, index] = [[] as number[], [] as number[], [] as number[], [] as number[], [] as number[]];
  sections.forEach((s, i) => {
    const y = map.groundY(s.x, s.z) + LIFT;
    for (const side of [-1, 1]) {
      positions.push(s.x + s.across.x * half * side, y, s.z + s.across.z * half * side);
      roads.push(side, s.along, Math.min(s.along, length - s.along));
      colors.push(color.r, color.g, color.b);
      normals.push(0, 1, 0);
    }
    if (i > 0) {
      const v = i * 2;
      index.push(v - 2, v - 1, v, v - 1, v + 1, v); // (facing up)
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('aRoad', new THREE.Float32BufferAttribute(roads, 3));
  geometry.setIndex(index);
  geometry.computeBoundingSphere();
  return geometry;
}

const chunkOf = (x: number, z: number) => `${Math.floor(x / CHUNK_SIZE)},${Math.floor(z / CHUNK_SIZE)}`;

// The worn ways of `map` as a chunk layer.
export function roadLayer(map: WorldMap, ways: WornWay[] = map.wornWays()): ChunkLayer {
  const grass = new THREE.Color(TERRAIN_COLORS[map.data.baseTier % TERRAIN_COLORS.length]);
  const materials = { road: wornMaterial('road', grass), path: wornMaterial('path', grass) };
  // Each chunk: the runs of each way's sections whose stretches start in it (a run's last section shared with the
  // next chunk's first, so the ribbon is unbroken).
  const runs = new Map<string, Array<{ way: WornWay; sections: Section[]; length: number }>>();
  for (const way of ways) {
    const sections = sectionsOf(way.points);
    const length = sections.at(-1)?.along ?? 0;
    let start = 0;
    for (let i = 1; i <= sections.length; i++) {
      const key = chunkOf(sections[start].x, sections[start].z);
      if (i < sections.length && chunkOf(sections[i].x, sections[i].z) === key) continue;
      const run = sections.slice(start, Math.min(i + 1, sections.length));
      if (run.length > 1) (runs.get(key) ?? runs.set(key, []).get(key)!).push({ way, sections: run, length });
      start = i;
    }
  }
  return {
    name: 'roads',
    materials: [materials.road, materials.path],
    chunkKeys: () => runs.keys(),
    build: (key) => (runs.get(key) ?? []).map(({ way, sections, length }) => new THREE.Mesh(ribbon(map, way, sections, length), materials[way.style])),
  };
}
