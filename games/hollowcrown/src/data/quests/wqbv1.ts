// WQ-BV1, The Tinker's Box (a wild side quest, found, not given): a tinker dying by his broken cart on the South Road
// asks the hero to carry a box to his girl in Tallow Green. There is no girl; there hasn't been since the Wet Years.
// Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_CART: Point = [1153, 3422];

export const WQ_BV1: Quest = {
  id: 'WQ-BV1',
  name: "The Tinker's Box",
  act: 'prologue',
  level: 2,
  minutes: 15,
  starts: 'found: the tinker dying by his cart, off the South Road',
  start: { after: ['MQ01'], found: { examine: { at: THE_CART, prop: 'body', label: 'Kneel by the man' } } },
  places: ['tallow-green', 'thatch-house'],
  stages: [
    {
      id: 'the-cart', title: 'A cart with one wheel',
      objectives: [
        {
          id: 'tinker', kind: 'talk', text: "A tinker by his cart, a wound in his side gone black. He's been here a while.", at: THE_CART,
          lines: [
            { who: 'Aelric Crane', text: "Not a robber. Good. I've nothing left for a robber." },
            { who: 'Aelric Crane', text: "Something in the dark took the wheel off. Then a piece of me. Ribbon, combs, a box. The box is for my girl." },
            { who: 'hero', text: 'Where is she?' },
            { who: 'Aelric Crane', text: 'Tallow Green. Little Ide. She likes the blue ribbon. Tell her her da\'s... tell her it\'s from the fair.' },
          ],
        },
        { id: 'box', kind: 'take', text: 'A box, tied with blue ribbon. It rattles: coins, and something lighter.', at: THE_CART, what: "the tinker's box" },
        { id: 'stay', kind: 'wait', text: 'Stay with him till it\'s over. It isn\'t long.', at: THE_CART, optional: true },
      ],
    },
    {
      id: 'tallow-green', title: 'Little Ide',
      objectives: [
        {
          id: 'goody', kind: 'talk', text: 'Ask after Ide Crane in Tallow Green.', at: 'thatch-house', who: 'Goody Thatch',
          lines: [
            { who: 'Goody Thatch', text: 'Aelric\'s girl? Ide went in the Wet Years. Her and her mother both. Eight winters ago.' },
            { who: 'Goody Thatch', text: 'He comes every summer with a ribbon for her. We stopped telling him. It only made him cry and go and buy another.' },
          ],
        },
        {
          id: 'box', kind: 'choose', text: "Coins, a lifetime's worth of a tinker's. And a milk tooth, wrapped in blue ribbon.", at: 'tallow-green',
          options: [
            { id: 'grave', tone: 'kind', label: '[Leave the box on Ide\'s grave]', sets: { wq_tinker: 'grave' } },
            { id: 'village', label: "[Give the coins to Goody Thatch for the village] He'd want someone fed.", sets: { wq_tinker: 'village' } },
            { id: 'kept', tone: 'hard', label: '[Keep the coins] The dead don\'t spend.', sets: { wq_tinker: 'kept' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 60, items: ['blue ribbon'], other: ['the coins, if kept'] },
  journal: 'A tinker died on the South Road carrying a box to a daughter eight years dead. He knew. He bought the ribbon anyway.',
  next: [],
};
