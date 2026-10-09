# Hollowcrown — Story Bible

The whole story of Hollowcrown: the world, its people, the main quest, every side quest and monster contract, the
choices and the endings. This is the reference the game's content is built from: when a quest, a character or a
place is made in the game, it is made as written here (or this is changed first).

## Files

| File | What's in it |
|---|---|
| [world.md](world.md) | Premise, history and timeline, the Oath and the Hollow Crown, factions, reputation, the map and its regions |
| [characters.md](characters.md) | Every named character of the main story: who they are, what they want, their secret, what they remember of the hero |
| [main-quest-1.md](main-quest-1.md) | Prologue (Brindle Vale) and Act I: *Three Claims* |
| [main-quest-2.md](main-quest-2.md) | Act II: *The Pieces* |
| [main-quest-3.md](main-quest-3.md) | Act III: *The Barrow Wakes*, the six endings |
| [choices.md](choices.md) | Every choice that carries on, the world-state flags, ally count, epilogue slides |
| [regions/brindle-vale.md](regions/brindle-vale.md) | The starting region in full detail: places, people, side quests, contract |
| [regions/hollowmere.md](regions/hollowmere.md) | Kingsmere, the lake, Reedby, Elderwick, the Middle Downs |
| [regions/saltreach.md](regions/saltreach.md) | Gullhaven, Saltcombe, the sea caves |
| [regions/greenwood.md](regions/greenwood.md) | Oakhallow, Thornbeck, Wren's camp, the forest dungeons |
| [regions/lantern-moors.md](regions/lantern-moors.md) | The Abbey of the Last Lantern, Gorse Hollow, Cairnfold |
| [regions/southfields.md](regions/southfields.md) | Millbrook, Larkspur, the farmlands |
| [regions/the-barrows.md](regions/the-barrows.md) | The barrow hills, the Watchers' Crypt, the Great Barrow |

## The game in numbers

| | Count | Time (first playthrough, average player) |
|---|---|---|
| Main quest | 29 quests in a prologue and three acts | ~23 h (prologue 2.5, Act I 6.5, Act II 8, Act III 6) |
| Side quests | 46 | ~25.5 h |
| Monster contracts | 14 | ~4.5 h |
| Exploration, landmarks, trading, travel | — | ~3 h |
| **Total** | | **~56 h** (a main-quest-only run: ~24 h; a typical run skipping a third of the side content: ~45 h) |

World: 4096 x 4096 tiles, 2 towns, 10 villages, 12 dungeons (8 crypts, 4 caves), 6 bandit camps and the Greenhood's
hidden camp, 8 regions (the Middle Downs between them, open country).

## Conventions

- **Coordinates** are tiles, `(x, z)`: x grows east (0 at the west edge), z grows south (0 at the north edge). The
  map is 4096 a side; the hero starts at the Pilgrim's Shrine, `(480, 3380)`.
- **Quest ids**: `MQ01`..`MQ29` main quests; `SQ-BV1` side quests by region (BV Brindle Vale, HM Hollowmere,
  SR Saltreach, GW Greenwood, LM Lantern Moors, SF Southfields, BR the Barrows); `CT-BV1` contracts likewise.
- **Flags** (`snake_case`, in `code` style) are the world state the game keeps: every choice that matters later sets
  one. They're all listed in [choices.md](choices.md).
- **Reputation**: three factions (Regency, Greenhood, Lantern), -100..100; ten villages, standing -3..+3. Changes are
  written `Regency +10`, `Brindleford +1`.
- **Time** per quest is for an average player at the level the quest expects.
- Monsters named here are those the game has (wolves, boars, bears, lynxes, bandits, ghosts, skeletons, draugr,
  spiders, bats, cave worms, crypt lords) unless marked **new**.

## Changes from the first draft

- The third crown piece is held by Maelis, not hidden in Hrathgar's barrow: the Great Barrow is where the crown is
  worn, at the end.
- Why the hero matters: the crown's pieces (and all oath-iron) burn with cold anyone born under the Oath. The hero,
  born beyond the mountains, is **unsworn**: the only one who can carry the pieces and reforge them.
- The Order has a hidden villain, Lector Anselm, behind Sister-Captain Odalys.
- The map is 4096 a side, and Southfields has two villages (Millbrook, Larkspur): 10 villages in all.
