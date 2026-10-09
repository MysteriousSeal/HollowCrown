# Main Quest — Act II: *The Pieces* (~8.5 h)

The hero goes after the three pieces. The Brow first (MQ13–MQ15); then Millbrook (MQ16–MQ19) and the vault (MQ20) in
either order; MQ21 needs both; MQ22 ends the act. A piece sits in its own bag slot (can't be sold, dropped, stored);
people near it feel the cold and step back. From the first piece, the hero dreams (*The Hollow Voice*, below).

---

## MQ13 — Gullhaven
- **Starts**: MQ12. **Where**: the Salt Road → Gullhaven (320, 2150). **Level** 10. **Time** 50 min.
1. Gullhaven: houses climbing a cliff cleft, nets, gulls, the fish market, the Regency's outnumbered harbour warden
   **Wystan Coyle**, and **Nell Corrigan**'s people everywhere else.
2. Gullmouth (200, 1750) is reachable only by boat at low tide; Coyle won't lend his ("that water eats boats"); Nell
   will. She receives the hero in **the Milk House** over her warehouse: smoke, cushions, curtains, sleepers rich and
   poor in rows with their eyes open, talking softly to people who aren't there; the madam **Mother Sorrow** moving
   among them with a lamp. A sleeper grips the hero's sleeve: *"My boy's here, he's here, can't you see him?"* Nell,
   unbothered: *"I sell what people want. If they want the wrong things, take it up with the gods."*
3. If `hesper_safe` is false: **Hesper Rowe** works here now, poppy-eyed, and pretends not to know the hero. The hero
   can pay Nell for her debt (60 silver) and get her out (`hesper_freed`), or leave her.
4. The boat (`mq13_boat`): **pay** Nell 150 silver (`paid`); **a favour**: SQ-SR1 first (`favour`); or **commandeer**
   the warden's cutter (Regency ≥ 20) (`commandeered`: Gullhaven -1; Nell refuses all later work).
- **Rewards**: 80 xp.

## MQ14 — The Drowned King
- **Where**: Gullmouth Sea Cave. **Level** 11. **Time** 75 min.
1. Rowing in at low tide past the Gull Light's rocks; inside, a cathedral of rock where the lake's underground river
   falls into the sea; the light green and wrong.
2. **The cave** (3 levels; the lowest floods at the tide's turn, pushing the hero upward): cave worms, bats, drowned
   sailors; a wreck inside the cave with Carrow coin and the bodies of Sabeline's last divers, crabs in their eye-holes.
3. **King Edric** (crypt lord, level 12): seven years in salt water, swollen, white, crusted with barnacles, the **Brow**
   on his head like a crown, sea-lice in his beard. Two phases; between them, lucid: *"Corvin... let go of the oar,
   Corvin, I'm sorry, I'll not sign... Rhosyn? Where's my girl — Maelis — "*
4. Choice (`edric`):
   - **Lay him to rest** (needs `rite_of_rest` or the lantern charm): he kneels in the water; he asks the hero to tell
     his daughter he was sorry *"for Haakon, for all of it"*; he gives the Brow and his **locket** (a painting of a girl
     of fourteen) (`rested`).
   - **Destroy him**: the Brow and the locket fall (`destroyed`).
   - **Bind him** for the Lantern (Lantern ≥ 20): a chain of oath-iron; he follows the hero out like a dog, weeping
     seawater; delivered to the Abbey; Anselm will use him (`bound`); the locket is lost.
5. **The Brow** in the hero's hand: frost runs up the walls. Out on the rising tide.
- **Rewards**: 400 xp; the Brow; the locket; 200 silver of Carrow coin.

### The Hollow Voice (MQ14 onward)
Each time the hero sleeps while holding a piece, a short dream: a barrow, a stone, a voice. **Hrathgar** never
threatens. He bargains and he tells his side, a little each time, in order:
1. *"You carry my iron. It was my crown before they hollowed it. Did they tell you that?"*
2. Cairnfold: *"Four thousand. My wives. My grandchildren. They sealed the doors and lit them with lanterns. Ask the
   Lantern why it's called the Lantern."*
3. Sigrun: *"They say she loved him. She was twenty and he took her on the floor of my burning hall. Is that a love
   song, in your country?"*
4. The Oath: *"I lay down so the rest would live. Their crown is my chain. Your kings swore to rule my children justly in
   return. Look at my children. Go to the Ditch and look."*
5. The offer: *"Bring me my iron. I'll give you anything the dead have. They have a great deal."*
The hero answers each (tones). Answers that listen honestly (not agreeing, not mocking) raise `hrathgar_rapport` (0..3).

## MQ15 — The Envoy's Offer
- **Starts**: returning to a town with the Brow. **Where**: Sabeline finds the hero. **Level** 11. **Time** 25 min.
1. **Sabeline** knows (her divers died in that cave). 2,000 silver for the Brow, or its location. Honest: Carrow would
   melt it. *"No crown, no oath, no dead in our way. Your Vale would be free of its ghosts, and ours to dig. Is that so
   very bad? Ask your Barrowborn what the crown has done for them."*
2. Choice (`mq15_sabeline`): **refuse** (`refused`; romance beat if done with charm); **sell** (`sold`: steal it back
   from her courier on the Wood Road; she becomes an enemy and sells the hero's movements: ambushes in Act II);
   **pretend to consider** and learn her network (`played`: needs SQ-HM5 begun; she names her grave-robbers and her
   man in the Hall).
- **Rewards**: 60 xp.

## MQ16 — Ketter's Trail
- **Starts**: MQ14 (with the locket, or a rumour in Kingsmere: a hunter asking after "a red-haired girl of twenty-two").
  **Where**: Kingsmere → Southfields → Millbrook. **Level** 11. **Time** 40 min.
1. *The Heron and Pike*: a drunk Regency clerk on "the Regent's private hunter" paid from the secret purse.
2. The trail: a wolfhound's prints; **Larkspur**, half burned, half fevered, its people spitting at Lantern charms; the
   **Deserters' camp**, paid by Ketter for information.
3. **Millbrook**: Ketter at *the Barley Mow*, dicing with Biscuit at his feet: *"We're after the same thing, I think.
   Shall we not make it messy?"* If the hero asks why he does this work, he shows a child's ribbon: *"Somebody in Carrow
   has my daughter. Somebody always has somebody's daughter."*
- **Choice**: talk; or threaten him (`ketter_warned`: he leaves for a day).
- **Rewards**: 120 xp.

## MQ17 — The Herbalist of Millbrook
- **Where**: Millbrook, Hesk's cottage and the fever barn. **Level** 12. **Time** 45 min.
1. **Isolde** in the fever barn: forty sick from Larkspur on straw, the smell, a man screaming while she lances a
   bubo on his neck: *"Hold him. No — hold him properly."* (The hero can; romance beat.) She feels the Brow's cold from
   across the barn and goes white.
2. At night, at the hives, she asks why the hero carries "a piece of a crown". The truth or a lie (`told_isolde_truth`).
   The locket, shown: she takes it, sits down in the grass, doesn't cry, asks the hero to leave, and comes to the inn at
   midnight.
3. The hero notices (an observation prompt): her lips faintly blue, her pupils pinned, a poppy cup by her bed (SQ-SF7).
4. Her deal: cure Larkspur and she'll tell what she knows: **MQ18**.
- **Rewards**: 100 xp; Millbrook +1.

## MQ18 — Larkspur Barrow
- **Giver**: Isolde. **Where**: Larkspur → Larkspur Barrow (3650, 3350). **Level** 12. **Time** 80 min.
1. Larkspur: the **Burned Row**: Odalys's knights nailed five sick houses shut and burned them, eleven inside. The
   headwoman **Rosamund Pye**: *"We heard them. All afternoon. The knights sang hymns to cover it."*
2. Isolde's theory: the fever is *grave-rot* from the barrow on the hill, opened last spring by **poppy-diggers**:
   Larkspur's own sleepers, digging the barrow-witch's grave to plant poppy on her.
3. **Larkspur Barrow** (crypt, level 12): diseased skeletons (blows cause **rot**: a new debuff), rats, the diggers'
   bodies (the poppy grows out of them now), the witch's chamber.
4. **Old Mother Grisel** (crypt lord, level 13): rot-ghosts, a poisoned floor. Dying: *"They planted their flowers in
   my mouth. Let them eat what grows."*
5. Seal the grave with the oath-iron ward; gather barrow-moss.
6. Back in Larkspur (`larkspur`):
   - **Cure** (default, a day of game time): Larkspur +3, Millbrook +1.
   - **A Lantern patrol comes to burn the sick houses** "before the cure's proven" (only if Lantern ≥ 20 and the hero
     told the Lantern where they were going): stand them off (talk: Lantern -10; fight: Lantern -30) or let them burn
     (`burned`: Larkspur -3, Lantern +10; Isolde never takes the crown and won't give the Heart: it must be taken).
- **Rewards**: 450 xp; a **charm of mallow**.

## MQ19 — Ketter
- **Starts**: MQ18. **Where**: Millbrook, at night. **Level** 13. **Time** 45 min.
1. Isolde, if she trusts the hero: she is **Maelis**. She saw a gloved hand on the oar; she saw Rhosyn drown calling
   for her, and *"the ferryman rowing away from her, and then coming back for me, and I've never known what to do with
   that"*. She has the **Heart** under the third hive.
2. **Ketter** comes with three deserters and Biscuit. A fight through the lanes and the hive garden (the hives can be
   knocked over: a swarm that hurts everyone). Ketter beaten, alive: Corvin hired him to bring her "quietly"; he sold
   the same news to Sabeline; and *"Ferrand has my Lina. If I come back with nothing, she goes to Haakon's household.
   You know what that means. Everyone in Carrow knows what that means."*
3. Choice (`ketter`): **kill him** (`dead`; Biscuit stays with the hero: barks at hidden things); **turn him** with
   300 silver or a persuasion (`turned`: he reports her dead; with Sabeline defected or SQ-HM9 done, Lina can be got
   out: `lina_freed`); **let him go** (`free`: he returns in MQ25).
4. The Heart (`heart`): **given** (she gives it if 2 of: `larkspur: cured`, `told_isolde_truth`, the locket shown,
   `isolde_hives`) or **taken** (dug up while she sleeps, or demanded: she flees Millbrook; she can't be crowned).
- **Rewards**: 400 xp; the Heart.

## MQ20 — The Regent's Vault
- **Starts**: MQ14 (holding the Brow). **Where**: the vault under the Regent's Hall. **Level** 13. **Time** 60 min.
- Paths (`vault_path`):
  1. **Earned** (Regency ≥ 40): Corvin opens it himself, peels off his glove and shows the black hand: *"Take it. You can
     carry it. I can't. I tried, once."* Regency +10.
  2. **The heist with Wren** (Greenhood ≥ 40): the old water-gate (the Chamberlain's signet), the cellars, the
     treasury clerks' night shift, dogs; the vault's oath-iron door. Inside, besides the Band: **the poppy-purse
     ledgers** (`corvin_ledgers`): seven years of the Regency's tenth of the poppy trade, and the payments to Garrick, to
     Ketter, and, in the Wet Years, the grain bought for Kingsmere alone while the villages' seed was seized. Wren reads
     a page by lantern-light and goes quiet: Oakhallow is on it. Greenhood +15, Regency -25. (Romance scene after, if
     committed or ready.)
  3. **The Lantern's writ** (Lantern ≥ 40): Odalys and twelve knights; old law: oath-iron is the Order's. A stand-off in
     the court; blood (`writ_blood`, Regency -30) or Corvin yields (Regency -10, Lantern +10).
  4. **Alone** (no faction ≥ 40): the water-gate, alone; no ledgers unless the hero searches the desk (a lockpick check).
- **Rewards**: 450 xp; the Band.

## MQ21 — The Night of Still Water
- **Starts**: MQ19 and MQ20. **Where**: the Regent's study at night, the lake window. **Level** 14. **Time** 60 min.
1. Corvin asks to see the hero alone. He knows they know. He tells it in layers; each needs the hero to push with what
   they have (each push: a line marked with its evidence):
   - **The oar**: *"I held it. I'd hold it again. He was going to give the barrows to Ferrand, and his daughter to
     Haakon. You've heard of Haakon? Ask Ketter."*
   - **The witnesses** (needs the vision of MQ12 or Garrick's word): *"I told the ferryman to row. Two people. I've
     done the sum every night for seven years and it comes out the same."*
   - **The poppy** (needs `corvin_ledgers` or MQ06's crates): *"In the Wet Years Kingsmere had six days of bread. Carrow
     would sell grain for one thing. I sold it. Kingsmere lived."* *"And Oakhallow?"* *"I couldn't save everyone. I saved
     the most."*
   - **Annis** (needs `edric_letter` or Bettony's words, SQ-HM8): he doesn't answer; he looks at the lake for a long time.
     *"She had red hair. The girl has her hair."* It's the only time he loses his voice.
2. The evidence that can go before Kingsmere's assembly: **Garrick** (needs `garrick_spared` and `garrick_trusts` or
   Brindleford ≥ +2; he'll testify against himself too, and the hero must ask him first), **Maelis** (`heart: given`),
   **the ledgers**; `edric_letter` and `saw_maelis_saved` count only alongside one of those.
3. Choice (`corvin`):
   - **Expose him** (two pieces of evidence): a trial in the Hall. He doesn't deny anything. Aldous pleads for his life.
     The assembly decides by the hero's word: hanged (`hanged`), exiled (`exiled`), held for the next ruler (`held`).
     If Garrick testified, he's tried too (flogging and the stocks: he asks for it). Regency -20; Greenhood +15.
   - **Keep his secret** (`kept`): Regency +25; Corvin fights in Act III; Maelis and Wren, if they know, won't forgive
     it.
   - **Kill him** in the study (`killed`): the hero flees Kingsmere; Regency -60; Aldous rules in grief and hatred.
   - **Hand Maelis to him** (if in reach) (`maelis_to_corvin`): she's "kept safe" in the Hall; Regency +30, Millbrook -2;
     she can still be crowned, as his puppet.
   - **Give him his sister's letter** (`wren_letter_given`, SQ-GW6): before anything, he reads Maud's last letter. It's
     short. He reads it twice. He sits down on the floor of his own study. He confesses before the assembly of his own
     will (`confessed`); Wren, if she's there, spares him; he fights in Act III as a common soldier.
4. **Garrick and Maelis** (if both are in Kingsmere): they meet. She can forgive him (the hero can speak for him, or
   not) (`maelis_forgave_garrick`).
- **Rewards**: 500 xp.

## MQ22 — The Hollow Voice
- **Starts**: MQ21. **Where**: the hero's bed → Elderwick → Gorse Hollow. **Level** 14. **Time** 50 min.
1. The dream: Hrathgar, awake. *"You have all my iron now. I can feel it in your hands. Bring it to me, or I'll come
   for it, and I won't come alone."* The hero wakes to every bell in the Vale ringing by itself.
2. The watchtower on the Barrow Road has fallen; the dead march south; the White Fields' novices fled, leaving their
   sickles. **Elderwick** is attacked: the hero defends it, or it holds alone (`elderwick_wall`), or with three Trusted
   factions; else it burns (`elderwick: saved/burned`). In Elderwick's Barrowborn lane, villagers are dragging grey-eyed
   families out to blame them ("they called them up"); the hero can stop it (a choice that costs the defence time).
3. At Gorse Hollow, **Odalys** meets the hero. With enough evidence against Anselm (two of `told_odalys_wynfrith`,
   `archive_pages`, `anselm_pages`, `cuthwin_testimony`; `bryn_voices` only alongside another; one fewer if
   `odalys_doubts`), she reads it on horseback in silence (`anselm_exposed`). *"There must be a reason,"* she says, one
   last time, and then: *"No. There mustn't."*
- **Act II ends.**
- **Rewards**: 300 xp.
