// The props of the wild side quests (src/data/quests/wq*.ts), placed where each is found: a dying man by his cart, a
// child's shoe by the river, a cellar hatch in a burnt farmstead, a wolf's den, a notice on a hanged boy's oak, a
// hermit's fire, a drowned sailor on the strand. Each is something to examine with E, or the sign of a place to come
// near. Used by the props' placing (environment); the quests' `found` names the same kinds and tiles.

import type { Dressing } from './dressing';
import { EAST, NORTH, SOUTH, WEST } from './kinds';

export const WILD_PROPS: Dressing[] = [
  { kind: 'body', note: 'a tinker dying by his cart (WQ-BV1)', at: [1153, 3422], facing: WEST, pose: 'dying' },
  { kind: 'childs-shoe', note: "a child's shoe in the reeds, still laced (WQ-BV2)", at: [832, 3627], facing: EAST },
  { kind: 'cellar-hatch', note: "a cellar hatch in the burnt tithe-barn's floor (WQ-MD1)", at: [2453, 2783], facing: SOUTH },
  { kind: 'wolf-den', note: 'a she-wolf\'s den under a root-plate (WQ-GW1)', at: [3565, 2162], facing: WEST, radius: 2 },
  { kind: 'body', note: 'a boy hanged from the oak, small for the rope (WQ-HM1)', at: [2650, 2601], facing: SOUTH, pose: 'hanged' },
  { kind: 'notice', note: 'the Regency\'s notice nailed under him: THIEF (WQ-HM1)', at: [2651, 2603], facing: SOUTH },
  { kind: 'hermit-fire', note: 'a hermit\'s fire, poppy-cups round it (WQ-LM1)', at: [654, 656], facing: NORTH },
  { kind: 'body', note: 'a drowned sailor on the strand, a letter in oilcloth on him (WQ-SR1)', at: [172, 2236], facing: EAST, pose: 'drowned' },
];
