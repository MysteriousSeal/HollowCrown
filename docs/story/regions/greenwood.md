# Greenwood — Oakhallow, Thornbeck, the Hollow Oak

**Tiles** x 2800–3950, z 700–2600. **Levels** 6–11 (the Hunter's Barrow 10–12). **Time** ~5 h of side content (7 side
quests, 2 contracts). **Mood**: the oldest forest in the Vale: giant oaks, mossy boulders, brooks, pine on the ridges,
shafts of light; woodsmoke and the Greenhood's whistles; a Regency garrison that doesn't sleep well.

Main quests here: MQ09, MQ10, MQ20 (the heist starts here), MQ24 (Greenhood and Thornbeck allies).

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The deep wood** | most of the region: polygon (2850, 750) (3900, 750) (3900, 2550) (2850, 2550) | Dense oak and beech; paths only along the roads and trails |
| **Pine ridges** | x 3600–3950, z 700–1400 and 1700–2100 | Rockier, pines; Spinner's Deep in the second |
| **The Oakbrook** | stream from (3700, 800) south-west to Hollowmere at (2700, 2100) | Fords at Oakhallow (3200, 1500) and the Wood Road (2950, 2150) |
| **Clearings** | Oakhallow's (3150–3250, 1450–1560), the Hollow Oak's (3560–3640, 1060–1140), Thornbeck's fields (2950–3050, 2250–2350) | |
| **The Old Road** | an overgrown royal road (2850, 1800) → (3600, 1800) | Lynx country (CT-GW2) |

## Oakhallow — village (centre at 3200, 1500)
Woodcutters' village of 10 log houses round a sawpit and a giant felled oak used as the village table. Loves the
Greenhood; hates the reeves. Standing 0 (+1 if Greenhood ≥ 20 when first visited). Maud Halloway's grave is behind the
village under a rowan.
People: headman **Aldred Fell** (old, stubborn), the woodcutter **Bera Long** and her daughter **Nettle** (SQ-GW3's
bride), the charcoal-burner **Smudge**, the herb-wife **Gudrun** (Wren's mother's friend; SQ-GW6).

## Thornbeck — village (centre at 3000, 2300)
A Regency garrison village on the Wood Road: 8 houses, a stone tithe barn (3020, 2280), a stockade with a gate tower
and 20 soldiers under **Captain Ilse Varrow** (40, tired, decent, wry). Standing 0. The villagers are half soldiers'
families, half farmers who resent the garrison eating their harvest.
People: Captain **Ilse Varrow**, **Sergeant Brock** (hard), **Old Annis** (alewife), the miller **Cole Thorne**.

## The Hollow Oak — the Greenhood's camp (3600, 1100)
A clearing round a vast hollow oak: the meeting hall inside its trunk, tree-platforms, tents, a larder, a smithy-tent,
40 Greenhood (archers, families, the wounded). Friendly unless Greenhood < -20.
People: **Wren Halloway**, **Pip Tanner** (her second; Kit's father: SQ-BV2), **Mother Rook** (the camp's healer), the
fletcher **Jem Arrowsmith**, **Kestrel** (a girl scout, 12, who finds the hero in MQ09).

## Dungeons and camps
- **Spinner's Deep** (3700, 1900): a cave in the pine ridge, a spider nest in old mine-workings (3 levels) (SQ-GW5).
- **Hunter's Barrow** (3400, 800): a crypt under a ruined hunting lodge of the Barrow War (SQ-GW4).
- **Sour Apple camp** (3300, 2000): a palisaded camp in a crab-apple thicket, 6 rogues (bandits, level 8) and their
  leader **Corliss Crabbe** (bandit chief, level 9) (SQ-GW1).

## Landmarks
| Landmark | (x, z) | What |
|---|---|---|
| **The Greatest Oak** | 3350, 1250 | A living oak twelve tiles round; a hidden carving of Osric and Sigrun (lore); a chest in its roots |
| **The Charcoal Pits** | 3100, 1750 | Smudge's pits; smoke; a lynx den nearby |
| **The Old Road's Milestone** | 3300, 1800 | "Kingsmere 40 leagues" in the old tongue; lore |
| **Hermit's Spring** | 3800, 1400 | A clear pool; drinking from it heals fully (once a day) |

---

## Side quests

