// SQ-BV2, Kit's Father (docs/story/regions/brindle-vale.md): Kit's father went to Kingsmere for work and never came
// home. He was pressed into the levy, deserted, and is Wren's second in the Greenwood now. Played in stages across the
// game. (Pip Tanner isn't one of Brindleford's people: the objectives name him in their text.) Used by the quest system
// and the journal.

import type { Quest } from './kinds';

export const SQ_BV2: Quest = {
  id: 'SQ-BV2',
  name: "Kit's Father",
  act: 'prologue',
  level: 2,
  minutes: 30,
  starts: 'after SQ-BV1, or the third talk with Kit',
  places: ['cobbe-barn', 'kingsmere', 'hollow-oak', 'brindleford'],
  stages: [
    {
      id: 'the-heron', title: 'A wooden heron',
      objectives: [
        {
          id: 'kit', kind: 'talk', text: 'Kit wants his father found. All he has of him is a whittled heron.', at: 'cobbe-barn', who: 'Kit',
          lines: [
            { who: 'Kit', text: "My da made this. It's a heron. You can tell by the legs." },
            { who: 'Kit', text: "He went to Kingsmere for work. Four winters. Kingsmere's big, but you're from the mountains, you can find anything." },
            { who: 'hero', text: "What's his name?" },
            { who: 'Kit', text: 'Pip Tanner. He laughs like a goose. Ask anyone.' },
          ],
        },
      ],
    },
    {
      id: 'the-levy-roll', title: 'The levy roll',
      objectives: [
        { id: 'roll', kind: 'search', text: "Pip Tanner, on Kingsmere's levy roll: pressed four years ago, deserted three. 'To hang if found.'", at: 'kingsmere', what: 'the levy roll' },
      ],
    },
    {
      id: 'pip', title: 'Pip Tanner',
      objectives: [
        {
          id: 'find-pip', kind: 'talk', text: "Find Pip Tanner among Wren's people, and show him the heron.", at: 'hollow-oak',
          lines: [
            { who: 'Pip Tanner', text: 'Whoever told you my name, they owe me for it.' },
            { who: 'hero', text: 'Kit told me. He sent this.' },
            { who: 'Pip Tanner', text: '...' },
            { who: 'Pip Tanner', text: "I made that the night before the levy came. They don't pay you to go home, the Regent's men. They hang you for it." },
          ],
        },
        {
          id: 'kit', kind: 'choose', text: "He couldn't go home a deserter. Kit is waiting in a barn for an answer.", at: 'hollow-oak',
          lines: [
            { who: 'Pip Tanner', text: 'Does he still laugh at everything? He used to laugh at everything.' },
          ],
          options: [
            { id: 'with-pip', label: '[Bring Kit to the Hollow Oak]', sets: { kit: 'kit_with_pip' } },
            { id: 'home', label: '[Bring Pip home] (Greenhood 20, or a pardon)', sets: { kit: 'pip_home' } },
            { id: 'lie', tone: 'hard', label: "[Tell Kit his father is dead] It's kinder. It has to be.", sets: { kit: 'kit_lied' } },
            { id: 'hanged', label: '[Bring Kit the news] (if Pip was hanged)', sets: { kit: 'pip_hanged' } },
          ],
        },
      ],
    },
    {
      id: 'kit-again', title: 'Back to the barn',
      objectives: [
        {
          id: 'kit', kind: 'talk', text: 'Tell Kit.', at: 'cobbe-barn', who: 'Kit',
          lines: [
            { who: 'Kit', text: 'Well? Did he laugh like a goose?' },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 150, items: ['wooden heron'], other: [] },
  journal: "Kit's father didn't abandon him. He deserted the Regency's levy and couldn't come home. What Kit knows now is what I chose to tell him.",
  next: [],
};
