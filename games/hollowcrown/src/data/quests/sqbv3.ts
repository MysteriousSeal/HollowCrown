// SQ-BV3, Honey and Wax (docs/story/regions/brindle-vale.md): Tallow Green's bees are dying at the Nine Sisters. A
// barrow there has been dug into and its ward thrown down, and the girl buried in it wants her necklace back. The
// digger was a chandler's son after a bride-price. Used by the quest system and the journal.

import type { Quest } from './kinds';

export const SQ_BV3: Quest = {
  id: 'SQ-BV3',
  name: 'Honey and Wax',
  act: 'prologue',
  level: 3,
  minutes: 30,
  starts: 'after MQ02: Agna Bee, at her hives',
  places: ['tallow-green', 'agnas-hives', 'clover-meadow', 'nine-sisters'],
  stages: [
    {
      id: 'the-bees', title: 'Bees in the grass',
      objectives: [
        {
          id: 'agna', kind: 'talk', text: "Agna Bee's hives are emptying. The bees are dying out in the meadow.", at: 'agnas-hives', who: 'Agna Bee',
          lines: [
            { who: 'Agna Bee', text: 'Listen. Hear that? No. Neither do I.' },
            { who: 'Agna Bee', text: "Twelve hives. Four left humming. They fly off west in the morning and they don't come home. I find them in the grass, curled up like they're sleeping." },
            { who: 'hero', text: 'Poison?' },
            { who: 'Agna Bee', text: "Poison I'd smell. This is something else." },
          ],
        },
        {
          id: 'brede', kind: 'talk', text: "Little Brede says they go to the cold stones and fall asleep.", at: 'tallow-green', who: 'Little Brede', optional: true,
          lines: [
            { who: 'Little Brede', text: 'They go to the cold stones and fall asleep. I tried to wake one. It was cold too.' },
          ],
        },
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
        {
          id: 'maiden', kind: 'fight', text: 'The Barrow-Maiden.', at: 'nine-sisters', what: 'Barrow-Maiden',
          lines: [
            { who: 'the Barrow-Maiden', text: 'Mine. Mother put it round my neck. Mother put me in the dark. Give it back.' },
          ],
        },
        { id: 'set-ward', kind: 'go', text: 'Set the ward back on the mound. Nobody else can carry it.', at: 'nine-sisters' },
      ],
    },
    {
      id: 'the-digger', title: 'Wax',
      objectives: [
        {
          id: 'hal', kind: 'talk', text: "The wax is a chandler's. Hal Wicke has a bronze necklace and a bride-price to find.", at: 'tallow-green', who: 'Hal Wicke',
          lines: [
            { who: 'Hal Wicke', text: "It's only bronze. I thought it'd be gold. They always say gold." },
            { who: 'hero', text: "There's frost on those stones in August, Hal." },
            { who: 'Hal Wicke', text: "Garrick wants twenty silver for her. Twenty. My da's never seen twenty silver. I'd dig up the whole hill for Elsa." },
            { who: 'hero', text: 'Something down there would let you.' },
          ],
        },
        {
          id: 'hal-secret', kind: 'choose', text: 'He dug up a dead girl to marry a living one. Whether Tallow Green knows is up to me.', at: 'tallow-green', who: 'Hal Wicke',
          lines: [
            { who: 'Hal Wicke', text: "If Goody Thatch hears, I'm done here. If Garrick hears, I'm done everywhere." },
          ],
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
