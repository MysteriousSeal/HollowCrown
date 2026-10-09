// The world: its size and land (terrain), drawn in chunks streamed in round the camera.
export { wholeMap, type Area, type MapSize } from './grid';
export { TILE_HEIGHT, TerrainResource, flatTerrain, type Terrain } from './terrain';
export { terrainLayer, tierRects, type TierRect } from './terrainLayer';
export { CHUNK_SIZE, chunkKeysIn, chunkTilesIn } from './chunks';
export type { ChunkLayer } from './chunkLayer';
export { ChunkStreamer } from './chunkStreamer';
export { addVoxelGround } from './voxelGround';
