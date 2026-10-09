# Southfields — Millbrook, Larkspur, the farmlands

**Tiles** x 2600–3900, z 2700–3900. **Levels** 8–12. **Time** ~4 h of side content (6 side quests, 2 contracts).
**Mood**: the Vale's breadbasket: patchwork fields of barley and wheat, orchards, hedgerows, hay wains, bee gardens;
under the harvest gold, fever in Larkspur and a burned street no one talks about.

Main quests here: MQ16, MQ17, MQ18, MQ19.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **Fields** | most of the region: hand-drawn field plots with hedgerows | Barley, wheat, beans, hay; harvest-time looks (stooks) |
| **Orchards** | round Millbrook (2900–3100, 3200–3400) | Apples, pears; the fair's field |
| **The Mill Brook** | stream from the Carrow Teeth (3800, 2800) west to Millbrook (3000, 3300) and on to the Kingsbrook | Millbrook's watermill |
| **Larkspur Hill** | (3650, 3350), tiers 2–4 | The barrow ruin on top |
| **Hedge Maze** | (3200, 3500) | Old overgrown hedges round a ruined manor (the deserters' camp is nearby) |
| **The South Road** | from Brindle Vale (1450, 3450) east → (2300, 3400) King's Oak → Millbrook (3000, 3300) → Larkspur (3500, 3100) | |

## Millbrook — village (centre at 3000, 3300)
The Vale's biggest village: 16 houses, a watermill, a green with a maypole, a tithe barn, an inn (**The Barley
Mow**), orchards. Mother Hesk's cottage stands at the village's east end (3040, 3300), with a bee garden of twelve
hives. Standing 0.
People: **Isolde** (Maelis), headman **Wilfrid Barley** (cheerful, shrewd), the miller **Gerda Mill**, the inn's
landlord **Cuthbert**, the Lantern's tithe-reeve **Brother Cormac** (SQ-SF5), the children **Poll and Robin Barley**.

## Larkspur — village (centre at 3500, 3100)
A village of 11 houses; one street (the north row, 5 houses) burned last spring by Odalys's knights when the fever
began; black beams, nettles. The rest live with the fever. Standing 0 (they hate the Lantern: Lantern ≥ 20 makes it
start at -1).
People: the headwoman **Rosamund Pye** (lost her husband in the burning), the fever-nurse **Old Cass**, **Jack
Pye** (her son, 18, angry: SQ-SF1), the farmer **Edwin Shaw** (SQ-SF6).

## Dungeons and camps
- **Larkspur Barrow** (3650, 3350): MQ18's crypt (a barrow-witch's grave); after it's sealed it stays quiet.
- **Deserters' camp** (3300, 3700): in the overgrown grounds of a ruined manor by the Hedge Maze: a stockade of
  hurdles, 6 deserters (bandits in Regency kit, level 9) and their sergeant **Hugh Hobday** (bandit chief, level 10)
  (SQ-SF2).

## Landmarks
| Landmark | (x, z) | What |
|---|---|---|
| **King's Oak** | 2300, 3300 | (Middle Downs) Osric's banner oak; a rest point |
| **The Ruined Manor** | 3250, 3650 | Hedgemoor House, empty since the Wet Years; a cellar with a chest (a **steward's chain**: +trade prices) |
| **The Wishing Well** | 3400, 2900 | A well in a wood; throw a coin: a random small blessing (game: a buff) |
| **The Burned Row** | 3500, 3080 | Larkspur's burned street: a memorial the villagers built of the charred beams |

---

## Side quests

### SQ-SF1 — The Burned Row
- **Giver**: Rosamund Pye (after MQ18, if `larkspur` cured). **Level** 11. **Time** 35 min.
1. Larkspur is cured, but it wants justice: Jack Pye has gathered six young men with bows to ambush the next Lantern
   patrol on the South Road.
2. Choice (`burned_row`):
   - **Stop the ambush** by talking Jack down (`stopped`), then **bring Odalys** (needs Lantern ≥ 20 or
     `odalys_doubts`) to stand in the Burned Row and ask Larkspur's forgiveness (`odalys_knelt`): she does it, stiffly,
     honestly; Rosamund forgives nothing but lets her plant a tree; Larkspur +1, Lantern +5, Odalys's arc deepens (she
     gives the hero her doubts about Anselm: `odalys_doubts`).
   - **Help the ambush** (`ambushed`): four knights die; Larkspur +1, Lantern -30; Jack becomes a Greenhood archer.
   - **Warn the patrol** (`warned`): Jack and his friends are taken; Larkspur -2, Lantern +10.
- **Rewards**: 220 xp.

### SQ-SF2 — The Deserters
- **Giver**: Wilfrid Barley (they steal from Millbrook's orchards) or Ketter's trail (MQ16). **Level** 10. **Time** 35
  min.
1. The deserters were Southfields farm boys pressed into the Regency's levy and sent north to the barrow watch; they
   ran when the dead came. They steal to eat; one robbery went bad and a farmer died.
2. Their camp by the Hedge Maze; Sergeant **Hugh Hobday**.
3. Choice (`deserters`):
   - **Bring them in** to Captain Varrow / Kingsmere (`surrendered`): they're hanged or sent back north (Regency
     +10); Millbrook +0.
   - **Let them go home** and work the harvest (needs Millbrook ≥ +1 so Wilfrid will vouch) (`home`): Millbrook +1,
     Regency -10; they fight for Millbrook in MQ24 (village militia counts double for Millbrook).
   - **Send them to the Greenhood** (`to_greenhood`): Greenhood +10.
   - **Fight** (`killed`).
   - The farmer's killer, **Ralf**, is among them: the hero can hand him alone to the farmer's widow's justice
     (`ralf_judged`).
