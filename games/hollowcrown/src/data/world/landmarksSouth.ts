// The small landmarks of the realm's south: Brindle Vale, the Middle Downs, the Southfields, the Saltreach Coast.
// (Their kinds and the realm's whole list: landmarks.ts.)

import { mark, type Landmark } from './landmarkKinds';

const VALE = (k: Parameters<typeof mark>[1], x: number, z: number, story: string, loot = false) => mark('brindle-vale', k, x, z, story, loot);
const DOWNS = (k: Parameters<typeof mark>[1], x: number, z: number, story: string, loot = false) => mark('middle-downs', k, x, z, story, loot);
const SOUTH = (k: Parameters<typeof mark>[1], x: number, z: number, story: string, loot = false) => mark('southfields', k, x, z, story, loot);
const SALT = (k: Parameters<typeof mark>[1], x: number, z: number, story: string, loot = false) => mark('saltreach', k, x, z, story, loot);

export const SOUTH_LANDMARKS: Record<string, Landmark[]> = {
  'brindle-vale': [
    VALE('wayside-cross', 420, 3050, 'Two birch poles lashed with gut into a cross. Somebody keeps re-tying it.'),
    VALE('cairn', 520, 3020, 'A shepherd\'s cairn. A stone for every lamb the winter took. It\'s a tall cairn.'),
    VALE('beehive-hut', 560, 3150, 'A hut of fieldstone shaped like a skep, older than the Vale\'s name. Sheep shelter in it now.'),
    VALE('holy-well', 1000, 3020, 'A well with a saint\'s niche and no saint. The water tastes of iron. Nobody drinks it.', true),
    VALE('charcoal-clearing', 1300, 2975, 'A charcoal burner\'s clearing. The mound\'s been cold a year. His axe is still in the stump.', true),
    VALE('standing-stone', 1350, 3300, 'A lone stone, leaning east. The old women say it\'s the Nine Sisters\' tenth, walking home.'),
    VALE('abandoned-cart', 1150, 3420, 'A tinker\'s cart, one wheel gone. The tinker went on on foot. Or didn\'t.', true),
    VALE('burnt-farmstead', 380, 3650, 'Burnt the spring after the Wet Years. The door was barred from outside.'),
    VALE('battlefield', 1350, 3840, 'Rusted pike-heads in the heather, from Osric\'s war. Nobody buried the men. The hill did.', true),
    VALE('waymark', 960, 3620, 'A ram\'s skull on a post at the marsh\'s edge. Follow the horns, and keep your feet dry.'),
  ],
  'middle-downs': [
    DOWNS('cairn', 1550, 2800, 'A drover\'s cairn on the brow. Add a stone and the road\'s kind to you, they say.'),
    DOWNS('wayside-shrine', 1700, 2760, 'A lantern niche with the glass long gone. Someone left a copper anyway.', true),
    DOWNS('ruined-chapel', 1950, 2780, 'Three walls and a doorway. The fourth wall went into a farmer\'s sheepfold.'),
    DOWNS('milestone', 2200, 2810, 'KINGSMERE IX. The heron chiselled over a crown, and the crown showing through.'),
    DOWNS('burnt-farmstead', 2450, 2780, 'A tithe-barn burnt with the tithe still in it. The Regency called it an accident.'),
    DOWNS('wayside-shrine', 2100, 2950, 'Toll-keepers prayed here for travellers. Then charged them.'),
    DOWNS('battlefield', 1600, 3150, 'A field where the grass grows greener in long rows. Graves, or the furrows they were dug from.', true),
    DOWNS('standing-stone', 1800, 3200, 'A stone with a hole through it. Look through, and the Downs look further than they are.'),
    DOWNS('abandoned-cart', 2050, 3150, 'A Regency supply cart, the oxen long eaten, the sacks long gone. The ledger\'s still in the box.', true),
    DOWNS('hanged-oak', 2300, 3100, 'A lone oak with a rope still on it. The knot\'s a sailor\'s, a long way from the sea.'),
    DOWNS('beehive-hut', 2500, 3200, 'A stone hut, bees in its roof. They don\'t mind you. They mind the dark.'),
    DOWNS('holy-well', 1550, 3450, 'A well where pilgrims washed their feet. Now it\'s where the Downs\' foxes drink.'),
    DOWNS('cairn', 1750, 3500, 'A grave-cairn too long for a man. Too short for two.'),
    DOWNS('ruined-tower', 2000, 3450, 'A signal tower from the old king\'s day. The fire-basket rusted through, and the hill went dark.', true),
    DOWNS('wayside-cross', 2250, 3450, 'An oak cross with nails in it: one for every name the levy took from Millbrook.'),
    DOWNS('waymark', 2500, 3500, 'A painted post: south to Millbrook, the paint gone, the hand still pointing.'),
    DOWNS('burnt-farmstead', 1650, 3700, 'A hearth and a chimney, nothing else. The swallows still nest in it.'),
    DOWNS('standing-stone', 1900, 3720, 'A stone with a face worn into it by four hundred years of rain. It looks tired.'),
    DOWNS('battlefield', 2150, 3700, 'Arrowheads in the chalk. The crows still come here to look.', true),
    DOWNS('cairn', 2400, 3700, 'A cairn on the last rise before the Southfields. From here, you can smell the mills.'),
  ],
  southfields: [
    SOUTH('milestone', 2700, 2800, 'MILLBROOK IV. Somebody\'s scratched a wheat-ear under it, and a skull.'),
    SOUTH('wayside-shrine', 3000, 2800, 'A harvest shrine: a corn-doll in a niche, black with three summers\' rain.', true),
    SOUTH('burnt-farmstead', 3300, 2850, 'Burnt by deserters for the grain. The grain burnt too.'),
    SOUTH('standing-stone', 3700, 2800, 'A boundary stone between two fields and two families. Both moved it, every night, for forty years.'),
    SOUTH('abandoned-cart', 2700, 3100, 'A miller\'s cart in a ditch, flour turned to paste. The miller\'s hat is still on the seat.', true),
    SOUTH('beehive-hut', 3250, 3100, 'A reaper\'s hut of stone. Inside, a tally on the wall: days worked, days paid. They don\'t match.'),
    SOUTH('hanged-oak', 3800, 3050, 'An oak by the barrow road. Larkspur hanged a man here for moving the dead. Then moved them themselves.'),
    SOUTH('holy-well', 2750, 3450, 'Our Lady of the Sheaves\' well. Barren women leave ribbons. There are a lot of ribbons.'),
    SOUTH('battlefield', 3250, 3400, 'Where the levy met the Carrow men. Plough here and you turn up teeth.', true),
    SOUTH('cairn', 3800, 3550, 'A cairn at the foot of the Teeth. The topmost stone is always warm.'),
    SOUTH('ruined-chapel', 2700, 3750, 'A chapel the river took half of. The other half still rings, in a wind.'),
    SOUTH('wayside-cross', 3000, 3650, 'A cross of iron, from the Lantern\'s mission days. Nobody\'s dared take it for scrap.'),
    SOUTH('burnt-farmstead', 3600, 3800, 'A steading burnt in the night. The dog still waits on the step, what\'s left of it.'),
    SOUTH('ruined-tower', 3150, 3850, 'A watchtower on the Sorrow Hills\' skirts. The stair\'s gone. Someone still lives at the top.', true),
  ],
  saltreach: [
    SALT('cairn', 300, 1500, 'A sea-cairn: drowned men\'s names on the stones, in chalk, washed off and written again.'),
    SALT('wayside-cross', 550, 1550, 'A cross of driftwood, salt-white, tied with net cord.'),
    SALT('burnt-farmstead', 400, 1850, 'A kelp-burner\'s croft. The kilns burnt everything else when the wreckers came.'),
    SALT('milestone', 650, 1800, 'GULLHAVEN VII. Under it someone\'s cut a gull. Under that, a gull with a knife.'),
    SALT('holy-well', 550, 2050, 'A spring that comes up fresh a hundred yards from the sea. The fishwives call it a mercy.', true),
    SALT('hanged-oak', 230, 2290, 'A wind-bent oak above the strand. Wreckers hang their own here, when they hang anyone.'),
    SALT('standing-stone', 650, 2300, 'A stone the sailors used to steer by, before Gull Light. Now nobody steers by anything.'),
    SALT('abandoned-cart', 500, 2450, 'A fish-cart, the fish long gone, the smell not.', true),
    SALT('ruined-chapel', 650, 2600, 'A chapel to the drowned. The bell was taken for a ship. The ship went down.'),
    SALT('cairn', 260, 2820, 'A cairn among the dunes, the sand trying to bury it. Somebody keeps digging it out.'),
    SALT('beehive-hut', 600, 2850, 'A salter\'s hut. The walls are crusted white, and taste of tears.'),
  ],
};
