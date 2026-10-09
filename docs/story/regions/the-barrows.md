# The Barrows — the barrow hills, the Watchers' Crypt, the Great Barrow

**Tiles** x 1450–3000, z 150–1400. **Levels** 12–18. **Time** ~3.5 h of side content (5 side quests, 2 contracts).
**Mood**: bare green-grey hills ringed with grassy barrow mounds, cairns on every ridge, ruined watchtowers, wind,
ravens, no trees; a cold that comes up out of the ground; at the north end, under a black sky in Act III, the Great
Barrow.

Main quests here: MQ26, MQ27, MQ28.

## Access
- **The Fringe** (z 800–1400): open from the end of Act I (MQ12). Grave-robbers, cairns, the watchtower ruins, Sigrun's
  cairn. The dead here are restless but few until MQ22, then many.
- **The Barrow Valley** (z 150–800): closed by the Lantern's oath-iron gate across the Barrow Road at the Watchers'
  Crypt (2250, 1050) until MQ26. The ridges round the valley are cliffs; no other way in.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The barrow hills** | the whole region, tiers 2–6, rounded | Short grass, heather patches, bare rock on the tops |
| **Barrow mounds** | ~60 small mounds scattered (decoration), 9 **war cairns** (SQ-BR5) | Some opened by robbers: holes, spoil heaps |
| **The Barrow Road** | Elderwick (2600, 1600) → (2400, 1300) → the Watchers' Crypt (2250, 1050) → the valley → the Great Barrow (2250, 450) | Old paving under the turf |
| **The Barrow Valley** | x 1900–2600, z 200–800 | A long valley ringed by cliffs, dozens of great mounds, the Great Barrow at its head |
| **Coldstep Pass** | (2900, 500) | A pass into the Carrow Teeth (closed by snow; CT-BR2) |
| **The Cold Spine** | z < 150 | Mountains: the map's north edge |

## Places
| Place | (x, z) | What |
|---|---|---|
| **Watchers' Crypt** | 2250, 1050 | A ruined watchtower over the Barrow Road; the Lantern's oath-iron gate; the crypt of the Watchers beneath (MQ26) |
| **The Great Barrow** | 2250, 450 | The greatest mound, 40 tiles long, a stone-lined passage; five levels down to the Speaking Stone (MQ28) |
| **Grave-robbers' camp** | 1800, 900 | A camp in a dug-out barrow: tents, carts of barrow-iron, 6 grave-robbers (bandits, level 12), **Haskel the Spade** (bandit chief, level 13) |
| **Carrow adit** | 2700, 950 | A mine tunnel into a hill: Carrow prospectors (SQ-BR3) |
| **Sigrun's Cairn** | 2050, 1200 | A cairn ringed by white stones on a hilltop, wild white roses growing out of it (SQ-BR4) |
| **The Broken Towers** | 1700, 1250 and 2850, 1250 | Two more ruined watchtowers (SQ-BR2) |

---

## Side quests

### SQ-BR1 — The Grave-Robbers
- **Giver**: Reeve Margery Cotes of Elderwick (the robbers sell barrow-iron in Elderwick's market) or Odalys.
  **Level** 12. **Time** 35 min.
1. Barrows are being opened; the dead in them wake angry and come south.
2. **Haskel the Spade**'s camp: the robbers dig at night with oath-iron gloves (they burn, they use them anyway), and
   load barrow-iron onto carts for **Carrow buyers** (Sabeline's agents).
3. Choice (`grave_robbers`):
   - **Clear the camp** (`cleared`): fewer dead in Act III (the siege is a little easier: counts as half an ally).
   - **Follow the carts** to Elderwick and catch Sabeline's agent (`agent_caught`): evidence of Carrow's hand; Regency
     +10; Sabeline's MQ24 offer is made with less confidence (she offers more: 3 allies' worth, at the same price).
   - **Take a cut** (`bribed`, 150 silver): more barrows opened; Elderwick's attack in MQ22 is worse.
- **Rewards**: 260 xp.

### SQ-BR2 — The Last Watchman
- **Giver**: a ghost at the first Broken Tower (1700, 1250). **Level** 13. **Time** 40 min.
1. The ghosts of the three Broken Towers are Watchers, the first Lantern knights, set to watch the barrows 300 years
   ago. Each holds a third of the **Watchers' oath**, a vow the first Watcher, Sir Eadric Long, made and broke (he fled
   his post once, and the dead came south).
2. Visit the three towers (1700, 1250), (2250, 1050: its outside only, before MQ26), (2850, 1250); at each, a trial:
   stand watch till dawn against the dead (a survival fight), answer a riddle in the Watchers' tradition, bring the
   ghost a token of its living kin (a novice at the Abbey descends from one: Novice Bryn).
3. The whole oath (`watchers_oath`): in MQ26 Sir Eadric hears it, kneels, and fights for the hero.
- **Rewards**: 280 xp; the **Watcher's cloak** (the dead notice the hero later).