### SQ-GW1 — The Sour Apple
- **Giver**: Wren (if Greenhood ≥ 0) or Captain Varrow (if Regency ≥ 0). **Level** 8. **Time** 35 min.
1. A band calling itself Greenhood robs and kills travellers on the Wood Road: the Regency blames Wren.
2. Their camp in the crab-apple thicket: **Corliss Crabbe** and his rogues, Greenhood cloaks over Carrow coin: Sabeline
   pays them to make the Greenhood look like murderers.
3. Choice (`sour_apple`):
   - **Clear them, for Wren** (`for_wren`): bring Crabbe's Carrow purse to Wren: Greenhood +15; Wren learns Carrow's
     hand in it.
   - **Clear them, for Varrow** (`for_varrow`): bring their cloaks to Thornbeck: Regency +10; Varrow believes the
     Greenhood guilty (she softens only after SQ-GW2).
   - **Show both** the Carrow purse (needs Greenhood ≥ 0 and Regency ≥ 0) (`both`): Varrow and Wren agree, for once,
     on something: +10 each; makes MQ10's `shared` option possible even without SQ-GW2.
- **Rewards**: 200 xp; Crabbe's **crab-apple bow**; 80 silver of Carrow coin.

### SQ-GW2 — Thornbeck's Garrison
- **Giver**: Captain Ilse Varrow. **Level** 8. **Time** 40 min.
1. Varrow's men are deserting (three this month). Kingsmere sends no pay and short rations; her men steal from
   Thornbeck's farmers; the farmers hate them.
