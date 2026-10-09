// Models: what entities are drawn as. One interface for all (Model), one base for rigged ones (RiggedModel), still
// voxel models (VoxelModel), and the parts, materials and shade they're made of.
export type { Model, ModelAction } from './model';
export { RiggedModel } from './riggedModel';
export { VoxelModel } from './voxelModel';
export { MODEL_VOXEL, addPart, joint, meshPart, type PartLook } from './parts';
export { createLitMaterial, glowMaterial, litMaterial, spectralMaterial, withRimLight } from './materials';
export { SHADE, addShade } from './shade';
