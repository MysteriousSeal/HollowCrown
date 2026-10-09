// Every person of the Vale with a name (docs/story/regions/brindle-vale.md), by their full name exactly as the map's
// residents have it (data/world/brindleford.ts: 'Tamsin Reede', 'Cob Fletcher'): how each is made. The game places them (gameplay), the model viewer (models.html) shows them all.

import type { Model } from '@voxel/engine/models';
import { FrameModel, type FrameSpec } from '@voxel/engine/characters';
import { FOLK } from './brindleford';
import { HOUSEHOLDS } from './households';

export interface Person {
  name: string;
  make(): Model;
}

const people = (specs: Record<string, FrameSpec>): Array<[string, Person]> =>
  Object.entries(specs).map(([name, spec]) => [name, { name, make: () => new FrameModel(spec) }]);

export const PEOPLE: Record<string, Person> = Object.fromEntries([...people(FOLK), ...people(HOUSEHOLDS)]);

// A person's id for a URL or a save: their name in lower case, hyphened ('Garrick Fenn' is garrick-fenn).
export const personId = (name: string): string => name.toLowerCase().replace(/[^a-z]+/g, '-');
