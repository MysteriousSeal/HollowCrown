// SQ-BV4, A Bell With No Tongue (docs/story/regions/brindle-vale.md): Cuthwin wants the Quiet Bell rung by the living.
// A new pin from the smith, a ruined tower to climb, the whole village up the hill at dawn, and on the chapel step
// the reason he ran from the Lantern. Used by the quest system and the journal.

import type { Quest } from './kinds';

export const SQ_BV4: Quest = {
  id: 'SQ-BV4',
  name: 'A Bell With No Tongue',
  act: 'prologue',
  level: 3,
  minutes: 25,
  starts: "after MQ02: Father Cuthwin, given the Bell-Tongue",
  places: ['shrine-house', 'smithy', 'quiet-bell-chapel', 'famine-pit'],
  stages: [
    {
      id: 'the-living', title: 'Rung by the living',
      objectives: [
        { id: 'cuthwin', kind: 'talk', text: 'Cuthwin wants the bell rung once by the living. Not the dead.', at: 'shrine-house', who: 'Father Cuthwin' },
      ],
    },
    {
      id: 'the-pin', title: 'A yoke-pin',
      objectives: [
        { id: 'tobin', kind: 'talk', text: 'Tobin can forge a new yoke-pin, for two iron bars or thirty copper.', at: 'smithy', who: 'Tobin Harrow' },
        { id: 'pin', kind: 'take', text: 'Take the pin.', at: 'smithy', what: 'yoke-pin' },
      ],
    },
    {
      id: 'the-tower', title: 'The half-tower',
      objectives: [
        { id: 'ladder', kind: 'search', text: "Mend the tower's ladder. The ledges above won't wait for it.", at: 'quiet-bell-chapel', what: 'a rotten ladder' },
        { id: 'tongue', kind: 'go', text: 'Climb to the bell and hang the tongue.', at: 'quiet-bell-chapel' },
      ],
    },
    {
      id: 'dawn', title: 'Ring it', hour: 6,
      objectives: [
        { id: 'ring', kind: 'go', text: 'Ring it at dawn.', at: 'quiet-bell-chapel' },
        { id: 'village', kind: 'wait', text: "All Brindleford is coming up the hill. Old Meg has flowers for the pit.", at: 'famine-pit' },
      ],
      sets: { bv_bell_rung: true },
    },
    {
      id: 'the-step', title: 'The chapel step',
      objectives: [
        { id: 'story', kind: 'talk', text: "Sit with Cuthwin on the step. He has something he's never told anyone.", at: 'quiet-bell-chapel', who: 'Father Cuthwin' },
        { id: 'rite', kind: 'talk', text: 'He can teach me the Rite of Rest.', at: 'quiet-bell-chapel', who: 'Father Cuthwin' },
      ],
      sets: { cuthwin_story: true, rite_of_rest: true },
    },
  ],
  rewards: { xp: 120, items: [], other: ['Brindleford +1', 'the Rite of Rest'] },
  journal: "The Quiet Bell rang for the living, and the whole village climbed the hill to hear it. Cuthwin told me why he left the Lantern. He held a girl's head for one stitch, and he's been running ever since.",
  next: [],
};
