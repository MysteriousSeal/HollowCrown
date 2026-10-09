# Main Quest — Prologue and Act I

Each quest: who starts it, where, the level it expects, how long it takes, then its steps, its choices (the flags
they set and the reputation they move: [choices.md](choices.md)), its rewards and its journal entry. Places and
people of Brindle Vale are detailed in [regions/brindle-vale.md](regions/brindle-vale.md).

---

# Prologue — *The Stranger at the Ford* (Brindle Vale, ~3 h)

The prologue teaches walking, fighting, looting, talking, the journal and the first choice. It ends when the hero
leaves Brindle Vale.

## MQ01 — The Stranger at the Ford
- **Starts**: the game's start. **Where**: Pilgrim's Shrine (480, 3380) → Brindleford (900, 3350).
- **Level** 1. **Time** 30 min.
1. **Waking** at dusk on the pilgrim road by the Pilgrim's Shrine, in underclothes: the Red Hen's bandits took
   everything. A hen feather, dyed red, lies in the mud (`item: red feather`). The shrine's offering bowl holds a
   rusty **knife** and 3 copper (the first loot). Journal opens: *"Robbed on the road into the Vale. A red feather is
   all they left. There's a village east: lights, smoke."*
2. **The road east** (420 tiles): two wolves at the Birchwood's north edge (650, 3420) teach the fight (level 1). A
   dead pilgrim by the road has a **padded jerkin** and a **walking staff**.
3. **Brindleford**, night falling. The chapel bell rings on the hill, though the chapel has had no bell-tongue for
   forty years. Villagers run inside; **Reeve Odo Pell** shouts at the stranger to get indoors.
4. **The Ferryman's Rest**: **Garrick Fenn** lets the hero in, gives bread and a bed "on account". **Elsa** brings
   soup. Talk: Garrick asks where the hero's from (the first dialogue choice the game remembers: `hero_reason` =
   `work`/`forget`/`road`).
5. **Midnight**: ghosts drift down from the chapel into the village (4 ghosts, level 1–2). Garrick takes up an oar
   and goes out; the hero follows (or stays: Garrick is knocked down and Elsa begs for help: the quest goes on either
   way). Defend the square: the ghosts fade at the well when struck down.
6. Dawn. Pell, shaken, gathers the village at the well. Father **Cuthwin** says the dead came from the **Bellwarden's
   Tomb** under the chapel. No one will go. Garrick: "The stranger fought them. The stranger owes us a bed."
- **Rewards**: 40 xp; the bed at the inn (free while in Brindleford); Garrick's spare **boatman's coat**.
- **Journal**: *"The dead walked into Brindleford tonight. The priest says they came from the tomb under the old
  chapel. Everyone looks at me."*

## MQ02 — The Quiet Bell
- **Starts**: end of MQ01. **Giver**: Father Cuthwin, Reeve Pell. **Where**: Chapel of the Quiet Bell (1080, 3180),
  the Bellwarden's Tomb below.
- **Level** 2. **Time** 50 min.
1. Pell gives the **reeve's old sword** ("Regency property, mind"). Cuthwin gives a **lantern-oil flask** (heals) and
   tells the legend: Sir **Hamund**, the Bellwarden, a knight of the Oath buried with the chapel bell's tongue, "to
   ring if the dead ever rose, to wake the living".
2. The chapel ruin: broken walls, a skeleton pair at the altar (level 2). The stairs down are sealed by an
   **oath-iron grate**, frosted white. Cuthwin's hands blister with cold at the bars; the hero's don't. *"It's only
   iron to you,"* Cuthwin says, very quietly. (`hero_unsworn_seen`)
3. **The Bellwarden's Tomb** (crypt, 3 halls, level 2–3): skeletons, two ghosts, a pit trap, a side niche with
   Hamund's journal page ("If the crown fails, the bell will ring by itself. Then someone must go to the Lantern.").
