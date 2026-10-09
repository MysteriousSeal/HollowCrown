// The land drawn: a column under every tile reaching up to its tier, its top voxel-shaded grass (voxelGround.ts),
// instanced per chunk (chunks.ts), so only the chunks round the camera are built (chunkStreamer.ts).

import * as THREE from 'three';
import type { ChunkLayer } from './chunkLayer';
import { chunkKeysIn, chunkTilesIn } from './chunks';
import { wholeMap } from './grid';
import { TILE_HEIGHT, type Terrain } from './terrain';
import { TERRAIN_COLORS } from '../render/constants';
import { addVoxelGround } from './voxelGround';

const BOX_TOP_FACE = 2; // BoxGeometry material groups: +x, -x, +y, -y, +z, -z

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

// The terrain's layer, its tiles grouped by tier in each chunk. `tiers`: every tier the land has (their materials made
// up front, for the stylized look to patch before the first frame).
export function terrainLayer(terrain: Terrain, tiers: readonly number[]): ChunkLayer {
  const area = wholeMap(terrain.size);
  const matrix = new THREE.Matrix4();
  const kinds = new Map(tiers.map((tier) => [tier, { geometry: new THREE.BoxGeometry(1, (tier + 1) * TILE_HEIGHT, 1), material: tileMaterial(tier) }]));
  return {
    materials: [...kinds.values()].flatMap((k) => k.material),
    chunkKeys: () => chunkKeysIn(area),
    build(key) {
      const tiles = chunkTilesIn(key, area);
      if (!tiles) return [];
      const byTier = new Map<number, Array<[number, number]>>();
      for (let x = tiles.x0; x < tiles.x1; x++) {
        for (let z = tiles.z0; z < tiles.z1; z++) {
          const tier = terrain.tierAt(x, z);
          const cells = byTier.get(tier);
          if (cells) cells.push([x, z]);
          else byTier.set(tier, [[x, z]]);
        }
      }
      return [...byTier].flatMap(([tier, cells]) => {
        const kind = kinds.get(tier);
        if (!kind) return []; // (a tier not declared: not drawn)
        const height = (tier + 1) * TILE_HEIGHT;
        const mesh = new THREE.InstancedMesh(kind.geometry, kind.material, cells.length);
        cells.forEach(([x, z], i) => mesh.setMatrixAt(i, matrix.makeTranslation(x, tier * TILE_HEIGHT - height / 2, z)));
        return [mesh];
      });
    },
  };
}
