// MQ03, The Red Hen (docs/story/main-quest-1.md): Pell's bounty on the man who robbed the hero. Red feathers to the
// Hanging Oak, the Red Hen camp in the Birchwood, Wat in the stock and Hesper Rowe chained in the back tent: the dead
// pilgrim's daughter. Then Brannoc, beaten, and who decides what happens to him. (Brannoc and Hesper aren't villagers:
// they speak in lines.) Used by the quest system and the journal.

import type { Quest } from './kinds';

export const MQ03: Quest = {
  id: 'MQ03',
  name: 'The Red Hen',
  act: 'prologue',
  level: 3,
  minutes: 45,
  starts: 'MQ02 done, or asking Pell about the robbery',
  places: ['reeves-house', 'ferrymans-rest', 'hanging-oak', 'red-hen-camp', 'brindleford-well', 'herbalists-cottage', 'cobbe-farmhouse'],
  stages: [
    {
      id: 'the-bounty', title: 'Alive to hang, dead to bury',
      objectives: [
        {
          id: 'pell', kind: 'talk', text: 'Pell has a bounty out on the man who robbed me.', at: 'reeves-house', who: 'Odo Pell',
          lines: [
            { who: 'Odo Pell', text: 'Brannoc Mabb. Fifty copper. Alive to hang, dead to bury. I\'m not particular about the order.' },
          ],
        },
        {
          id: 'garrick', kind: 'talk', text: 'Garrick knows the feather.', at: 'ferrymans-rest', who: 'Garrick Fenn', optional: true,
          lines: [
            { who: 'Garrick Fenn', text: 'Brannoc. Says he\'s Greenhood. The Greenhood says he isn\'t. Both are lying a little.' },
          ],
        },
      ],
    },
    {
      id: 'the-trail', title: 'Red feathers',
      objectives: [
        { id: 'oak', kind: 'go', text: 'Red feathers along the South Road, to the Hanging Oak.', at: 'hanging-oak' },
        {
          id: 'hollow', kind: 'take', text: 'A note in the hollow, and a vial of grave-poppy milk.', at: 'hanging-oak', what: 'a note',
          lines: [{ who: 'a note', text: 'Wednesday, the miller\'s sacks, and the white.' }],
        },
      ],
    },
    {
      id: 'the-camp', title: 'The Red Hen camp',
      objectives: [
        { id: 'bandits', kind: 'fight', text: 'A palisade in a birch clearing. Five of them at the fire.', at: 'red-hen-camp', what: 'Red Hen bandit', count: 5 },
        { id: 'wat', kind: 'search', text: "Wat, Tobin's apprentice, in the stock by the fire.", at: 'red-hen-camp', who: 'Wat', optional: true },
        {
          id: 'hesper', kind: 'talk', text: 'In the back tent, chained: a woman. She asks for her mother.', at: 'red-hen-camp',
          lines: [
            { who: 'Hesper Rowe', text: 'Is she with you? My mother. Grey shawl. She walks slow.' },
            { who: 'hero', text: '...' },
            { who: 'Hesper Rowe', text: "Don't. I know that face. I've made it." },
          ],
        },
        { id: 'chest', kind: 'take', text: 'My things, in a chest: twelve copper and a good pack.', at: 'red-hen-camp', what: "traveller's pack" },
      ],
    },
    {
      id: 'brannoc', title: 'Brannoc Mabb',
      objectives: [
        { id: 'fight', kind: 'fight', text: 'Brannoc Mabb, with a cleaver.', at: 'red-hen-camp', what: 'Brannoc Mabb' },
        {
          id: 'judgement', kind: 'choose', text: 'Brannoc, beaten, grinning. Hesper is watching.', at: 'red-hen-camp',
          lines: [
            { who: 'Brannoc Mabb', text: "I'm Greenhood, me. Wren's man. You hang me, the woods'll remember." },
          ],
          options: [
            { id: 'hanged', label: '[Bring him to Pell to hang]', sets: { bv_red_hen: 'hanged' } },
            { id: 'killed', label: '[Kill him here]', sets: { bv_red_hen: 'killed' } },
            { id: 'hesper', tone: 'kind', label: "[Let Hesper decide] It was done to you. It's yours.", sets: { bv_red_hen: 'hesper_judged' } },
            { id: 'wren', label: "[Send him to Wren] Let his own people have him.", sets: { bv_red_hen: 'to_wren' } },
            { id: 'spared', tone: 'sly', label: '[Let him go for his purse] Thirty copper buys a lot of forgetting.', sets: { bv_red_hen: 'spared' } },
          ],
        },
      ],
    },
    {
      id: 'hesper-after', title: 'Hesper',
      objectives: [
        {
          id: 'safe', kind: 'choose', text: 'Hesper has nowhere to go.', at: 'red-hen-camp',
          lines: [{ who: 'Hesper Rowe', text: 'Where now? Tell me where. I can\'t think of one.' }],
          options: [
            { id: 'nan', label: "[Take her to Nan Wicket and the Cobbes]", sets: { hesper_safe: true } },
            { id: 'inn', label: '[Leave her at the inn]', sets: { hesper_safe: false } },
          ],
        },
        { id: 'pell', kind: 'talk', text: 'Tell Pell. Collect.', at: 'brindleford-well', who: 'Odo Pell' },
      ],
    },
  ],
  rewards: { xp: 150, copper: 50, items: ["traveller's pack"], other: ['the Red Hen\'s Bane, if Brannoc was killed'] },
  journal: "The Red Hen robbed me and murdered an old pilgrim on the road. Her daughter was chained in their tent. Brannoc Mabb's fate is settled. Hesper's isn't.",
  next: ['MQ04', 'SQ-BV5', 'SQ-BV8'],
};
