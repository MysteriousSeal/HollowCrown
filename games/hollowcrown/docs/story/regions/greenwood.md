# Greenwood — Oakhallow, Thornbeck, the Hollow Oak

**Tiles** x 2800–3950, z 700–2600. **Levels** 6–11 (the Hunter's Barrow 10–12). **Time** ~5.5 h of side content (8 side
quests, 2 contracts). **Mood**: the oldest forest in the Vale: giant oaks, moss, brooks, shafts of light, woodsmoke, the
Greenhood's whistles; a garrison that doesn't sleep; a burned barn at the edge of Thornbeck that everyone walks around.

Main quests here: MQ09, MQ10, MQ20 (heist), MQ24.

---

## Land
| Feature | Where | Notes |
|---|---|---|
| **The deep wood** | (2850, 750) (3900, 750) (3900, 2550) (2850, 2550) | Dense oak and beech; paths only on roads and trails |
| **Pine ridges** | x 3600–3950, z 700–1400 and 1700–2100 | Spinner's Deep in the second |
| **The Oakbrook** | (3700, 800) → Hollowmere (2700, 2100) | Fords at Oakhallow (3200, 1500) and the Wood Road (2950, 2150) |
| **Clearings** | Oakhallow (3150–3250, 1450–1560), the Hollow Oak (3560–3640, 1060–1140), Thornbeck's fields (2950–3050, 2250–2350) | |
| **The Old Road** | (2850, 1800) → (3600, 1800) | Overgrown royal road; gibbets; a sleeper who hunts it (CT-GW2) |

