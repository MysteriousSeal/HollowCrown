import { describe, expect, it } from 'vitest';
import {
  box, colorAt, createGrid, erase, fillBox, fillEllipsoid, greedyMesh, namedPalette, over, recolor, roundNormals, setColor, stamp, wrap,
} from '../src/voxel';
import * as THREE from 'three';

const count = (g: ReturnType<typeof createGrid>, c?: number) => g.cells.filter((v) => (c === undefined ? v !== 0 : v === c)).length;

describe('grid and shapes', () => {
  it('reads 0 outside the grid and clips boxes to it', () => {
    const g = createGrid([4, 4, 4]);
    expect(colorAt(g, -1, 0, 0)).toBe(0);
    fillBox(g, -2, -2, -2, 1, 1, 1, 3);
    expect(count(g, 3)).toBe(8);
  });

  it('fills an ellipsoid round its centre, clipped, its paint told how far out each voxel is', () => {
    const g = createGrid([5, 5, 5]);
    const seen: number[] = [];
    fillEllipsoid(g, [2.5, 2.5, 2.5], [2.5, 2.5, 2.5], (_x, _y, _z, r) => (seen.push(r), 1));
    expect(colorAt(g, 2, 2, 2)).toBe(1); // (its centre)
    expect(colorAt(g, 0, 0, 0)).toBe(0); // (a corner, outside)
    expect(Math.min(...seen)).toBe(0);
    expect(Math.max(...seen)).toBeLessThanOrEqual(1);
    const big = createGrid([3, 3, 3]);
    expect(() => fillEllipsoid(big, [1.5, 1.5, 1.5], [9, 9, 9], () => 2)).not.toThrow(); // (far bigger than the grid: clipped)
    expect(count(big, 2)).toBe(27);
  });

  it('paints relative to an offset', () => {
    const g = createGrid([6, 6, 6]);
    fillEllipsoid(g, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], () => 4, [2, 3, 1]);
    expect(colorAt(g, 2, 3, 1)).toBe(4);
    expect(count(g)).toBe(1);
  });
});

describe('painting', () => {
  it('boxes, erases, recolors, wraps and stamps relative to an offset', () => {
    const g = createGrid([6, 6, 6]);
    const o: [number, number, number] = [1, 1, 1];
    box(g, o, 0, 0, 0, 1, 1, 1, 2); // (a 2x2x2 cube at (1, 1, 1))
    expect(count(g, 2)).toBe(8);
    over(g, o, (x, _y, _z, c) => (x === 0 && c === 2 ? 3 : 0));
    expect(count(g, 3)).toBe(4);
    recolor(g, 3, 5);
    expect(count(g, 5)).toBe(4);
    wrap(g, o, () => 7); // (one layer round the cube: 6 faces of 4)
    expect(count(g, 7)).toBe(24);
    erase(g, o, -1, -1, -1, 2, 2, 2);
    expect(count(g)).toBe(0);
    const piece = createGrid([1, 1, 1]);
    setColor(piece, 0, 0, 0, 9);
    stamp(g, piece, [5, 5, 5]);
    expect(colorAt(g, 5, 5, 5)).toBe(9);
  });

  it('names a palette, its colors indexed from 1', () => {
    const p = namedPalette({ red: 0xff0000, blue: 0x0000ff });
    expect(p.colors).toEqual([0xff0000, 0x0000ff]);
    expect(p.C).toEqual({ red: 1, blue: 2 });
  });
});

describe('meshing', () => {
  it('meshes a solid cube as six merged faces (12 triangles)', () => {
    const g = createGrid([3, 3, 3]);
    fillBox(g, 0, 0, 0, 2, 2, 2, 1);
    const geometry = greedyMesh(g, [0x808080], 1, new THREE.Vector3());
    expect(geometry.getAttribute('position').count / 3).toBe(12);
  });

  it('meshes only the colors asked for, and rounds normals without adding vertices', () => {
    const g = createGrid([2, 1, 1]);
    setColor(g, 0, 0, 0, 1);
    setColor(g, 1, 0, 0, 2);
    const one = greedyMesh(g, [0xff0000, 0x00ff00], 1, new THREE.Vector3(), (c) => c === 1);
    const both = greedyMesh(g, [0xff0000, 0x00ff00], 1, new THREE.Vector3());
    expect(one.getAttribute('position').count).toBeLessThan(both.getAttribute('position').count);
    const rounded = roundNormals(both.clone(), g, 1, new THREE.Vector3());
    expect(rounded.getAttribute('position').count).toBe(both.getAttribute('position').count);
  });
});
