// SQ-BV1, The Flour Thief (docs/story/regions/brindle-vale.md): flour goes missing from Brindle Mill. The orphan Dunstan
// blames takes only the spillings; the thief is the miller's own son, trading sacks for poppy-milk to talk to his dead
// mother. Used by the quest system and the journal.

import type { Quest } from './kinds';

export const SQ_BV1: Quest = {
  id: 'SQ-BV1',
  name: 'The Flour Thief',
  act: 'prologue',
  level: 2,
  minutes: 25,
  starts: 'after MQ01: Dunstan, or the notice board',
  start: { after: ['MQ01'], giver: 'Dunstan' },
  places: ['brindle-mill', 'brindleford-notices', 'famine-pit', 'hanging-oak', 'herbalists-cottage', 'shrine-house', 'reeves-house'],
  stages: [
    {
      id: 'the-miller', title: 'Sacks that walk',
      objectives: [
        {
          id: 'dunstan', kind: 'talk', text: "Dunstan's losing flour from his loft at night. He says it's the orphan.", at: 'brindle-mill', who: 'Dunstan',
          lines: [
            { who: 'Dunstan', text: "Sacks don't walk. Mine do. Two a week, out of a locked loft." },
            { who: 'hero', text: 'Who has a key?' },
            { who: 'Dunstan', text: "Me. The boy. And that orphan has fingers like a key. Sit up there one night. I'll pay." },
          ],
        },
      ],
    },
    {
      id: 'the-loft', title: 'A night in the loft', hour: 23,
      objectives: [
        { id: 'watch', kind: 'wait', text: 'Wait in the loft. Quietly.', at: 'brindle-mill' },
        {
          id: 'kit', kind: 'search', text: "Kit, sweeping spilled flour into a rag. He hasn't touched a sack.", at: 'brindle-mill', who: 'Kit',
          lines: [
            { who: 'Kit', text: "It's spilled! Spilled's nobody's. Everyone knows that." },
            { who: 'hero', text: 'Go home, Kit.' },
            { who: 'Kit', text: "Haven't got one. Don't tell him." },
          ],
        },
        { id: 'jory', kind: 'search', text: "Jory, loading two sacks on a hand-cart. Sweating, in the cold. His lips are blue.", at: 'brindle-mill', who: 'Jory' },
      ],
    },
    {
      id: 'follow-jory', title: 'Follow the cart', hour: 1,
      objectives: [
        {
          id: 'the-pit', kind: 'go', text: 'He went up to the famine pit. He is talking to someone.', at: 'famine-pit',
          lines: [
            { who: 'Jory', text: "I know, Mam. Soon. I know. It's cold up here. I brought you some." },
          ],
        },
        { id: 'the-oak', kind: 'go', text: 'Then to the Hanging Oak, with the flour.', at: 'hanging-oak' },
        {
          id: 'the-trade', kind: 'search', text: 'Flour for vials of milk. Somebody here is doing well out of the dead.', at: 'hanging-oak', what: 'poppy-milk vial',
          lines: [
            { who: 'a Red Hen man', text: "Two sacks. Last week it was two sacks. Next week it's three, or it's your da's wheel." },
            { who: 'Jory', text: 'Three. Yes. Give it here.' },
          ],
        },
      ],
    },
    {
      id: 'confront', title: 'Jory',
      objectives: [
        {
          id: 'jory', kind: 'talk', text: 'Have it out with Jory, at the mill.', at: 'brindle-mill', who: 'Jory',
          lines: [
            { who: 'Jory', text: 'You followed me. Up the hill. In the dark. Brave.' },
            { who: 'hero', text: 'You were talking to someone at the pit.' },
            { who: 'Jory', text: "My mam. She went in with the first cart, the winter we ate the seed. She's not angry. She's just cold." },
            { who: 'Jory', text: "The milk lets me hear her. Without it there's just the wheel." },
          ],
        },
        {
          id: 'what-now', kind: 'choose', text: 'His mother is in the pit. The poppy lets him hear her. What happens to him now is up to me.', at: 'brindle-mill', who: 'Jory',
          lines: [
            { who: 'Jory', text: 'So. What happens to me?' },
          ],
          options: [
            { id: 'tell-dunstan', label: '[Tell Dunstan]', sets: { bv_flour: 'jory_told' } },
            { id: 'quiet', label: '[Make him stop, and pay it back quietly]', sets: { bv_flour: 'jory_quiet' } },
            { id: 'reeve', label: '[Report him to Pell]', sets: { bv_flour: 'jory_reeve' } },
            { id: 'weaned', tone: 'kind', label: "[Take him to Cuthwin and Nan Wicket] You'll still hear her. Just not through that.", sets: { bv_flour: 'jory_weaned' } },
          ],
        },
        {
          id: 'speak-for-kit', kind: 'choose', text: "Kit sweeps up the spillings. Dunstan could use someone who doesn't steal.", at: 'brindle-mill', who: 'Dunstan', optional: true,
          lines: [
            { who: 'Dunstan', text: "The orphan? He's still up my loft every night?" },
          ],
          options: [
            { id: 'speak', label: "[Speak for Kit] He's been cleaning your floor for nothing. Pay him in bread.", sets: { kit_at_mill: true } },
            { id: 'leave', label: '[Leave it]' },
          ],
        },
      ],
    },
    {
      id: 'after', title: 'Sweating it out',
      objectives: [
        {
          id: 'nan', kind: 'talk', text: "Nan Wicket has a draught for the sweats. If anyone fetches it.", at: 'herbalists-cottage', who: 'Nan Wicket', optional: true,
          lines: [
            { who: 'Nan Wicket', text: "Willowbark, hop, a bit of something I won't name. He'll sweat. He'll curse you. Give it him anyway." },
          ],
        },
        {
          id: 'cuthwin', kind: 'talk', text: 'Cuthwin will sit with Jory. Somebody has to pay Nan, and come back twice.', at: 'shrine-house', who: 'Father Cuthwin', optional: true,
          lines: [
            { who: 'Father Cuthwin', text: "I'll sit with him. I know what the nights are like, at the end of it. Pay Nan. And come back." },
          ],
        },
        {
          id: 'paid', kind: 'talk', text: 'Tell Dunstan his flour has stopped walking.', at: 'brindle-mill', who: 'Dunstan',
          lines: [
            { who: 'Dunstan', text: 'So. My own boy.' },
            { who: 'Dunstan', text: "Take the money. Don't come back to the mill for a while." },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 80, copper: 25, items: ['flour sack'], other: [] },
  journal: "Jory has been trading his father's flour for poppy-milk at the Hanging Oak, so he can talk to his mother in the famine pit. The Red Hen want more each week.",
  next: ['SQ-BV2'],
};
