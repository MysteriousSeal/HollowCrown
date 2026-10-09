// The land drawn: each chunk's tiles (chunks.ts) merged into the fewest rectangles of one tier (greedy, in 2D), each a
// column from a tier below the ground up to its top, its top voxel-shaded grass (voxelGround.ts), every rectangle of
// a tier one instance (a flat chunk: one box). Only the chunks round the camera are built (chunkStreamer.ts).

import * as THREE from 'three';
import type { ChunkLayer } from './chunkLayer';
import { chunkKeysIn, chunkTilesIn } from './chunks';
import { wholeMap, type Area } from './grid';
import { TILE_HEIGHT, type Terrain } from './terrain';
import { TERRAIN_COLORS } from '../render/constants';
import { addVoxelGround } from './voxelGround';

const BOX_TOP_FACE = 2; // BoxGeometry material groups: +x, -x, +y, -y, +z, -z

// A rectangle of tiles of one tier: its first tile and its size.
export interface TierRect {
  tier: number;
  x: number;
  z: number;
  width: number;
  depth: number;
}

// `area`'s tiles as the fewest same-tier rectangles a greedy pass finds (each tile in exactly one).
export function tierRects(terrain: Terrain, area: Area): TierRect[] {
  const [w, d] = [area.x1 - area.x0, area.z1 - area.z0];
  const tiers = new Int32Array(w * d);
  for (let z = 0; z < d; z++) for (let x = 0; x < w; x++) tiers[x + z * w] = terrain.tierAt(area.x0 + x, area.z0 + z);
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
      rects.push({ tier, x: area.x0 + x, z: area.z0 + z, width, depth });
    }
  }
  return rects;
}

// A tile's column: grass on its top face, its sides plain.
function tileMaterial(tier: number): THREE.Material[] {
  const color = new THREE.Color(TERRAIN_COLORS[tier % TERRAIN_COLORS.length]);
  const side = new THREE.MeshStandardMaterial({ color });
  const top = new THREE.MeshStandardMaterial({ color });
  addVoxelGround(top);
  const materials: THREE.Material[] = Array(6).fill(side);
  materials[BOX_TOP_FACE] = top;
  return materials;
}

// The terrain's layer. `tiers`: every tier the land has (their materials made up front, for the stylized look to
// patch before the first frame); a tile of a tier not listed isn't drawn.
export function terrainLayer(terrain: Terrain, tiers: readonly number[]): ChunkLayer {
  const area = wholeMap(terrain.size);
  const kinds = new Map(tiers.map((tier) => [tier, { geometry: new THREE.BoxGeometry(1, (tier + 1) * TILE_HEIGHT, 1), material: tileMaterial(tier) }]));
  const [matrix, at, scale, turn] = [new THREE.Matrix4(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Quaternion()];
  return {
    materials: [...kinds.values()].flatMap((k) => k.material),
    chunkKeys: () => chunkKeysIn(area),
    build(key) {
      const tiles = chunkTilesIn(key, area);
      if (!tiles) return [];
      const byTier = new Map<number, TierRect[]>();
      for (const rect of tierRects(terrain, tiles)) {
        const list = byTier.get(rect.tier);
        if (list) list.push(rect);
        else byTier.set(rect.tier, [rect]);
      }
      return [...byTier].flatMap(([tier, rects]) => {
        const kind = kinds.get(tier);
        if (!kind) return [];
        const height = (tier + 1) * TILE_HEIGHT;
        const mesh = new THREE.InstancedMesh(kind.geometry, kind.material, rects.length);
        rects.forEach((r, i) => {
          at.set(r.x + (r.width - 1) / 2, tier * TILE_HEIGHT - height / 2, r.z + (r.depth - 1) / 2); // (tile centres are whole numbers)
          mesh.setMatrixAt(i, matrix.compose(at, turn, scale.set(r.width, 1, r.depth)));
        });
        mesh.computeBoundingSphere();
        return [mesh];
      });
    },
  };
}
