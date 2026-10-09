// How the bot plays, as data (who uses it: bot/plan.ts): the replies it picks, and how patient it is. Change these to
// play another way through the story.

import type { ChoiceOption } from '../data/quests';

export const POLICY = {
  // A reply chosen outright, by quest and objective ('MQ01/pilgrim'): the option's id.
  replies: {
    'MQ01/first-words': 'kind', // a thank-you to whoever left the knife
    'MQ01/pilgrim': 'cover', // her jerkin left on her: the story's gentler road
    'MQ01/why-here': 'road', // came for the Vale itself
  } as Record<string, string>,
  // Otherwise, the first of these tones offered; none of them: the first reply.
  tones: ['kind', 'blunt', 'sly', 'hard'] as Array<NonNullable<ChoiceOption['tone']>>,
  // Optional objectives (Elsa's soup, Old Meg) are played before the stage's last required one ends it.
  playOptional: true,
  // Seconds of game time on an objective before giving it up (an optional one only: the story can't go on without the rest).
  giveUpAfter: 90,
  // Seconds of game time a line stays up before the bot reads on, and before it answers a question.
  readLine: 1.1,
  thinkReply: 1.6,
  // How near a hostile must come (tiles) before the bot turns to fight it.
  fightRange: 10,
};

// The reply to pick of `options`, asked by objective `objective` of `quest`: the one the policy names, else the first of
// its tones offered, else the first.
export function chooseReply(quest: string, objective: string, options: ChoiceOption[]): number {
  const named = POLICY.replies[`${quest}/${objective}`];
  const byId = options.findIndex((o) => o.id === named);
  if (byId >= 0) return byId;
  for (const tone of POLICY.tones) {
    const byTone = options.findIndex((o) => o.tone === tone);
    if (byTone >= 0) return byTone;
  }
  return 0;
}
