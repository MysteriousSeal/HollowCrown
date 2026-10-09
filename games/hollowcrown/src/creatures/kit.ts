// Small painting helpers the Vale's creatures share.

import { hashUnit } from '@voxel/engine/math';

// A ragged hem's length (0..2 voxels) at a column: the same every time.
export const tornHem = (x: number, z: number, salt: number): number => Math.floor(hashUnit(x * 3 + z, salt, 41) * 3);