4. **Sir Hamund**, crypt lord (level 3): his ghost rises with the bell-tongue in his hand. At half health he stops:
   *"Unsworn. You're not of the Oath. Then you can carry what we can't. The crown is broken. The Oath is failing. Tell
   the Lantern."* Choice:
   - **Fight to the end**: he falls, drops the **Bell-Tongue** and **Hamund's sword** (`hamund: destroyed`).
   - **Let him finish his watch** (talk): he lays the tongue down and fades in peace; no sword, but **Hamund's
     blessing** (+5% max health, permanent) and Cuthwin's gratitude later (`hamund: rested`, Lantern +5).
5. Back to Brindleford. If the hero gives Cuthwin the Bell-Tongue, SQ-BV4 starts.
- **Rewards**: 120 xp, 20 copper from Pell, the Bell-Tongue.
- **Journal**: *"Sir Hamund, the Bellwarden, called me Unsworn. The crown is broken and the Oath is failing, he said.
  Oath-iron froze the priest's hands, and didn't touch mine."*

## MQ03 — The Red Hen
- **Starts**: MQ02 done, or on talking to Pell about the robbery. **Giver**: Reeve Pell (the Regency's bounty), or
  Garrick (who recognises the red feather). **Where**: Red Hen camp (620, 3560) in the Birchwood.
- **Level** 3. **Time** 40 min.
1. Pell: the Red Hen's band has robbed every pilgrim for a month. A bounty: 50 copper for **Brannoc Mabb**, "alive to
   hang, dead to bury".
2. Track them: the dyed feathers on the trail; the Hanging Oak (1000, 3480) where they left a note for a fence
   ("Wednesday, the miller's sacks").
3. **The camp**: palisade, 5 bandits (level 2–3) and Brannoc (bandit chief, level 4). The hero's stolen belongings
   are in the camp chest (their coin, a **traveller's pack**: +4 bag slots).
4. At low health Brannoc throws down his cleaver: *"I'm Greenhood, me. Wren's man. Hang me and the woods'll remember
   it."* Choice (`bv_red_hen`):
   - **Bring him to Pell to hang** (`hanged`): Regency +15, Greenhood -15, Brindleford +1. He's hanged at the well.
     Wren knows of it in MQ09 (cold).
   - **Kill him** (`killed`): Regency +5, Greenhood -5. Title *the Red Hen's Bane*.
   - **Send him to Wren for judgment** (`to_wren`): Greenhood +15, Regency -10, Brindleford -1 (Pell is furious).
     He carries a message; Wren knows the hero's name in MQ09.
   - **Let him go** for his purse (`spared`, +30 copper): no reputation change; Brindleford -1. He reappears in SQ-GW7.
- **Rewards**: 150 xp, the bounty (if hanged or killed), the hero's belongings.
- **Journal** (by choice): *"The Red Hen has hanged at the well."* / *"Brannoc will face Wren Halloway's judgment, he
  swears."* …

## MQ04 — Three Roads
- **Starts**: MQ02 and MQ03 done. **Where**: Brindleford, then Hob's Tower checkpoint (1400, 3000).
- **Level** 4. **Time** 30 min.
1. Three messages reach the hero at the Ferryman's Rest, the same evening:
   - **The Regency**: Pell's report went to Kingsmere; a sealed summons from the Lord Regent: *"The person who opened
     the Bellwarden's grate is to present themselves at the Regent's Hall."* (always)
   - **The Lantern**: Cuthwin wrote to Sister-Captain Odalys; her reply, carried by a novice: *"Send the unsworn one
     to the Abbey."* (always)
   - **The Greenhood**: a wren's feather and a scrap of birch bark pushed under the door: *"The Hollow Oak. Come
     alone. — W."* (always; its tone depends on `bv_red_hen`: if hanged, *"You hanged one of mine. Come and explain
     yourself."*)
2. **Garrick**, late, by the fire (the first hint): *"Three roads, and every one of them wants the same thing. They
   want the crown. Whatever they tell you."* He tells the public story of the Night of Still Water (the king drowned,
   the princess lost, the crown found broken) and stops short. *"I rowed that boat for twenty years. Not that night.
   That night I was ill."* (a lie; `garrick_lied_once`)
3. **Hob's Tower checkpoint**: the Regency's sergeant **Matthias Crow** lets the hero through with the Regent's
   summons. The Vale opens.
- **Rewards**: 100 xp; Garrick's **ferry token** (free passage on Hollowmere's ferries: Reedby, Elderwick, the isle
  once it's open).
- **Journal**: *"The Regent, the Lantern and the Greenhood all want to see me. Garrick says they all want the crown.
  I think Garrick knows more than he says about the night it broke."*

---

# Act I — *Three Claims* (~7 h)

The three factions court the hero. The order is free: Kingsmere (MQ05–06), the Abbey (MQ07–08), the Greenwood
(MQ09–10). When all three have been met, MQ11 starts. The act ends with MQ12.

## MQ05 — The Regent's Court
- **Where**: Kingsmere (2100, 2550), the Regent's Hall. **Level** 5. **Time** 40 min.
1. Kingsmere: walls, a lake harbour, the market, the gallows square (SQ-HM4), the Regent's Hall with its grey heron
   banners. The steward **Benedikt Orme** keeps the hero waiting (an hour of game time; the hero can explore).
2. **Corvin**, in his study, gloved. He knows about the grate. He tests the hero with a small oath-iron key on the
   desk: "Pick it up." The hero does; he flinches. *"So it's true."* He tells the "official" story of Still Water.
   He wants the crown reforged and the Vale safe; he offers the hero a place: "the Regent's Hand", if they serve.
3. **Aldous** interrupts, eager to meet "the one who went into the tomb". Corvin sends him out (seeds SQ-HM3).
4. **Sabeline**, in the corridor, introduces herself: "If the Regent ever disappoints you, I'm two doors down. Carrow
   pays in gold, not promises." (seeds MQ15)
5. Corvin's first task: **MQ06**.
- **Rewards**: 80 xp; the **Regency writ** (free passage at all checkpoints; Regency guards will answer the hero).
- **Journal**: *"The Lord Regent wears gloves indoors. He watched my hand on the oath-iron like a man watching a coin
  fall."*

## MQ06 — The Tax Cart
- **Giver**: Corvin. **Where**: Reedby (1550, 2050) → the Lake Road → Kingsmere. **Level** 6. **Time** 45 min.
1. Escort the quarter's tax cart from Reedby to Kingsmere with two Regency guards and the tax clerk **Hiram Bose**.
   Reedby's fishers watch it go in silence; a widow begs for her share of the grain back.
2. At the Weeping Willows (1800, 2350) the **Greenhood** blocks the road: **Pip Tanner** and six archers. Pip,
   politely: *"Grain's going back to the people it was taken from. Nobody needs to bleed."*
3. Choice (`mq06_cart`):
   - **Defend the cart** (`defended`): fight Pip's archers (they retreat at half losses; Pip escapes). Regency +15,
     Greenhood -15, Reedby -1. Corvin: *"Good. You've a head for sums."*
   - **Stand aside** (`given`): the Greenhood takes the cart; the guards curse the hero. Greenhood +15, Regency -15,
     Reedby +1. Corvin is cold in the next meeting; the summons stays.
   - **The middle way** (persuade, needs Brindleford ≥ +1 or Greenhood ≥ 20): half the grain goes back to Reedby,
     half to Kingsmere; Hiram writes "lost to bandits" in the book (`split`): Regency -5, Greenhood +5, Reedby +2.
     Hiram owes the hero (SQ-HM5).
- **Rewards**: 160 xp; 60 copper from Corvin (defended) or a Greenhood **wren token** (given/split: lets the hero find
  the Hollow Oak without tracking).

## MQ07 — The Abbey on the Moor
- **Giver**: Odalys's letter. **Where**: the Moor Road → Gorse Hollow (1050, 1150) → the Abbey (850, 800).
  **Level** 7. **Time** 40 min.
1. The Moor Road climbs from Reedby into heather and mist; standing stones; a grey hound pack (level 6).
2. **Gorse Hollow**: a peat village under the Abbey; the Order's tithe-wagon is loading their peat (seeds SQ-LM2).
3. **The Abbey**: a walled keep of grey stone on a crag, the great lantern burning on its tower day and night.
   **Odalys** receives the hero in the yard among drilling knights. She doesn't waste words: she holds out an
   oath-iron reliquary; her gauntlet frosts. The hero takes it bare-handed. Knights murmur.
4. **Lector Anselm** in the chapter house: gentle, curious, asks about the hero's homeland, blesses them. He explains
   the Oath (the public version: the crown keeps the dead asleep; it must be reforged at the Oathforge and the rite
   spoken). He doesn't mention who should wear it. *"The pieces will come to you, I think. Iron finds the hands that
   can hold it."*
5. Odalys's test: **MQ08**.
- **Rewards**: 80 xp; Lantern +5; a **lantern charm** (ghosts' blows -10%).

## MQ08 — Cairnfold
- **Giver**: Odalys. **Where**: Cairnfold ruin and crypt (550, 1250). **Level** 8. **Time** 60 min.
1. Cairnfold's crypt has broken open; three Lantern knights went in two days ago. Odalys goes with the hero (a
   companion for this quest: she fights with a mace, heals once).
2. The ruined keep above: skeleton archers on the walls (level 7).
3. **The crypt**: an oath-iron reliquary chain seals each hall; only the hero can open them. Odalys's reactions show
   her: she makes the hero go first, she guards their back, she prays for the dead she breaks.
4. The three knights: two dead, one alive (**Brother Aedric**, the Abbey's forge-brother, trapped behind a fallen
   ward). He thanks the hero; he'll matter at the Oathforge (MQ23: `aedric_alive`).
5. **The crypt lord**: **Abbess Wynfrith**, a Lantern abbess of a hundred years ago, risen (level 9, calls skeletons).
   Dying, she whispers: *"Anselm... practising the words... the dead don't sleep, they listen..."* Odalys hears
   only "Anselm". She doesn't understand it. (`wynfrith_warning`; a seed for exposing Anselm.)
- **Choice**: none here; whether the hero tells Odalys what Wynfrith said in full matters later (`told_odalys_wynfrith`).
- **Rewards**: 220 xp; Lantern +15; Odalys's **knight's mace** or 80 silver; access to the Abbey's smith and stores.

## MQ09 — The Hood in the Wood
- **Giver**: the birch-bark note. **Where**: the Wood Road → Thornbeck (3000, 2300) → Oakhallow (3200, 1500) → the
  Hollow Oak (3600, 1100). **Level** 7. **Time** 45 min.
1. **Thornbeck**: a Regency garrison village; Captain **Ilse Varrow** warns the hero off the deep wood (seeds
   SQ-GW2).
2. **Oakhallow**: woodcutters, a village that loves the Greenhood; they won't say where the camp is unless the hero
   has the wren token, Greenhood ≥ 20, or does a favour (SQ-GW3's first step).
3. Finding the Hollow Oak: a trail of wren carvings on trees (tracking), past a lynx's den (level 8).
4. **The Hollow Oak**: a camp round and inside a vast hollow oak; children, the wounded, smoke, a hanging larder.
   **Wren** meets the hero with a bow half-drawn. Her greeting depends on `bv_red_hen` (to_wren: *"Brannoc told me.
   You could've hanged him and you didn't. That's a start."*; hanged: *"Brannoc was a thief and a bully. He was also
   mine to judge."*).
5. Wren's view of the crown: *"Kings are bandits who got there first. If you find the pieces, throw them in the
   sea."* She wants a test of the hero's side: **MQ10**.
- **Rewards**: 80 xp; Greenhood +5.

## MQ10 — Bread and Arrows
- **Giver**: Wren. **Where**: Thornbeck's tithe barn (3020, 2280). **Level** 8. **Time** 50 min.
1. The Regency's grain for the winter garrison sits in Thornbeck's tithe barn; Oakhallow is starving. Wren plans a
   night raid and wants the hero to open the barn's lock (an oath-iron lock: the Regency uses old Lantern locks for
   its stores).
2. Scout Thornbeck: the garrison's watch rota (Captain Varrow is decent; her men are tired, hungry too).
3. Choice (`mq10_raid`):
   - **Open the barn for Wren** (`raided`): a night raid; the hero holds the gate against the watch (non-lethal by
     choice, or not). Greenhood +20, Regency -20, Oakhallow +2, Thornbeck -2. If guards were killed (`raid_blood`),
     Captain Varrow hates the hero (SQ-GW2 closed).
   - **Warn Captain Varrow** (`warned`): the raid walks into an ambush; Pip is captured (Wren must be talked out of
     killing the hero; hero escapes the camp). Regency +20, Greenhood -30, Thornbeck +2, Oakhallow -2. Pip is to hang
     in Kingsmere (SQ-HM4 can save him).
   - **Talk Varrow into sharing the grain** (needs SQ-GW2 done, or Regency ≥ 20 and Greenhood ≥ 20): Varrow opens the
     barn to Oakhallow "for the winter's peace" (`shared`): Regency -5, Greenhood +10, Thornbeck +1, Oakhallow +2.
     Varrow is reprimanded by Kingsmere; Wren respects the hero more than any outcome.
- **Rewards**: 220 xp; a Greenhood **longbow** (raided/shared) or 80 silver from Varrow (warned).

## MQ11 — What the Ferryman Saw
- **Starts**: MQ05, MQ07 and MQ09 done. **Where**: Brindleford, the Ferryman's Rest (Garrick sends for the hero), or
  Kingsmere if Garrick has come to market. **Level** 9. **Time** 30 min.
1. Elsa sends word: her father's drinking himself sick since the stranger left. Garrick, drunk at the fire, finally
   talks: there were three on the boat that night besides himself. The king. The Lord Regent, then chancellor. The
   princess. *"I said I was ill. I wasn't ill."* He won't say what happened, only: *"The king went in. The crown went
   in, I heard it go. It broke on the gunwale, three ways, and I heard one piece hit the water. You want the crown?
   Ask the lake."*
2. The **ferry token** now opens the ferry to the **Drowned Chantry** isle: no one has gone there in seven years.
- **Choice**: press Garrick for more (he breaks down; Brindleford -1, `garrick_pressed`) or let him sleep
  (`garrick_spared`: he trusts the hero, needed for his full testimony later).
- **Rewards**: 60 xp.

## MQ12 — Still Water
- **Where**: the Reedby ferry → the Drowned Chantry isle (2050, 1950), crypt below. **Level** 10. **Time** 70 min.
1. Reedby's ferrywoman **Agnes Lark** rows the hero out at dusk ("seven years, and I never once rowed this way").
2. The isle: a sunken chapel half under water, the royal ferry's wreck beached in the reeds (it was dragged here by
   the lake, against all sense). On the wreck: the oath-iron **rowlock**, scarred where the crown struck it.
3. **The Drowned Chantry** (crypt, flooded halls, level 9–10): drowned courtiers (ghosts), skeletons rising from the
   water, a flooded hall the hero crosses on the tops of tombs.
4. **The vision**: in the chantry's heart, the ghosts re-enact the Night of Still Water in light on the water, but
   only in pieces: the boat, the king standing, a raised voice, *two* figures struggling, one going over, an oar held
   down by a gloved hand (the face never shown), a girl in the water. The ghosts whisper: *"What the lake takes, the
   sea keeps."*
5. **The crypt lord**: **the Drowned Chamberlain**, Lord Osbert Hale (level 11), who drowned trying to save the king
   (he dove after him). Laid to rest, he tells the hero: Hollowmere drains under the hills to the sea, at **Gullmouth**
   on the Saltreach Coast. *"The king went with the water. So did his iron."*
- **Rewards**: 300 xp; Lantern +5 (the chantry's dead laid to rest); the **Chamberlain's signet** (opens Kingsmere's
  old water-gate: the heist route in MQ20).
- **Journal**: *"The lake showed me the night the king drowned: someone held the oar down while he drowned, someone in
  gloves. And the iron went with the water, to the sea, to a place called Gullmouth."*
- **Act I ends.** The Act I summary scroll shows the three factions' standing and what the hero did.
