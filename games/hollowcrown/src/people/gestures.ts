// What villagers do with themselves standing about: small gestures played over their pose now and then (scratching
// the head, a stretch, leaning back with the arms folded, a yawn, a shrug, a wipe of the brow, a look round). Each
// adds to the joints after the model's own pose, as `phase` runs 0..1 (eased in and out, so it starts and ends at
// rest). For the human frame: an arm hangs down, rotation.x negative swings it forward and up; rotation.z swings it
// out from the body (+ for the left, - for the right). Who uses it: the villagers' models (once the engine passes
// named actions to a spec's gestures).

import type { FrameModel } from '@voxel/engine/characters';

export type Gesture = (m: FrameModel, phase: number) => void;
const ease = (phase: number) => Math.sin(Math.min(Math.max(phase, 0), 1) * Math.PI); // (0 at both ends, 1 midway)

export const GESTURES: Record<string, Gesture> = {
  // A hand up to scratch behind the ear, the head tipped to it.
  scratch: (m, p) => {
    const w = ease(p);
    m.joints.rightArm.rotation.x += -2.6 * w;
    m.joints.rightArm.rotation.z += (0.55 + Math.sin(p * 40) * 0.08) * w;
    m.joints.head.rotation.z += -0.15 * w;
  },
  // Both arms up over the head, the back arched, the face to the sky.
  stretch: (m, p) => {
    const w = ease(p);
    for (const arm of [m.joints.leftArm, m.joints.rightArm]) arm.rotation.x += -2.9 * w;
    m.joints.leftArm.rotation.z += 0.2 * w;
    m.joints.rightArm.rotation.z += -0.2 * w;
    m.upper.rotation.x += -0.15 * w;
    m.joints.head.rotation.x += -0.3 * w;
  },
  // Leaning back (on a wall, a post), the arms folded across the chest.
  lean: (m, p) => {
    const w = Math.min(1, ease(p) * 2); // (settled into it for most of the while)
    m.upper.rotation.x += -0.12 * w;
    m.joints.leftArm.rotation.x += -1.0 * w;
    m.joints.leftArm.rotation.z += -0.7 * w;
    m.joints.rightArm.rotation.x += -1.1 * w;
    m.joints.rightArm.rotation.z += 0.7 * w;
  },
  // A hand to the mouth, the head back.
  yawn: (m, p) => {
    const w = ease(p);
    m.joints.leftArm.rotation.x += -2.3 * w;
    m.joints.leftArm.rotation.z += -0.45 * w;
    m.joints.head.rotation.x += -0.35 * w;
  },
  // The arms out a little from the sides, the palms up, the head to one side.
  shrug: (m, p) => {
    const w = ease(p);
    m.joints.leftArm.rotation.x += -0.6 * w;
    m.joints.rightArm.rotation.x += -0.6 * w;
    m.joints.leftArm.rotation.z += 0.4 * w;
    m.joints.rightArm.rotation.z += -0.4 * w;
    m.joints.head.rotation.z += 0.2 * w;
  },
  // A forearm drawn across the brow.
  wipeBrow: (m, p) => {
    const w = ease(p);
    m.joints.rightArm.rotation.x += -2.4 * w;
    m.joints.rightArm.rotation.z += (0.3 + 0.4 * Math.sin(p * Math.PI * 2)) * w;
    m.joints.head.rotation.x += -0.1 * w;
  },
  // A look over one shoulder, then the other.
  lookRound: (m, p) => {
    m.joints.head.rotation.y += Math.sin(p * Math.PI * 2) * 0.9 * ease(p);
    m.upper.rotation.y += Math.sin(p * Math.PI * 2) * 0.2 * ease(p);
  },
};
