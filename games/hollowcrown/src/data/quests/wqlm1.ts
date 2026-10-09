// WQ-LM1, The Hermit Who Listens (a wild side quest, found, not given): in a Barrowborn hut on the Lantern Moors, a
// runaway novice has drunk grave-poppy for years to keep hearing the dead. He knows words in the barrow-tongue no
// living man should. Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_FIRE: Point = [654, 656];

export const WQ_LM1: Quest = {
  id: 'WQ-LM1',
  name: 'The Hermit Who Listens',
  act: 'act-1',
  level: 8,
  minutes: 20,
  starts: "found: coming near a hermit's fire by the beehive hut on the moor",
  start: { after: ['MQ04'], found: { at: THE_FIRE, radius: 8 } },
  places: [],
  stages: [
    {
      id: 'the-fire', title: 'Poppy-cups',
      objectives: [
        {
          id: 'osk', kind: 'talk', text: 'An old man by a fire, white poppy-cups round him like a fairy ring. His lips are blue. He\'s talking to the ground.', at: THE_FIRE,
          lines: [
            { who: 'Brother Osk', text: 'Shh. Shh. They\'re saying the old words. Hear? Under. Under the heather.' },
            { who: 'hero', text: 'Who is?' },
            { who: 'Brother Osk', text: "The ones under the stones. The Abbey sends girls to listen, and sews their eyes so they don't look away. I just drink. Drinking's kinder." },
            { who: 'Brother Osk', text: 'You\'re the cold one. Unsworn. They talk about you. They\'re pleased.' },
          ],
        },
        {
          id: 'words', kind: 'take', text: 'He scratches barrow-tongue on a slate with a burnt stick, and hands it over without looking.', at: THE_FIRE, what: "Osk's slate",
          lines: [{ who: 'Brother Osk', text: 'That one means door. That one means the door is a mouth. Don\'t say them aloud near water.' }],
        },
      ],
    },
    {
      id: 'the-poppy', title: 'Kinder',
      objectives: [
        {
          id: 'poppy', kind: 'choose', text: "His stash: a dozen cups of milk, more than enough to kill him. He'll drink it all by spring either way.", at: THE_FIRE,
          options: [
            { id: 'take', tone: 'hard', label: "[Take the poppy] You'll hate me tomorrow. You'll be alive to.", sets: { wq_hermit: 'taken' } },
            { id: 'leave', label: '[Leave it with him]', sets: { wq_hermit: 'left' } },
            { id: 'abbey', label: '[Tell him you\'ll send word to the Abbey]', sets: { wq_hermit: 'abbey' } },
            { id: 'drink', tone: 'sly', label: "[Drink a cup with him] Let's hear what they're saying.", sets: { wq_hermit: 'drank' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 160, items: ["Osk's slate (barrow-tongue)"], other: ['lore: the Listeners, the door that is a mouth'] },
  journal: 'A runaway brother of the Lantern drinks grave-poppy on the moor to hear the dead, and says they talk about me. He says they\'re pleased.',
  next: [],
};
