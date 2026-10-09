// SQ-BV5, The Reeve's Ledger (docs/story/regions/brindle-vale.md): a Regency auditor is coming, and Pell keeps two
// ledgers, the true one hiding the tax he holds back so the village eats. Then a third, from the Wet Years, with
// 'pit' against six names. (Clerk Ansel Pike isn't one of Brindleford's people: the objectives name him in their text.)
// Used by the quest system and the journal.

import type { Quest } from './kinds';

export const SQ_BV5: Quest = {
  id: 'SQ-BV5',
  name: "The Reeve's Ledger",
  act: 'prologue',
  level: 3,
  minutes: 30,
  starts: 'after MQ03: Odo Pell, nervous',
  places: ['reeves-house', 'brindleford', 'ferrymans-rest', 'brindleford-well'],
  stages: [
    {
      id: 'the-auditor', title: 'An auditor on the road',
      objectives: [
        { id: 'pell', kind: 'talk', text: "A clerk from Kingsmere is coming to count Pell's taxes. Pell wants him delayed a day.", at: 'reeves-house', who: 'Odo Pell' },
      ],
    },
    {
      id: 'the-ledgers', title: 'Two ledgers, and a third',
      objectives: [
        { id: 'two', kind: 'search', text: "Two ledgers. The true one keeps a third of the tax back every year, so the village eats.", at: 'reeves-house', what: "the reeve's ledgers" },
        { id: 'third', kind: 'search', text: "An older ledger: the seed grain Pell took for Kingsmere in the Wet Years, house by house. Against six names, later: 'pit'.", at: 'reeves-house', what: 'the Wet Years ledger' },
      ],
    },
    {
      id: 'pike', title: 'Clerk Ansel Pike',
      objectives: [
        { id: 'pike', kind: 'talk', text: "Clerk Ansel Pike: thin, polite, and a box of hanged men's fingers he says is a joke.", at: 'brindleford-well' },
        {
          id: 'ledger', kind: 'choose', text: 'Pike will have his numbers. Which ones is up to me.', at: 'brindleford-well',
          options: [
            { id: 'hidden', label: '[Delay Pike, and say nothing]', sets: { pell_ledger: 'hidden' } },
            { id: 'reported', label: '[Give Pike the true ledger]', sets: { pell_ledger: 'reported' } },
            { id: 'written-off', label: '[Show Pike the risen dead] Write it off. War losses. (after MQ02)', sets: { pell_ledger: 'written_off' } },
            { id: 'confessed', tone: 'blunt', label: '[Make Pell tell the village about the pit ledger] They should hear it from you.', sets: { pell_ledger: 'pell_confessed' } },
          ],
        },
      ],
    },
    {
      id: 'after', title: 'What the village knows',
      objectives: [
        { id: 'pell', kind: 'talk', text: 'Go back to Pell.', at: 'reeves-house', who: 'Odo Pell' },
        { id: 'inn', kind: 'wait', text: "If he told them, the village is sitting in silence at the inn. Old Meg has something for him.", at: 'ferrymans-rest', optional: true },
      ],
    },
  ],
  rewards: { xp: 100, copper: 40, items: [], other: ['60 copper instead, by the choice'] },
  journal: "Pell has fed Brindleford by cheating the Regency for years. In the Wet Years he fed Kingsmere by starving Brindleford, and wrote 'pit' beside six names.",
  next: [],
};