2. Three tasks: find the deserters (two in the Charcoal Pits with Smudge, ashamed; one dead to a lynx: bring his tag);
   settle a theft between a soldier and Cole Thorne the miller (judge it); get pay: carry Varrow's letter to Kingsmere
   (Hiram Bose, or Corvin, or Aldous after SQ-HM3) and bring back the wages (an ambush by the Sour Apple if SQ-GW1
   isn't done).
3. Done: the garrison steadies; Varrow trusts the hero (`varrow_trusts`). Unlocks MQ10's `shared`, the Thornbeck ally
   (MQ24).
- **Rewards**: 220 xp; Thornbeck +1; a **garrison shield**.

### SQ-GW3 — The Oakhallow Wedding
- **Giver**: Bera Long. **Level** 7. **Time** 35 min.
1. Nettle Long is to marry **Ash Rowan**, a young Greenhood archer; the wedding is in three days; the bride wants
   honey from Tallow Green (or Southfields), a fiddler (**Fiddler Cobb** at the Heron and Pike in Kingsmere: he'll
   come for 20 silver or a drinking contest), and a wedding crown of flowers from the Hermit's Spring.
2. The wedding (a scene: music, dancing round the felled oak, Wren comes, the hero is a guest).
3. A Regency patrol (Sergeant Brock, 6 soldiers) arrives to arrest Ash. Choice (`oak_wedding`):
   - **Talk Brock down** (needs Regency ≥ 20 or the heir's signet, or `varrow_trusts`) (`talked`): the patrol leaves;
     Oakhallow +2.
   - **Fight** (`fought`): Greenhood +10, Regency -15, Oakhallow +1; Thornbeck -1.
   - **Let them take Ash** (`taken`): Oakhallow -2; Ash can be freed later (SQ-HM4's variant: he's in Kingsmere's
     gaol).
- **Rewards**: 180 xp; Oakhallow's gratitude (Aldred Fell tells the hero the way to the Hollow Oak: MQ09).

### SQ-GW4 — The Hunter's Barrow
- **Giver**: a carving on the Greatest Oak, or Gudrun's story. **Level** 11. **Time** 45 min.
1. **Ulfar the Hunter**, Osric's greatest archer in the Barrow War, was buried with his bow in a lodge in the deep
   wood; the dead there have stirred.
2. The ruined lodge (hunting trophies, a broken roof), the crypt beneath (3 halls): skeleton archers, a pack of
   skeleton hounds, a hall of Barrow War trophies (lore: Hrathgar's banner, the story of the war from the hunters' side,
   and of Sigrun crossing the lines alone to make peace).
3. **Ulfar** (crypt lord, level 12, an archer: he shoots, hides, shoots). Laid to rest or destroyed.
- **Rewards**: 320 xp; **Ulfar's Yew** (the best bow in the game until Act III); lore (`ulfar_lore`).

### SQ-GW5 — Spinner's Deep
- **Giver**: Oakhallow's headman Aldred Fell. **Level** 10. **Time** 40 min.
1. A crew of four woodcutters went to fell pines on the ridge and didn't come back.
2. **Spinner's Deep**: old mine-workings full of webs; spiders (level 9–10), webbed cocoons (two woodcutters dead;
   **Bera Long's husband, Tolly**, and a boy alive in cocoons: cut them free).
3. **The Spinner** (giant spider queen, level 11) in the deepest working, her egg-sacs (burn them with a torch or
   they hatch during the fight).
- **Rewards**: 260 xp; Oakhallow +1; silk (sells well; a **spider-silk shirt** from Bera).

### SQ-GW6 — Wren's Mother
- **Giver**: Gudrun the herb-wife (after MQ09), or Wren herself (Greenhood ≥ 40). **Level** 9. **Time** 35 min.
1. The anniversary of Maud Halloway's death. Wren goes alone to her mother's grave under the rowan behind Oakhallow and
   doesn't come back by dark.
2. The hero finds her at the grave, drunk on sloe gin, a little dead around her (the grave-cold: 3 ghosts of the
   famine dead, level 8).
3. Talk: she tells the hero about Maud, the famine, the reeves who took Oakhallow's seed grain, and the letter she
   stole: her mother's last letter to Corvin, begging him for grain, *unopened*. *"He never read it. I made sure of it.
   I wanted him never to know she asked."*
4. The hero can:
   - **Ask her for the letter**, to take to Corvin (`wren_letter_given`): she gives it, if Greenhood ≥ 20 and the hero
     tells her why (*"Because he should know what he did, from her, not from you."*). Unlocks MQ21's best outcome.
   - **Leave it** (`wren_letter_kept`).
- **Rewards**: 200 xp; Greenhood +10; Wren's **wren bracer** (+crit with bows).

### SQ-GW7 — Brannoc's Debt
- **Opens** only if `bv_red_hen` is `to_wren` or `spared`. **Level** 10. **Time** 35 min.
- **If `to_wren`**: Wren sentenced Brannoc to dig graves for the famine dead for a year. He's changed (or says he has).
  He asks the hero's help to pay back a pilgrim family he robbed (the **Ashdowns**, now in Gullhaven: find them, bring
  them his savings). The family's son wants him hanged. Choice: give the money and the apology (`brannoc_redeemed`:
  Brannoc fights at the siege and dies well, or lives, by the siege's outcome), or turn him over to the son
  (`brannoc_hanged`).
- **If `spared`**: Brannoc has a new band on the Old Road, robbing Oakhallow's carts. The hero sees what sparing him
  bought. A fight at the Old Road (Brannoc level 11, 5 bandits) (`brannoc_dead`); or he begs again: a second spare
  (`brannoc_spared_twice`: he leaves the Vale; Oakhallow -1).
- **Rewards**: 200 xp.

---

## Contracts

### CT-GW1 — The Greywood Bear
- **Notice board** (Thornbeck): *"A bear as big as a cart has killed two of ours and a horse. 140 silver.
  — Capt. I. Varrow."* **Level** 10. **Time** 20 min.
1. Tracks from the dead horse into the deep wood; a cave under a boulder pile.
2. **Old Scar** (a giant bear, level 11): a Regency crossbow bolt is lodged in its shoulder, rusted: it was shot by
   Varrow's men years ago and has hunted soldiers since.
3. Kill it (`bear: killed`), or (Rite of Rest no: it's living) draw the bolt after wounding it with a sleeping draught
   from Mother Rook (`bear: spared`): the bear leaves the woods; Varrow pays half ("dead's what I paid for"); Greenhood
   +5.
- **Rewards**: 180 xp; 140 (or 70) silver; a **bear-hide cloak** if killed.

### CT-GW2 — The Lynx of the Old Road
- **Notice board** (Oakhallow): *"The grey cat of the Old Road has taken three dogs and a child's arm. 100 silver.
  — A. Fell."* **Level** 9. **Time** 15 min.
1. The Old Road at dusk: a **giant lynx** (level 10) that stalks and pounces from the undergrowth, and her two kits.
2. Kill her (`lynx: killed`); or find that the "child's arm" story was a lie: the child was poaching her kits;
   leave her be and bring Aldred the kits' tracks to prove she's only defending them (`lynx: spared`, half pay).
- **Rewards**: 140 xp; 100 (or 50) silver; a **lynx-fur hood**.
