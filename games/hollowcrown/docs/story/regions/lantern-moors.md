# Lantern Moors — the Abbey, Gorse Hollow, Cairnfold

**Tiles** x 300–1450, z 300–1500. **Levels** 6–11 (the Undercroft in Act III: 14). **Time** ~4 h of side content (6 side
quests, 2 contracts). **Mood**: purple heather, brown peat, white mist, standing stones, curlews; a great lantern burning
on a crag day and night; under the Abbey, singing in a language no one speaks.

Main quests here: MQ07, MQ08, MQ22, MQ23.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The moor** | most of the region, tiers 2–5 | Heather, rocks, peat cuttings |
| **The Abbey Crag** | (850, 800) | One road up its south side; the poppy terraces on its east slope |
| **Black Fen** | x 400–700, z 900–1150 | Bog, pools, mist; the Fen Path; at night, **the Sewn** who escaped the Abbey wander here, shrieking at sounds |
| **The Cold Spine's foot** | z 300–500 | Scree, the mountains |
| **The Grey Stones** | (1200, 600) | An avenue of thirty standing stones |
| **The Moor Road** | Reedby → (1350, 1700) → Gorse Hollow → the Abbey | |

## The Abbey of the Last Lantern (850, 800)
Walls on a crag; a gatehouse; the drill yard; the **Lantern Tower**; the chapter house; the chapel; the library and the
archive beneath; the refectory; the novices' dormitory (cold, twelve beds, eleven used); the smithy (**Brother Aedric**);
the infirmary (**Sister Hild Weller**); the **poppy terraces** (the Order's cemetery, white with poppy, novices
bleeding the heads); and the **Undercroft** beneath the chapel: the Order's dead in niches, the **Listening Hall**, the
**Oathforge**.
People: **Anselm**, **Odalys**, **Aedric**, **Brother Ninian** (archivist, short-sighted gossip), **Sister Hild**,
**Novice Bryn** (17), **Brother Hode** (quartermaster; he sews the Listeners' eyes; gentle hands, a hymn under his
breath), **Brother Leofric** visits from Kingsmere.

## Gorse Hollow — village (1050, 1150)
9 turf-roofed stone houses, peat stacks, **The Smoking Turf** alehouse. Barrowborn, nearly all: grey eyes, the old
names. They owe the Abbey a tithe of peat. Reeve **Hamish Dunn**, peat-cutter **Morag Gale**, alewife **Effie Lusk**,
shepherd **Tam Gorse**; Bryn's mother, **Ailsa**, who hasn't seen her daughter in two years.

## Cairnfold (550, 1250)
The ruined hill fort of the Night of Lanterns: broken ring walls, the burned barrow-halls (black stone, bones fused in
the walls), the keep stump; the crypt beneath (MQ08). The **Hermit** in a cell in the outer wall. After MQ22, at night,
**the Ashen** walk the burned halls, smouldering, small ones among them; they don't leave the ring walls; they pass the
Hermit's cell every night and he reads them names until dawn.

