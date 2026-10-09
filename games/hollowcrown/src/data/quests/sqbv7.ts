// SQ-BV7, The Smith's Apprentice (docs/story/regions/brindle-vale.md): Wat ran off with Tobin's best blade to be a
// bandit, and found out what bandits are. Done at once if he was freed in MQ03. Then Tobin's smith-book, and the
// Oathforge his people kept. Used by the quest system and the journal.

import type { Quest } from './kinds';

export const SQ_BV7: Quest = {
  id: 'SQ-BV7',
  name: "The Smith's Apprentice",
  act: 'prologue',
  level: 3,
  minutes: 20,
  starts: 'Tobin Harrow (done at once if Wat was freed in MQ03)',
  start: { after: [], giver: 'Tobin Harrow' },
  places: ['smithy', 'red-hen-camp'],
  stages: [
    {
      id: 'the-blade', title: 'A blade gone missing',
      objectives: [
        {
          id: 'tobin', kind: 'talk', text: "Wat ran off with Tobin's best blade 'to be a bandit'. Tobin said that in four words.", at: 'smithy', who: 'Tobin Harrow',
          lines: [
            { who: 'Tobin Harrow', text: "Boy's gone." },
            { who: 'hero', text: 'Gone where?' },
            { who: 'Tobin Harrow', text: 'Bandit.' },
            { who: 'Tobin Harrow', text: 'Took my best. Bring him back.' },
          ],
        },
      ],
    },
    {
      id: 'the-stock', title: 'In the stock',
      objectives: [
        {
          id: 'wat', kind: 'talk', text: "Wat, in the Red Hen's stock. He wouldn't cut the old pilgrim woman's throat. Someone else did.", at: 'red-hen-camp', who: 'Wat',
          lines: [
            { who: 'Wat', text: "I'm not a coward. I just didn't want to hurt that old woman." },
            { who: 'Wat', text: "They gave me the knife and pointed. I couldn't. Brannoc laughed and did it himself, and then they put me in here to learn." },
            { who: 'hero', text: "What's in the back tent, Wat?" },
            { who: 'Wat', text: "Don't. Please." },
          ],
        },
        { id: 'free', kind: 'take', text: 'Get him out of the stock, and get the blade back.', at: 'red-hen-camp', what: "Tobin's blade" },
      ],
    },
    {
      id: 'home', title: 'Home',
      objectives: [
        {
          id: 'tobin', kind: 'talk', text: 'Bring Wat home to the smithy.', at: 'smithy', who: 'Tobin Harrow',
          lines: [
            { who: 'Tobin Harrow', text: 'Good.' },
            { who: 'Wat', text: 'Master, I —' },
            { who: 'Tobin Harrow', text: 'Good.' },
          ],
        },
        {
          id: 'smith-book', kind: 'search', text: "Tobin's smith-book: his grandfather's drawings of a crown, and a blue fire.", at: 'smithy', what: 'the smith-book',
          lines: [
            { who: 'Tobin Harrow', text: "Grandfather's. A crown, and a fire burning blue." },
            { who: 'Tobin Harrow', text: 'My people kept the Oathforge, before the Lantern took it. I could find my way round an old forge.' },
          ],
        },
        {
          id: 'blade', kind: 'choose', text: 'Tobin says the blade is mine if I want it.', at: 'smithy', who: 'Tobin Harrow',
          lines: [
            { who: 'Tobin Harrow', text: "Harrow steel. Yours. Or bring it back and I'll make you better." },
          ],
          options: [
            { id: 'keep', label: '[Keep the Harrow steel]', sets: { harrow_steel: 'kept' } },
            { id: 'return', label: '[Give it back] Make me something better, later.', sets: { harrow_steel: 'returned' } },
          ],
        },
      ],
      sets: { tobin_at_forge: true },
    },
  ],
  rewards: { xp: 100, items: [], other: ['Harrow steel, or a free upgrade later'] },
  journal: "Wat came home from the Red Hen without the blade's shine and without a word for what he saw. Tobin held him a long time. His people kept the Oathforge once.",
  next: [],
};
