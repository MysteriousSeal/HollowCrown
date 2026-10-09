# Saltreach Coast — Gullhaven, Saltcombe, the sea caves

**Tiles** x 0–750, z 1400–2900 (the sea: x < 160). **Levels** 9–13. **Time** ~4 h of side content (6 side quests, 2
contracts). **Mood**: wind, salt, white cliffs, gulls, sea-pinks on the cliff-tops, coves of shingle, a ruined
lighthouse; a harbour town that answers to coin and to Nell Corrigan.

Main quests here: MQ13, MQ14, MQ15 (sometimes).

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The cliffs** | the whole coast, x 160–260, 3–5 tiers high | Broken by coves: Gullhaven's cleft (320, 2150), Saltcombe's cove (400, 2700), Wreckers' Cove (250, 2450) |
| **The Sea** | x < 160, z 1400–2900 | Impassable except by boat; the tide (a clock: high at dawn and dusk +6 h) uncovers the Gullmouth cave and the Gannet Rocks |
| **Gullmouth** | (200, 1750) | A sea cave under the northern cliffs where Hollowmere's underground river reaches the sea |
| **Dunes** | x 260–500, z 2550–2900 | Marram grass, sand; Saltcombe behind them |
| **Cliff-top heath** | x 260–750, z 1400–2400 | Heather, sea-pinks, sheep, wind-bent thorn trees |
| **The Gannet Rocks** | (120, 2300) | Sea stacks, birds; reachable at low tide |

## Gullhaven — town (harbour at 320, 2150)
A town of tall narrow houses climbing both sides of a cliff cleft, a harbour walled against the sea, 45 buildings.
Standing 0.

| Place | Where | What |
|---|---|---|
| **The Harbour** | (300, 2150) | Piers, fishing boats, Nell's ship *the Sorrow's Bride*, the warden's cutter |
| **The Warden's House** | (330, 2130) | The Regency's harbour warden, **Wystan Coyle** |
| **The Drowned Man** (tavern) | (340, 2160) | Nell holds court in the back room |
| **Fish Market** | (320, 2170) | Food; a fishwife network that knows every boat |
| **Chandlery** | (350, 2140) | Rope, lanterns, diving gear (a breath potion: +30 s underwater) |
| **The Net-Loft Lantern Chapel** | (360, 2180) | A tiny chapel in a net-loft; hides SQ-SR6's deserter |

**People**: **Nell Corrigan** (smuggler queen), **Wystan Coyle** (harbour warden: honest-ish, outnumbered), **Mag Dory**
(fishwife, gossip, Nell's eyes), **Captain Eel** (Nell's first mate, a giant of few words), **Brother Oswin Penn**
(SQ-SR6, hiding), **Widow Saltash** (SQ-SR4), **Jonno** (a boy who sells "maps to treasure", mostly false).