## Oakhallow — village (3200, 1500)
10 log houses round a sawpit and a felled giant oak used as the village table. Loves the Greenhood, hates reeves. Maud
Halloway's grave behind it under a rowan.
People: headman **Aldred Fell** (old, stubborn; his grandson **Col** is in Thornbeck's levy), woodcutter **Bera Long**
and her daughter **Nettle**, charcoal-burner **Smudge**, herb-wife **Gudrun** (Maud's friend).

## Thornbeck — village (3000, 2300)
A Regency garrison village on the Wood Road: 8 houses, the stone tithe barn (3020, 2280), a stockade, 20 soldiers under
**Captain Ilse Varrow** (40, tired, decent, wry). **The Fellowe barn** (3060, 2330): burned black, nettles, a child's shoe.
People: **Varrow**, **Sergeant Brock** (hard), **Old Annis** (alewife), the miller **Cole Thorne**, and **Joan Fellowe**
(70, the only Fellowe left: she was at market that night).

## The Hollow Oak — the Greenhood's camp (3600, 1100)
A clearing round a vast hollow oak: a hall inside the trunk, tree-platforms, tents, a larder, a smithy tent, the poppy
table (where milk is cut into vials), 40 people.
People: **Wren**, **Pip Tanner**, **Mother Rook** (healer), **Jem Arrowsmith** (fletcher), **Kestrel** (scout, 12),
**Dunny Fosse** (the man Wren hanged for the Fellowe barn: his widow **Meg Fosse** still lives in the camp, and knows he
didn't light it alone).

## Dungeons, camps, landmarks
| Place | (x, z) | What |
|---|---|---|
| **Spinner's Deep** | 3700, 1900 | Spider nest in old mine-workings (SQ-GW5) |
| **Hunter's Barrow** | 3400, 800 | Crypt under a Barrow War hunting lodge (SQ-GW4) |
| **Sour Apple camp** | 3300, 2000 | Crab-apple thicket; 6 rogues, **Corliss Crabbe** |
| **The Greatest Oak** | 3350, 1250 | Twelve tiles round; a carving of Osric and Sigrun, and under it a Barrowborn one (a woman in chains) |
| **The Charcoal Pits** | 3100, 1750 | Smudge's pits; a bear's wallow nearby |
| **The Old Road's Milestone** | 3300, 1800 | "Kingsmere 40 leagues", old tongue |
| **Hermit's Spring** | 3800, 1400 | Heals fully once a day |

---

## Side quests

### SQ-GW1 — The Sour Apple
- **Giver**: Wren (Greenhood ≥ 0) or Varrow (Regency ≥ 0). **Level** 8. **Time** 35 min.
1. A band in green hoods robs and kills on the Wood Road; the Regency blames Wren.
2. Their camp: **Corliss Crabbe** and his rogues, Greenhood cloaks over Carrow coin; a family of travellers tied in the
   thicket (the father dead, the mother and son alive).
3. Choice (`sour_apple`): **for Wren** (`for_wren`: the Carrow purse to her; Greenhood +15); **for Varrow** (`for_varrow`:
   the cloaks to Thornbeck; Regency +10); **show both** (`both`: +10 each; opens MQ10's `shared`).
- **Rewards**: 200 xp; the **crab-apple bow**; 80 silver.

### SQ-GW2 — Thornbeck's Garrison
- **Giver**: Varrow. **Level** 8. **Time** 40 min.
1. Desertions; no pay from Kingsmere; soldiers stealing from farmers.
2. Tasks: the deserters (two at the Charcoal Pits, ashamed; one dead to a bear); a theft to judge between a soldier and
   Cole Thorne; the pay from Kingsmere (Hiram, Corvin or Aldous), and the Sour Apple's ambush if SQ-GW1 isn't done.
3. **The turn**: Varrow, over ale, about the Fellowe barn: *"Fellowe told us where the hoods camped. We never went. I
   didn't have the men. Then they burned his family. I sent his name to Kingsmere and nobody came. That's what talking to
   the Regency gets you."* (`varrow_trusts`)
- **Rewards**: 220 xp; Thornbeck +1; a **garrison shield**.

### SQ-GW3 — The Oakhallow Wedding
- **Giver**: Bera Long. **Level** 7. **Time** 35 min.
1. Nettle Long marries **Ash Rowan**, a Greenhood archer. Honey (Tallow Green or Southfields), a fiddler (**Fiddler Cobb**
   at the Heron and Pike: 20 silver or a drinking contest), a crown of flowers from Hermit's Spring.
2. The wedding: music round the felled oak, Wren dances (badly, on purpose), Smudge sings a filthy song about a reeve
   and a goat; the hero dances with someone (a romance beat if the partner is Wren).
3. A Regency patrol (Sergeant Brock) comes to arrest Ash. Choice (`oak_wedding`): **talk Brock down** (Regency ≥ 20, the
   heir's signet, or `varrow_trusts`) (`talked`); **fight** (`fought`: Greenhood +10, Regency -15); **let them take Ash**
   (`taken`: SQ-HM4's prisoner).
- **Rewards**: 180 xp; Aldred tells the way to the Hollow Oak.

### SQ-GW4 — The Hunter's Barrow
- **Giver**: the Greatest Oak's carving, or Gudrun. **Level** 11. **Time** 45 min.
1. **Ulfar the Hunter**, Osric's archer, was buried with his bow under a lodge in the deep wood.
2. The lodge (trophies, a fallen roof); the crypt (3 halls): skeleton archers, skeleton hounds, the **trophy hall**: not
   deer heads. Hill-folk heads, three hundred years dry, labelled in Ulfar's hand by "kind" (*"grey-eye, female, young"*).
3. **Ulfar** (crypt lord, level 12, an archer who hides): dying, proud: *"I was at Cairnfold. I lit the west door. Do
   they still sing of it?"*
- **Rewards**: 320 xp; **Ulfar's Yew**; lore (`ulfar_lore`: evidence of Cairnfold for MQ27's arguments).

### SQ-GW5 — Spinner's Deep
- **Giver**: Aldred Fell. **Level** 10. **Time** 40 min.
1. Four woodcutters went to the pine ridge and didn't come back.
2. Old mine-workings full of webs; spiders; cocoons: two dead; **Tolly Long** (Bera's husband) and a boy alive. Cut them
   free; Tolly is half-blind from the venom.
3. **The Spinner** (level 11) and her egg-sacs (burn them).
- **Rewards**: 260 xp; Oakhallow +1; a **spider-silk shirt**.

### SQ-GW6 — Wren's Mother
- **Giver**: Gudrun (after MQ09), or Wren (Greenhood ≥ 40). **Level** 9. **Time** 35 min.
1. The anniversary of Maud's death; Wren at the grave under the rowan, drunk on sloe gin; three famine ghosts round her.
2. Talk: Maud, the famine, the reeves who took Oakhallow's seed; the letter, unopened. *"I wanted him never to know she
   asked. So it'd be his fault forever, and not a little bit mine for not making her come to the Oak."*
3. **Ask for the letter** to take to Corvin (Greenhood ≥ 20, the right reason) (`wren_letter_given`), or leave it.
- **Rewards**: 200 xp; Greenhood +10; the **wren bracer**.

### SQ-GW7 — Brannoc's Debt
- **Opens** if `bv_red_hen` is `to_wren` or `spared`. **Level** 10. **Time** 35 min.
- **`to_wren`**: Wren set Brannoc to dig the famine dead's graves for a year. He's thinner, quieter. He asks the hero to
  help him pay back a pilgrim family: **Hesper Rowe**. The hero finds her (Gullhaven: the Milk House or the fish market).
  She can take his money and his apology, or his life (she chooses; the hero can speak or not) (`brannoc_redeemed` /
  `brannoc_hanged`).
- **`spared`**: Brannoc runs a new band on the Old Road, with Oakhallow girls taken for ransom. The hero sees what
  sparing him bought. A fight (level 11) (`brannoc_dead`); or he begs again (`brannoc_spared_twice`: he leaves the Vale;
  Oakhallow -1).
- **Rewards**: 200 xp.

### SQ-GW8 — The Fellowe Barn
- **Giver**: **Joan Fellowe**, at the barn's ashes (after MQ09). **Level** 9. **Time** 40 min.
1. Joan wants to know who burned her son's family. The Regency says the hoods; the hoods say the Regency, to blame them.
2. Investigation: the barn's door was nailed from outside with **Greenhood arrow-nails** (Jem Arrowsmith's make); the
   ashes hold five bodies, one a child behind the door; a soldier's account of the night; **Meg Fosse** at the Hollow Oak:
   her husband Dunny was hanged for it, but *"he didn't light it alone, and he didn't decide it. Pip was there. Pip
   brought the nails."*
3. **Pip**, asked: he was there. He nailed the door. Dunny lit it. *"Fellowe sold us out. Eleven of ours hanged in
   Kingsmere off his word. I didn't know the children were in there. I didn't look."* Wren found out at dawn, hanged
   Dunny, kept Pip, and blamed the herons.
4. **Wren**, confronted (romance beat if the hero lets her speak first): *"I hanged one of them. I needed the other. I've
   needed him every day since. Is that what you wanted to hear?"*
5. Choice (`fellowe`):
   - **Tell Joan the truth** (`truth`): she walks to the Hollow Oak alone and asks for Pip. What happens depends on Wren:
     she gives Pip to Joan (Greenhood ≥ 40 or Wren committed in romance) and Joan, at the end, doesn't kill him; or Wren
     refuses, and Joan hangs herself in the barn's ashes (a slide).
   - **Tell Varrow** (`regency`): the herons raid the Oak for Pip; Greenhood -30, Regency +20; Pip hanged in Kingsmere
     (`pip_hanged`), or killed in the raid.
   - **Keep it** (`kept`): Joan dies not knowing; Wren owes the hero (Greenhood +10); Pip can't look at the hero again.
   - **Make Pip tell Joan himself** (Hard or Blunt, needs Kit's heron from SQ-BV2: *"Your boy's ten. Tell her like
     you'd want someone to tell him."*) (`pip_confessed`): Joan spits on him and lets him live; Pip leaves the Greenhood
     to work Joan's fields (Kit can join him there: `kit` outcome changes).
- **Rewards**: 240 xp.

---

## Contracts

### CT-GW1 — The Greywood Bear
- **Board** (Thornbeck): *"A bear as big as a cart has killed two of ours and a horse. 140 silver. — Capt. I. Varrow."*
  **Level** 10. **Time** 20 min.
1. **Old Scar** (giant bear, level 11): a rusted Regency crossbow bolt in its shoulder; it hunts soldiers.
2. **The turn**: it was shot by Brock's men the day they shot its cub for sport; Brock keeps the cub's skin as a rug.
3. Kill it (`killed`), or wound it, give it Mother Rook's draught, draw the bolt (`spared`: half pay; Greenhood +5).
   Either way, telling Varrow about the rug: she makes Brock burn it.
- **Rewards**: 180 xp; 140 (or 70) silver; a **bear-hide cloak** if killed.

### CT-GW2 — The Thing on the Old Road
- **Board** (Oakhallow): *"Something on the Old Road took three dogs and a boy's arm. It walks like a man. 100 silver.
  — A. Fell."* **Level** 9. **Time** 20 min.
1. Tracks that are bare feet; dogs' bones under a gibbet; at night, humming.
2. **The Hollowed** (level 10): **Ruddock**, a trapper, Smudge's brother, three years a sleeper; he eats raw what he
   catches; the milk he buys from the hoods ran out when Wren's sellers moved to the Ditch. He speaks in his dead wife's
   voice. Two more sleepers follow him.
3. **The turn**: the boy whose arm he took was the hood who sold to him, come to collect a debt.
4. Choice (`old_road`): **kill him** (`killed`); **throw him a vial** and, while he kneels to it, bind him and bring him to
   Mother Rook (`rook`: she tries to wean him; he lives, ruined; Smudge weeps; half pay from Aldred, who wanted him dead);
   **tell Wren** her sellers made him (`wren_told`: she moves the poppy table out of the Hollow Oak, a beat in her arc).
- **Rewards**: 140 xp; 100 (or 50) silver; Ruddock's **trapper's hood**.