- **Rewards**: 200 xp.

### SQ-SF3 — Hesk's Hives
- **Giver**: Isolde (after MQ17). **Level** 11. **Time** 30 min.
1. Mother Hesk's hives are failing since she died; Isolde never had the knack. She asks for help, as much for company
   as for bees.
2. Tasks: fetch a new queen from Agna Bee at Tallow Green (Brindle Vale; a long trip: or a wild swarm from the Wishing
   Well's wood: smoke them out of a hollow tree, a stinging minigame); mend two hives (wood, a hammer); move the hives
   out of the wind.
3. While working, Isolde talks: about Hesk, about a ferryman who visited once a year and never stayed, about bad dreams
   of water. If the hero has told her the truth (`told_isolde_truth`), she tells them about the oar.
4. Hesk's journal, in the hive shed: *"The girl the ferryman brought is the king's daughter. I'll call her Isolde. She
   brought a piece of iron in her fist that burned my hand. I've buried it under the third hive."*
- **Rewards**: 180 xp; Isolde's trust (`isolde_hives`: counts toward MQ19's `heart: given`); a jar of Hesk's honey
  (heals fully once).

### SQ-SF4 — The Harvest Fair
- **Giver**: Wilfrid Barley; the fair runs for three days once a season (the first time: when the hero first reaches
  Millbrook). **Level** any. **Time** 30 min.
1. Contests: **archery** (targets on the green: a timing game), **the greasy pole** (balance), **the pie table** (eat
   three pies in a minute: a food-eating gag), **wrestling** (three bouts, unarmed).
2. The wrestling champion, **Big Hamm** the miller's man, wins by cheating: Gerda Mill puts lard on his shoulders.
   Expose it, or win anyway, or throw the bout for Gerda's bribe (20 silver).
3. Winning two contests earns the **Harvest Ribbon** (Millbrook +1) and a dance with the fair's queen (a short
   scene; if Isolde is there, she's crowned fair queen and dances with the hero: a gentle moment before MQ19).
- **Rewards**: 120 xp; prizes (a ham, a bow, a pie tin hat: cosmetic).

### SQ-SF5 — The Tithe Barn
- **Giver**: Gerda Mill. **Level** 10. **Time** 30 min.
1. The Lantern's tithe-reeve, **Brother Cormac**, takes a tenth of Millbrook's grain for the Abbey; this year he
   wants a fifth "for the war against the dead".
2. Investigate: Cormac's ledger shows a fifth collected, a tenth sent to the Abbey; the rest goes to Carrow buyers in
   Kingsmere (Sabeline's grain agents, buying the Vale hungry).
3. Choice (`tithe`):
   - **Expose Cormac to the Abbey** (`abbey`): Odalys sends him in chains to the moors; the tithe drops; Lantern +10,
     Millbrook +1.
   - **Expose him to Millbrook** (`village`): the village throws him in the brook and keeps the grain; Millbrook +2,
     Lantern -10.
   - **Blackmail him** (`blackmail`): 100 silver for the hero; nothing changes.
- **Rewards**: 180 xp.

### SQ-SF6 — The Scarecrow
- **Giver**: Edwin Shaw, Larkspur. **Level** 9. **Time** 30 min.
1. A scarecrow in Edwin's barley walks at night; crows won't land anywhere near; a dog was found torn.
2. Night in the field: the scarecrow holds a **ghost**, **Dickon Moss** (level 9), a farmhand who vanished last
   harvest. He was murdered and buried under the scarecrow's post.
3. Clues: a broken sickle in the hedge (the blade marked with the Pye family's sign); Dickon's love letters, hidden in
   the barn, to **Rosamund Pye's daughter, Lettice**; Jack Pye's temper.
4. The truth: **Jack Pye** killed Dickon in a fight over his sister and hid him. Choice (`scarecrow`):
   - **Tell Rosamund** (`told`): she gives her son up to the reeve; Larkspur +0 (grief); Dickon rests.
   - **Make Jack confess** himself (`confessed`): Jack, broken, confesses; Rosamund keeps her dignity; Larkspur +1.
   - **Bury the truth** with Dickon (Rite of Rest, say nothing) (`buried`): Dickon rests; Jack carries it.
- **Rewards**: 180 xp.

---

## Contracts

### CT-SF1 — Boars in the Barley
- **Notice board** (Millbrook): *"A sounder of boars ruins the barley at the south fields. 80 silver a head of the
  big tusker. — W. Barley."* **Level** 9. **Time** 15 min.
1. Five boars (level 8) and **Old Tusk** (a giant boar, level 10) rooting at night; they charge in a line.
- **Rewards**: 120 xp; 80 silver; a **boar-tusk necklace**.

### CT-SF2 — The Grain-Worm
- **Notice board** (Millbrook): *"Something under the old granary eats grain and dogs. 130 silver. — G. Mill."*
  **Level** 11. **Time** 20 min.
1. The old stone granary (2960, 3330); the floor caved into a pit; tunnels.
2. A **cave worm** (giant, level 11) that grew fat on grain in old tunnels under the granary (tunnels of the Barrow War:
   lore), and its brood.
- **Rewards**: 160 xp; 130 silver.
