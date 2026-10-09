import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { composeWorldMap, loadWorldMap, roadLayer, sectionsOf } from '../src/world';

const MAP = loadWorldMap(composeWorldMap(
  { size: { width: 64, depth: 64 }, baseTier: 1, surfaceKinds: { road: { color: 0x9a8461, worn: 'road' }, yard: { color: 0x887766, worn: 'path' } } },
  { surfaces: [{ shape: { line: [[2, 10], [40, 10], [40, 30]], width: 3 }, surface: 'road' }, { shape: { rect: [50, 50, 55, 55] }, surface: 'yard' }] },
));

describe('worn ways', () => {
  it('cut a line into cross-sections, keeping its width round a corner', () => {
    const s = sectionsOf([[0, 0], [10, 0], [10, 10]]);
    expect(s[0]).toMatchObject({ x: 0, z: 0, along: 0 });
    expect(s.at(-1)!.along).toBeCloseTo(20);
    const corner = s.find((c) => c.x === 10 && c.z === 0)!;
    expect(Math.hypot(corner.across.x, corner.across.z)).toBeCloseTo(Math.SQRT2); // (mitred)
  });

  it('draw a line-painted road as a ribbon over bare-land tiles; a road painted otherwise stays tiles', () => {
    expect(MAP.surfaceAt(20, 10)).toBe(1); // (still a road: for walking, for names)
    expect(MAP.drawnSurfaceAt(20, 10)).toBe(0);
    expect(MAP.drawnSurfaceAt(52, 52)).toBe(2); // (a rect: tiles)
    expect(MAP.wornWays()).toHaveLength(1);
    const layer = roadLayer(MAP);
    const keys = [...layer.chunkKeys()];
    expect(keys.sort()).toEqual(['0,0', '1,0', '2,0', '2,1'].sort());
    const [mesh] = layer.build('1,0') as THREE.Mesh[];
    const position = mesh.geometry.getAttribute('position');
    for (let i = 0; i < position.count; i++) expect(position.getY(i)).toBeGreaterThan(MAP.groundY(position.getX(i), position.getZ(i)) - 0.2);
  });
});
