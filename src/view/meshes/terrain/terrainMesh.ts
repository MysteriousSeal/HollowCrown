// The land: a column under every tile, its top voxel-shaded grass (voxelGround.ts), instanced per chunk so only the
// chunks round the hero are built (world/chunkStreamer.ts).

import * as THREE from 'three';
import type { ChunkLayer } from '../../world/chunkLayer';
import { chunkKeysIn, chunkTilesIn } from '../../world/chunks';
import type { GameModel } from '../../../model/GameModel';
import { GROUND_TIER, TILE_HEIGHT } from '../../../model/constants';
import { wholeMap } from '../../../model/map/grid';
import { TERRAIN_COLORS } from '../../constants';
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

export function terrainLayer(model: GameModel): ChunkLayer {
  const area = wholeMap(model.size);
  const height = (GROUND_TIER + 1) * TILE_HEIGHT; // (from a tier below ground up to its top)
  const geometry = new THREE.BoxGeometry(1, height, 1);
  const material = tileMaterial(GROUND_TIER);
  const matrix = new THREE.Matrix4();
  return {
    materials: material,
    chunkKeys: () => chunkKeysIn(area),
    build(key) {
      const tiles = chunkTilesIn(key, area);
      if (!tiles) return [];
      const { x0, z0, x1, z1 } = tiles;
      const mesh = new THREE.InstancedMesh(geometry, material, (x1 - x0) * (z1 - z0));
      let i = 0;
      for (let x = x0; x < x1; x++) for (let z = z0; z < z1; z++) mesh.setMatrixAt(i++, matrix.makeTranslation(x, GROUND_TIER * TILE_HEIGHT - height / 2, z));
      return [mesh];
    },
  };
}
