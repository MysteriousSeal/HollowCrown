// SQ-BV6, Mossjaw (docs/story/regions/brindle-vale.md): Wenna went after a lost ewe and didn't come back. Scrap leads
// to Mossjaw Cave, through wolves, a starving pit-eater and a brood of spiders, to a girl in a crack with a knife. She
// didn't follow a ewe. She ran from what Hob sold her into. Used by the quest system and the journal.

import type { Quest } from './kinds';

export const SQ_BV6: Quest = {
  id: 'SQ-BV6',
  name: 'Mossjaw',
  act: 'prologue',
  level: 4,
  minutes: 40,
  starts: 'after MQ01: Ada Cobbe, frantic, or Scrap the dog, barking',
  places: ['cobbe-farmhouse', 'mossjaw-cave', 'herbalists-cottage', 'ferrymans-rest'],
  stages: [
    {
      id: 'missing', title: 'Two days gone',
      objectives: [
        { id: 'ada', kind: 'talk', text: "Wenna went after a lost ewe two days ago. Ada's frantic. Hob won't look at anyone.", at: 'cobbe-farmhouse', who: 'Ada Cobbe' },
        { id: 'hob', kind: 'talk', text: "Hob says she'll turn up.", at: 'cobbe-farmhouse', who: 'Hob Cobbe', optional: true },
      ],
    },
    {
      id: 'scrap', title: 'Follow the dog',
      objectives: [
        { id: 'cave', kind: 'go', text: "Scrap knows the way: across the shepherds' track, up to Mossjaw.", at: 'mossjaw-cave' },
        { id: 'wolves', kind: 'fight', text: 'Wolves at the mouth.', at: 'mossjaw-cave', what: 'wolf', count: 3 },
      ],
    },
    {
      id: 'mossjaw', title: 'Mossjaw',
      objectives: [
        { id: 'aldo', kind: 'search', text: "The ewe, what's left of it, and the man who ate it: old Aldo, gone since the Wet Years. He runs from my torch.", at: 'mossjaw-cave', what: 'pit-eater' },
        { id: 'spiders', kind: 'fight', text: 'Spiders in the second chamber.', at: 'mossjaw-cave', what: 'spider', count: 4 },
        { id: 'brood-mother', kind: 'fight', text: 'The brood mother, in the deep tunnel.', at: 'mossjaw-cave', what: 'brood mother' },
        { id: 'wenna', kind: 'talk', text: "Behind her, in a crack too narrow for her: Wenna. Starving, bruised, alive, holding a knife.", at: 'mossjaw-cave', who: 'Wenna' },
      ],
    },
    {
      id: 'the-truth', title: 'She ran',
      objectives: [
        {
          id: 'wenna', kind: 'choose', text: "Hob sold a year of her to the Red Hen for his poppy debt, and beats her when he's sick for it. She'd rather the spiders.", at: 'mossjaw-cave', who: 'Wenna',
          options: [
            { id: 'home', label: '[Take her home]', sets: { wenna: 'home' } },
            { id: 'ada', tone: 'blunt', label: "[Tell Ada] Look at her arms, Ada. Then ask him where she's been 'in service'.", sets: { wenna: 'ada_told' } },
            { id: 'hob', tone: 'hard', label: '[Confront Hob] With my fists.', sets: { wenna: 'hob_beaten' } },
            { id: 'nan', tone: 'kind', label: "[Take her to Nan Wicket] She needs somewhere he isn't. And a trade.", sets: { wenna: 'wenna_nan' } },
          ],
        },
        { id: 'home', kind: 'go', text: 'Bring Wenna out of the hill.', at: 'cobbe-farmhouse' },
      ],
    },
  ],
  rewards: { xp: 160, items: ["Wenna's sling"], other: ["the Cobbes' wool cloak, if Ada was told", 'Brindleford +1'] },
  journal: "Wenna didn't chase a ewe into Mossjaw. She ran from the year of her that Hob sold to the Red Hen. A starving pit-eater left her alone because she gave him her bread.",
  next: [],
};
