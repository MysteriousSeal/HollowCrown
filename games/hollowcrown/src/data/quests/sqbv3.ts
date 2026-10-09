// SQ-BV3, Honey and Wax (docs/story/regions/brindle-vale.md): Tallow Green's bees are dying at the Nine Sisters. A
// barrow there has been dug into and its ward thrown down, and the girl buried in it wants her necklace back. The
// digger was a chandler's son after a bride-price. (Tallow Green's people aren't Brindleford's: the objectives name
// them in their text.) Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_HIVES: Point = [1180, 3000]; // Agna's, above the clover meadow

export const SQ_BV3: Quest = {
  id: 'SQ-BV3',
  name: 'Honey and Wax',
  act: 'prologue',
  level: 3,
  minutes: 30,
  starts: 'after MQ02: Agna Bee, at her hives',
  places: ['tallow-green', 'clover-meadow', 'nine-sisters'],
  stages: [
    {
      id: 'the-bees', title: 'Bees in the grass',
      objectives: [
        { id: 'agna', kind: 'talk', text: "Agna Bee's hives are emptying. The bees are dying out in the meadow.", at: THE_HIVES },
        { id: 'brede', kind: 'talk', text: "Little Brede says they go to the cold stones and fall asleep.", at: 'tallow-green', optional: true },
      ],
    },
    {
      id: 'the-stones', title: 'The Nine Sisters',
      objectives: [
        { id: 'frost', kind: 'search', text: 'Frost on the stones, in daylight. The mound in the middle has been dug into.', at: 'nine-sisters' },
        { id: 'ward', kind: 'take', text: 'An oath-iron grave-ward, thrown in the grass. It burns cold. Not for me.', at: 'nine-sisters', what: 'oath-iron grave-ward' },
        { id: 'wax', kind: 'search', text: 'Boot prints. Drips of candle-wax.', at: 'nine-sisters', what: 'candle-wax' },
      ],
    },
    {
      id: 'the-maiden', title: 'The Barrow-Maiden', hour: 23,
      objectives: [
        { id: 'ghosts', kind: 'fight', text: 'Ghosts at the stones, and a girl four hundred years dead. She wants her necklace.', at: 'nine-sisters', what: 'ghost', count: 3 },
        { id: 'maiden', kind: 'fight', text: 'The Barrow-Maiden.', at: 'nine-sisters', what: 'Barrow-Maiden' },
        { id: 'set-ward', kind: 'go', text: 'Set the ward back on the mound. Nobody else can carry it.', at: 'nine-sisters' },
      ],
    },
    {
      id: 'the-digger', title: 'Wax',
      objectives: [
        { id: 'hal', kind: 'talk', text: "The wax is a chandler's. Hal Wicke has a bronze necklace and a bride-price to find.", at: 'tallow-green' },
        {
          id: 'hal-secret', kind: 'choose', text: 'He dug up a dead girl to marry a living one. Whether Tallow Green knows is up to me.', at: 'tallow-green',
          options: [
            { id: 'told', label: '[Tell Agna and Goody Thatch]', sets: { hal_secret: 'told' } },
            { id: 'kept', label: "[Keep it] You'll give it back to her yourself. Tonight. At the stones.", sets: { hal_secret: 'kept' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 120, items: ['honeycomb', 'honeycomb', 'honeycomb', 'honeycomb', 'honeycomb'], other: ["Tallow Green's honey for sale again"] },
  journal: "Hal Wicke robbed a barrow at the Nine Sisters for a bride-price. The girl in it took it badly, and so did the bees. The ward's back. The necklace too.",
  next: ['SQ-BV8'],
};