## Saltcombe — village (centre at 400, 2700)
A fishing village in a cove behind the dunes, 9 cottages, boats hauled up on the shingle, nets, a smokehouse.
Standing 0. People: reeve **Garth Hollin** (SQ-SR3's secret), the netmaker **Bryony**, the smokehouse keeper **Old
Fenwick**.

## Dungeons and camps
- **Gullmouth Sea Cave** (200, 1750): MQ14's dungeon (3 levels, rising water). Afterwards it can be revisited (cave
  worms return; the king's tomb-chamber stays empty or holds his resting place, by `edric`).
- **Wrecker's Hole** (250, 2500): a sea cave under Wreckers' Cove: the wreckers' store (SQ-SR1, SQ-SR3). Two levels:
  a smugglers' dock with crates and a tunnel up to the camp; a lower flooded cave with a cave worm.
- **Wreckers' camp** (300, 2420): on the cliff-top above the cove: a palisade, a fire-beacon (they light false lights),
  5 wreckers (bandits, level 9) and **Old Sorrel** (bandit chief, level 10).

## Landmarks
| Landmark | (x, z) | What |
|---|---|---|
| **The Gull Light** | 180, 2000 | A ruined lighthouse on a headland (SQ-SR2) |
| **The Whale's Ribs** | 270, 2620 | A whale skeleton on the dunes; a chest under the jaw (a **whalebone charm**: +breath) |
| **The Drowned Bell** | 140, 2250 | A ship's bell on a rock that rings with the waves; the old wreck of a Carrow ship below at low tide (60 silver, Carrow letters: lore) |
| **Sea-pink Cairn** | 500, 1600 | A cairn on the heath with a view to the sea; a ghost (level 11) at night |

---

## Side quests

### SQ-SR1 — Nell's Debt
- **Giver**: Nell Corrigan, in the Drowned Man's back room. **Level** 10. **Time** 40 min.
1. Nell's cargo (twenty crates) was stolen from her own hiding place in Wrecker's Hole by Old Sorrel's wreckers. She
   wants it back, and doesn't say what's in it.
2. **Wrecker's Hole**: the dock (wreckers, level 9), the crates. The crates hold **Carrow swords and crossbows**,
   two hundred of them: weapons Sabeline paid Nell to bring in for "friends" in Kingsmere (a Carrow-backed rising
   against the Regency, planned for when the dead have weakened it).
3. Choice (`nell_cargo`):
   - **Bring the cargo to Nell** and say nothing (`delivered`): Nell's favour (MQ13 boat), Gullhaven +1; in MQ25 a
     band of Carrow-armed "volunteers" attacks Kingsmere's Hall during the siege (an extra enemy wave).
   - **Tell Warden Coyle** (`warden`): the crates are seized; Nell is furious (she won't help in Act III), Regency +15.
   - **Dump them in the sea** and tell Nell the wreckers sold them (`sunk`): Nell grumbles, believes it (if the hero
     also clears the camp: SQ-SR3), favour granted.
   - **Give them to the Greenhood** (needs Greenhood ≥ 20) (`to_greenhood`): Greenhood +20, Regency -10; Wren's archers
     are better armed in MQ25 (counts as a stronger ally).
- **Rewards**: 220 xp; 100 silver; Nell's favour.

### SQ-SR2 — The Gull Light
- **Giver**: Old Fenwick of Saltcombe ("Light that lamp and the wreckers'd starve"). **Level** 10. **Time** 35 min.
1. The lighthouse has been dark for twelve years; its keeper's ghost haunts it.
2. Climb the ruined tower (broken stairs, a rope, gulls attacking); the keeper's ghost, **Ambrose Fair** (ghost,
   level 10), believes he's still on watch and the light still burns.
3. Find oil (the chandlery: 20 silver; or whale oil from the Whale's Ribs' hidden store) and a new wick; mend the
   lens's frame (iron from the camp or the chandlery).
4. Light the lamp: Ambrose sees it lit and rests (`gull_light: lit`): the wreckers' false lights fail; their camp
   turns on Saltcombe (SQ-SR3 becomes urgent if not done).
- **Rewards**: 200 xp; Saltcombe +1, Gullhaven +1.

### SQ-SR3 — Saltcombe's Missing Boats
- **Giver**: Bryony the netmaker. **Level** 11. **Time** 40 min.
1. Three Saltcombe boats lost on calm nights this summer; her husband among them.
2. The wreckers' beacon: false lights on the cliff lure boats onto the Gannet Rocks; the wreckers loot them.
3. Clue: Saltcombe's own reeve, **Garth Hollin**, wears a drowned fisher's ring: he takes a share and tells the
   wreckers which boats carry catches.
4. The **Wreckers' camp**: Old Sorrel and five wreckers. Bryony's husband, **Ned**, is alive, chained, made to row the
   wreckers' boats.
5. Choice (`garth`):
   - **Expose Garth** to Saltcombe (`exposed`): the village drives him out; Saltcombe +2.
   - **Make him confess to the Regency warden** (`warden`): he's hanged in Gullhaven; Saltcombe +1, Regency +5.
   - **Keep quiet** for his bribe (60 silver) (`bribed`): Saltcombe -1 (it comes out later).
- **Rewards**: 260 xp; Saltcombe's boat (a rowing boat at Saltcombe); Ned's gratitude (smoked fish, a stack).

### SQ-SR4 — The Widow's Ring
- **Giver**: Widow Saltash, on the harbour wall. **Level** 9. **Time** 20 min.
1. Her husband's wedding ring went down with his boat off the Drowned Bell rock; she wants it back before she dies.
2. Low tide at the Drowned Bell: the wreck (it's the Carrow ship, not her husband's: Jonno's "map" got it wrong);
   crabs (spiders, reskinned as crabs: **new** look), a chest. The ring isn't there.
3. The ring is on **Garth Hollin**'s finger (see SQ-SR3): if SQ-SR3 is done, the hero already has it or can get it.
   Otherwise, a ghost at the wreck points the way to Saltcombe.
4. Give her the ring (`widow_ring`). She gives the hero her husband's **sea-knife**.
- **Rewards**: 120 xp; the sea-knife (a fast dagger).

### SQ-SR5 — The Harbour Warden
- **Giver**: Wystan Coyle. **Level** 11. **Time** 30 min.
1. Coyle has three Regency men to Nell's sixty smugglers. He wants proof of her dealings to bring Kingsmere's ships
   down on her.
2. Gather proof: Nell's ledger in the Drowned Man (stealth or charm Mag Dory), a Carrow-sealed letter (from SQ-SR1's
   crates), the testimony of Captain Eel (he won't, unless the hero saved Ned in SQ-SR3: Ned was Eel's brother).
3. Choice (`gullhaven_harbour`):
   - **Give Coyle the proof** (`warden`): Regency ships come; Nell's trade is broken; Regency +20, Gullhaven -1; Nell
     won't help in Act III.
   - **Warn Nell** (`nell`): she pays Coyle off and lets him keep his pride; Gullhaven +1, Nell's favour (Act III
     boats).
   - **Broker a truce**: Nell pays a harbour fee, Coyle looks away from the rest (needs Gullhaven ≥ +1 and Regency ≥
     20) (`truce`): Gullhaven +2; both help in Act III.
