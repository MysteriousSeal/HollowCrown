import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { STRUCTURE_VOXEL, StructureModel, structureGrid, type StructureColor, type StructureSpec } from '../src/structures';
import { createGrid, colorAt } from '../src/voxel';

const ROLES: StructureColor[] = ['plaster', 'plasterShade', 'timber', 'timberDark', 'stone', 'stoneLight', 'stoneDark', 'roof', 'roofLight', 'roofDark', 'door', 'doorDark', 'window', 'shutter', 'inside'];
const colors = Object.fromEntries(ROLES.map((r, i) => [r, i + 1])) as Record<StructureColor, number>;
const palette = ROLES.map((_, i) => 0x101010 * (i + 1));
const C = colors;

const SPEC: StructureSpec = {
  width: 30, depth: 24, storeys: 1, storeyHeight: 12, walls: 'timber', roof: 'thatch', colors,
  door: { width: 5, height: 9 }, windows: { width: 4, height: 4, sill: 4, every: 12 }, chimney: 1,
};

const count = (g: ReturnType<typeof createGrid>, c: number) => g.cells.filter((v) => v === c).length;

describe('structure grids', () => {
  const { grid, layout } = structureGrid(SPEC);

  it('stand their walls in the middle, the roof over them, the ridge highest', () => {
    expect(layout.x1 - layout.x0 + 1).toBe(30);
    expect(layout.z1 - layout.z0 + 1).toBe(24);
    expect(layout.eaves).toBe(12);
    const zc = Math.round((layout.z0 + layout.z1) / 2);
    expect([C.roofDark, C.roofLight]).toContain(colorAt(grid, layout.x0 + 6, layout.ridge, zc));
    for (let x = 0; x < layout.size[0]; x++) for (let z = 0; z < layout.size[2]; z++) {
      if (x >= layout.x1 && x <= layout.x1 + 3) continue; // (the chimney stands above it)
      expect(colorAt(grid, x, layout.ridge + 1, z)).toBe(0);
    }
  });

  it('open a door in the front, recessed, a step before it', () => {
    const d = layout.door!;
    expect(d.x1 - d.x0 + 1).toBe(5);
    expect(colorAt(grid, d.x0 + 1, 3, layout.z1)).toBe(0);
    expect([C.door, C.doorDark]).toContain(colorAt(grid, d.x0 + 1, 3, layout.z1 - 1));
    expect(colorAt(grid, d.x0, 0, layout.z1 + 1)).toBe(C.stoneLight);
  });

  it('light windows, and board them when it is shut', () => {
    expect(count(grid, C.window)).toBeGreaterThan(20);
    expect(count(structureGrid({ ...SPEC, shut: true }).grid, C.window)).toBe(0);
  });

  it('raise a chimney above the ridge, and keep everything inside the grid', () => {
    let top = 0;
    for (let x = layout.x1; x <= layout.x1 + 3; x++) for (let y = 0; y < layout.size[1]; y++) for (let z = 0; z < layout.size[2]; z++) if (colorAt(grid, x, y, z)) top = Math.max(top, y);
    expect(top).toBeGreaterThan(layout.ridge + 2);
    expect(structureGrid({ ...SPEC, chimney: undefined }).grid.cells.filter(Boolean).length).toBeLessThan(grid.cells.filter(Boolean).length);
  });

  it('jetty upper storeys out a voxel at front and back', () => {
    const two = structureGrid({ ...SPEC, storeys: 2, jetty: true, windows: undefined }).layout;
    const g = structureGrid({ ...SPEC, storeys: 2, jetty: true, windows: undefined }).grid;
    const x = two.x0 + 3;
    expect(colorAt(g, x, 6, two.z1 + 1)).toBe(0);
    expect(colorAt(g, x, 18, two.z1 + 1)).not.toBe(0);
    expect(colorAt(g, x, 18, two.z0 - 1)).not.toBe(0);
  });

  it('paint every wall style and roof covering in its own colors', () => {
    for (const walls of ['timber', 'stone', 'wattle'] as const) {
      for (const roof of ['thatch', 'slate', 'shingle'] as const) {
        const { grid: g } = structureGrid({ ...SPEC, walls, roof });
        expect(count(g, C.roof) + count(g, C.roofLight)).toBeGreaterThan(100);
        if (walls === 'stone') expect(count(g, C.plaster)).toBe(0);
        else expect(count(g, C.plaster)).toBeGreaterThan(50);
      }
    }
  });
});

describe('structure models', () => {
  it('stand centred on their origin, at the structure voxel, windows glowing, props where asked', () => {
    let spun = 0;
    const model = new StructureModel(SPEC, { palette }, (m) => {
      const sign = m.prop(createGrid([1, 1, 1]), [0, 0, 0], [m.layout.x0, 5, m.layout.z1 + 1]);
      m.ticks.push((t) => (sign.rotation.z = spun = t));
    });
    const box = new THREE.Box3().setFromObject(model.root);
    expect(box.min.y).toBeCloseTo(0);
    expect(box.max.x + box.min.x).toBeCloseTo((3 - 1) * STRUCTURE_VOXEL); // (centred: the chimney 3 voxels out right, the verge 1 left)
    expect(model.height).toBeCloseTo(model.layout.size[1] * STRUCTURE_VOXEL);
    const meshes = model.root.children[0].children.filter((c) => (c as THREE.Mesh).isMesh);
    expect(meshes).toHaveLength(2); // (lit, and the windows glowing)
    model.animate(1.5);
    expect(spun).toBe(1.5);
  });
});
