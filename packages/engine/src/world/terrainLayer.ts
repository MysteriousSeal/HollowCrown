// The land drawn: each chunk's tiles (chunks.ts) merged into the fewest rectangles of one tier and relief (greedy, in
// 2D), each a column from a tier below the ground up to its top (raised or lowered by its relief, relief.ts), its top
// voxel-shaded grass (voxelGround.ts), every rectangle of a tier one instance (a flat chunk: one box). Only the chunks round the camera are built (chunkStreamer.ts).

import * as THREE from 'three';
import type { ChunkLayer } from './chunkLayer';
import { chunkKeysIn, chunkTilesIn } from './chunks';
import { wholeMap, type Area } from './grid';
import { RELIEF_STEP } from './relief';
import { TILE_HEIGHT, type Terrain } from './terrain';
import { TERRAIN_COLORS } from '../render/constants';
import { EDGE_BITS, addVoxelGround } from './voxelGround';

const BOX_TOP_FACE = 2; // BoxGeometry material groups: +x, -x, +y, -y, +z, -z

// A rectangle of tiles of one tier, one surface and one relief: its first tile and its size.
export interface TierRect {
  tier: number;
  surface: number;
  relief: number; // its top's rise or dip, in relief steps
  x: number;
  z: number;
  width: number;
  depth: number;
}

// `area`'s tiles as the fewest same-tier rectangles a greedy pass finds (each tile in exactly one).
const RELIEF_OFFSET = 8; // (a relief step packed into the tile's key, kept positive)
export function tierRects(terrain: Terrain, area: Area): TierRect[] {
  const [w, d] = [area.x1 - area.x0, area.z1 - area.z0];
  const tiers = new Int32Array(w * d); // (a tier, a relief and a surface in one: (tier * 16 + relief) * 256 + surface)
  for (let z = 0; z < d; z++) {
    for (let x = 0; x < w; x++) {
      const [tx, tz] = [area.x0 + x, area.z0 + z];
      const relief = (terrain.reliefAt?.(tx, tz) ?? 0) + RELIEF_OFFSET;
      tiers[x + z * w] = (terrain.tierAt(tx, tz) * 16 + relief) * 256 + drawnSurface(terrain, tx, tz);
    }
  }
  const taken = new Uint8Array(w * d);
  const rects: TierRect[] = [];
  for (let z = 0; z < d; z++) {
    for (let x = 0; x < w; x++) {
      if (taken[x + z * w]) continue;
      const tier = tiers[x + z * w];
      const same = (i: number, k: number) => !taken[i + k * w] && tiers[i + k * w] === tier;
      let width = 1;
      while (x + width < w && same(x + width, z)) width++;
      let depth = 1;
      while (z + depth < d) {
        let row = true;
        for (let i = x; i < x + width && row; i++) row = same(i, z + depth);
        if (!row) break;
        depth++;
      }
      for (let k = z; k < z + depth; k++) taken.fill(1, x + k * w, x + width + k * w);
      const high = Math.floor(tier / 256);
      rects.push({ tier: Math.floor(high / 16), relief: (high % 16) - RELIEF_OFFSET, surface: tier % 256, x: area.x0 + x, z: area.z0 + z, width, depth });
    }
  }
  return rects;
}

// The surface a tile's top is drawn as.
const drawnSurface = (terrain: Terrain, x: number, z: number): number => terrain.drawnSurfaceAt?.(x, z) ?? terrain.surfaceAt?.(x, z) ?? 0;

// Which sides of `r` meet ground of another tier or surface (EDGE_BITS), anywhere along them.
export function seamsOf(terrain: Terrain, r: TierRect): number {
  const key = (x: number, z: number) => terrain.tierAt(x, z) * 256 + drawnSurface(terrain, x, z);
  const own = r.tier * 256 + r.surface;
  const { width: W, depth: D } = terrain.size;
  const differs = (x: number, z: number) => x >= 0 && z >= 0 && x < W && z < D && key(x, z) !== own;
  let bits = 0;
  for (let z = r.z; z < r.z + r.depth; z++) {
    if (differs(r.x - 1, z)) bits |= EDGE_BITS.west;
    if (differs(r.x + r.width, z)) bits |= EDGE_BITS.east;
  }
  for (let x = r.x; x < r.x + r.width; x++) {
    if (differs(x, r.z - 1)) bits |= EDGE_BITS.north;
    if (differs(x, r.z + r.depth)) bits |= EDGE_BITS.south;
  }
  return bits;
}

