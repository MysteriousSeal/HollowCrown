# Lantern Moors — the Abbey, Gorse Hollow, Cairnfold

**Tiles** x 300–1450, z 300–1500. **Levels** 6–11 (the Undercroft in Act III: 14). **Time** ~4 h of side content (6
side quests, 2 contracts). **Mood**: high moorland: purple heather, brown peat, white mist in the hollows, standing
stones, curlews, a great lantern burning on a crag day and night.

Main quests here: MQ07, MQ08, MQ22 (end), MQ23.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The moor** | most of the region, tiers 2–5 in long swells | Heather (a hand-drawn "heath" area: purple ground cover), rocks, peat cuttings |
| **The Abbey Crag** | (850, 800), a rock spur 4 tiers above the moor | The Abbey on top; one road up its south side |
| **Black Fen** | x 400–700, z 900–1150 | A bog: pools, rushes, mist; the Fen Path (SQ-LM6) |
| **The Cold Spine's foot** | z 300–500 | Scree, the mountains rising to the map's north edge |
| **The Grey Stones** | (1200, 600) | A long avenue of standing stones (CT-LM2) |
| **The Moor Road** | Reedby (1550, 2050) → (1350, 1700) → Gorse Hollow (1050, 1150) → the Abbey (850, 800) | |

## The Abbey of the Last Lantern (850, 800)
A walled keep of grey stone on the crag: a gatehouse, a yard where knights drill, the **Lantern Tower** (the great
lantern at its top, tended day and night), the chapter house, the chapel, the library (the archive below it), the
refectory, the novices' dormitory, the Abbey smithy (Brother **Aedric**, if alive after MQ08), stables, and the
**Undercroft** (crypt under the chapel; the Oathforge at its deepest).
Not a village (no standing); its people follow the Lantern's reputation.
People: **Lector Anselm Crane**, **Sister-Captain Odalys Venn**, **Brother Aedric** (forge-brother), **Brother
Ninian** (archivist, 50, short-sighted, gossip), **Sister Hild Weller** (infirmarian), **Novice Bryn** (17, SQ-LM1), the
quartermaster **Brother Hode** (sells Lantern gear to Trusted heroes: oath-iron-banded weapons that hurt the dead
more).

## Gorse Hollow — village (centre at 1050, 1150)
A peat-cutters' village in a sheltered hollow below the Abbey: 9 turf-roofed stone houses, peat stacks, a
peat-smoked alehouse (**The Smoking Turf**). They owe the Abbey a tithe of peat and resent it. Standing 0.
People: reeve **Hamish Dunn** (dour), the peat-cutter **Morag Gale** (SQ-LM2), the alewife **Effie Lusk**, the shepherd
**Tam Gorse**, children who dare each other to touch the standing stones.

## Cairnfold (550, 1250)
A ruined hill fort of the Barrow War on a knoll above the Black Fen: broken ring walls, a gate, a keep stump; the crypt
beneath (MQ08). The **Hermit** lives in a cell in the outer wall (SQ-LM4).

