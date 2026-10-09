// Dressing the body: its palette with colors swapped (a dead skin, clouded eyes) and gear colors after it; which
// side a limb is on.

import { BODY_COLOR_COUNT, C, type Joint } from './bodyVoxels';

// The body's palette (bodyPalette) with some entries swapped (by the body's C names), then `gear`'s colors after it
// (from index 16).
export function bodyColors(base: number[], swaps: Partial<Record<keyof typeof C, number>>, gear: number[]): number[] {
  const out = base.slice();
  for (const [name, color] of Object.entries(swaps)) out[C[name as keyof typeof C] - 1] = color as number;
  return [...out, ...gear];
}

// A limb's outer side (away from the body): its right is -X, so the right limbs' outer side is low x.
export const isRight = (joint: Joint): boolean => joint.startsWith('right');
export const outerX = (joint: Joint, width: number): number => (isRight(joint) ? -1 : width);

// Color indices for colors added after a body's palette (as bodyColors appends them), by name, in order.
export function afterBody<K extends string>(names: readonly K[]): Record<K, number> {
  return Object.fromEntries(names.map((name, i) => [name, BODY_COLOR_COUNT + 1 + i])) as Record<K, number>;
}