- **Rewards**: 200 xp; 100 silver from whoever wins.

### SQ-SR6 — Brine and Bone
- **Giver**: Brother Oswin Penn, hiding in the net-loft chapel (he finds the hero: he's heard of the Unsworn).
  **Level** 11. **Time** 35 min.
1. Brother Oswin fled the Abbey last winter. He has **pages torn from the Lector's book**: a changed oath, in Anselm's
   hand: *"...and the dead shall not sleep, but wake to the voice of the crowned, and serve."* Lantern knights are
   hunting him.
2. Two Lantern knights arrive in Gullhaven asking for him (polite, armed). The hero can talk them away (Lantern ≥ 20:
   "he's under my protection"), fight them (Lantern -20), or lead them off with a false trail.
3. Get Oswin away on a boat (Nell's, or Saltcombe's). He gives the pages (`anselm_pages`: evidence against Anselm for
   MQ22 / MQ23).
4. If the hero gives Oswin up to the knights (`oswin_given`): Lantern +15; Oswin is never seen again; the pages are
   lost unless the hero copies them first (a reading check: they get half: counts as evidence only with SQ-LM3).
- **Rewards**: 220 xp; the pages.

---

## Contracts

### CT-SR1 — The Thing in the Tide-Cave
- **Notice board** (Gullhaven): *"Something big in Wrecker's Hole's lower cave eats our pots and our boys' courage.
  150 silver. — the Fishwives."* **Level** 11. **Time** 20 min.
1. The lower flooded cave of Wrecker's Hole at low tide.
2. **The Tide-Worm**: a giant cave worm (level 12) that burrows through the shingle and surfaces under the hero; its
   brood (2 small worms).
- **Rewards**: 200 xp; 150 silver; the worm's tooth (sells for 60).

### CT-SR2 — The Cliff-Top Pack
- **Notice board** (Saltcombe): *"Wolves take the sheep on the heath. Big grey one leads them. 90 silver."*
  **Level** 10. **Time** 20 min.
1. Tracks across the heath to the Sea-pink Cairn.
2. A pack of 5 wolves (level 9) and **Old Greymuzzle** (an alpha wolf, level 11, bigger, scarred).
3. Twist (lore): the pack only came down to the heath because the dead stir in the cairns of the cliff-top: the
   wolves are fleeing them. A ghost at the cairn after dark; laying it to rest (Rite of Rest) keeps the wolves in the
   hills for good (`clifftop: rested`).
- **Rewards**: 160 xp; 90 silver; a **greymuzzle pelt** (a cloak).
