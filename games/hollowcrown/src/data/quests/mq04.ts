// MQ04, Three Roads (docs/story/main-quest-1.md): three summonses in one evening (the Regent's, the Lantern's, the
// Greenhood's), Garrick by a low fire telling the story everyone tells and lying about his part in it, and the
// checkpoint at Hob's Tower where the Vale ends. (Sergeant Crow isn't a villager: he speaks in lines.) Used by the
// quest system and the journal.

import type { Quest } from './kinds';

export const MQ04: Quest = {
  id: 'MQ04',
  name: 'Three Roads',
  act: 'prologue',
  level: 4,
  minutes: 30,
  starts: 'MQ02 and MQ03 done',
  start: { after: ['MQ02', 'MQ03'] },
  places: ['ferrymans-rest', 'hobs-tower'],
  stages: [
    {
      id: 'three-messages', title: 'Three messages', hour: 19,
      objectives: [
        {
          id: 'regent', kind: 'take', text: "A summons sealed with a grey heron. Pell's report reached Kingsmere.", at: 'ferrymans-rest', what: "the Regent's summons",
          lines: [{ who: "the Regent's summons", text: 'The bearer is required at the Regent\'s Hall, Kingsmere, without delay.' }],
        },
        {
          id: 'lantern', kind: 'take', text: "A letter from the Abbey. Cuthwin wrote to them.", at: 'ferrymans-rest', what: "Odalys's letter",
          lines: [{ who: "Odalys's letter", text: 'Send the unsworn one to the Abbey.' }],
        },
        {
          id: 'greenhood', kind: 'take', text: 'A wren feather and a strip of birch bark, under my door.', at: 'ferrymans-rest', what: 'birch-bark note',
          lines: [{ who: 'birch-bark note', text: 'The Hollow Oak. Come alone. — W.' }],
        },
      ],
    },
    {
      id: 'garrick', title: 'The second bottle', hour: 23,
      objectives: [
        {
          id: 'garrick', kind: 'talk', text: 'Garrick, late, the fire low, the second bottle open.', at: 'ferrymans-rest', who: 'Garrick Fenn',
          lines: [
            { who: 'Garrick Fenn', text: 'Three roads, and all of them want the crown, whatever they say.' },
            { who: 'Garrick Fenn', text: "You know what a crown is, stranger? A ring of iron somebody else forged, that you can't take off." },
            { who: 'hero', text: 'You were the ferryman. The night of the Still Water.' },
            { who: 'Garrick Fenn', text: 'I was ill that night. Fever. Another man rowed. Everyone knows that.' },
            { who: 'Elsa Fenn', text: '...' },
          ],
        },
      ],
      sets: { garrick_lied_once: true },
    },
    {
      id: 'hobs-tower', title: "Hob's Tower",
      objectives: [
        {
          id: 'crow', kind: 'talk', text: "The checkpoint at Hob's Tower. The bar is down.", at: 'hobs-tower',
          lines: [
            { who: 'Sergeant Matthias Crow', text: 'Papers. Or a reason. Papers are quicker.' },
            { who: 'Sergeant Matthias Crow', text: "...The Regent's own seal. Kingsmere, then. Mind the Ditch when you get there: they'll sell you the white for a copper, and your boots for two." },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 100, items: ["Garrick's ferry token"], other: ['the road out of the Vale'] },
  journal: 'Three letters in one evening: the Regent, the Lantern, the Greenhood. Garrick says he was ill the night the king drowned. Elsa heard him say it, and knew he was lying.',
  next: ['MQ05', 'MQ07', 'MQ09'],
};
