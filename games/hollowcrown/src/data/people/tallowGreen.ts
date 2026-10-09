// Tallow Green's people (docs/story/regions/brindle-vale.md, "Tallow Green"): the bible's five named villagers, their
// homes and work in the village's map (src/data/world/tallowGreen.ts), their day, their first words and what they
// mutter as the hero passes. Used by the villagers' spawning and routines (gameplay), their models (characters) and
// dialogue.

import type { Point } from '@voxel/engine/world';
import type { Villager } from './kinds';

const GOODYS_PORCH: Point = [1198, 3036];

export const TALLOW_GREEN_PEOPLE: Villager[] = [
  {
    id: 'goody-thatch', name: 'Goody Thatch', who: 'headwoman, 60; runs the village from her porch', home: 'thatch-house', work: 'thatch-house',
    routine: [{ from: 0, at: 'thatch-house', doing: 'sleep' }, { from: 6, at: 'thatch-house', doing: 'work' }, { from: 8, at: GOODYS_PORCH, doing: 'sit' }, { from: 13, at: 'thatch-house', doing: 'eat' }, { from: 14, at: GOODYS_PORCH, doing: 'sit' }, { from: 20, at: 'thatch-house', doing: 'sleep' }],
    firstWords: "Wipe that look off. This is a village, not a crossroads. We see who comes through.",
    barks: ["Wax and honey kept us alive when bread didn't. Mind the smell.", "Brindleford digs pits. We keep bees. Draw your own conclusions.", 'Mind the oak. It was here before the Regent, and it\'ll be here after.'],
    quests: ['SQ-BV3'],
  },
  {
    id: 'agna-bee', name: 'Agna Bee', who: 'beekeeper, 45; her hives are dying', home: 'bee-house', work: 'agnas-hives',
    routine: [{ from: 0, at: 'bee-house', doing: 'sleep' }, { from: 5, at: 'agnas-hives', doing: 'work' }, { from: 12, at: 'bee-house', doing: 'eat' }, { from: 13, at: 'agnas-hives', doing: 'work' }, { from: 18, at: 'bee-house', doing: 'work' }, { from: 21, at: 'bee-house', doing: 'sleep' }],
    firstWords: "Stand still. They don't mind you if you don't mind them.",
    barks: ['Twelve hives. Four humming.', "Bees know a death in the house before the house does.", { line: "They're back. Listen. You hear that? That's them.", after: 'SQ-BV3' }],
    quests: ['SQ-BV3'],
  },
  {
    id: 'osmund-wicke', name: 'Osmund Wicke', who: 'chandler, 55', home: 'chandlery', work: 'chandlery',
    routine: [{ from: 0, at: 'chandlery', doing: 'sleep' }, { from: 6, at: 'chandlery', doing: 'work' }, { from: 20, at: 'tallow-green-oak', doing: 'sit' }, { from: 22, at: 'chandlery', doing: 'sleep' }],
    firstWords: "Light's cheap. Darkness costs.",
    barks: ['Tallow for the poor, beeswax for the dead. Same flame.', "My boy's hands are full of wax. His head's full of an innkeeper's girl.", 'Since the bell rang, I sell more candles than bread gets eaten.'],
    quests: [],
  },
  {
    id: 'hal-wicke', name: 'Hal Wicke', who: "Osmund's son, 23; in love with Elsa Fenn", home: 'chandlery', work: 'chandlery',
    routine: [
      { from: 0, at: 'chandlery', doing: 'sleep' }, { from: 6, at: 'chandlery', doing: 'work' },
      { from: 7, at: 'tallow-green-green', doing: 'stand', days: { every: 4, on: 3 } }, { from: 13, at: 'chandlery', doing: 'work', days: { every: 4, on: 3 } },
      { from: 18, at: 'ferrymans-rest', doing: 'drink' }, { from: 22, at: 'chandlery', doing: 'sleep' },
    ],
    firstWords: "If you're going to Brindleford, would you take — no. Never mind. Nothing.",
    barks: ["She comes to market every fourth day. I know. I count.", "Twenty silver. For a cook. He wants me gone, that's all.", { line: "Don't look at me like that. I gave it back.", after: 'SQ-BV3' }],
    quests: ['SQ-BV3', 'SQ-BV8'],
  },
  {
    id: 'little-brede', name: 'Little Brede', who: "Agna's daughter, 8; follows the bees", home: 'bee-house',
    routine: [{ from: 0, at: 'bee-house', doing: 'sleep' }, { from: 7, at: 'agnas-hives', doing: 'wander' }, { from: 10, at: 'clover-meadow', doing: 'wander' }, { from: 12, at: 'bee-house', doing: 'eat' }, { from: 13, at: 'tallow-green-green', doing: 'wander' }, { from: 19, at: 'bee-house', doing: 'sleep' }],
    firstWords: "Are you a ghost? Mam says ghosts can't hold bread. Here. Hold this.",
    barks: ['They go to the cold stones and fall asleep.', "I'm not allowed past the oak. I go past the oak.", "The stones hum at night. Not like bees. Like singing with your mouth shut."],
    quests: ['SQ-BV3'],
  },
];
