// Brindleford's people (docs/story/regions/brindle-vale.md, "Brindleford"): everyone the bible names, their home and
// work in the village's map (src/data/world/brindleford.ts), their day, their first words and what they mutter as the
// hero passes. Used by the villagers' spawning and routines (gameplay), their models (characters) and dialogue.

import type { Point } from '@voxel/engine/world';
import type { Villager } from './kinds';

// Spots in and round the village that aren't places of their own.
const THE_FORD: Point = [866, 3350]; // Garrick's dawn; Bran's traps, under the ford
const THE_RIVERBANK: Point = [862, 3346]; // the west bank, by the Fletchers'
const MEGS_DOORSTEP: Point = [924, 3348];
const ORRS_DOORSTEP: Point = [934, 3357];
const HALFWAY_UP_THE_CHAPEL_PATH: Point = [1040, 3230]; // Cuthwin, at dusk, never further
const THE_RED_HENS_STOCK: Point = [617, 3557]; // Wat's, by the camp's fire, until he's freed
const THE_SOUTH_PASTURES: Point = [1030, 3500]; // Wenna's ewes, below the Hanging Oak

export const BRINDLEFORD_PEOPLE: Villager[] = [
  // The inn.
  {
    id: 'garrick-fenn', name: 'Garrick Fenn', who: 'innkeeper, once the ferryman', home: 'ferrymans-rest', work: 'ferrymans-rest',
    routine: [{ from: 0, at: 'ferrymans-rest', doing: 'sleep' }, { from: 5, at: THE_FORD, doing: 'stand' }, { from: 7, at: 'ferrymans-rest', doing: 'work' }, { from: 20, at: 'ferrymans-rest', doing: 'sit' }],
    firstWords: "Wipe your feet. The floor's the only thing in here I've paid for.",
    barks: ["Ferry's sunk. So's the ferryman, near enough.", "Pay first. The dead don't, and I've had my fill of them.", "River's quiet. I don't like it quiet."],
    quests: ['MQ01', 'MQ04', 'MQ11', 'SQ-BV8'],
    bed: { line: "Bed's aired. Sheets are mostly clean. Up the stair, second door, don't mind the noises.", yes: '[Sleep till morning]', no: 'Not yet.' },
  },
  {
    id: 'elsa-fenn', name: 'Elsa Fenn', who: 'cook, 24, Garrick\'s daughter', home: 'ferrymans-rest', work: 'ferrymans-rest',
    routine: [
      { from: 0, at: 'ferrymans-rest', doing: 'sleep' }, { from: 5, at: 'ferrymans-rest', doing: 'work' },
      { from: 6, at: 'tallow-green', doing: 'travel', days: { every: 4, on: 3 } }, { from: 13, at: 'ferrymans-rest', doing: 'work', days: { every: 4, on: 3 } },
      { from: 14, at: 'brindleford-well', doing: 'work' }, { from: 15, at: 'ferrymans-rest', doing: 'work' }, { from: 23, at: 'ferrymans-rest', doing: 'sleep' },
    ],
    firstWords: "Soup's on. Sit before it walks off.",
    barks: ['Hal Wicke brought candles again. We\'ve candles for a year.', 'Eat. You look like the hill spat you out.', 'Da talks to the river. Don\'t tell him I told you.'],
    quests: ['SQ-BV8'],
  },

  // The square.
  {
    id: 'odo-pell', name: 'Odo Pell', who: "the Regency's reeve; two ledgers", home: 'reeves-house', work: 'reeves-house',
    routine: [{ from: 0, at: 'reeves-house', doing: 'sleep' }, { from: 7, at: 'reeves-house', doing: 'work' }, { from: 12, at: 'brindleford-notices', doing: 'stand' }, { from: 14, at: 'reeves-house', doing: 'work' }, { from: 21, at: 'reeves-house', doing: 'sleep' }],
    firstWords: 'In the name of the Lord Regent — why are you in your smalls?',
    barks: ['Taxes are not cruelty. Taxes are arithmetic.', 'Move along. The Regency sees you.', 'Every name in this village is in my book. Every one.'],
    quests: ['MQ02', 'MQ03', 'SQ-BV5'],
  },
  {
    id: 'father-cuthwin', name: 'Father Cuthwin', who: 'priest, once of the Lantern', home: 'shrine-house', work: 'shrine-house',
    routine: [{ from: 0, at: 'shrine-house', doing: 'sleep' }, { from: 6, at: 'shrine-house', doing: 'pray' }, { from: 9, at: 'shrine-house', doing: 'work' }, { from: 18, at: HALFWAY_UP_THE_CHAPEL_PATH, doing: 'stand' }, { from: 20, at: 'shrine-house', doing: 'pray' }, { from: 22, at: 'shrine-house', doing: 'sleep' }],
    firstWords: 'The bell rang. Forty years without a tongue, and it rang.',
    barks: ['The Lantern taught me to keep a light. Not what to do with what it shows.', "Pray if you like. I've stopped asking what for.", "Don't go up the hill after dark. I don't."],
    quests: ['MQ02', 'SQ-BV4'],
  },
  {
    id: 'tobin-harrow', name: 'Tobin Harrow', who: 'smith, a man of one word', home: 'smithy', work: 'smithy',
    routine: [{ from: 0, at: 'smithy', doing: 'sleep' }, { from: 6, at: 'smithy', doing: 'work' }, { from: 19, at: 'ferrymans-rest', doing: 'drink' }, { from: 23, at: 'smithy', doing: 'sleep' }],
    firstWords: 'Mm.',
    barks: ['Mm.', 'No.', "Boy's not a coward. Mm."],
    quests: ['SQ-BV7'],
  },
  {
    id: 'wat', name: 'Wat', who: "the smith's apprentice, 16; sleeps in the loft", home: 'smithy', work: 'smithy',
    routine: [{ from: 0, at: 'smithy', doing: 'sleep' }, { from: 6, at: 'smithy', doing: 'work' }, { from: 20, at: 'brindleford-well', doing: 'sit' }, { from: 22, at: 'smithy', doing: 'sleep' }],
    firstWords: "I'm not a coward. I just didn't want to hurt that old woman.",
    barks: ['Master Tobin says I swing like a drowning cat.', 'They tied her to a post. I just... ran.', "Don't tell him where you found me."],
    quests: ['SQ-BV7'],
    away: { until: 'SQ-BV7', at: THE_RED_HENS_STOCK, doing: 'held' },
  },
  {
    id: 'nan-wicket', name: 'Nan Wicket', who: 'herbalist, 70', home: 'herbalists-cottage', work: 'herbalists-cottage',
    routine: [{ from: 0, at: 'herbalists-cottage', doing: 'sleep' }, { from: 5, at: 'hay-meadows', doing: 'gather' }, { from: 9, at: 'herbalists-cottage', doing: 'work' }, { from: 21, at: 'herbalists-cottage', doing: 'sleep' }],
    firstWords: "Chew this. Don't swallow it, you'll grow a tail.",
    barks: ["Poppy stops the pain. Then it stops everything else.", "Seventy winters, half of them hungry. Don't tell me about pain.", "I've stitched better than you. Sit still."],
    quests: ['MQ03'],
  },

  // The mill.
  {
    id: 'dunstan', name: 'Dunstan', who: 'the miller', home: 'brindle-mill', work: 'brindle-mill',
    routine: [{ from: 0, at: 'brindle-mill', doing: 'sleep' }, { from: 5, at: 'brindle-mill', doing: 'work' }, { from: 21, at: 'brindle-mill', doing: 'sleep' }],
    firstWords: "Sacks don't walk. Mine do.",
    barks: ["Jory? Asleep. He's always asleep.", 'Sacks go missing at night. So does the boy.', "Wheel turns. That's all a mill's for."],
    quests: ['SQ-BV1'],
  },
  {
    id: 'jory', name: 'Jory', who: "Dunstan's son, 20; a sleeper, blue at the lips", home: 'brindle-mill', work: 'brindle-mill',
    routine: [
      { from: 0, at: 'famine-pit', doing: 'gather' }, { from: 4, at: 'brindle-mill', doing: 'sleep' }, { from: 14, at: 'brindle-mill', doing: 'work' },
      { from: 20, at: 'hanging-oak', doing: 'stand', days: { every: 7, on: 2 } }, { from: 22, at: 'famine-pit', doing: 'gather' },
    ],
    firstWords: 'Mill\'s closed. Go away.',
    barks: ['...cold. Is it cold?', "Don't look at my mouth.", 'I said it\'s closed.'],
    quests: ['SQ-BV1'],
  },

  // The Cobbe farm.
  {
    id: 'kit', name: 'Kit', who: 'orphan, 10; sleeps in the Cobbes\' barn', home: 'cobbe-barn',
    routine: [{ from: 0, at: 'cobbe-barn', doing: 'sleep' }, { from: 6, at: 'brindleford-well', doing: 'wander' }, { from: 10, at: 'holt-house', doing: 'wander' }, { from: 13, at: 'hay-meadows', doing: 'wander' }, { from: 17, at: 'brindleford-well', doing: 'wander' }, { from: 21, at: 'cobbe-barn', doing: 'sleep' }],
    firstWords: "You've got no shoes either! We're the same!",
    barks: ["I found a tooth! Not a person's. Probably.", "The Holt house is mine. Don't tell the reeve.", 'Can you kill a dead man? Again, I mean?'],
    quests: ['SQ-BV1', 'SQ-BV2'],
  },
  {
    id: 'hob-cobbe', name: 'Hob Cobbe', who: 'farmer, 45; owes the Red Hen for poppy', home: 'cobbe-farmhouse', work: 'cobbe-fields',
    routine: [{ from: 0, at: 'cobbe-farmhouse', doing: 'sleep' }, { from: 5, at: 'cobbe-fields', doing: 'work' }, { from: 18, at: 'ferrymans-rest', doing: 'drink' }, { from: 23, at: 'cobbe-farmhouse', doing: 'sleep' }],
    firstWords: "Hay's in. Mind your business.",
    barks: ['I owe no one. Write that down.', "Wenna? She's about. She's always about.", 'Field doesn\'t care who\'s dead. Field wants ploughing.'],
    quests: ['SQ-BV6'],
  },
  {
    id: 'ada-cobbe', name: 'Ada Cobbe', who: 'farmer, 40', home: 'cobbe-farmhouse', work: 'cobbe-farmhouse',
    routine: [{ from: 0, at: 'cobbe-farmhouse', doing: 'sleep' }, { from: 5, at: 'cobbe-farmhouse', doing: 'work' }, { from: 11, at: 'cobbe-barn', doing: 'work' }, { from: 15, at: 'cobbe-farmhouse', doing: 'work' }, { from: 22, at: 'cobbe-farmhouse', doing: 'sleep' }],
    firstWords: 'Gods keep the dead out, and the reeve with them.',
    barks: ["He's at the inn again. Course he is.", "Kit eats more than the dog. I don't mind. Don't tell him.", "Shut the gate. The dead can't work a latch. Yet."],
    quests: ['SQ-BV6'],
  },
  {
    id: 'wenna', name: 'Wenna', who: "Ada's niece, 13, and her dog Scrap", home: 'cobbe-farmhouse', work: 'cobbe-farmhouse',
    routine: [{ from: 0, at: 'cobbe-farmhouse', doing: 'sleep' }, { from: 6, at: THE_SOUTH_PASTURES, doing: 'herd' }, { from: 19, at: 'cobbe-farmhouse', doing: 'eat' }, { from: 21, at: 'cobbe-farmhouse', doing: 'sleep' }],
    firstWords: 'Scrap finds everything. Even things you don\'t want found.',
    barks: ['Scrap, leave it. Leave it!', "Scrap dug up a hand. Uncle Hob said it was a glove. It wasn't.", "Ewes won't go near the hill. Nor will I."],
    quests: ['SQ-BV6'],
  },

  // The East Lane, north side.
  {
    id: 'old-meg', name: 'Old Meg', who: 'widow, 70; held the door on her sister', home: 'megs-house',
    routine: [{ from: 0, at: MEGS_DOORSTEP, doing: 'sit' }, { from: 3, at: 'megs-house', doing: 'sleep' }, { from: 10, at: 'megs-house', doing: 'work' }, { from: 14, at: 'brindleford-well', doing: 'stand' }, { from: 18, at: MEGS_DOORSTEP, doing: 'sit' }],
    firstWords: 'Nobody comes out of the mountains. What are you?',
    barks: ["I hear the hill at night. It's chewing.", "Reede's roof leaks. His wife's leaving. You didn't hear it from me.", "I held the door. I'd hold it again. Go on, judge me."],
    quests: ['MQ01'],
  },
  {
    id: 'rolf-reede', name: 'Rolf Reede', who: 'thatcher, 38; his own roof leaks', home: 'reede-house', work: 'reede-house',
    routine: [{ from: 0, at: 'reede-house', doing: 'sleep' }, { from: 6, at: 'hask-house', doing: 'work' }, { from: 12, at: 'reede-house', doing: 'eat' }, { from: 13, at: 'tidy-house', doing: 'work' }, { from: 19, at: 'reede-house', doing: 'sit' }, { from: 22, at: 'reede-house', doing: 'sleep' }],
    firstWords: 'Mind the ladder. Mind the thatch. Mind your own.',
    barks: ['Every roof in this village is mine. Except mine.', 'Kingsmere. She says it like a prayer.', "My mother's on that hill. I'm not leaving her to the crows."],
    quests: [],
  },
  {
    id: 'tamsin-reede', name: 'Tamsin Reede', who: '35; three children; wants Kingsmere', home: 'reede-house', work: 'reede-house',
    routine: [{ from: 0, at: 'reede-house', doing: 'sleep' }, { from: 6, at: 'reede-house', doing: 'work' }, { from: 9, at: 'brindleford-well', doing: 'work' }, { from: 10, at: 'reede-house', doing: 'work' }, { from: 22, at: 'reede-house', doing: 'sleep' }],
    firstWords: 'Three children and a roof that weeps. What do you want?',
    barks: ["Kingsmere has stone walls. Stone doesn't remember.", "He'd die here for the dead. I'd rather live somewhere.", 'Mind the little ones. They bite.'],
    quests: [],
  },
  {
    id: 'joan-lusk', name: 'Joan Lusk', who: 'carter, 50; carries the Red Hen\'s poppy under the hay', home: 'lusk-house', work: 'cobbe-barn',
    routine: [
      { from: 0, at: 'lusk-house', doing: 'sleep' }, { from: 5, at: 'old-toll-bridge', doing: 'travel', days: { every: 14, on: 0 } }, { from: 6, at: 'cobbe-barn', doing: 'work' },
      { from: 18, at: 'ferrymans-rest', doing: 'drink' }, { from: 22, at: 'lusk-house', doing: 'sleep' },
    ],
    firstWords: "Wagon's full. Don't ask with what.",
    barks: ["It's hay. Smells like hay, doesn't it?", "Don't sit on the sacks.", "Kingsmere's two days if the road's dry. It's never dry."],
    quests: [],
  },

  // The East Lane, south side.
  {
    id: 'edric-tidy', name: 'Edric Tidy', who: 'hayward, 44; two children in the pit', home: 'tidy-house', work: 'hay-meadows',
    routine: [{ from: 0, at: 'tidy-house', doing: 'sleep' }, { from: 5, at: 'hay-meadows', doing: 'work' }, { from: 19, at: 'tidy-house', doing: 'sit' }, { from: 22, at: 'tidy-house', doing: 'sleep' }],
    firstWords: "Keep off the hay. It's all we've got that grows.",
    barks: ["Two of mine are in that hill. Don't say sorry. Everyone says sorry.", 'Wynn leaves milk out. Let her.', { line: "Someone's walking the meadows at night. Barefoot. Small feet.", after: 'MQ01' }],
    quests: [],
  },
  {
    id: 'wynn-tidy', name: 'Wynn Tidy', who: '40; leaves milk on the sill for her dead children', home: 'tidy-house', work: 'tidy-house',
    routine: [{ from: 0, at: 'tidy-house', doing: 'sleep' }, { from: 6, at: 'tidy-house', doing: 'work' }, { from: 10, at: 'brindleford-well', doing: 'work' }, { from: 11, at: 'tidy-house', doing: 'work' }, { from: 21, at: 'tidy-house', doing: 'sit' }, { from: 22, at: 'tidy-house', doing: 'sleep' }],
    firstWords: "Hush. You'll wake them.",
    barks: ['They were six and nine. They\'d be bigger now.', "Don't look at the sill.", { line: 'The milk was gone this morning. Every drop.', after: 'MQ01' }],
    quests: [],
  },
  {
    id: 'sibyl-hask', name: 'Sibyl Hask', who: 'weaver, 48; her son\'s letters stopped', home: 'hask-house', work: 'hask-house',
    routine: [{ from: 0, at: 'hask-house', doing: 'sleep' }, { from: 6, at: 'hask-house', doing: 'work' }, { from: 13, at: 'brindleford-well', doing: 'stand' }, { from: 14, at: 'hask-house', doing: 'work' }, { from: 23, at: 'hask-house', doing: 'sleep' }],
    firstWords: 'Mending\'s a penny. Shrouds are two.',
    barks: ['Aldric writes every month. Wrote.', "The loom doesn't ask questions. That's why I like it.", 'If you meet the Regency\'s men, ask after a tall lad with a crooked nose.'],
    quests: [],
  },
  {
    id: 'gammer-orr', name: 'Gammer Orr', who: '78; drew the lots in the Wet Years', home: 'orr-house', work: 'orr-house',
    routine: [{ from: 0, at: 'orr-house', doing: 'sleep' }, { from: 6, at: 'orr-house', doing: 'work' }, { from: 9, at: 'brindleford-well', doing: 'stand' }, { from: 11, at: 'orr-house', doing: 'work' }, { from: 20, at: 'orr-house', doing: 'sleep' }],
    firstWords: "He's resting. Whatever he told you, he's confused.",
    barks: ['Simkin talks. Old men talk. It\'s nothing.', 'We kept this village alive. Someone had to choose.', 'The priest has enough to carry.'],
    quests: [],
  },
  {
    id: 'simkin-orr', name: 'Simkin Orr', who: '80, nearly blind; wants to confess the lots', home: 'orr-house',
    routine: [{ from: 0, at: 'orr-house', doing: 'sleep' }, { from: 8, at: ORRS_DOORSTEP, doing: 'sit' }, { from: 18, at: 'orr-house', doing: 'sit' }, { from: 20, at: 'orr-house', doing: 'sleep' }],
    firstWords: "Is that the priest? Tell me it's the priest.",
    barks: ['Beans in a cup. Black bean, no bread.', "I can't see your face. Good. I couldn't see theirs either.", 'Fetch Cuthwin. Before she comes back.'],
    quests: [],
  },

  // Across the ford.
  {
    id: 'ned-tolley', name: 'Ned Tolley', who: 'drover, 30; sells the Vale\'s paths', home: 'ferry-cottage', work: 'hay-meadows',
    routine: [{ from: 0, at: 'ferrymans-rest', doing: 'drink' }, { from: 1, at: 'ferry-cottage', doing: 'sleep' }, { from: 9, at: THE_SOUTH_PASTURES, doing: 'herd' }, { from: 16, at: 'ferrymans-rest', doing: 'drink' }],
    firstWords: 'Need a path? Paths cost. Shortcuts cost more.',
    barks: ["I've walked every sheep-run in the Vale. Most of them drunk.", "Garrick's cottage. Garrick's rent. Garrick's bloody ale.", "There's a way round the Red Hen. Five pennies."],
    quests: [],
  },
  {
    id: 'alys-fletcher', name: 'Alys Fletcher', who: 'fletcher, 33; the Vale\'s best shot', home: 'fletcher-house', work: 'fletcher-house',
    routine: [{ from: 0, at: 'fletcher-house', doing: 'sleep' }, { from: 6, at: 'fletcher-house', doing: 'work' }, { from: 9, at: 'birchwood', doing: 'wander' }, { from: 13, at: 'fletcher-house', doing: 'work' }, { from: 22, at: 'fletcher-house', doing: 'sleep' }],
    firstWords: "Don't touch the shafts. They're straighter than you.",
    barks: ['Best shot in the Vale, and all I kill is rabbits.', "Cob won't say what he did. I've stopped asking.", 'Bring me goose feathers. Grey ones.'],
    quests: ['SQ-BV7'],
  },
  {
    id: 'cob-fletcher', name: 'Cob Fletcher', who: '36; came home from the levy without his right hand', home: 'fletcher-house',
    routine: [{ from: 0, at: 'fletcher-house', doing: 'sleep' }, { from: 8, at: THE_RIVERBANK, doing: 'sit' }, { from: 12, at: 'fletcher-house', doing: 'sit' }, { from: 17, at: 'ferrymans-rest', doing: 'drink' }, { from: 23, at: 'fletcher-house', doing: 'sleep' }],
    firstWords: 'Left hand works fine. For drinking.',
    barks: ['The Regency pays in coin. You pay the rest yourself.', "Don't ask about the hand.", 'I can still shake. Just the wrong one.'],
    quests: [],
  },
  {
    id: 'bran-hollin', name: 'Bran Hollin', who: 'eel-trapper, 25', home: 'hollin-house', work: 'hollin-house',
    routine: [{ from: 0, at: 'hollin-house', doing: 'sleep' }, { from: 4, at: THE_FORD, doing: 'work' }, { from: 10, at: 'hollin-house', doing: 'work' }, { from: 15, at: THE_FORD, doing: 'work' }, { from: 20, at: 'hollin-house', doing: 'eat' }, { from: 22, at: 'hollin-house', doing: 'sleep' }],
    firstWords: "Eels. Fresh. Don't ask what they've been eating.",
    barks: ['River gives. River takes. Mostly takes.', "Mam talks. Don't believe her. Believe her a bit.", { line: 'Traps come up heavy since the bell. Heavy and pale.', after: 'MQ01' }],
    quests: [],
  },
  {
    id: 'gert-hollin', name: 'Gert Hollin', who: "Bran's mother, 60; tells everyone everything", home: 'hollin-house', work: 'hollin-house',
    routine: [{ from: 0, at: 'hollin-house', doing: 'sleep' }, { from: 6, at: 'hollin-house', doing: 'work' }, { from: 9, at: 'brindleford-well', doing: 'stand' }, { from: 13, at: 'hollin-house', doing: 'work' }, { from: 21, at: 'hollin-house', doing: 'sleep' }],
    firstWords: "You're the one from the mountains. Meg said. Everyone said.",
    barks: ['Eels and bread. Bread and eels.', 'Garrick ran the ferry till it drowned a cart. Ask him.', { line: 'My Bran found fingers in his traps. Fingers!', after: 'MQ01' }],
    quests: [],
  },
];