## Landmarks
| Landmark | (x, z) | What |
|---|---|---|
| **The Grey Stones** | 1200, 600 | An avenue of 30 standing stones; CT-LM2 |
| **The Drowned Knight** | 560, 1020 | A Lantern knight's armour sunk to the waist in the Black Fen, a ghost at night (SQ-LM6) |
| **Curlew Tor** | 1300, 900 | A rock tor; view over the moor to the barrows; a hidden chest (a **moor-walker's boots**: +speed on rough ground) |
| **The Peat Bodies** | 1150, 1250 | Gorse Hollow's peat cutting, where the bodies come up (SQ-LM2) |

---

## Side quests

### SQ-LM1 — The Novice
- **Giver**: Novice Bryn, in the Abbey stables at night. **Level** 7. **Time** 30 min. **Opens** after MQ07.
1. Bryn wants to leave the Order and go home to Gorse Hollow; novices who leave are "lost to the Lantern" and their
   families pay a fine of peat they can't afford. She's frightened: she's heard voices in the Undercroft at night,
   words she doesn't know, and the dead answering.
2. Choice (`bryn`):
   - **Help her escape** at night (sneak out past the gate watch) (`escaped`): Gorse Hollow +1; Lantern -10 if caught.
     Bryn's account of the voices is evidence later (`bryn_voices`: a weak piece; counts with any other).
   - **Talk to Odalys for her** (`released`): Odalys releases her without the fine if Lantern ≥ 20; she doesn't
     believe the voices ("the dead murmur, child").
   - **Send her back to her bed** (`stayed`): Lantern +5.
- **Rewards**: 150 xp.

### SQ-LM2 — Peat and Bones
- **Giver**: Morag Gale, Gorse Hollow. **Level** 8. **Time** 35 min.
1. Bodies keep coming up in the peat cutting: old, brown, perfectly kept; last week one sat up.
2. The cutting at night: 4 **bog draugr** (draugr, level 8) rise from the peat; the cutting's lowest face shows a
   buried oath-iron grave-ward, cracked: the bog was an old barrow-cemetery the Lantern warded centuries ago.
3. The Abbey demands Gorse Hollow cut *more* peat this year (the tithe doubled) and the cutters dug too deep.
4. Choice (`peat`):
   - **Mend the ward** (only the hero can carry it; Brother Aedric or Tobin can mend it, or buy a new one from Brother
     Hode, 80 silver) (`warded`): the dead sleep; Gorse Hollow +1.
   - **Take the cracked ward to Odalys** and argue the tithe down (`tithe_cut`): she halves it (Lantern -5, Gorse
     Hollow +2), and sends knights to re-ward the bog.
- **Rewards**: 200 xp; peat-smoked ale (a stack, from Effie).

### SQ-LM3 — The Archive
- **Giver**: Odalys (after MQ08, if `told_odalys_wynfrith`), or Brother Ninian's gossip. **Level** 9. **Time** 40 min.
1. Odalys asks the hero to find the Abbey's record of the Oath's rite (she's never seen it written; the Lector keeps
   it). Or Ninian lets slip that the Lector's had the oldest books carried to his rooms.
2. The archive under the library: dust, stairs, ghost-candles; Ninian's help (or a key from his belt).
3. Find: the **old smith-book** of the Oathforge (`smith_book`: a guide for MQ23 if neither Tobin nor Aedric can
   help); the **rite** of coronation, as it was always spoken; and **Anselm's notes**: the same rite, with the words
   changed, in his hand, dated; and a list of the Undercroft dead he's "tested the words upon" (`archive_pages`:
   evidence).
