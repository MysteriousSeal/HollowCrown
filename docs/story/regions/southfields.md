# Southfields — Millbrook, Larkspur, the farmlands

**Tiles** x 2600–3900, z 2700–3900. **Levels** 8–12. **Time** ~4.5 h of side content (7 side quests, 2 contracts).
**Mood**: barley and wheat, orchards, hedgerows, hay wains, beehives, a harvest fair; in Larkspur, a burned street and
a fever that came out of a grave someone dug for flowers.

Main quests here: MQ16, MQ17, MQ18, MQ19.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **Fields** | most of the region, hand-drawn plots with hedgerows | Harvest-time looks |
| **Orchards** | round Millbrook (2900–3100, 3200–3400) | The fair's field |
| **The Mill Brook** | (3800, 2800) → Millbrook (3000, 3300) → the Kingsbrook | |
| **Larkspur Hill** | (3650, 3350), tiers 2–4 | The barrow ruin on top |
| **Hedge Maze** | (3200, 3500) | Overgrown hedges round a ruined manor |
| **The South Road** | Brindle Vale (1450, 3450) → King's Oak → Millbrook → Larkspur | |

## Millbrook — village (3000, 3300)
16 houses, a watermill, a maypole green, a tithe barn, the inn **The Barley Mow** (landlord **Cuthbert**), orchards;
Mother Hesk's cottage at the east end (3040, 3300) with twelve hives; the **fever barn** (MQ17).
People: **Isolde**, headman **Wilfrid Barley**, the miller **Gerda Mill**, the Lantern's tithe-reeve **Brother Cormac**,
the children **Poll and Robin Barley**, **Big Hamm** (Gerda's man).

## Larkspur — village (3500, 3100)
11 houses; **the Burned Row** (5 houses, black beams, nettles, a memorial of charred beams). Hates the Lantern.
People: headwoman **Rosamund Pye** (lost her husband in the burning), the fever-nurse **Old Cass**, **Jack Pye** (18,
angry), his sister **Lettice** (20), the farmer **Edwin Shaw**, the sleepers who dug the barrow (most now dead: their
families won't say their names).

## Dungeons, camps, landmarks
| Place | (x, z) | What |
|---|---|---|
| **Larkspur Barrow** | 3650, 3350 | MQ18 |
| **Deserters' camp** | 3300, 3700 | Hurdle stockade by the ruined manor; 6 deserters, Sergeant **Hugh Hobday** |
| **King's Oak** | 2300, 3300 | (Middle Downs) rest point |
| **Hedgemoor House** | 3250, 3650 | Ruined manor; a cellar chest (a **steward's chain**) and a family's last letters (the Wet Years) |
| **The Wishing Well** | 3400, 2900 | Throw a coin: a small blessing |
| **The Burned Row** | 3500, 3080 | |

---

## Side quests

### SQ-SF1 — The Burned Row
- **Giver**: Rosamund Pye (after MQ18, if cured). **Level** 11. **Time** 35 min.
1. Cured, Larkspur wants justice: **Jack Pye** (or **Will Carter**, if `scarecrow: told`) and six young men with bows
   mean to ambush the next Lantern patrol on the South Road.
2. Rosamund, at the memorial: *"They sang hymns. All afternoon, to cover it. I can't hear a hymn now."*
3. Choice (`burned_row`):
   - **Stop the ambush** (`stopped`), then **bring Odalys** (Lantern ≥ 20 or `odalys_doubts`) to stand in the Burned Row
     (`odalys_knelt`): she takes off her helm and kneels in the ash; she names the eleven, one by one, she knows every
     name; Rosamund doesn't forgive her and lets her plant a rowan. Larkspur +1; Lantern +5; romance beat; Odalys gives
     the hero her doubts about Anselm's fever orders (`odalys_doubts`).
   - **Help the ambush** (`ambushed`): four knights die, one of them sixteen; Larkspur +1, Lantern -30; Jack joins the
     Greenhood.
   - **Warn the patrol** (`warned`): the young men are taken and hanged at the Abbey gate; Larkspur -2, Lantern +10.
- **Rewards**: 220 xp.

### SQ-SF2 — The Deserters
- **Giver**: Wilfrid Barley, or Ketter's trail (MQ16). **Level** 10. **Time** 35 min.
1. Southfields farm boys pressed into the levy and sent to the barrow watch; they ran when the dead came. They steal to
   eat; one robbery went bad and a farmer, **Tom Ashby** (no kin of the Regent's), died.
2. Their camp: **Hugh Hobday**, a sergeant of twenty-three with a broken nose, keeping the boys alive. They tell what the
   barrow watch was: draugr walking out of the hills while the officers rode south.
3. Choice (`deserters`): **bring them in** (`surrendered`: hanged; Regency +10); **send them home** to the harvest
   (Millbrook ≥ +1 so Wilfrid will vouch) (`home`: Millbrook +1, Regency -10; Millbrook's militia counts double in MQ24);
   **to the Greenhood** (`to_greenhood`); **fight** (`killed`). Tom Ashby's killer, **Ralf**, can be given to the widow
   alone (`ralf_judged`: she can't do it; she makes him dig her husband's field until he dies, and he does).
- **Rewards**: 200 xp.

### SQ-SF3 — Hesk's Hives
- **Giver**: Isolde (after MQ17). **Level** 11. **Time** 30 min.
1. The hives fail since Hesk died; Isolde never had the knack.
2. A new queen (Agna at Tallow Green, or a wild swarm from the Wishing Well's wood: smoke, stings); two hives mended; the
   hives moved out of the wind.
3. Isolde talks: Hesk; a ferryman who visited once a year and never stayed; dreams of water.
4. **Hesk's journal** in the hive shed: *"The girl the ferryman brought is the king's daughter. I'll call her Isolde.
   She brought iron that burned my hand. Under the third hive."* And the last page, in Isolde's hand, a year later:
   *"She asked me to. I gave her enough to sleep. Forgive me."*
- The hero can read the last page and say nothing, or ask (a long scene: Isolde about Hesk's death; no judgment works
  better than either comfort or blame; romance beat).
- **Rewards**: 180 xp; `isolde_hives`; a jar of Hesk's honey (heals fully once).

### SQ-SF4 — The Harvest Fair
- **Giver**: Wilfrid Barley; three days once a season. **Level** any. **Time** 30 min.
1. **Archery**, **the greasy pole**, **the pie table** (three pies in a minute), **wrestling** (three bouts).
2. Big Hamm wins by cheating (Gerda greases his shoulders with lard). Expose it, win anyway, or throw the bout (20 silver).
3. Two wins: the **Harvest Ribbon**, a dance with the fair's queen (Isolde, if she's come: a gentle moment before MQ19;
   romance beat). And at night, behind the tithe barn, Smudge's cousin sells milk to the fair's young men; the hero can
   leave it be.
- **Rewards**: 120 xp; prizes.

### SQ-SF5 — The Tithe Barn
- **Giver**: Gerda Mill. **Level** 10. **Time** 30 min.
1. **Brother Cormac** takes a fifth of Millbrook's grain this year "for the war against the dead".
2. His ledger: a tenth to the Abbey; the rest sold to Carrow's grain agents in Kingsmere (Sabeline's), buying the Vale
   hungry.
3. Choice (`tithe`): **to the Abbey** (`abbey`: Odalys has him flogged and sent to the White Fields; Lantern +10,
   Millbrook +1); **to Millbrook** (`village`: they throw him in the brook and keep the grain; Millbrook +2, Lantern -10);
   **blackmail** (`blackmail`: 100 silver).
- **Rewards**: 180 xp.

### SQ-SF6 — The Scarecrow
- **Giver**: Edwin Shaw, Larkspur. **Level** 9. **Time** 30 min.
1. A scarecrow walks his barley at night; crows won't land; a dog torn.
2. In it, a ghost: **Dickon Moss**, a farmhand who vanished last harvest, murdered and buried under the scarecrow's post.
3. Clues: a sickle with the Pye mark in the hedge; Dickon's letters to **Lettice Pye**; Jack's temper.
4. **The turn**: Jack killed him; but Lettice's letters show she was trying to *leave* Dickon, who beat her, and Jack
   found her with a split lip. (Not excused; complicated.)
5. Choice (`scarecrow`): **tell Rosamund** (`told`: she gives her son to the reeve; Jack hanged at Millbrook unless the hero
   speaks for him with Lettice's letters: then a branding and exile); **make Jack confess** (`confessed`); **bury the
   truth** with Dickon (Rite of Rest, `buried`: Lettice thanks the hero, once, never again).
- **Rewards**: 180 xp.

### SQ-SF7 — The Sleeping Draught
- **Giver**: the hero notices (MQ17) or Old Cass in Larkspur ("the herbalist sleeps on Hesk's grave some nights").
  **Level** 11. **Time** 45 min, spread over three nights.
1. Isolde's habit: four years of grave-poppy every night, to see Rhosyn and her father, who are kind to her there. She's
   been cutting it with valerian to use less. It isn't working. Her hands shake in the fever barn.
2. Asked about it, she lies; then she's angry; then, at night on Hesk's grave, she offers the hero a cup: *"Come and meet
   them. They're lovely. My father apologises every time."* The hero can drink (poppy-sight: Rhosyn and Edric, gentle,
   wrong: the hero sees what Isolde doesn't: they're not her dead; they're the barrow's dreaming wearing their faces), or
   refuse.
3. If the hero helps her stop (she must ask; the hero can only offer): **three nights** in Hesk's cottage. Each night a
   scene: sweats and vomiting and fury (*"Get out. No — stay."*); the silence (the worst night: the dead gone, all the
   grief back at once; she talks about Rhosyn's hands on her hair); the morning after the third, she goes to the hives.
   The hero's tone choices each night matter (Kind or Blunt help; Hard breaks it; Sly makes her laugh once, which helps
   more than anything).
4. Outcome (`isolde_clean`): **clean** (`true`: she sees her real dead never again, and lives with that; romance beat
   +2), **still using** (`false`: in the Rightful Queen ending she rules with a cup by her bed; one epilogue slide ends
   her on Hesk's grave), or **the hero supplies her** (she asks, the hero gives: romance +1 now, the dark slide later).
- **Rewards**: 240 xp.

---

## Contracts

### CT-SF1 — Boars in the Barley
- **Board** (Millbrook): *"A sounder ruins the south barley. 80 silver for the big tusker. — W. Barley."* **Level** 9.
  **Time** 15 min.
1. Five boars and **Old Tusk** (level 10), at night.
2. **The turn**: they're rooting up the Wet Years' field graves along the hedgerow, where Millbrook buried its dead
   without a churchyard; the boars eat what they find. The hero can tell Wilfrid, who goes grey and organises a reburial
   (`hedge_graves`: Millbrook +1).
- **Rewards**: 120 xp; 80 silver; a **boar-tusk necklace**.

### CT-SF2 — The Grain-Worm
- **Board** (Millbrook): *"Something under the old granary eats grain and dogs. 130 silver. — G. Mill."* **Level** 11.
  **Time** 20 min.
1. The old granary (2960, 3330); the floor caved in; tunnels of the Barrow War; a **cave worm** (level 11) and its brood.
2. **The turn**: the tunnels are Barrowborn hiding-holes from the Barrow War; children's bones in the deepest one, with
   toys. The hero can bring one, a carved wooden bird, to Grey Edda in the Ditch (she knows the carving: a song).
- **Rewards**: 160 xp; 130 silver.
