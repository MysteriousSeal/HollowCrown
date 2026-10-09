// Every creature model of the Vale, by kind and variant, in the bestiary's order (docs/story/bestiary.md): what it's
// called and how it's made. The model viewer (models.html) shows them all; the game picks its own from here.

import type { Model } from '@voxel/engine/models';
import { BeastModel, BirdModel, FrameModel, SpiderModel } from '@voxel/engine/characters';
import { ALPHA_WOLF, BARROW_HOUND, BEAR, BOAR, WOLF } from './beasts';
import { BROOD_MOTHER, CAVE_SPIDER, HATCHLING } from './spiderVoxels';
import { SKELETON, SKELETON_ARCHER } from './skeletonVoxels';
import { ShadeModel } from './ghostVoxels';
import { BOG_DRAUGR, DRAUGR } from './draugrVoxels';
import { GHOST } from './spectralVoxels';
import { HUNGRY, HUNGRY_MOTHER, PIT_RISEN, PIT_RISEN_CHILD, PIT_RISEN_WOMAN } from './hungryVoxels';
import { DROWNED, HOLLOWED, PIT_EATER, SEWN } from './fleshVoxels';
import { ASHEN, ASHEN_SMALL, BLOOMER } from './bloomVoxels';
import { ROOK, ROOK_LEADER } from './rookVoxels';
import { BARROW_GIANT } from './giantVoxels';
import { BANDIT, CARROW_ARBALESTER, CARROW_PIKEMAN, GREENHOOD, HERON_CROSSBOWMAN, HERON_SPEARMAN, LANTERN_KNIGHT } from './peopleVoxels';
import { RED_HEN_BAND } from '../people/redHen';
import { DEAD_PILGRIM, sprawl } from '../people/pilgrim';
import { MULE } from './muleVoxels';
import { Lying } from './lying';
import { HOBS_TOWER_GUARD } from '../people/hobsTower';

export interface CreatureEntry {
  id: string;
  name: string;
  family: 'beast' | 'dead' | 'horror' | 'people' | 'remains'; // (remains: bodies lying where they fell)
  make(): Model;
}

export const CREATURES: CreatureEntry[] = [
  { id: 'wolf', name: 'Wolf', family: 'beast', make: () => new BeastModel(WOLF) },
  { id: 'alphaWolf', name: 'Alpha wolf', family: 'beast', make: () => new BeastModel(ALPHA_WOLF) },
  { id: 'boar', name: 'Boar', family: 'beast', make: () => new BeastModel(BOAR) },
  { id: 'bear', name: 'Brown bear', family: 'beast', make: () => new BeastModel(BEAR) },
  { id: 'mule', name: 'Mule', family: 'beast', make: () => new BeastModel(MULE) },
  { id: 'spider', name: 'Giant spider', family: 'beast', make: () => new SpiderModel(CAVE_SPIDER) },
  { id: 'spiderling', name: 'Spiderling', family: 'beast', make: () => new SpiderModel(HATCHLING) },
  { id: 'broodMother', name: 'Brood mother', family: 'beast', make: () => new SpiderModel(BROOD_MOTHER) },
  { id: 'bandit', name: 'Bandit (Red Hen)', family: 'people', make: () => new FrameModel(BANDIT) },
  ...RED_HEN_BAND.map(({ id, name, spec }) => ({ id, name, family: 'people' as const, make: () => new FrameModel(spec) })),
  { id: 'heronSpearman', name: 'Regency heron', family: 'people', make: () => new FrameModel(HERON_SPEARMAN) },
  { id: 'heronCrossbowman', name: 'Heron crossbowman', family: 'people', make: () => new FrameModel(HERON_CROSSBOWMAN) },
  ...HOBS_TOWER_GUARD.map(({ id, name, spec }) => ({ id, name, family: 'people' as const, make: () => new FrameModel(spec) })),
  { id: 'greenhood', name: 'Greenhood archer', family: 'people', make: () => new FrameModel(GREENHOOD) },
  { id: 'lanternKnight', name: 'Lantern knight', family: 'people', make: () => new FrameModel(LANTERN_KNIGHT) },
  { id: 'carrowPikeman', name: 'Carrow pikeman', family: 'people', make: () => new FrameModel(CARROW_PIKEMAN) },
  { id: 'carrowArbalester', name: 'Carrow arbalester', family: 'people', make: () => new FrameModel(CARROW_ARBALESTER) },
  { id: 'skeleton', name: 'Skeleton', family: 'dead', make: () => new FrameModel(SKELETON) },
  { id: 'skeletonArcher', name: 'Skeleton archer', family: 'dead', make: () => new FrameModel(SKELETON_ARCHER) },
  { id: 'ghost', name: 'Ghost', family: 'dead', make: () => new FrameModel(GHOST) },
  { id: 'shade', name: 'Wailing shade', family: 'dead', make: () => new ShadeModel() },
  { id: 'draugr', name: 'Draugr', family: 'dead', make: () => new FrameModel(DRAUGR) },
  { id: 'bogDraugr', name: 'Bog-draugr', family: 'dead', make: () => new FrameModel(BOG_DRAUGR) },
  { id: 'barrowHound', name: 'Barrow-hound', family: 'dead', make: () => new BeastModel(BARROW_HOUND) },
  { id: 'barrowGiant', name: 'Barrow-giant', family: 'dead', make: () => new FrameModel(BARROW_GIANT) },
  { id: 'hungry', name: 'The Hungry', family: 'horror', make: () => new FrameModel(HUNGRY) },
  { id: 'hungryMother', name: 'The Hungry (mother)', family: 'horror', make: () => new FrameModel(HUNGRY_MOTHER) },
  { id: 'pitRisen', name: 'The Hungry, risen from the pit', family: 'horror', make: () => new FrameModel(PIT_RISEN) },
  { id: 'pitRisenWoman', name: 'The Hungry, risen from the pit (Bet)', family: 'horror', make: () => new FrameModel(PIT_RISEN_WOMAN) },
  { id: 'pitRisenChild', name: 'The Hungry, risen from the pit (child)', family: 'horror', make: () => new FrameModel(PIT_RISEN_CHILD) },
  { id: 'drowned', name: 'The Drowned', family: 'horror', make: () => new FrameModel(DROWNED) },
  { id: 'bloomer', name: 'Bloomer', family: 'horror', make: () => new FrameModel(BLOOMER) },
  { id: 'hollowed', name: 'The Hollowed', family: 'horror', make: () => new FrameModel(HOLLOWED) },
  { id: 'sewn', name: 'The Sewn', family: 'horror', make: () => new FrameModel(SEWN) },
  { id: 'ashen', name: 'The Ashen', family: 'horror', make: () => new FrameModel(ASHEN) },
  { id: 'ashenSmall', name: 'The Ashen (child)', family: 'horror', make: () => new FrameModel(ASHEN_SMALL) },
  { id: 'pitEater', name: 'Pit-eater', family: 'horror', make: () => new FrameModel(PIT_EATER) },
  { id: 'rook', name: 'Carrion rook', family: 'horror', make: () => new BirdModel(ROOK) },
  { id: 'rookLeader', name: 'Carrion rook (leader)', family: 'horror', make: () => new BirdModel(ROOK_LEADER) },
  { id: 'deadPilgrim', name: 'Dead pilgrim woman (MQ01, the ditch)', family: 'remains', make: () => new Lying(new FrameModel(DEAD_PILGRIM), 'back', (m) => sprawl(m as FrameModel)) },
  { id: 'deadMule', name: 'Dead mule (MQ01, the Birchwood)', family: 'remains', make: () => new Lying(new BeastModel(MULE), 'side') },
];
