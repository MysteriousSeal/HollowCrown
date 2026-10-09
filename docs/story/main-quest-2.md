# Main Quest — Act II: *The Pieces* (~8.5 h)

The hero goes after the three pieces of the crown. The Brow is first (MQ13–MQ15); then the order is free: Millbrook
(MQ16–MQ19) and the vault (MQ20), both open once the hero holds the Brow. MQ21 needs the vault and Millbrook done;
MQ22 ends the act.

Holding a piece: the hero's bag shows it in a slot of its own (it can't be sold, dropped or stored). NPCs react when
they're near it (they feel the cold). From the first piece on, the hero dreams (MQ14 onward: see *The Hollow Voice*
below).

---

## MQ13 — Gullhaven
- **Starts**: MQ12 done. **Where**: the Salt Road → Gullhaven (320, 2150). **Level** 10. **Time** 45 min.
1. Gullhaven: a harbour town in a cleft of the cliffs; tall narrow houses, nets, gulls, a fish market, the Regency's
   harbour warden **Wystan Coyle** and, everywhere else, **Nell Corrigan**'s people.
2. Gullmouth (200, 1750) is a sea cave under the northern cliffs, reachable only by boat at low tide. The warden won't
   lend a boat ("that water eats boats"). Nell will, for a price. Choice (`mq13_boat`):
   - **Pay Nell** 150 silver (`paid`).
   - **Do Nell a favour**: start SQ-SR1 (*Nell's Debt*) and finish it first (`favour`): Nell +, Gullhaven +1.
   - **Use the Regency writ** to commandeer the warden's cutter (needs Regency ≥ 20) (`commandeered`): Gullhaven -1,
     Nell refuses the hero later work (SQ-SR1 closed); the warden's crew comes along (2 Regency sailors, companions).
3. **The tide table**: low tide comes at dusk; the hero has until the next dusk (game time) to prepare (buy, rest).
- **Rewards**: 80 xp.

## MQ14 — The Drowned King
- **Where**: Gullmouth Sea Cave (200, 1750). **Level** 11. **Time** 75 min.
1. Rowing in at low tide past the Gull Light's wreck-rocks. Inside, the cave opens into a cathedral of rock where the
   underground river from Hollowmere falls into the sea.
2. **The sea cave** (3 levels, rising water: the lowest level floods at the tide's turn, ~20 min game time, pushing
   the hero upward): cave worms (level 10), bats, drowned sailors (skeletons), a shipwreck inside the cave holding a
   chest of Carrow coin (Sabeline's agents tried this before: their bodies are here).
3. **King Edric**, the Drowned King (crypt lord, level 12): a drowned wight in rotted royal blue, the **Brow** set on
   his head like a crown. His fight has two phases; between them he is lucid for a moment: *"Corvin... let go of the
   oar, Corvin... where is my girl? Maelis — "*
4. Choice (`edric`):
   - **Lay him to rest** (needs the lantern charm from MQ07 or Cuthwin's rite words from SQ-BV4): he kneels, gives
     the Brow, and his **locket** (a painted portrait of a girl of fifteen: Maelis). (`rested`) Lantern +5.
   - **Destroy him**: the Brow and the locket fall with him (`destroyed`).
   - **Bind him** for the Lantern (only if Lantern ≥ 20; Odalys asked for "any royal dead" to be brought bound to the
     Abbey): his wight follows a chain to the Abbey; Anselm will use him (`bound`); Lantern +10; the locket is lost.
5. **The Brow** in the hero's hand: frost runs up the cave walls. Out by boat on the rising tide.
- **Rewards**: 400 xp; the Brow; the locket (unless bound); the Carrow coin (200 silver).
- **Journal**: *"The drowned king said Corvin's name. 'Let go of the oar, Corvin.' The gloved hand at the oar."*

### The Hollow Voice (from MQ14 on)
Each time the hero sleeps after taking a piece, a short dream: a barrow, a stone, a voice. **Hrathgar** never
threatens: he bargains, he asks questions, he tells the old story from his side ("We were here first. Your Osric took
my iron and my daughter and called it peace."). The dreams are optional to answer; the hero's answers are counted
(`hrathgar_rapport` 0..3) and change his last words in MQ28 and unlock the bargain in the Hollow King ending.

## MQ15 — The Envoy's Offer
- **Starts**: on returning to any town with the Brow. **Where**: Gullhaven's inn or Kingsmere: Sabeline finds the hero.
  **Level** 11. **Time** 20 min.
1. **Sabeline** knows (her agents died in the cave; she's watched the tide). She offers 2,000 silver for the Brow,
   "or for its location, if you'd rather keep your hands clean". She is honest: Carrow would melt it. *"No crown, no
   oath, no dead in our way. Your Vale would be free of its ghosts and ours to dig. Is that so bad?"*
2. Choice (`mq15_sabeline`):
   - **Refuse** (`refused`): she smiles. *"The offer stays open."* (She'll offer again in MQ24.)
   - **Sell the Brow** (`sold`): 2,000 silver. The main quest continues with a new step: steal it back from Carrow's
     courier on the Kingsmere–Thornbeck road (a fight with Carrow guards, level 12) before it crosses the mountains.
     Sabeline is furious and becomes an enemy (her spies sell the hero's movements: ambushes in Act II).
   - **Pretend to consider** and learn her network (needs SQ-HM5 done or in progress): she names her grave-robbers in
     the Barrows and her agent in the Regency (`sabeline_played`), which helps SQ-HM5 and SQ-BR1.
- **Rewards**: 60 xp.

## MQ16 — Ketter's Trail
- **Starts**: MQ14 done (with the locket, or without it, from a rumour in Kingsmere's taverns of a bounty hunter
  asking about "a red-haired girl of twenty-two"). **Where**: Kingsmere → the South Road → Southfields. **Level** 11.
  **Time** 40 min.
1. In Kingsmere's tavern, *The Heron and Pike*, a drunk Regency clerk talks of "the Regent's private hunter" paid from
   the secret purse. In Southfields a wolfhound's prints and a man asking at every door: **Ketter**.
2. Follow Ketter's trail through Southfields: he asks questions in **Larkspur** (half-burned, half fevered; seeds
   SQ-SF1) and at the **Deserters' camp** (he paid them for information).
3. The trail ends at **Millbrook**, where a red-haired herbalist named Isolde runs the dead Mother Hesk's cottage.
   Ketter is at the inn, watching her door, playing dice with Biscuit at his feet. He greets the hero by name.
   *"We're after the same thing, I think. Shall we not make it messy?"*
- **Choice**: talk with Ketter (learn who hired him: he won't say yet), or threaten him (he leaves for a day:
  `ketter_warned`).
- **Rewards**: 120 xp.

## MQ17 — The Herbalist of Millbrook
- **Where**: Millbrook (3000, 3300), Hesk's cottage. **Level** 12. **Time** 40 min.
1. **Isolde** is busy: Larkspur's fever. She has no time for strangers, and she feels the cold of the Brow from across
   the room, and goes pale.
2. Earning her ear: help her with the fever patients in Millbrook's barn (carry water, hold a man down for a lancing:
   a short task); or show her the **locket** (she breaks, hides it, asks the hero to leave, and comes to find them at
   night).
3. Either way, at night, at the hives: she admits nothing yet but asks why the hero carries "a piece of a crown". The
   hero can tell the truth (the Oath, the dead) or lie (`told_isolde_truth`).
4. She makes a deal: cure Larkspur, and she'll tell them what she knows: **MQ18**.
- **Rewards**: 100 xp; Millbrook +1.

## MQ18 — Larkspur Barrow
- **Giver**: Isolde. **Where**: Larkspur (3500, 3100) → Larkspur Barrow ruin and crypt (3650, 3350). **Level** 12.
  **Time** 75 min.
1. Larkspur: the fever started when grave-robbers broke into the old barrow on the hill last spring; the Lantern burned
   the first sick houses (Odalys's order). The survivors hate the Lantern; they spit at a Lantern charm.
2. Isolde's theory: the fever is *grave-rot* from a barrow-witch's tomb; it needs **barrow-moss** from the tomb's
   heart and the witch's grave **sealed** again.
3. **Larkspur Barrow** (crypt, level 12): diseased skeletons (blows that cause sickness: a new debuff), rats (bats in
   the game's set), the grave-robbers' corpses, the witch's grave chamber.
4. **The crypt lord**: **Old Mother Grisel**, the barrow-witch (level 13): summons rot-ghosts, poisons the floor.
5. Seal the grave with the oath-iron grave-ward the robbers broke (only the hero can carry it). Gather the moss.
6. Return: Isolde brews the cure. Choice at Larkspur (`larkspur`):
   - **Cure the village** (default, takes a day of game time): Larkspur +3, Millbrook +1, Isolde's trust +.
   - **A Lantern patrol arrives to burn the sick houses** "before the cure's proven" (only if Lantern ≥ 20 and the
     hero told the Lantern where they were going): the hero must stand them off (talk: Lantern -10; or fight: Lantern
     -30), or let them burn (`burned`: Larkspur -3 Burned, Lantern +10, Isolde refuses to be queen ever, and won't
     give the Heart freely: it must be taken in MQ19).
- **Rewards**: 450 xp; Larkspur's thanks (a **charm of mallow**: +1 health regeneration).

## MQ19 — Ketter
- **Starts**: MQ18 done. **Where**: Millbrook, at night. **Level** 13. **Time** 40 min.
1. Isolde, trusting now (if `larkspur` cured), tells the truth: she is **Maelis**. She saw a gloved hand hold the oar
   that night: Corvin's. She has the third piece, **the Heart**, buried under Hesk's hives. She doesn't want a crown.
   She wants the dead to sleep and Larkspur to live.
2. **Ketter** comes for her that night with three hired deserters (level 12) and Biscuit. Fight in the lanes and the
   hive garden. Ketter is beaten but alive. He tells the truth: Corvin hired him "to bring her quietly", and he sold
   the same news to Sabeline.
3. Choice (`ketter`):
   - **Kill him** (`dead`). Biscuit stays with the hero (a dog companion: barks at hidden enemies).
   - **Turn him** with 300 silver, or a persuasion (`turned`): he'll tell both employers she died of the fever. Corvin
     stops looking; Sabeline too. (Protects Garrick and Maelis later.)
   - **Let him go** (`free`): he returns in MQ25 for Maelis or Garrick.
4. **The Heart** (`heart`):
   - Given freely by Maelis (if she trusts the hero: `larkspur` cured and the hero didn't lie to her, or showed the
     locket) (`given`); Maelis +, she'll come to Kingsmere in Act III.
   - Taken: dug up while she sleeps or demanded with threats (`taken`): she flees Millbrook; she can't be crowned.
- **Rewards**: 400 xp; the Heart.
- **Journal**: *"Isolde is Maelis, the lost princess, and she saw the Lord Regent hold the oar while her father
  drowned."*

## MQ20 — The Regent's Vault
- **Starts**: MQ14 done (the hero holds the Brow). **Where**: Kingsmere, the Regent's Hall vault. **Level** 13.
  **Time** 60 min.
- The Band is in the vault under the Regent's Hall. Three ways in (`vault_path`):
  1. **Earned** (Regency ≥ 40): Corvin, if the hero offers to bring all the pieces under the Regency's keeping, opens
     the vault to them himself: *"Take it. You can carry it. I can't."* He shows his frostbitten hand. Regency +10.
     Corvin now expects the crown to come to Kingsmere (sets up Iron Regency).
  2. **The heist with Wren** (Greenhood ≥ 40): the Greenhood's sappers and the **Chamberlain's signet** (MQ12) open the
     old water-gate under the Hall. A stealth level through the cellars (guards, dogs, the treasury clerks' night
     shift); the vault's oath-iron door opens only to the hero. Inside, besides the Band: Corvin's private ledgers
     (`corvin_ledgers`: proof of the secret purse paying Ketter and Garrick). Greenhood +15, Regency -25.
  3. **The Lantern's writ** (Lantern ≥ 40): Odalys and twelve knights march into the Hall with a writ under the old
     law: oath-iron belongs to the Order. A tense stand-off in the Regent's court; the hero decides whether it ends in
     blood (`writ_blood`, Regency -30) or Corvin yields (Regency -10, Lantern +10).
  4. **Without any faction** (none ≥ 40): the hero steals alone through the water-gate (needs the signet); harder,
     no ledgers.
- **Rewards**: 450 xp; the Band.

## MQ21 — The Night of Still Water
- **Starts**: MQ19 and MQ20 done. **Where**: Kingsmere, the Regent's study (or Corvin comes to the hero). **Level** 14.
  **Time** 50 min.
1. The hero holds all three pieces. Corvin asks to see the hero, alone, at night, in his study, by the lake window.
2. He knows they know (Ketter's silence, the vault, Garrick). He tells the night as it was: Edric was selling the
   barrows to Carrow; Corvin begged; the king struck him; they struggled; the king went over; *"and I held the oar. I
   held it, while he drowned, and I'd hold it again."* He shows the black hand. He asks what the hero will do.
3. The evidence that can be put before Kingsmere's assembly of reeves and guildmasters: **Garrick's testimony**
   (needs `garrick_spared` and Brindleford ≥ +2: Garrick comes to Kingsmere), **Maelis's testimony** (needs
   `heart: given`), **the ledgers** (`corvin_ledgers`), **Edric's words** (only the hero heard them: not enough
   alone).
4. Choice (`corvin`):
   - **Expose him** (needs two pieces of evidence): a trial in the Regent's Hall. Corvin doesn't deny it. He's stripped
     of the regency; Aldous pleads for his life. Then: hanged (`hanged`), exiled (`exiled`), or held for the next
     ruler to judge (`held`). Regency -20 (its leader gone), Greenhood +15, the reeves' loyalty splits.
   - **Keep his secret** (`kept`): Corvin owes the hero; the Regency is the hero's (Regency +25), and Corvin fights in
     Act III. Maelis (if she knows) and Wren will never forgive it.
   - **Kill him** (`killed`) in the study: the hero flees Kingsmere; Regency -60 (Hated); Aldous becomes regent in
     grief and hates the hero.
   - **Hand Maelis over to him** (only if the hero knows who she is and she's in reach: Millbrook or Kingsmere)
     (`maelis_to_corvin`): Corvin keeps her "safe" in the Hall; his secret is buried for good (`corvin: kept`);
     Regency +30; Millbrook -2; Maelis can still be crowned, as Corvin's puppet (the Rightful Queen's slides turn
     grey).
   - **Bring him Wren's letter** (needs `wren_letter_given` from SQ-GW6): before choosing, Corvin reads his sister's
     last letter. He breaks. He offers to stand down of his own will and confess before the assembly (`confessed`);
     Wren spares him; he serves in Act III as a common soldier. The best outcome for Aldous and Wren.
- **Rewards**: 500 xp.

## MQ22 — The Hollow Voice
- **Starts**: MQ21 done. **Where**: wherever the hero sleeps → the Abbey. **Level** 14. **Time** 45 min.
1. The dream: Hrathgar wakes fully in it. *"You have all my iron now, Unsworn. I can feel it. Bring it to me, or I
   will come for it."* The hero wakes to bells: every village's bell, ringing by itself.
2. Messengers: the Barrow Road's watchtower has fallen; the dead march south from the barrows. Elderwick is under
   attack.
3. To the Abbey to reforge the crown. On the way, **Odalys** meets the hero at Gorse Hollow. If the hero has the
   evidence against Anselm (two of: `wynfrith_warning` told, SQ-LM3 archive pages, SQ-SR6 deserter's pages, SQ-LM5
   Cuthwin's testimony), they can show her now (`anselm_exposed`). She reads it on her horse in silence. *"Then we
   go in with our swords drawn."*
4. **Defend Elderwick** on the way (or send help: if three or more of Regency/Greenhood/Lantern/Gullhaven are Trusted
   or better, they defend it without the hero). Elderwick's fate: saved (`elderwick: saved`) or burned (-3).
- **Act II ends.** The scroll shows the pieces and how they were got, Corvin's fate, Maelis's.
- **Rewards**: 300 xp.
