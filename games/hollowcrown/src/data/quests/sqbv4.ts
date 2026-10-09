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
        {
          id: 'cuthwin', kind: 'talk', text: 'Cuthwin wants the bell rung once by the living. Not the dead.', at: 'shrine-house', who: 'Father Cuthwin',
          lines: [
            { who: 'Father Cuthwin', text: 'The tongue. You brought it out of there.' },
            { who: 'Father Cuthwin', text: 'That bell has rung for the dead twice now. Once when they were buried and once when they got up. I want it rung once for the living.' },
            { who: 'hero', text: 'Why me?' },
            { who: 'Father Cuthwin', text: "Because I can't climb, and nobody else will go up that hill." },
          ],
        },
      ],
    },
    {
      id: 'the-pin', title: 'A yoke-pin',
      objectives: [
        {
          id: 'tobin', kind: 'talk', text: 'Tobin can forge a new yoke-pin, for two iron bars or thirty copper.', at: 'smithy', who: 'Tobin Harrow',
          lines: [
            { who: 'Tobin Harrow', text: 'Mm.' },
            { who: 'hero', text: 'A yoke-pin. For the bell.' },
            { who: 'Tobin Harrow', text: 'Two bars. Or thirty.' },
            { who: 'Tobin Harrow', text: '...Good.' },
          ],
        },
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
        {
          id: 'story', kind: 'talk', text: "Sit with Cuthwin on the step. He has something he's never told anyone.", at: 'quiet-bell-chapel', who: 'Father Cuthwin',
          lines: [
            { who: 'Father Cuthwin', text: 'You never asked why I left the Lantern. Everyone else did, once. Then they stopped.' },
            { who: 'Father Cuthwin', text: 'The Lector chose a girl of fourteen for a vigil. He asked me to hold her head while Brother Hode sewed her eyes.' },
            { who: 'Father Cuthwin', text: "I held it. For one stitch. Then I let go and ran, and I've been running for twelve years, and I never told anyone, and I never went back for her." },
            { who: 'hero', text: '...' },
            { who: 'Father Cuthwin', text: "Don't. Whatever you were going to say. Just sit." },
          ],
        },
        {
          id: 'rite', kind: 'talk', text: 'He can teach me the Rite of Rest.', at: 'quiet-bell-chapel', who: 'Father Cuthwin',
          lines: [
            { who: 'Father Cuthwin', text: "The Rite of Rest. It isn't magic. It's manners. You tell the dead their names, and that they can stop." },
          ],
        },
      ],
      sets: { cuthwin_story: true, rite_of_rest: true },
    },
  ],
  rewards: { xp: 120, items: [], other: ['Brindleford +1', 'the Rite of Rest'] },
  journal: "The Quiet Bell rang for the living, and the whole village climbed the hill to hear it. Cuthwin told me why he left the Lantern. He held a girl's head for one stitch, and he's been running ever since.",
  next: [],
};
