// The four-legged creatures of the Vale (bestiary.md): wolf, alpha wolf, boar, bear, barrow-hound, as the engine's
// beast rig draws them (their parts: wolfVoxels.ts, boarVoxels.ts, bearVoxels.ts, houndVoxels.ts).

import { beastPart, type BeastSpec } from '@voxel/engine/characters';
import { ALPHA_PALETTE, BODY_GRID, HEAD_GRID, LEG_GRID, TAIL_GRID, WOLF_PALETTE, buildBody, buildHead, buildLeg, buildTail } from './wolfVoxels';
import { BOAR_BODY_GRID, BOAR_HEAD_GRID, BOAR_LEG_GRID, BOAR_PALETTE, BOAR_TAIL_GRID, buildBoarBody, buildBoarHead, buildBoarLeg, buildBoarTail } from './boarVoxels';
import { BEAR_BODY, BEAR_HEAD, BEAR_LEG, BEAR_PALETTE, BEAR_TAIL, bearBody, bearHead, bearLeg, bearTail } from './bearVoxels';
import { HOUND_BODY, HOUND_GLOW, HOUND_HEAD, HOUND_LEG, HOUND_PALETTE, HOUND_TAIL, houndBody, houndHead, houndLeg, houndTail } from './houndVoxels';

const part = beastPart;

export const WOLF: BeastSpec = {
  palette: WOLF_PALETTE,
  body: part(buildBody, BODY_GRID),
  head: part(buildHead, HEAD_GRID),
  leg: part(buildLeg, LEG_GRID),
  tail: part(buildTail, TAIL_GRID),
  headDrop: 3,
  legsAt: [[-2, 5], [2, 5], [-2, -5], [2, -5]],
};
export const ALPHA_WOLF: BeastSpec = { ...WOLF, palette: ALPHA_PALETTE, scale: 1.25 };

export const BOAR: BeastSpec = {
  palette: BOAR_PALETTE,
  body: part(buildBoarBody, BOAR_BODY_GRID),
  head: part(buildBoarHead, BOAR_HEAD_GRID),
  leg: part(buildBoarLeg, BOAR_LEG_GRID),
  tail: part(buildBoarTail, BOAR_TAIL_GRID),
  headDrop: 5, // carried low
  legsAt: [[-2.5, 4], [2.5, 4], [-2.5, -4], [2.5, -4]],
  stride: 1.8,
};

export const BEAR: BeastSpec = {
  palette: BEAR_PALETTE,
  body: part(bearBody, BEAR_BODY),
  head: part(bearHead, BEAR_HEAD),
  leg: part(bearLeg, BEAR_LEG),
  tail: part(bearTail, BEAR_TAIL),
  headDrop: 7, // carried low, before its hump
  tailDrop: 4, // (its rump lower than its hump)
  tailDroop: 0.6,
  legsAt: [[-4, 6.5], [4, 6.5], [-4, -6.5], [4, -6.5]],
  stride: 1.1,
};

export const BARROW_HOUND: BeastSpec = {
  palette: HOUND_PALETTE,
  body: part(houndBody, HOUND_BODY),
  head: part(houndHead, HOUND_HEAD),
  leg: part(houndLeg, HOUND_LEG),
  tail: part(houndTail, HOUND_TAIL),
  headDrop: 3,
  legsAt: [[-2, 5], [2, 5], [-2, -5], [2, -5]],
  glows: HOUND_GLOW,
  stride: 2.2,
};
