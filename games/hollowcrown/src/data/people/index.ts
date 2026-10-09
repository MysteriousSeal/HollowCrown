// Everyone named in the Vale, by their name exactly as the story's bible and their building's residents have it: for
// talking to them (gameplay), their routines and their models.

import { BRINDLEFORD_PEOPLE } from './brindleford';
import type { Villager } from './kinds';

export const PEOPLE: Villager[] = [...BRINDLEFORD_PEOPLE];
export const PEOPLE_DATA: Record<string, Villager> = Object.fromEntries(PEOPLE.map((p) => [p.name, p]));
export { barkLine, type Bark, type Doing, type RoutineStep, type Spot, type Villager } from './kinds';
