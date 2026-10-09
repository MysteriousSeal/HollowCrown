// The small landmarks of the realm's north: Hollowmere, the Lantern Moors, the Greenwood, the Barrows. (Their kinds
// and the realm's whole list: landmarks.ts.)

import { mark, type Landmark } from './landmarkKinds';

type Kind = Parameters<typeof mark>[1];
const MERE = (k: Kind, x: number, z: number, story: string, loot = false) => mark('hollowmere', k, x, z, story, loot);
const MOOR = (k: Kind, x: number, z: number, story: string, loot = false) => mark('lantern-moors', k, x, z, story, loot);
const WOOD = (k: Kind, x: number, z: number, story: string, loot = false) => mark('greenwood', k, x, z, story, loot);
const BARROW = (k: Kind, x: number, z: number, story: string, loot = false) => mark('the-barrows', k, x, z, story, loot);

export const NORTH_LANDMARKS: Record<string, Landmark[]> = {
  hollowmere: [
    MERE('cairn', 1500, 1450, 'A reed-cutters\' cairn. They pile a stone for every season the lake didn\'t take one of them.'),
    MERE('ruined-chapel', 1750, 1480, 'A lake chapel with its floor gone to water. Fish swim where the faithful knelt.', true),
    MERE('milestone', 2050, 1480, 'ELDERWICK III. The lake\'s risen since this was set. It used to be a long walk.'),
    MERE('wayside-cross', 2350, 1480, 'A cross with a lantern hook and no lantern. The Order took them back when the poppy started paying.'),
    MERE('standing-stone', 1500, 1800, 'A stone half in the shallows. At night the water round it doesn\'t move.'),
    MERE('wayside-shrine', 1530, 1640, 'A ferryman\'s shrine: an oar nailed upright, coins in the cracks.', true),
    MERE('ruined-tower', 2550, 1760, 'A watchtower over the north shore. The king\'s barge was seen from here, the night of the Still Water. Nobody else saw it after.'),
    MERE('holy-well', 2700, 1900, 'A well the Lantern blessed. The water glows faintly. Elderwick\'s children aren\'t allowed near it.'),
    MERE('burnt-farmstead', 2600, 2050, 'A steading burnt by the Regency for hiding a Greenhood man. They never found him. Just the family.'),
    MERE('abandoned-cart', 2550, 2300, 'A poppy cart, overturned, its jars smashed. The grass here grows white.', true),
    MERE('hanged-oak', 2650, 2600, 'An oak on the Wood Road. The Regency\'s notice is still nailed to it: THIEF. In a child\'s size.'),
    MERE('wayside-shrine', 2350, 2500, 'A shrine outside the walls for those the Ditch turned away. The offerings are buttons and teeth.'),
    MERE('milestone', 1900, 2450, 'KINGSMERE I. Every traveller touches it for luck. The top\'s worn smooth as glass.'),
    MERE('battlefield', 1850, 2600, 'The Ditch\'s old burial ground, before there was a Ditch. The town\'s growing over it.', true),
    MERE('beehive-hut', 1600, 2600, 'An eel-smoker\'s hut. The smoke\'s been out for years. The smell hasn\'t.'),
    MERE('waymark', 1480, 2300, 'A Salt Road waymark: three notches for Gullhaven, one cut deep for "don\'t".'),
  ],
  'lantern-moors': [
    MOOR('cairn', 400, 400, 'A cairn under the Cold Spine. Climbers left their names. Most of them didn\'t come back for them.'),
    MOOR('standing-stone', 650, 380, 'A stone the Lantern\'s monks tried to pull down. The rope\'s still round it, rotted. The stone\'s still up.'),
    MOOR('waymark', 950, 400, 'A peat-cutter\'s pole with a tin lamp. On foggy nights someone still lights it. Nobody knows who.'),
    MOOR('ruined-tower', 1250, 400, 'A lookout from the Barrow wars, black with old fire. The Barrowborn say it was they who lit it.', true),
    MOOR('holy-well', 400, 700, 'A moor spring with the Lantern\'s mark cut over it. The water underneath is older than the mark.'),
    MOOR('beehive-hut', 650, 650, 'A Barrowborn hut of turf and stone. Inside, a cradle, and a child\'s grey eyes painted on the wall.', true),
    MOOR('ruined-chapel', 600, 880, 'A chapel the Order abandoned for the Abbey. The bell-cote\'s full of jackdaws and their stolen things.', true),
    MOOR('wayside-cross', 1100, 650, 'An iron cross on the Moor Road, frosted in summer. Oath-iron, if you know to look.'),
    MOOR('burnt-farmstead', 1350, 750, 'A peat farm burnt for a debt to the Abbey. The tithe-stone at the gate still says THANK YOU.'),
    MOOR('battlefield', 450, 1000, 'Where the Barrowborn made their last stand against the Oath. Heather grows in the shape of a ring.', true),
    MOOR('wayside-shrine', 750, 1050, 'A Lantern shrine with a lamp that never goes out. The novices are flogged if it does.'),
    MOOR('cairn', 1300, 1050, 'A cairn of peat-bricks, slowly sinking. Gorse Hollow buries its unbaptised here.'),
    MOOR('abandoned-cart', 850, 1350, 'A tithe-cart stuck in a bog, axle-deep, the peat still in it. The driver walked to the Abbey and was fined for it.'),
    MOOR('milestone', 1150, 1400, 'ABBEY V. Below it, a smaller stone: GORSE HOLLOW, scratched by hand.'),
    MOOR('standing-stone', 420, 1430, 'The Moor\'s last stone before the sea crags. Gulls sit on it and watch the moor, not the sea.'),
  ],
  greenwood: [
    WOOD('charcoal-clearing', 2900, 800, 'A collier\'s clearing, his mound still smoking a little. He went for water a week ago.', true),
    WOOD('holy-well', 3150, 850, 'A well in an oak\'s roots. The Greenhood drink from it and swear their oaths on it.'),
    WOOD('cairn', 3650, 780, 'A hunters\' cairn, antlers on it. The newest pair is a man\'s skull.'),
    WOOD('hanged-oak', 3880, 900, 'An oak the Regency used as a gallows. The Greenhood cut the men down. They left the ropes as a promise.'),
    WOOD('beehive-hut', 2950, 1100, 'A honey-hunter\'s hut, high on stilts against the boars. The ladder\'s pulled up.', true),
    WOOD('charcoal-clearing', 3250, 1150, 'A burnt clearing where a collier\'s mound went up and took him with it. The ash is still black.'),
    WOOD('ruined-tower', 3850, 1250, 'A forester\'s tower from the king\'s day. Wren\'s lookouts use it now. They won\'t say so.'),
    WOOD('wayside-shrine', 2900, 1400, 'A green-man face carved in a stump. Oakhallow\'s girls leave it bread before they marry.'),
    WOOD('burnt-farmstead', 3450, 1350, 'A woodward\'s house burnt by the hoods. He\'d sold their names. His wife hadn\'t.'),
    WOOD('standing-stone', 3750, 1500, 'A stone the trees have grown around and lifted. It hangs in the roots, off the ground.'),
    WOOD('abandoned-cart', 3000, 1700, 'A Regency wagon ambushed on the Wood Road. The arrows are still in the boards.', true),
    WOOD('hanged-oak', 3450, 1650, 'A hollow oak with a rag doll nailed to it. The Greenhood\'s mark for "keep out".'),
    WOOD('waymark', 3880, 1700, 'A wren carved on a beech. Wren\'s people follow them; everyone else gets lost.'),
    WOOD('battlefield', 2900, 1950, 'Where the levy chased the Greenhood into the trees and the trees kept them. Helmets in the moss.', true),
    WOOD('charcoal-clearing', 3550, 2150, 'A clearing with three mounds, all cold. The colliers left for Thornbeck. Thornbeck says they never came.'),
    WOOD('holy-well', 3850, 2200, 'A spring under the Carrow Teeth, ice-cold all summer. The deer drink here at dusk, unafraid.'),
    WOOD('wayside-cross', 3250, 2400, 'A cross for the Fellowes, burnt in their barn. Thornbeck put it up. The hoods pulled it down. It\'s up again.'),
    WOOD('cairn', 3550, 2500, 'A cairn of hearthstones, from a village the wood took back.'),
    WOOD('milestone', 2850, 2550, 'THORNBECK II, KINGSMERE XII. Someone has added: WREN 0.'),
    WOOD('burnt-farmstead', 3800, 2550, 'A charcoal-burner\'s steading. The chimney stands like a finger raised for quiet.'),
  ],
  'the-barrows': [
    BARROW('cairn', 1550, 300, 'A cairn under the Cold Spine. Barrowborn stones, not the Oath\'s: no names, only marks for "we were here".'),
    BARROW('standing-stone', 1900, 250, 'A stone twice a man\'s height, frost on it in August. The grave-robbers won\'t camp in sight of it.'),
    BARROW('standing-stone', 2600, 250, 'A stone carved with a door. It is not a door. Don\'t knock.'),
    BARROW('cairn', 2900, 350, 'A cairn torn open and built back up, by somebody who knew which stone went where.', true),
    BARROW('battlefield', 1600, 600, 'The Oath\'s first victory: grass that won\'t grow, and a ring of burnt stones.', true),
    BARROW('beehive-hut', 2000, 550, 'A Barrowborn watcher\'s hut, its door to the Great Barrow. Someone was watching it, once.'),
    BARROW('ruined-tower', 2550, 600, 'One of the Lantern\'s gate-towers, empty, its brazier full of old bones instead of coal.', true),
    BARROW('holy-well', 2850, 700, 'A well that only the Barrowborn drink from. Everyone else who has is still in it.'),
    BARROW('burnt-farmstead', 1500, 1000, 'A crofter\'s house burnt the year the White Fields were planted. The Order needed the land.'),
    BARROW('waymark', 2850, 1000, 'A bone waymark: a thighbone in a cairn, pointing at the Watchers\' Crypt.'),
    BARROW('wayside-shrine', 1600, 1300, 'A Lantern shrine at the fringe, its lamp fed with poppy-oil. It smells sweet. It smells wrong.'),
    BARROW('abandoned-cart', 2000, 1250, 'A poppy-harvest cart from the White Fields. The pickers ran. The cart\'s still half full.', true),
    BARROW('ruined-chapel', 2450, 1300, 'A pickers\' chapel, built by the Order and prayed in by no one.'),
    BARROW('hanged-oak', 2850, 1300, 'A dead oak hung with Lantern masks, cloth faces stained white. The pickers\' joke. Or not a joke.'),
    BARROW('cairn', 2050, 400, 'A cairn in the shape of a sleeping man. On the coldest nights it isn\'t quite where it was.'),
  ],
};
