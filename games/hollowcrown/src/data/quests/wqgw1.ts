// WQ-GW1, Mother of Wolves (a wild side quest, found, not given): a she-wolf with cubs under a root-plate in the
// Greenwood, two poachers who want her pelt, and a collier's journal that says who started it. Used by the quest
// system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_DEN: Point = [3565, 2162];
const THE_CLEARING: Point = [3550, 2150];

export const WQ_GW1: Quest = {
  id: 'WQ-GW1',
  name: 'Mother of Wolves',
  act: 'act-1',
  level: 8,
  minutes: 25,
  starts: "found: coming near the she-wolf's den by the cold charcoal mounds",
  start: { after: ['MQ04'], found: { at: THE_DEN, radius: 10 } },
  places: [],
  stages: [
    {
      id: 'the-den', title: 'Teeth in the dark',
      objectives: [
        { id: 'wolf', kind: 'search', text: "A she-wolf in a root-plate's hollow, cubs behind her, lips back. She doesn't come out. She doesn't need to.", at: THE_DEN, what: 'she-wolf' },
        {
          id: 'poachers', kind: 'talk', text: 'Two men in the clearing with snares and a cudgel, waiting for her to move.', at: THE_CLEARING,
          lines: [
            { who: 'Rafe', text: 'Ours. We\'ve sat on her three days. Grey pelt like that\'s a Kingsmere winter.' },
            { who: 'Dunn', text: 'Cubs fetch a silver each from the Carrow lords. They like a wolf on a chain at the door.' },
            { who: 'Rafe', text: 'She took the collier, mind. Ate half of him. Doing the wood a kindness, we are.' },
          ],
        },
      ],
    },
    {
      id: 'the-collier', title: "The collier's book",
      objectives: [
        {
          id: 'journal', kind: 'take', text: "The collier's tally-book, in the cold mound's ashes.", at: THE_CLEARING, what: "the collier's book",
          lines: [{ who: "the collier's book", text: 'Took a cub from the root-hole. Rafe says a silver. The bitch watched me go. Will move the mound tomorrow.' }],
        },
        {
          id: 'choice', kind: 'choose', text: 'The collier took one of hers first. The poachers want the rest.', at: THE_CLEARING,
          options: [
            { id: 'pelt', tone: 'hard', label: '[Kill her, and take the pelt yourself]', sets: { wq_wolf_mother: 'pelt' } },
            { id: 'poachers', label: '[Drive the poachers off]', sets: { wq_wolf_mother: 'spared' } },
            { id: 'cubs', tone: 'sly', label: "[Let them have her. Take the cubs' price as your cut]", sets: { wq_wolf_mother: 'sold' } },
            { id: 'leave', label: '[Walk away. The wood can settle its own debts]', sets: { wq_wolf_mother: 'left' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 180, items: ['wolf pelt, if taken'], other: ['a grey wolf that shadows the hero in the Greenwood, if spared'] },
  journal: 'A collier stole a cub to sell. The mother took him for it. Then two poachers came for the rest. Somebody always comes for the rest.',
  next: [],
};
