// SQ-BV8, A Candle for Elsa (docs/story/regions/brindle-vale.md): Elsa and Hal Wicke want to marry, and Garrick sets a
// bride-price no chandler's son could pay. The hero talks to him at the river with whatever they know: a wedding in
// the square, or an empty room upstairs. Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_RIVER: Point = [866, 3350]; // the ford, where Garrick drinks

export const SQ_BV8: Quest = {
  id: 'SQ-BV8',
  name: 'A Candle for Elsa',
  act: 'prologue',
  level: 4,
  minutes: 30,
  starts: 'after MQ03: Elsa, crying in the yard, or Hal Wicke',
  start: { after: ['MQ03'], giver: 'Elsa Fenn' },
  places: ['ferrymans-rest', 'tallow-green', 'chandlery', 'brindleford-well'],
  stages: [
    {
      id: 'elsa', title: 'Crying in the yard',
      objectives: [
        {
          id: 'elsa', kind: 'talk', text: "Elsa wants to marry Hal Wicke. Her father wants a bride-price no chandler's son could pay.", at: 'ferrymans-rest', who: 'Elsa Fenn',
          lines: [
            { who: 'Elsa Fenn', text: "Don't. I'm not crying, I'm peeling onions. In the yard. With no onions." },
            { who: 'Elsa Fenn', text: "Hal asked Da for me. Da said twenty silver. Twenty. He might as well have said the moon, or a dead man's pardon." },
          ],
        },
      ],
    },
    {
      id: 'hal', title: "The chandler's son",
      objectives: [
        {
          id: 'hal', kind: 'talk', text: 'Hear Hal out, in Tallow Green.', at: 'chandlery', who: 'Hal Wicke',
          lines: [
            { who: 'Hal Wicke', text: "Twenty silver for a cook. He wants me gone, that's all it means." },
            { who: 'Hal Wicke', text: "I make candles. I'd make her a hundred. I'd make her a house of them." },
          ],
        },
      ],
    },
    {
      id: 'garrick', title: 'At the river', hour: 22,
      objectives: [
        {
          id: 'garrick', kind: 'choose', text: 'Garrick, at the river with a bottle. Talk him round with what I know.', at: THE_RIVER, who: 'Garrick Fenn',
          lines: [
            { who: 'Garrick Fenn', text: "Come to plead for the chandler's boy? Sit. Not on the dry side, that's mine." },
            { who: 'Garrick Fenn', text: "She's all I didn't drown. I'll not hand her to the first lad who smells of wax." },
          ],
          options: [
            { id: 'bell', label: '[The bell rang] You gave this village its nerve back. Give your daughter hers.', sets: { sqbv8_push: 'bell' } },
            { id: 'rhosyn', label: "[What the lake showed] You're afraid a son-in-law will ask where the money came from. And who Rhosyn was.", sets: { sqbv8_push: 'rhosyn' } },
            { id: 'plain', tone: 'kind', label: "She's happy with him. That's all. That should be enough.", sets: { sqbv8_push: 'plain' } },
          ],
        },
      ],
    },
    {
      id: 'the-end', title: 'A wedding, or an empty room',
      objectives: [
        { id: 'wedding', kind: 'go', text: "If he gave in: a wedding at the Ferryman's Rest, dancing in the square. Kit is after the cake.", at: 'brindleford-well', optional: true },
        {
          id: 'elsa', kind: 'talk', text: 'See Elsa, or what she left.', at: 'ferrymans-rest', who: 'Elsa Fenn',
          lines: [
            { who: 'Elsa Fenn', text: "Whatever you said to him. Thank you. Or curse you. I'll know by morning." },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 120, items: [], other: ['a wedding (bv_elsa_wed, garrick_trusts), or Elsa and Hal gone to Kingsmere (bv_elsa_eloped, Brindleford -1)'] },
  journal: "Garrick wouldn't let his daughter marry a chandler's son. I went down to the river and talked to him. What I said decided the rest.",
  next: [],
};