### SQ-BR3 — Iron in the Hills
- **Giver**: the hero finds the adit; or Wren (her scouts saw Carrow men in the hills). **Level** 13. **Time** 35 min.
1. Carrow's prospectors, under engineer **Joss Valt**, are driving a mine into a barrow hill for silver, with
   Sabeline's paper (a "permit" signed by Benedikt Orme in the Regent's name).
2. Inside the adit: the miners have broken into a barrow chamber; its dead are waking; the miners are trapped.
3. Choice (`adit`):
   - **Collapse the adit** (with the miners' own powder: blasting powder exists in Carrow; it's rare in the Vale)
     after getting the miners out (`collapsed`): Carrow's mining stopped; Sabeline furious.
   - **Collapse it with them inside** (`sealed_in`): the same, crueller; nobody knows.
   - **Let them dig** (`dug`): Carrow pays the hero 200 silver; the barrow hills are breached: the siege's dead are
     more (a wave more), and Carrow's shadow falls on the epilogue even without the pact.
- **Rewards**: 240 xp.

### SQ-BR4 — The Oath-Bride
- **Giver**: the white roses at Sigrun's Cairn (2050, 1200): touching them, the hero hears a woman's voice in the old
  tongue. **Level** 14. **Time** 45 min.
1. **Sigrun**, Hrathgar's daughter and Osric's queen, was buried here, between the living and the dead, as she asked.
   Grave-robbers broke her cairn last winter and took her **bridal torc**; her ghost is bound to the broken cairn,
   weakening.
2. Find the torc: sold in Elderwick's market (Haskel's goods) to **Sabeline's agent** (if SQ-BR1 `agent_caught`, the
   hero has it already), or to a Kingsmere goldsmith.
3. Rebuild the cairn (carry 9 white stones scattered on the hill back to the ring) and return the torc.
4. Sigrun speaks: the Oath was a **marriage** of the living and the dead, a promise both sides kept. *"My father
   doesn't want war. He wants his promise kept, or ended honestly."* (With `osric_stone` from SQ-HM2, she tells all of
   it: Osric's side kept faith until Edric tried to sell the barrows.)
5. (`sigrun_freed`): she fights for the living at the siege (MQ24 ally: the oath-dead) and walks with the hero in MQ28;
   in the Free Vale ending she makes laying Hrathgar to rest possible.
- **Rewards**: 320 xp; Sigrun's **white rose** (a charm: the hero's blows against the barrow-host hit harder).

### SQ-BR5 — Cairns of the Fallen
- **Giver**: the Hermit of Cairnfold (SQ-LM4) or a book in the Abbey archive. **Level** 12. **Time** 30 min (spread
  across exploring).
1. Nine **war cairns** across the fringe mark the Barrow War's dead of both sides. At each, a name stone in the old
   tongue (read by touch).
2. Find all nine (spread across the fringe, each with a small encounter: a ghost, skeletons, a draugr).
3. Bring the names to the Hermit or to Sigrun (`cairn_names`): the hero learns the barrow-tongue greeting; in the dreams
   and in MQ28, Hrathgar answers it (`hrathgar_rapport` +1).
- **Rewards**: 200 xp; the **cairn-stone ring** (resist cold).

---

## Contracts

### CT-BR1 — The Barrow-Hounds
- **Notice board** (Elderwick): *"Dead dogs. Dead, walking dogs. They take our sheep and leave them half-eaten. 160
  silver. — M. Cotes."* **Level** 13. **Time** 20 min.
1. A pack of 5 **barrow-hounds** (skeletal wolves, **new**, level 12) and their **Kennel-Master**, a draugr huntsman
   (level 13) with a horn, coursing the fringe at night.
2. His barrow, which he leaves every night, and a horn that calls them: blow it at dawn and they return to their
   barrow and lie down (`hounds: rested`), or destroy them all.
- **Rewards**: 220 xp; 160 silver; the **huntsman's horn** (if destroyed: calls a skeleton hound to fight for the hero
  once a day).

### CT-BR2 — The Wight of Coldstep
- **Notice board** (Kingsmere, posted by Carrow's envoy: Sabeline needs the pass for her couriers): *"A dead thing
  holds Coldstep Pass. 300 silver from the Duchy of Carrow."* **Level** 15. **Time** 25 min.
1. **Coldstep Pass** (2900, 500), in snow: a **barrow-wight** (draugr, level 16) on a cairn in the pass, killing all who
   cross, its frozen guards round it.
2. It guards the pass because it's the old border the Oath set: no barrow-iron crosses the mountains.
3. Kill it and Carrow's couriers cross (`coldstep: opened`): Sabeline pays; Carrow's agents come and go more freely
   (her offers come quicker). Or leave it (`left`) and lie to Sabeline that it can't be killed (no pay; a quiet win).
- **Rewards**: 300 xp; 300 silver (if killed).
