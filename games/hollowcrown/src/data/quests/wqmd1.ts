// WQ-MD1, The Cellar (a wild side quest, found, not given): under a burnt tithe-barn on the Middle Downs, a mother and
// two children have lived a winter in the cellar. Their father is down there too. He told them to, when it was time.
// Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_HATCH: Point = [2453, 2783];

export const WQ_MD1: Quest = {
  id: 'WQ-MD1',
  name: 'The Cellar',
  act: 'act-1',
  level: 5,
  minutes: 20,
  starts: "found: a cellar hatch in the burnt tithe-barn's floor",
  start: { after: ['MQ04'], found: { examine: { at: THE_HATCH, prop: 'cellar-hatch', label: 'Lift the hatch' } } },
  places: ['kingsmere'],
  stages: [
    {
      id: 'the-hatch', title: 'Under the barn',
      objectives: [
        {
          id: 'mother', kind: 'talk', text: 'A woman at the foot of the cellar steps, a kitchen knife held the wrong way. Two children behind her, too quiet.', at: THE_HATCH,
          lines: [
            { who: 'Morwen', text: "There's nothing down here. Nothing worth it. Go on." },
            { who: 'hero', text: "I'm not here to take anything." },
            { who: 'Morwen', text: "Everyone says that. The Regency said that. Then they burnt the barn with the tithe in it, for being short." },
          ],
        },
        {
          id: 'corner', kind: 'search', text: 'In the corner, under sacking, what was their father. Not all of him.', at: THE_HATCH, what: 'the sacking',
          lines: [
            { who: 'Morwen', text: 'He said to. When it was time. He made me promise, with the children listening, so I couldn\'t not.' },
            { who: 'Morwen', text: "Don't look at them like that. They don't know. They think it was a pig. Let them." },
          ],
        },
      ],
    },
    {
      id: 'what-now', title: 'A winter in a cellar',
      objectives: [
        {
          id: 'help', kind: 'choose', text: "They can't stay. Spring's coming, and so will the Regency's men for next year's tithe.", at: THE_HATCH,
          options: [
            { id: 'food', tone: 'kind', label: '[Give them food and coin] Enough to walk on.', sets: { wq_cellar: 'fed' } },
            { id: 'ditch', label: "[Send them to Kingsmere's Ditch] Nobody asks questions there.", sets: { wq_cellar: 'ditch' } },
            { id: 'regency', tone: 'hard', label: '[Report them to the Regency patrol] Tithe-dodgers. And worse.', sets: { wq_cellar: 'reported' } },
            { id: 'leave', label: '[Close the hatch, and keep walking]', sets: { wq_cellar: 'left' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 120, items: [], other: ["Morwen's thanks, or her curse, in Kingsmere later"] },
  journal: "A family under a burnt barn on the Downs, alive through the winter. The father saw to that. I won't write how.",
  next: [],
};
