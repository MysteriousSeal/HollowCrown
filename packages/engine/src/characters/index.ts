// Characters: the human body and its looks, the rigs every figure is built on (a humanoid frame, a beast, a spider, a
// bird), what people wear and carry, and a person ready-made.

// The body
export {
  BODIES, BODY_COLOR_COUNT, BODY_HEIGHT, C, HAIR_PIECE_GRID, HAIR_PIECE_PIVOT, HUMAN_VOXEL_SIZE, JOINTS, JOINT_NAMES, PART_GRID,
  bodyPalette, buildArm, buildBodyPart, buildHairPiece, buildHead, buildLeg, buildTorso,
  type BodyPart, type BodyShape, type Joint, type Side,
} from './body/bodyVoxels';
export {
  DEFAULT_LOOK, DYE_COUNT, EXPRESSIONS, HAIR_COLOR_COUNT, HAIR_STYLES, SKIN_TONE_COUNT,
  type BodyLook, type Build, type Expression, type HairStyle,
} from './body/look';
export { bodyGeometry, hairGeometry } from './body/bodyMeshes';
export { afterBody, bodyColors, isRight, outerX } from './body/dressing';
// The rigs
export { FrameModel, MARCH, SHAMBLE, type FrameSpec, type Gait, type Held } from './rigs/frameRig';
export { BeastModel, beastPart, type BeastPart, type BeastSpec } from './rigs/beastRig';
export { SpiderModel, type SpiderSpec } from './rigs/spiderRig';
export { BirdModel, type BirdPart, type BirdSpec } from './rigs/birdRig';
// Gear
export * from './gear/gearVoxels';
// A person
export { humanModel } from './human';