4. Anselm comes down the stair while the hero reads. He's gentle; he asks what they're looking for; he lets them go.
   (He knows. From here, Lantern knights watch the hero; in MQ23 he's ready.)
- **Rewards**: 220 xp; the smith-book.

### SQ-LM4 — The Hermit of Cairnfold
- **Giver**: the Hermit, in his cell in Cairnfold's wall (met after MQ08). **Level** 10. **Time** 35 min.
1. The Hermit (**Gyrth**, 90, half-blind, once the Abbey's Lector before Anselm, now forgotten) knows the oldest form
   of the Oath: not a command but a *promise*, Osric's and Sigrun's, a marriage of the living and the dead.
2. He asks the hero to bring three things so he'll teach them the true words: water from the Speaking Stone's spring
   (it rises at the Grey Stones: CT-LM2's place), a flower from Sigrun's cairn (in the Barrows: possible after the
   Barrow Road opens, or the hero can bring a pressed one from the Sunken Hall's treasury if SQ-HM2 is done), and a
   candle lit at the Lantern Tower's flame (the Abbey's yard: ask, or steal a light).
3. He teaches the **true rite** (`true_rite`): in MQ28 any wearer's oath "takes" at once (as a good forging would);
   and with the crown broken, the hero can speak the *end* of the promise to Hrathgar, which helps lay him to rest
   (Free Vale, `hrathgar: rested`, together with Sigrun).
- **Rewards**: 220 xp.

### SQ-LM5 — Penance
- **Opens** if `cuthwin_story` (SQ-BV4). **Giver**: Father Cuthwin, who walks all the way to the Abbey (the hero
  finds him at Gorse Hollow's alehouse, footsore). **Level** 10. **Time** 35 min.
1. Cuthwin means to confront the Lector before the chapter, as he should have twelve years ago.
2. The chapter house: Cuthwin speaks; Anselm answers him kindly and calls him confused, old, a deserter. The knights
   murmur. Odalys watches the hero.
3. That night Cuthwin is taken to a cell "for his health". Choice (`cuthwin`):
   - **Get him out** (a night-time rescue through the Abbey; knights to evade or fight) (`freed`): Cuthwin's testimony
     stands (`cuthwin_testimony`: evidence); Lantern -15 if seen.
   - **Ask Odalys to release him** (Lantern ≥ 40) (`released`): she does; and she starts to doubt (`odalys_doubts`:
     lowers the evidence needed in MQ22 by one).
   - **Leave him** (`held`): he's found dead in his cell in Act II ("his heart"). Brindleford -1 when they hear.
- **Rewards**: 220 xp.

### SQ-LM6 — The Fen Path
- **Giver**: Tam Gorse the shepherd ("my ewes go into the fen and don't come back"). **Level** 9. **Time** 30 min.
1. A light in the Black Fen leads sheep (and once a child) into the deep pools.
2. The **Drowned Knight** (560, 1020): the ghost of **Sir Lowell**, a Lantern knight who drowned there forty years ago
   carrying a message to Cairnfold; his lantern still lit, he walks the old path he can't find.
3. Find the old fen path (marker stones under the moss, a puzzle of firm ground) and walk it with him to Cairnfold's
   gate. He delivers his message (*"The Lector Gyrth is right. Do not let them change the words."*: lore, and points to
   SQ-LM4) and rests (`lowell: rested`).
4. The fen path stays open: a short way from the Moor Road to Cairnfold.
- **Rewards**: 180 xp; Sir Lowell's **lantern** (a light that also wards off ghosts' fear).

---

## Contracts

### CT-LM1 — The Grey Hounds of the Moor
- **Notice board** (Gorse Hollow): *"The grey hounds are back. Two shepherds' dogs and a pony this week. 110 silver.
  — H. Dunn."* **Level** 8. **Time** 20 min.
1. A wolf pack (6 wolves, level 8) and their leader, a white she-wolf (**Moonbelly**, level 9), hunting the moor at
   night in the mist (the mist hides them; they flank).
2. Their den under Curlew Tor.
- **Rewards**: 150 xp; 110 silver; a **white wolf pelt**.

### CT-LM2 — The Standing Man
- **Notice board** (the Abbey's gate, posted by Odalys): *"A dead man stands at the end of the Grey Stones and won't
  lie down. Knights sent have come back hurt. 160 silver."* **Level** 10. **Time** 25 min.
1. At the far end of the Grey Stones (1200, 600), a **barrow-draugr** (draugr, level 11) in old Barrow War iron
   stands facing north, unmoving, killing anyone who comes within the last three stones.
2. Lore at the stones: he's **Hrathgar's standard-bearer**, set there 300 years ago to "watch for the king's return".
   Something in him knows Hrathgar is waking.
3. Fight him (he calls the avenue's dead: 4 skeletons); or (with `true_rite` or `rite_of_rest`) tell him his king
   sleeps still: he lies down (`standing_man: rested`). His **banner** (barrow-iron pole: a weapon) either way.
- **Rewards**: 200 xp; 160 silver.
