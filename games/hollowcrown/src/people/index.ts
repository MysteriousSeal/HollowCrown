// Every person of the Vale with a name (docs/story/regions/brindle-vale.md), by their full name exactly as the map's
// residents have it (data/world/brindleford.ts: 'Tamsin Reede', 'Cob Fletcher'): how each is made, and where they
// live (only Brindleford's are on the map yet). The game places them (gameplay), the model viewer (models.html)
// shows them all.

import type { Model } from '@voxel/engine/models';
import { FrameModel, type FrameSpec } from '@voxel/engine/characters';
import { FOLK } from './brindleford';
import { HOUSEHOLDS } from './households';
import { RED_HEN_FOLK } from './redHen';
import { TALLOW_GREEN } from './tallowGreen';

export type Home = 'Brindleford' | 'Tallow Green' | 'Red Hen camp' | "Hob's Tower";

export interface Person {
  name: string;
  home: Home;
  make(): Model;
  variants?: Record<string, () => Model>; // the same person another way (Hesper Rowe 'chained', before MQ03)
}

// A group's people: each spec, or a spec with its variants.
type Specs = Record<string, FrameSpec | { spec: FrameSpec; variants: Record<string, FrameSpec> }>;
const people = (home: Home, specs: Specs): Array<[string, Person]> =>
  Object.entries(specs).map(([name, s]) => {
    const { spec, variants } = 'spec' in s ? s : { spec: s, variants: undefined };
    const person: Person = { name, home, make: () => new FrameModel(spec) };
    if (variants) person.variants = Object.fromEntries(Object.entries(variants).map(([k, v]) => [k, () => new FrameModel(v)]));
    return [name, person];
  });

export const PEOPLE: Record<string, Person> = Object.fromEntries([
  ...people('Brindleford', FOLK),
  ...people('Brindleford', HOUSEHOLDS),
  ...people('Tallow Green', TALLOW_GREEN),
  ...people('Red Hen camp', RED_HEN_FOLK),
]);

// A person's id for a URL or a save: their name in lower case, hyphened ('Garrick Fenn' is garrick-fenn).
export const personId = (name: string): string => name.toLowerCase().replace(/[^a-z]+/g, '-');
