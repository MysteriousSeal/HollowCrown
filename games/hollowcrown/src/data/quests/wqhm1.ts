// WQ-HM1, THIEF (a wild side quest, found, not given): on the Wood Road out of Kingsmere, a boy hanged from an oak
// under the Regency's notice. Inside his shirt, a note from his sister in the Ditch: come home after. Used by the
// quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_NOTICE: Point = [2651, 2603];

export const WQ_HM1: Quest = {
  id: 'WQ-HM1',
  name: 'THIEF',
  act: 'act-1',
  level: 6,
  minutes: 20,
  starts: "found: reading the Regency's notice under a hanged boy on the Wood Road",
  start: { after: ['MQ04'], found: { examine: { at: THE_NOTICE, prop: 'notice', label: 'Read the notice' } } },
  places: ['kingsmere'],
  stages: [
    {
      id: 'the-oak', title: 'THIEF',
      objectives: [
        {
          id: 'notice', kind: 'search', text: 'BY ORDER OF THE LORD REGENT: THIEF OF THE REGENT\'S GRAIN. Under it, a boy. Eleven, perhaps.', at: THE_NOTICE, what: 'the notice',
          lines: [{ who: 'hero', text: 'A handful of grain. They used a whole rope.' }],
        },
        {
          id: 'note', kind: 'take', text: 'In his shirt, a note, folded small.', at: THE_NOTICE, what: "Nell's note",
          lines: [{ who: "Nell's note", text: 'Tam. Don\'t go near the granary again, they\'re watching it. Come home after. I kept your bread. — Nell' }],
        },
        { id: 'cut-down', kind: 'choose', text: 'He\'s still up there.', at: THE_NOTICE, options: [
          { id: 'cut', tone: 'kind', label: '[Cut him down and bury him]', sets: { wq_thief_buried: true } },
          { id: 'leave', label: '[Leave him. The Regency counts its hanged]', sets: { wq_thief_buried: false } },
        ] },
      ],
    },
    {
      id: 'nell', title: 'Come home after',
      objectives: [
        {
          id: 'nell', kind: 'talk', text: "Find Nell in Kingsmere's Ditch.", at: 'kingsmere',
          lines: [
            { who: 'Nell', text: "You've got Tam's knot in that paper. Where is he? He's late. He's always late." },
          ],
        },
        {
          id: 'tell', kind: 'choose', text: 'She kept his bread. It\'s on the shelf behind her, going green.', at: 'kingsmere',
          options: [
            { id: 'truth', tone: 'blunt', label: "He's dead, Nell. The Regency hanged him on the Wood Road.", sets: { wq_thief: 'truth' } },
            { id: 'lie', tone: 'kind', label: "He got out. Took a cart west. He'll write.", sets: { wq_thief: 'lied' } },
            { id: 'boots', label: '[Say nothing. Leave his boots on her step]', sets: { wq_thief: 'boots' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 120, items: [], other: ['Nell, in the Ditch, later'] },
  journal: 'The Regency hanged an eleven-year-old for a handful of its grain and nailed THIEF under him. His sister kept his bread for when he came home.',
  next: [],
};
