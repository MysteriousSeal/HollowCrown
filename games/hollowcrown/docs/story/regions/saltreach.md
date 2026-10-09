# Saltreach Coast — Gullhaven, Saltcombe, the sea caves

**Tiles** x 0–750, z 1400–2900 (the sea x < 160). **Levels** 9–13. **Time** ~4.5 h of side content (7 side quests, 2
contracts). **Mood**: wind, salt, white cliffs, sea-pinks, shingle coves, a dead lighthouse; a harbour town that runs on
fish, smuggling and the Milk House's smoke.

Main quests here: MQ13, MQ14, MQ15.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The cliffs** | x 160–260, 3–5 tiers | Coves: Gullhaven's cleft (320, 2150), Saltcombe's (400, 2700), Wreckers' Cove (250, 2450) |
| **The sea** | x < 160 | Boats only; the tide (high at dawn and dusk +6 h) uncovers Gullmouth and the Gannet Rocks |
| **Gullmouth** | (200, 1750) | Sea cave where the lake's river meets the sea |
| **Dunes** | x 260–500, z 2550–2900 | Saltcombe behind them |
| **Cliff-top heath** | x 260–750, z 1400–2400 | Heather, sheep, thorn trees |
| **The Gannet Rocks** | (120, 2300) | Sea stacks |

## Gullhaven — town (harbour at 320, 2150)
Tall narrow houses up a cliff cleft, 45 buildings, a walled harbour.

| Place | Where | What |
|---|---|---|
| **The Harbour** | (300, 2150) | Boats, Nell's ship *the Sorrow's Bride*, the warden's cutter |
| **The Warden's House** | (330, 2130) | **Wystan Coyle** |
| **The Drowned Man** | (340, 2160) | Tavern; Nell's back room |
| **The Milk House** | over Nell's warehouse (300, 2140) | The poppy den; **Mother Sorrow** |
| **Fish Market** | (320, 2170) | **Mag Dory** and the fishwives |
| **Chandlery** | (350, 2140) | Rope, lanterns, breath draughts |
| **The Net-Loft Chapel** | (360, 2180) | A Lantern chapel in a loft; Brother Oswin hides here |

People: **Nell Corrigan**; **Wystan Coyle**; **Mag Dory**; **Captain Eel** (Nell's mate, huge, quiet; brother of Saltcombe's
Ned); **Mother Sorrow** (60, the Milk House's madam, once a girl there herself; soft voice, a ledger she keeps of every
girl's debt); **Brother Oswin Penn** (SQ-SR6); **Widow Saltash** (SQ-SR4); **Jonno** (a boy selling false treasure
maps).

## Saltcombe — village (400, 2700)
9 cottages in a cove behind the dunes, boats on the shingle, a smokehouse. Reeve **Garth Hollin**, netmaker **Bryony**,
smokehouse keeper **Old Fenwick**.

## Dungeons, camps, landmarks
| Place | (x, z) | What |
|---|---|---|
| **Gullmouth Sea Cave** | 200, 1750 | MQ14 |
| **Wrecker's Hole** | 250, 2500 | Sea cave: a smugglers' dock, a flooded lower cave |
| **Wreckers' camp** | 300, 2420 | Cliff-top palisade with a fire-beacon; 5 wreckers, **Old Sorrel** |
| **The Gull Light** | 180, 2000 | Ruined lighthouse (SQ-SR2) |
| **The Whale's Ribs** | 270, 2620 | Whale skeleton on the dunes; a chest (a **whalebone charm**) |
| **The Drowned Bell** | 140, 2250 | A ship's bell on a rock; a Carrow wreck at low tide |
| **Sea-pink Cairn** | 500, 1600 | Cliff-top cairn; a ghost at night |

---

## Side quests

### SQ-SR1 — Nell's Debt
- **Giver**: Nell. **Level** 10. **Time** 40 min.
1. Old Sorrel's wreckers stole twenty crates from Nell's hiding place in Wrecker's Hole. She won't say what's in them.
2. **Wrecker's Hole**: the dock, the crates: **Carrow swords and crossbows**, two hundred, paid for by Sabeline for a
   rising in Kingsmere when the dead have bled the Regency. And chained in the dock, two Saltcombe men the wreckers use
   as rowers.
