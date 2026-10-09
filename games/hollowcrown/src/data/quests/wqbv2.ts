// WQ-BV2, Small Feet (a wild side quest, found, not given): a child's shoe in the reeds by the Stepping Stones, laced,
// too small to have walked so far. Wynn Tidy knows it: she laced it on her son for the pit. Used by the quest system
// and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_SHOE: Point = [832, 3627];

export const WQ_BV2: Quest = {
  id: 'WQ-BV2',
  name: 'Small Feet',
  act: 'prologue',
  level: 2,
  minutes: 20,
  starts: "found: a child's shoe in the reeds by the Stepping Stones",
  start: { after: ['MQ01'], found: { examine: { at: THE_SHOE, prop: 'childs-shoe', label: 'Pick up the shoe' } } },
  places: ['tidy-house', 'famine-pit'],
  stages: [
    {
      id: 'the-shoe', title: 'A shoe in the reeds',
      objectives: [
        {
          id: 'shoe', kind: 'take', text: "A child's shoe, still laced, the sole worn through at the toe. Small prints in the mud, going north. Bare.", at: THE_SHOE, what: "a child's shoe",
          lines: [{ who: 'hero', text: "Somebody's laced this for a long walk. Somebody's kept walking without it." }],
        },
      ],
    },
    {
      id: 'wynn', title: 'Whose shoe',
      objectives: [
        {
          id: 'wynn', kind: 'talk', text: 'A mother in Brindleford would know a shoe she laced.', at: 'tidy-house', who: 'Wynn Tidy',
          lines: [
            { who: 'Wynn Tidy', text: '...Where did you find it.' },
            { who: 'Wynn Tidy', text: "I laced that on Cole. Double knot, so he wouldn't trip. You don't trip, in a pit. I didn't think. I just laced it." },
            { who: 'Wynn Tidy', text: 'He drinks the milk. Every night. He\'s coming home. He\'s just slow.' },
          ],
        },
      ],
    },
    {
      id: 'night', title: 'Barefoot', hour: 23,
      objectives: [
        {
          id: 'pit', kind: 'search', text: 'Small bare prints, up the Chapel Path to the pit. A thin shape, sitting on the mound, waiting.', at: 'famine-pit', what: 'the Hungry (a child)',
          lines: [{ who: 'a small voice', text: 'Mam? I lost my shoe. Mam, I lost it.' }],
        },
        {
          id: 'cole', kind: 'choose', text: 'He\'s one of the Hungry. He doesn\'t know. He wants his mother.', at: 'famine-pit',
          options: [
            { id: 'rest', tone: 'kind', label: '[The Rite of Rest] Cole. You can stop walking now.', sets: { wq_small_feet: 'rested' } },
            { id: 'wynn', label: '[Bring Wynn up the hill]', sets: { wq_small_feet: 'mother' } },
            { id: 'end', tone: 'hard', label: '[End it with the blade]', sets: { wq_small_feet: 'ended' } },
            { id: 'leave', label: '[Leave him the shoe, and go]', sets: { wq_small_feet: 'left' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 80, items: [], other: ['the milk stops being drunk, or doesn\'t'] },
  journal: "A child's shoe by the river led to Cole Tidy, six, dead in the famine pit and walking home every night. His mother leaves him milk. I decided how that ends.",
  next: [],
};
