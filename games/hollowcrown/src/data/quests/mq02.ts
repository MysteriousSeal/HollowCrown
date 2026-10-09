// MQ02, The Quiet Bell (docs/story/main-quest-1.md): up Chapel Hill to the famine pit, the chapel and the oath-iron
// grate only the hero can touch, down through the Bellwarden's Tomb to Sir Hamund, who still keeps his watch. Then
// back to the well, and what Pell says about the pit when no one else can hear. Used by the quest system and the
// journal.

import type { Quest } from './kinds';

export const MQ02: Quest = {
  id: 'MQ02',
  name: 'The Quiet Bell',
  act: 'prologue',
  level: 2,
  minutes: 50,
  starts: 'the end of MQ01: Father Cuthwin and Odo Pell, at the well',
  start: { after: ['MQ01'] },
  places: ['brindleford-well', 'shrine-house', 'famine-pit', 'quiet-bell-chapel', 'bellwardens-tomb'],
  stages: [
    {
      id: 'sent-up', title: 'Sent up the hill',
      objectives: [
        {
          id: 'pell', kind: 'talk', text: "Pell is lending me a sword. He wants it back clean.", at: 'brindleford-well', who: 'Odo Pell',
          lines: [
            { who: 'Odo Pell', text: 'Regency property. Bring it back. Clean.' },
            { who: 'hero', text: 'And if I bring it back bloody?' },
            { who: 'Odo Pell', text: "Then bring it back. I'm not a fussy man. I'm an accountable one." },
          ],
        },
        {
          id: 'cuthwin', kind: 'talk', text: 'Cuthwin has lantern oil, and a story about a knight buried with the bell.', at: 'brindleford-well', who: 'Father Cuthwin',
          lines: [
            { who: 'Father Cuthwin', text: 'Lantern oil. It heals, a little. Faith does the rest, or doesn\'t.' },
            { who: 'Father Cuthwin', text: 'Sir Hamund, the Bellwarden. They buried him with the bell\'s tongue in his fist, to ring it if the dead rose.' },
            { who: 'hero', text: 'It rang.' },
            { who: 'Father Cuthwin', text: 'It rang.' },
          ],
        },
        { id: 'oil', kind: 'take', text: 'A flask of lantern oil.', at: 'brindleford-well', what: 'lantern oil' },
      ],
    },
    {
      id: 'the-pit', title: 'The famine pit',
      objectives: [
        { id: 'pit', kind: 'search', text: 'A long low mound against the chapel wall. The turf is broken from inside.', at: 'famine-pit' },
        { id: 'sickle', kind: 'take', text: "Grave-poppy, white as frost, the heads cut clean. A sickle with a mill's mark.", at: 'famine-pit', what: "Jory's sickle" },
        {
          id: 'rite', kind: 'choose', text: 'Sixty of the Wet Years\' dead, buried without rites. A silver a grave, and nobody had one.', at: 'famine-pit',
          lines: [{ who: 'hero', text: 'Somebody should say something.' }],
          options: [
            { id: 'bless', label: "[Say Cuthwin's words over them] (if you asked him)", sets: { famine_pit: 'blessed' } },
            { id: 'leave', label: '[Leave them]', sets: { famine_pit: 'untouched' } },
          ],
        },
      ],
    },
    {
      id: 'the-chapel', title: 'The chapel',
      objectives: [
        { id: 'skeletons', kind: 'fight', text: 'Two skeletons at the altar, still kneeling until I came in.', at: 'quiet-bell-chapel', what: 'skeleton', count: 2 },
        {
          id: 'grate', kind: 'search', text: 'An oath-iron grate over the stairs, white with frost in summer.', at: 'quiet-bell-chapel', who: 'Father Cuthwin',
          lines: [
            { who: 'Father Cuthwin', text: 'Don\'t — it burns. It took the skin off my palms.' },
            { who: 'hero', text: "It's cold. That's all." },
            { who: 'Father Cuthwin', text: "...It's only iron to you." },
          ],
        },
      ],
      sets: { hero_unsworn_seen: true },
    },
    {
      id: 'the-tomb', title: "The Bellwarden's Tomb",
      objectives: [
        { id: 'ossuary', kind: 'go', text: 'Down through the Ossuary.', at: 'bellwardens-tomb' },
        { id: 'bell-hall', kind: 'fight', text: 'The Bell Hall: the ringers are still here. So is the drop.', at: 'bellwardens-tomb', what: 'bell-ringer ghost', count: 3 },
        {
          id: 'page', kind: 'take', text: 'A journal page in a niche.', at: 'bellwardens-tomb', what: "the Bellwarden's page", optional: true,
          lines: [{ who: 'the Bellwarden\'s page', text: 'If the crown fails, the bell will ring itself. Then someone must go to the Lantern. God help them if the Lantern is what it was when I was young.' }],
        },
      ],
    },
    {
      id: 'hamund', title: 'Sir Hamund',
      objectives: [
        { id: 'fight', kind: 'fight', text: "The Warden's Rest. Sir Hamund, the bell's tongue in his fist.", at: 'bellwardens-tomb', what: 'Sir Hamund' },
        {
          id: 'watch', kind: 'choose', text: 'Half-beaten, he stops, and stares at me.', at: 'bellwardens-tomb',
          lines: [
            { who: 'Sir Hamund', text: "Unsworn. You're not of the Oath. You can carry what we can't." },
            { who: 'Sir Hamund', text: 'The crown is broken. Go to the Lantern... no. Don\'t trust the Lantern. Trust what the Lantern fears.' },
          ],
          options: [
            { id: 'fight', label: '[Fight to the end]', sets: { hamund: 'destroyed' } },
            { id: 'kind', tone: 'kind', label: 'Your watch is over. Rest.', sets: { hamund: 'rested' } },
            { id: 'blunt', tone: 'blunt', label: "Your watch is over. Put it down.", sets: { hamund: 'rested' } },
          ],
        },
        { id: 'tongue', kind: 'take', text: 'The Bell-Tongue.', at: 'bellwardens-tomb', what: 'the Bell-Tongue' },
      ],
    },
    {
      id: 'back-at-the-well', title: 'Back at the well',
      objectives: [
        {
          id: 'pell', kind: 'choose', text: 'Pell, alone, if I mention the pit.', at: 'brindleford-well', who: 'Odo Pell',
          lines: [
            { who: 'Odo Pell', text: 'There was no money for graves. There was no money for anything.' },
            { who: 'Odo Pell', text: 'I dug that pit myself, with Dunstan and the Cobbes. I said the words I knew. I didn\'t know the right ones.' },
          ],
          options: [
            { id: 'kind', tone: 'kind', label: 'You did what you could. That has to be worth something.', sets: { pell_answer: 'kind' } },
            { id: 'hard', tone: 'hard', label: "You dug it. You filled it. Don't ask me to bless it.", sets: { pell_answer: 'hard' } },
          ],
        },
      ],
    },
  ],
  rewards: { xp: 120, copper: 20, items: ['the Bell-Tongue', "the reeve's old sword"], other: ["Hamund's sword (destroyed) or Hamund's blessing (rested)"] },
  journal: "The bell's tongue was in a dead knight's fist. He called me unsworn, and told me to trust what the Lantern fears. Oath-iron burns Cuthwin. It doesn't burn me.",
  next: ['MQ03', 'SQ-BV4'],
};