## Landmarks
| Landmark | (x, z) | What |
|---|---|---|
| **The Grey Stones** | 1200, 600 | CT-LM2 |
| **The Drowned Knight** | 560, 1020 | A knight's armour sunk in the fen; a ghost at night (SQ-LM6) |
| **Curlew Tor** | 1300, 900 | View to the barrows; a chest (**moor-walker's boots**) |
| **The Peat Bodies** | 1150, 1250 | Gorse Hollow's cutting (SQ-LM2) |

---

## Side quests

### SQ-LM1 — The Novice
- **Giver**: Bryn, at the hero's door at night (MQ07), then in the stables. **Level** 7. **Time** 30 min.
1. Bryn wants to go home to Gorse Hollow; novices who leave cost their families a fine of peat they can't pay. She's been
   "chosen for the vigil" next month. She doesn't know what it is. She's heard the singing under the floor.
2. The hero can look: the door to the Undercroft is barred at night; through the grate, poppy-lamp light, murmuring, a
   girl's voice reciting something in barrow-tongue with the cadence of a prayer.
3. Choice (`bryn`): **help her escape** (sneak out past the gate watch; Lantern -10 if caught) (`escaped`: she gives
   `bryn_voices`; at home, Ailsa weeps); **ask Odalys** to release her (Lantern ≥ 20) (`released`: Odalys does, saying
   "the vigil is an honour", and looks troubled); **send her back to bed** (`stayed`: she's in the Listening Hall in MQ23,
   eyes sewn).
- **Rewards**: 150 xp.

### SQ-LM2 — Peat and Bones
- **Giver**: Morag Gale. **Level** 8. **Time** 35 min.
1. Bodies come up in the peat cutting, brown and perfect; last week one sat up and spoke.
2. Night at the cutting: 4 **bog draugr** (level 8) and a broken oath-iron ward in the lowest face.
3. **The turn**: the bodies have their hands bound behind them and nooses of plaited rush round their necks: the
   **Gorse Hollow rising**, 80 years ago, when the Barrowborn refused a tithe; the Lantern drowned forty of them in the
   bog and warded it. Morag's grandmother is among them; the cutters knew; nobody said.
4. The Abbey has doubled the tithe this year; the cutters dug deep to pay it.
5. Choice (`peat`): **mend the ward** (Aedric, Tobin, or 80 silver from Hode) (`warded`: the dead sleep, unburied);
   **bury them properly** (the hero and the village carry forty bodies up to the hill, with Cuthwin's rite if known)
   (`buried`: Gorse Hollow +2; the Abbey is insulted; Lantern -5); **take the ward and the nooses to Odalys** (`tithe_cut`:
   she halves the tithe and doesn't know what to say about the nooses; Lantern -5, Gorse Hollow +1; `odalys_doubts`).
- **Rewards**: 200 xp; peat-smoked ale.

### SQ-LM3 — The Archive
- **Giver**: Odalys (after MQ08, if `told_odalys_wynfrith`), or Brother Ninian's gossip. **Level** 9. **Time** 40 min.
1. Odalys has never seen the coronation rite written. Ninian says the Lector took the oldest books to his rooms.
2. The archive (dust, ghost-candles); Ninian's help or his key.
3. Found: the **smith-book** (`smith_book`); the rite as always spoken; **Anselm's notes** (the changed words, dated, and
   the vigil roll: forty novices, ages, "rested") (`archive_pages`); and the **First Lector's chronicle** of the Night of
   Lanterns, in his own words, proud (`cairnfold_chronicle`: the Order's founding atrocity, written down).
4. Anselm on the stair as the hero reads. *"The past is a terrible teacher, child, and the only one we have."* He lets
   them go. From now the knights watch the hero.
- **Rewards**: 220 xp.

### SQ-LM4 — The Hermit of Cairnfold
- **Giver**: the Hermit (after MQ08). **Level** 10. **Time** 35 min.
1. **Gyrth** (90, half-blind), Lector before Anselm, deposed and forgotten. He knows the oldest form of the Oath: a
   surrender with a promise, and the promise's lost half (*rule my children justly*).
2. Three things for the true words: water from the spring at the Grey Stones; a white rose from Sigrun's Cairn (the
   Barrows' fringe) or a pressed one from the Sunken Hall; a candle lit at the Lantern Tower's flame.
3. He teaches the **true rite** (`true_rite`): a wearer's oath takes at once in MQ28, and the hero can speak the
   promise's *end* (Free Vale, with Sigrun: `hrathgar: rested`). And he confesses: he was the Lector who first let the
   Order farm the poppy, forty years ago, "to pay for steel". *"Everything Anselm built, he built on my floor."*
- **Rewards**: 220 xp.

### SQ-LM5 — Penance
- **Opens** with `cuthwin_story`. **Giver**: Cuthwin, footsore at the Smoking Turf. **Level** 10. **Time** 40 min.
1. Cuthwin will accuse the Lector before the chapter, and **Brother Hode** with him.
2. The chapter house: Cuthwin speaks; Anselm, kindly, calls him confused, a deserter; Hode says nothing and sews a button
   on his sleeve while he listens. Odalys watches the hero.
3. That night Cuthwin is taken to a cell "for his health". Choice (`cuthwin`): **get him out** (night, knights to evade or
   fight; Lantern -15 if seen) (`freed`: `cuthwin_testimony`); **ask Odalys** (Lantern ≥ 40) (`released`:
   `odalys_doubts`); **leave him** (`held`: found dead in the cell, "his heart"; Hode was the last to see him).
4. Hode, at any time after, can be confronted alone in his workroom: he shows the hero the needle, gently, and asks if
   they'd like to see how it's done. (A fight, if the hero wants one: `hode_dead`.)
- **Rewards**: 220 xp.

### SQ-LM6 — The Fen Path
- **Giver**: Tam Gorse ("my ewes go into the fen and don't come back"). **Level** 9. **Time** 30 min.
1. A light in the Black Fen leads sheep, and once a child, into the pools.
2. **Sir Lowell**, a knight drowned forty years ago carrying a message to Cairnfold, lantern still lit.
3. The old fen path (marker stones under moss, a puzzle of firm ground) to Cairnfold's gate. He delivers his message to
   the Hermit: *"The Lector Gyrth is right. Do not let them sell the graves."* (Gyrth weeps.) Lowell rests.
- **Rewards**: 180 xp; Sir Lowell's **lantern**.

---

## Contracts

### CT-LM1 — The Grey Hounds of the Moor
- **Board** (Gorse Hollow): *"The grey hounds are back. 110 silver. — H. Dunn."* **Level** 8. **Time** 20 min.
1. Six wolves and a white she-wolf, **Moonbelly**, hunting in the mist; den under Curlew Tor.
2. **The turn**: they hunt Gorse Hollow's sheep because the Abbey's poppy terraces' runoff poisoned the moor hares; the
   den is full of starved cubs. Kill them (`killed`), or bring Hode's poppy-cake accounts to Odalys and get the terraces
   drained to the fen (`terraces_drained`, half pay, Lantern -5).
- **Rewards**: 150 xp; 110 silver; a **white wolf pelt** if killed.

### CT-LM2 — The Standing Man
- **Board** (the Abbey gate, from Odalys): *"A dead man stands at the end of the Grey Stones. 160 silver."* **Level** 10.
  **Time** 25 min.
1. A **barrow-draugr** in Barrow War iron facing north, killing anyone past the last three stones.
2. **The turn**: Hrathgar's standard-bearer, set to "watch for the king's return"; carved on the last stone, in
   barrow-tongue (readable with `cairn_names` or Grey Edda's help): the names of his children, burned at Cairnfold.
3. Fight him (and 4 skeletons), or, with the true rite or the Rite of Rest, tell him his king still sleeps, and read him
   his children's names (`rested`). His **banner pole** either way.
- **Rewards**: 200 xp; 160 silver.
