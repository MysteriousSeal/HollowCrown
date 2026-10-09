// WQ-SR1, Salt Letter (a wild side quest, found, not given): a drowned sailor on the Saltreach strand, a letter to his
// wife sewn into oilcloth on him. It names the wreckers' false lights. His wife has since married one of them. Used by
// the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_STRAND: Point = [172, 2236];

export const WQ_SR1: Quest = {
  id: 'WQ-SR1',
  name: 'Salt Letter',
  act: 'act-1',
  level: 10,
  minutes: 25,
  starts: 'found: a drowned sailor on the strand below Gullhaven',
  start: { after: ['MQ04'], found: { examine: { at: THE_STRAND, prop: 'body', label: 'Search the drowned man' } } },
  places: ['saltcombe', 'gullhaven'],
  stages: [
    {
      id: 'the-strand', title: 'Oilcloth',
      objectives: [
        {
          id: 'letter', kind: 'take', text: 'A sailor, a week in the water. Sewn into his shirt, a letter in oilcloth, dry.', at: THE_STRAND, what: "Hew Marrow's letter",
          lines: [
            { who: "Hew Marrow's letter", text: "Brid. We saw the Light lit on the wrong headland. Captain says it's wreckers. If this finds you and I don't, it was the Gull Light and it was lit on purpose." },
            { who: "Hew Marrow's letter", text: "Don't marry a Saltcombe man. They've all got salt in their pockets that isn't theirs. — Hew" },
          ],
        },
      ],
    },
    {
      id: 'brid', title: 'Saltcombe',
      objectives: [
        {
          id: 'brid', kind: 'talk', text: "Find Brid Marrow in Saltcombe.", at: 'saltcombe',
          lines: [
            { who: 'Brid', text: 'Marrow? Not any more. I\'m a Callow now. A widow can\'t eat salt water.' },
            { who: 'Brid', text: 'Jack Callow\'s a good man. He brings things home from the strand. He\'s good to me.' },
          ],
        },
        {
          id: 'the-letter', kind: 'choose', text: 'Her husband brings things home from the strand. Her first one came home in the water.', at: 'saltcombe',
          options: [
            { id: 'give', tone: 'blunt', label: '[Give Brid the letter]', sets: { wq_salt_letter: 'brid' } },
            { id: 'harbour', label: "[Take it to Gullhaven's harbourmaster] Wreckers hang.", sets: { wq_salt_letter: 'harbour' } },
            { id: 'burn', tone: 'kind', label: '[Burn it] She\'s eating. Let her eat.', sets: { wq_salt_letter: 'burnt' } },
            { id: 'sell', tone: 'sly', label: "[Sell it to Jack Callow]", sets: { wq_salt_letter: 'sold' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 200, copper: 0, items: [], other: ['the wreckers\' price on the letter, if sold'] },
  journal: 'A drowned sailor carried proof that Gull Light was lit to wreck ships. His widow married a wrecker. She says he\'s good to her.',
  next: [],
};
