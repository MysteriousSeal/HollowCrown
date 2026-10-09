// The world: its size and land (terrain), drawn in chunks streamed in round the camera.
export { wholeMap, type Area, type MapSize } from './grid';
export { TILE_HEIGHT, TerrainResource, flatTerrain, tileOf, type Terrain } from './terrain';
export { boundsOf, covers, type Point, type Shape } from './shapes';
export {
  WorldDataError, WorldMap, checkWorldMap, composeWorldMap, loadWorldMap,
  type AreaData, type LandPatch, type PlaceData, type PlaceRules, type SurfaceKind, type SurfacePatch, type WorldMapData, type WorldMapPart,
} from './worldMap';
export { terrainLayer, tierRects, type TierRect } from './terrainLayer';
export { CHUNK_SIZE, chunkKeysIn, chunkTilesIn } from './chunks';
export type { ChunkLayer } from './chunkLayer';
export { ChunkStreamer, FRAME_BUILD_BUDGET } from './chunkStreamer';
export { addVoxelGround } from './voxelGround';
export { placesLayer } from './placesLayer';
export { Obstacles, ObstaclesResource, type Box } from './obstacles';
