// A person: the human body of a look, on the humanoid rig (rigs/frameRig.ts), its meshes shared by every look alike.

import type { BodyLook } from './body/look';
import { DEFAULT_LOOK } from './body/look';
import { FrameModel, MARCH, type Gait } from './rigs/frameRig';
import { bodyPalette } from './body/bodyVoxels';

export function humanModel(look: BodyLook = DEFAULT_LOOK, gait: Gait = MARCH): FrameModel {
  return new FrameModel({ palette: bodyPalette(look), base: look, gait });
}
