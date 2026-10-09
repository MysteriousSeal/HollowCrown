// WQ-BV3, Iron Water (a wild side quest, found, not given): the holy well in Brindle Woods whose water nobody drinks.
// At night a girl with sewn eyes sits on its rim: the novice Cuthwin held for one stitch, who got out years later and
// came this far. Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_WELL: Point = [1003, 3022];

export const WQ_BV3: Quest = {
  id: 'WQ-BV3',
  name: 'Iron Water',
  act: 'prologue',
  level: 3,
  minutes: 20,
  starts: 'found: coming near the holy well in Brindle Woods',
  start: { after: ['MQ02'], found: { at: THE_WELL, radius: 5 } },
  places: ['shrine-house'],
  stages: [
    {
      id: 'the-well', title: 'Iron water',
      objectives: [
        { id: 'water', kind: 'search', text: 'The well-water tastes of iron. On the rim, scratched with a nail: a lantern, crossed out.', at: THE_WELL, what: 'the well-rim' },
        { id: 'night', kind: 'wait', text: 'Come back after dark.', at: THE_WELL },
      ],
    },
    {
      id: 'the-girl', title: 'The girl on the rim', hour: 23,
      objectives: [
        {
          id: 'ghost', kind: 'talk', text: 'A girl on the well\'s rim, her eyes sewn shut with black thread. She is listening to the water.', at: THE_WELL,
          lines: [
            { who: 'the girl at the well', text: "Don't hold my head. Everybody holds my head." },
            { who: 'hero', text: "I won't. What's your name?" },
            { who: 'the girl at the well', text: 'They took it at the Abbey. They said a Listener doesn\'t need one. I walked till the voices stopped. They stop under water.' },
            { who: 'the girl at the well', text: 'There was a brother who let go. One stitch, and he let go and ran. I wanted to tell him it was the right thing. Too late.' },
          ],
        },
        {
          id: 'what-now', kind: 'choose', text: 'She\'s waiting for something. Her name, or the brother who ran.', at: THE_WELL,
          options: [
            { id: 'rest', tone: 'kind', label: '[The Rite of Rest] You can stop listening now.', sets: { wq_iron_water: 'rested' } },
            { id: 'cuthwin', label: '[Bring Cuthwin here]', sets: { wq_iron_water: 'cuthwin' } },
            { id: 'leave', label: '[Leave her to the water]', sets: { wq_iron_water: 'left' } },
          ],
        },
      ],
    },
    {
      id: 'cuthwin', title: 'The brother who ran',
      objectives: [
        {
          id: 'cuthwin', kind: 'talk', text: 'Tell Cuthwin who is sitting on the well.', at: 'shrine-house', who: 'Father Cuthwin', optional: true,
          lines: [
            { who: 'Father Cuthwin', text: '...She got out.' },
            { who: 'Father Cuthwin', text: 'Twelve years I\'ve prayed she was dead. That\'s the kind of priest I am.' },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 90, items: ['a Listener\'s wax tablet'], other: ['lore: the Abbey\'s Listeners'] },
  journal: 'The girl Cuthwin held for one stitch walked out of the Abbey, all the way to a well in Brindle Woods, to stop hearing the dead. The water was the only thing that worked.',
  next: [],
};
