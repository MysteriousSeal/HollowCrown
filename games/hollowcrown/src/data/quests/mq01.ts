// MQ01, The Stranger at the Ford (docs/story/main-quest-1.md): the game's first quest. Waking robbed at the Pilgrim's
// Shrine at dusk, the road east to Brindleford, the bell that rings without a tongue, the night the famine dead come
// home, and the dawn at the well. Used by the quest system and the journal.

import type { Point } from '@voxel/engine/world';
import type { Quest } from './kinds';

const THE_DEAD_PILGRIM: Point = [560, 3374]; // in the ditch of the Pilgrim Road
const THE_DEAD_MULE: Point = [650, 3420]; // at the Birchwood's edge, two wolves on it

export const MQ01: Quest = {
  id: 'MQ01',
  name: 'The Stranger at the Ford',
  act: 'prologue',
  level: 1,
  minutes: 30,
  starts: 'the game\'s start',
  places: ['pilgrims-shrine', 'birchwood', 'brindleford', 'brindleford-well', 'ferrymans-rest', 'quiet-bell-chapel', 'famine-pit', 'bellwardens-tomb'],
  stages: [
    {
      id: 'waking', title: 'Waking', hour: 19,
      objectives: [
        { id: 'feather', kind: 'search', text: 'A red-dyed hen feather in the mud. Someone left a calling card.', at: 'pilgrims-shrine', what: 'red hen feather' },
        { id: 'bowl', kind: 'take', text: 'A rusty knife and three copper in the offering bowl, left for the dead.', at: 'pilgrims-shrine', what: 'rusty knife' },
        {
          id: 'first-words', kind: 'choose', text: 'Say something. Nobody\'s listening.', at: 'pilgrims-shrine',
          options: [
            { id: 'kind', tone: 'kind', label: 'Thank you, whoever you were.' },
            { id: 'hard', tone: 'hard', label: 'Of course.' },
            { id: 'sly', tone: 'sly', label: 'Well. Lighter for the walk.' },
            { id: 'blunt', tone: 'blunt', label: 'Robbed. Wonderful.' },
          ],
        },
      ],
    },
    {
      id: 'road-east', title: 'The road east',
      objectives: [
        {
          id: 'pilgrim', kind: 'choose', text: 'An old pilgrim woman in the ditch, throat cut. Her jerkin\'s still on her.', at: THE_DEAD_PILGRIM,
          options: [
            { id: 'take', label: '[Take the jerkin] It\'s a cold night. She doesn\'t need it.', sets: { pilgrim_jerkin: 'taken' } },
            { id: 'cover', label: '[Cover her with it]', sets: { pilgrim_jerkin: 'covered' } },
          ],
        },
        { id: 'wolves', kind: 'fight', text: 'Wolves on a dead mule at the Birchwood\'s edge. They\'ve seen me.', at: THE_DEAD_MULE, what: 'wolf', count: 2 },
        { id: 'brindleford', kind: 'go', text: 'Lights by the ford. A village.', at: 'brindleford' },
      ],
    },
    {
      id: 'the-bell', title: 'The bell', hour: 21,
      objectives: [
        { id: 'pell', kind: 'talk', text: 'A man in a nightcap with a sword wants to know why I\'m in my smalls.', at: 'brindleford-well', who: 'Odo Pell' },
      ],
    },
    {
      id: 'the-inn', title: "The Ferryman's Rest",
      objectives: [
        { id: 'garrick', kind: 'talk', text: 'The innkeeper will let me in. On account.', at: 'ferrymans-rest', who: 'Garrick Fenn' },
        {
          id: 'why-here', kind: 'choose', text: 'Garrick asks why I came to the Vale.', at: 'ferrymans-rest', who: 'Garrick Fenn',
          options: [
            { id: 'road', tone: 'kind', label: 'Somebody told me it was beautiful. They were right, so far.', sets: { hero_reason: 'road' } },
            { id: 'work', tone: 'hard', label: "That's my business. The room's yours to sell; sell it.", sets: { hero_reason: 'work' } },
            { id: 'beer', tone: 'sly', label: 'The beer. I heard it was terrible. I had to know.', sets: { hero_reason: 'road' } },
            { id: 'forget', tone: 'blunt', label: 'Nowhere else would have me.', sets: { hero_reason: 'forget' } },
          ],
        },
        { id: 'elsa', kind: 'talk', text: 'Soup, and an old shirt.', at: 'ferrymans-rest', who: 'Elsa Fenn', optional: true },
        { id: 'midnight', kind: 'wait', text: 'The bell has stopped. The silence is worse.', at: 'ferrymans-rest' },
      ],
    },
    {
      id: 'midnight', title: 'Midnight', hour: 0,
      objectives: [
        { id: 'the-hungry', kind: 'fight', text: 'The dead have come down from the hill. They\'re going home.', at: 'brindleford', what: 'the Hungry', count: 4 },
      ],
      sets: { mq01_dead_walked: true },
    },
    {
      id: 'dawn', title: 'Dawn', hour: 6,
      objectives: [
        { id: 'the-well', kind: 'go', text: 'The village has gathered at the well.', at: 'brindleford-well' },
        { id: 'cuthwin', kind: 'talk', text: 'The priest knows where they came from.', at: 'brindleford-well', who: 'Father Cuthwin' },
        { id: 'meg', kind: 'talk', text: 'Old Meg won\'t stop crying.', at: 'brindleford-well', who: 'Old Meg', optional: true },
      ],
    },
  ],
  rewards: { xp: 40, copper: 3, items: ["boatman's coat", 'rusty knife'], other: ["the inn's bed, free in Brindleford"] },
  journal: 'The dead walked into Brindleford tonight: starved villagers, not monsters. One said the reeve put them in a pit. Everyone looks at me.',
  next: ['MQ02'],
};