// A tile's column: its top voxel-shaded (grass, or a surface's color), its sides plain.
function tileMaterial(tier: number, surface?: number): THREE.Material[] {
  const color = new THREE.Color(surface ?? TERRAIN_COLORS[tier % TERRAIN_COLORS.length]);
  const side = new THREE.MeshStandardMaterial({ color: TERRAIN_COLORS[tier % TERRAIN_COLORS.length] });
  const top = new THREE.MeshStandardMaterial({ color });
  addVoxelGround(top, surface === undefined ? undefined : new THREE.Color(TERRAIN_COLORS[tier % TERRAIN_COLORS.length]));
  const materials: THREE.Material[] = Array(6).fill(side);
  materials[BOX_TOP_FACE] = top;
  return materials;
}

// The terrain's layer. `tiers`: every tier the land has; `surfaceColors`: each surface's top color, by its number
// (1..): their materials all made up front, for the stylized look to patch before the first frame. A tile of a tier
// not listed isn't drawn.
export function terrainLayer(terrain: Terrain, tiers: readonly number[], surfaceColors: readonly number[] = []): ChunkLayer {
  const area = wholeMap(terrain.size);
  const kinds = new Map<number, { geometry: THREE.BoxGeometry; material: THREE.Material[] }>();
  for (const tier of tiers) {
    const geometry = new THREE.BoxGeometry(1, (tier + 1) * TILE_HEIGHT, 1);
    [undefined, ...surfaceColors].forEach((color, surface) => kinds.set(tier * 256 + surface, { geometry, material: tileMaterial(tier, color) }));
  }
  const [matrix, at, scale, turn] = [new THREE.Matrix4(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Quaternion()];
  return {
    name: 'terrain',
    materials: [...kinds.values()].flatMap((k) => k.material),
    chunkKeys: () => chunkKeysIn(area),
    build(key) {
      const tiles = chunkTilesIn(key, area);
      if (!tiles) return [];
      const byKind = new Map<number, TierRect[]>();
      for (const rect of tierRects(terrain, tiles)) {
        const key = rect.tier * 256 + rect.surface;
        const list = byKind.get(key);
        if (list) list.push(rect);
        else byKind.set(key, [rect]);
      }
      return [...byKind].flatMap(([key, rects]) => {
        const kind = kinds.get(key);
        if (!kind) return [];
        const tier = Math.floor(key / 256);
        const height = (tier + 1) * TILE_HEIGHT;
        // The tier's column (a box: 24 vertices, copied), with this chunk's rectangles' seams (which sides meet other
        // ground) on it; freed with the chunk.
        const geometry = kind.geometry.clone();
        geometry.setAttribute('aEdges', new THREE.InstancedBufferAttribute(new Float32Array(rects.map((r) => seamsOf(terrain, r))), 1));
        const mesh = new THREE.InstancedMesh(geometry, kind.material, rects.length);
        mesh.addEventListener('dispose', () => geometry.dispose());
        rects.forEach((r, i) => {
          // The column stretched from its foot (a tier below the ground) to its top, raised or lowered by its relief.
          const reach = height + r.relief * RELIEF_STEP;
          at.set(r.x + (r.width - 1) / 2, tier * TILE_HEIGHT + r.relief * RELIEF_STEP - reach / 2, r.z + (r.depth - 1) / 2); // (tile centres are whole numbers)
          mesh.setMatrixAt(i, matrix.compose(at, turn, scale.set(r.width, reach / height, r.depth)));
        });
        mesh.computeBoundingSphere();
        return [mesh];
      });
    },
  };
}