3. Choice (`nell_cargo`): **deliver** to Nell, say nothing (`delivered`: Nell's favour; in MQ25 a Carrow-armed mob
   attacks the Hall); **tell Coyle** (`warden`: seized; Nell won't help in Act III; Regency +15); **sink them** and tell
   Nell the wreckers sold them (`sunk`); **give them to the Greenhood** (Greenhood ≥ 20) (`to_greenhood`: Wren's archers
   stronger in MQ25).
- **Rewards**: 220 xp; 100 silver.

### SQ-SR2 — The Gull Light
- **Giver**: Old Fenwick. **Level** 10. **Time** 35 min.
1. The lighthouse dark twelve years; its keeper's ghost, **Ambrose Fair**, still climbs the stairs.
2. **The turn**: Ambrose didn't die by accident. The wreckers paid him to let the light go out one night; a ship broke on
   the Gannet Rocks: his own son was aboard. He hanged himself from the lamp-frame. He's been trying to light it since.
3. Oil, a wick, the lens frame mended. Light the lamp: he sees it lit and goes (`lit`); the wreckers' false lights fail,
   and they turn on Saltcombe (SQ-SR3 becomes urgent).
- **Rewards**: 200 xp; Saltcombe +1, Gullhaven +1.

### SQ-SR3 — Saltcombe's Missing Boats
- **Giver**: Bryony. **Level** 11. **Time** 40 min.
1. Three boats lost on calm nights; her husband **Ned** among them.
2. The wreckers' beacon lures boats onto the rocks; they loot them; survivors are chained as rowers or held under the
   water till they stop.
3. **Garth Hollin**, Saltcombe's reeve, wears a drowned fisher's ring: he tells the wreckers which boats carry catches.
4. The camp: Old Sorrel; **Ned** alive, chained, his hands rope-raw.
5. Choice (`garth`): **expose him to the village** (`exposed`: they drown him in the cove at dusk, the whole village
   holding the rope; the hero can watch or stop it: `garth_drowned` / `garth_driven_out`); **to the warden** (`warden`:
   hanged in Gullhaven); **keep quiet** for 60 silver (`bribed`: it comes out; Saltcombe -1).
- **Rewards**: 260 xp; Saltcombe's boat; smoked fish.

### SQ-SR4 — The Widow's Ring
- **Giver**: Widow Saltash, on the harbour wall. **Level** 9. **Time** 20 min.
1. Her husband's wedding ring went down with his boat off the Drowned Bell.
2. Low tide at the wreck (Jonno's "map" got the wrong ship): two of **the Drowned** (the Carrow ship's sailors), a chest of Carrow letters
   (lore: Carrow's poppy contracts, signed by the Lantern's bursar). No ring.
3. The ring is on Garth Hollin's finger (SQ-SR3). Give it to her (`widow_ring`). She gives the hero her husband's
   **sea-knife**, and tells them her husband was the wreckers' first: *"He saw a light. He thought it was home."*
- **Rewards**: 120 xp.

### SQ-SR5 — The Harbour Warden
- **Giver**: Wystan Coyle. **Level** 11. **Time** 30 min.
1. Three men against Nell's sixty; he wants proof to bring Kingsmere's ships down on her.
2. Proof: Nell's ledger (stealth, or Mag Dory charmed); a Carrow-sealed letter (SQ-SR1); Captain Eel's word (only if Ned
   was saved: Eel's brother).
3. **The turn**: the ledger shows the Regency's tenth of the poppy trade paid through Coyle's own office. He didn't
   know; or he did and took it; the hero decides how to read his face.
4. Choice (`gullhaven_harbour`): **to Coyle** (`warden`: Regency ships come; Nell broken; Regency +20, Gullhaven -1);
   **warn Nell** (`nell`); **a truce** (Gullhaven ≥ +1 and Regency ≥ 20) (`truce`: both help in Act III).
- **Rewards**: 200 xp; 100 silver.

### SQ-SR6 — Brine and Bone
- **Giver**: Brother Oswin Penn, finding the hero. **Level** 11. **Time** 35 min.
1. Oswin fled the Abbey last winter with **pages torn from the Lector's book**: the changed oath in Anselm's hand, and a
   list of novices "given to the vigil", with dates and, against forty names, *"rested"*. He was a Listener for a month:
   his eyelids are scarred with needle-holes; he got the stitches out with a fish-knife.
2. Two Lantern knights in Gullhaven, polite, armed, asking for him. Talk them away (Lantern ≥ 20), fight them (Lantern
   -20), or a false trail.
3. Get him on a boat. He gives the pages (`anselm_pages`).
4. Or give him up (`oswin_given`: Lantern +15; the pages lost unless copied: half evidence).
- **Rewards**: 220 xp.

### SQ-SR7 — Mother Sorrow's Ledger
- **Giver**: **Hesper Rowe** (if in the Milk House: `hesper_safe` false) or a girl named **Pearl** (if not). **Level** 10.
  **Time** 35 min.
1. Mother Sorrow's girls and boys work off "debts" (the cost of their poppy, their keep, their clothes) that never
   shrink. Pearl wants out; she's twenty, was a kitchen girl there from twelve (kept quiet with milk), went upstairs at
   eighteen, and owes four hundred silver for eight years of poppy she never asked for.
2. The ledger: Mother Sorrow's book of every debt for forty years. The hero can steal it, buy it, or ask her for it.
3. **The turn**: in the ledger, twenty-nine years back: *"Bryda, 24, Gullhaven. Debt sold to a Carrow gentleman with her
   daughter, aged 6, named Sabeline."* Mother Sorrow, asked, remembers the child: *"She bit him, the gentleman. Good girl."*
   (`sabeline_mother`: in romance, a beat; outside it, leverage over Sabeline in MQ24: she'll defect for the hero's
   silence, or hate them for knowing.)
4. Choice (`sorrow_ledger`): **burn it** (every debt cancelled; Nell is furious and Mother Sorrow, surprisingly, isn't:
   `burned`); **give it to Nell** to "renegotiate" (Nell halves the debts and keeps the rest: `nell`); **buy Pearl's debt
   alone** (400 silver, `pearl_freed`).
- **Rewards**: 200 xp; Gullhaven +1 (`burned`).

---

## Contracts

### CT-SR1 — The Tide-Wife
- **Board** (Gullhaven): *"Something in Wrecker's Hole pulls our boys under. Singing. 150 silver. — the Fishwives."*
  **Level** 11. **Time** 25 min.
1. The lower flooded cave at low tide: drowned men standing in the water up to their chests, facing the same way.
2. **The Tide-Wife** (the Drowned, level 12): **Morwen Sorrel**, Old Sorrel's wife, who drowned herself after she
   learned what her husband's beacon did; she gathers the wreckers' victims round her and sings them into the deep
   water, and takes any man who comes in, to give her husband's crimes back to the sea.
3. **The turn**: she's taking boys because Sorrel's son is one of the fishwives' boys; she wants *him*.
4. Choice (`tide_wife`): **fight** her and her drowned (`destroyed`); **bring Sorrel** (alive, if SQ-SR3 left him so, or
   his body) to the water: she takes him and the cave goes quiet (`sorrel_given`); **Rite of Rest**, with the boy's
   promise to light a candle at the Gull Light each year (`rested`).
- **Rewards**: 200 xp; 150 silver.

### CT-SR2 — The Cliff-Top Pack
- **Board** (Saltcombe): *"Wolves take the sheep on the heath. 90 silver."* **Level** 10. **Time** 20 min.
1. 5 wolves and **Old Greymuzzle** (level 11).
2. **The turn**: they came down because the dead walk in the cliff-top cairns; the Sea-pink Cairn's ghost at night.
   Laying it to rest (Rite of Rest) sends the pack back to the hills (`clifftop: rested`).
- **Rewards**: 160 xp; 90 silver; a **greymuzzle pelt**.
