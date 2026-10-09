# Main Quest — Act III: *The Barrow Wakes* (~6 h) and the Endings

The dead march south. The crown is reforged, the Vale's allies gather, Kingsmere is besieged, and the hero goes north
into the Great Barrow with whoever will wear the crown, or with the will to break it.

---

## MQ23 — The Oathforge
- **Where**: the Abbey of the Last Lantern (850, 800), the Undercroft. **Level** 15. **Time** 60 min.
1. The **Abbey Undercroft** (crypt, level 14): the Order's own dead, laid in ranks, and they are *awake*, standing in
   their niches, watching, not attacking (Anselm's practice: they wait for his words). Skeletons that do attack are
   the old wards' guardians.
2. **The Oathforge**: a forge older than the Abbey, its anvil barrow-iron, its fire fed by a vent of cold blue flame.
   The smith who guides the hero (`forge_guide`): **Tobin Harrow** (if SQ-BV7 done: `tobin_at_forge`), **Brother
   Aedric** (if `aedric_alive`), or neither (the hero follows the old smith-book from SQ-LM3; a harder forging
   minigame). The forging: three heats, three strikes each; a timing minigame. A good forge (`crown_quality: true`)
   matters in MQ28 (the crown holds against Hrathgar's will).
3. **Anselm** comes down the stair as the crown cools.
   - **If exposed** (`anselm_exposed`): Odalys and her knights block the stair; Anselm speaks his changed oath and the
     undercroft's dead rise for him. A fight (Anselm, level 16, with dead knights); he flees through a sealed passage
     to the north (he'll be waiting in the Great Barrow: MQ28). Odalys may die here holding the passage
     (`odalys_dead` if the fight goes badly: three dead knights reach her).
   - **If not exposed**: Anselm asks gently for the crown "to keep it safe until the rite". The hero may **give it**
     (`crown_to_anselm`: it leads to the Lantern Throne, Anselm), **refuse** (he drops the kindness, speaks the
     changed oath; the fight as above, but Odalys is confused and doesn't help unless `told_odalys_wynfrith`), or
     **expose him now** with what they have (persuasion, needs at least one piece of evidence).
- **Rewards**: 500 xp; **the Hollow Crown**, reforged.
- **Journal**: *"The crown is whole again. It's lighter than it looks, and colder."*

## MQ24 — Gathering the Vale
- **Where**: the whole Vale (a hub quest with up to six visits). **Level** 15. **Time** 75 min.
- The dead are coming to Kingsmere, where the roads meet. The hero gathers allies. Each ally is one point
  (`allies` 0..8), and each is gained by a short visit and a talk (or a last favour):

| Ally | Gained if | Last favour, if any |
|---|---|---|
| **Regency guard** | `corvin: kept`, or `confessed`, or Regency ≥ 20 (Aldous leads them if Corvin's gone) | Aldous asks the hero to speak to the men |
| **Greenhood archers** | Greenhood ≥ 20 and Wren alive | Wren wants Pip freed if he's held (SQ-HM4) |
| **Lantern knights** | Lantern ≥ 20, or `anselm_exposed` and Odalys alive | — |
| **Gullhaven boats** (Nell's smugglers bring men across the lake) | SQ-SR1 done or `mq13_boat: paid` and Gullhaven ≥ +1 | Nell wants her harbour free of the warden: a choice |
| **Village militia** | 4+ villages Grateful (+2) or better | — |
| **Thornbeck garrison** | SQ-GW2 done (Captain Varrow) and not `raid_blood` | — |
| **Sigrun's oath-dead** (fight beside the living at the siege) | SQ-BR4 done | — |
| **Carrow's soldiers** | the hero accepts Sabeline's pact (`carrow_pact`): she asks for the barrow hills | (counts as 2) |

- **Sabeline's last offer** comes here: 500 Carrow soldiers for a signed promise of the barrow hills. Accepting
  makes the siege easy and darkens every ending (the barrows are mined: the epilogue's dead never quite rest).
- **Rewards**: 300 xp; the Vale's banner (a cloak) if 5+ allies.

## MQ25 — The Siege of Kingsmere
- **Where**: Kingsmere's walls and lanes, at night. **Level** 16. **Time** 60 min.
1. The barrow-host comes over the Middle Downs: skeletons, draugr in barrow-iron, ghosts, three **barrow-giants**
   (**new**: huge draugr) and Hrathgar's herald, **the Grey Rider** (level 17).
2. The defence is three stands, the hero choosing where to fight each time: **the South Gate**, **the Harbour**
   (dead coming out of the lake), **the Hall** (the Grey Rider breaks in). Allies hold the places the hero isn't.
3. Outcome (`siege`), by allies:
   - **Held** (allies ≥ 4): the walls hold; few dead.
   - **Held at a cost** (2–3): the lower town and harbour burn (Kingsmere's epilogue is grim); a named ally dies
     (Corvin if he's fighting, else Pip, else Captain Varrow).
   - **Fallen** (0–1): Kingsmere falls; the hero escapes north with the crown and whoever's left. The Rightful Queen
     and Iron Regency endings can no longer happen (no throne to sit on); the others darken.
4. **Ketter** (if `ketter: free`) uses the chaos to come for Maelis (or, if she's not in Kingsmere, Garrick). The hero
   must choose between him and the Hall: a named death if they choose the Hall.
- **Rewards**: 600 xp; the Grey Rider's **barrow blade**.

## MQ26 — The Watchers' Road
- **Where**: Elderwick → the Barrow Road → the Watchers' Crypt (2250, 1050). **Level** 17. **Time** 50 min.
1. The Lantern's barrier on the Barrow Road (an oath-iron gate across the road at the watchtower) has been broken from
   the north. The road climbs through the barrow hills: cairns, dead in the grass, cold wind, no birds.
2. **The Watchers' Crypt** (crypt under the watchtower ruin, level 17): the tomb of the Watchers, the first Lantern
   knights. Its far door opens onto the Great Barrow's valley. Undead knights, barrow-hounds (**new**: skeletal
   wolves), a crypt lord: **the First Watcher**, Sir **Eadric Long** (level 17), who must be beaten or given the
   Watchers' oath back (from SQ-BR2: he lets the hero pass and fights for them).
- **Rewards**: 500 xp.

## MQ27 — Who Wears the Crown
- **Where**: the mouth of the Great Barrow (2250, 450). **Level** 17. **Time** 30 min.
- Those who've come with the hero gather at the barrow's mouth under a black sky. One by one (only those alive, free,
  and willing are here):
  - **Maelis** (if `heart: given` and not `larkspur: burned`): *"I'll wear it. Not for my father, for Larkspur."*
    Only if the hero asks her; she won't offer.
  - **Aldous** (if alive and Corvin isn't `killed` by the hero): willing, frightened. (Corvin, if `kept`, presses for
    it.)
  - **Corvin** (if `kept` and alive): asks to wear it himself, *"to put things right"*. The crown would kill him.
  - **Odalys** (if `anselm_exposed` and alive): *"If there's no one else. I'd rather there was."*
  - **Anselm** (if `crown_to_anselm`): he already holds it; the hero goes in as his escort.
  - **Wren** (if alive and Greenhood ≥ 20): she argues to break it: *"Three hundred years of kings. Let's try
    something else."*
  - **Nobody**: the hero can choose to wear it themselves, or break it.
- The hero chooses: a wearer (`crowned`: `maelis`, `aldous`, `corvin`, `odalys`, `anselm`, `hero`) or `broken`.
- **Rewards**: 100 xp.

## MQ28 — The Great Barrow
- **Where**: the Great Barrow (2250, 450). **Level** 18. **Time** 90 min.
1. **The barrow** (the last dungeon, 5 levels): the barrow-host's halls, Hrathgar's warriors in their armour of roots
   and iron, his wives' tombs, the **Hall of Sigrun** (her ghost keeps vigil; freed in SQ-BR4 she walks with the hero
   now), the **Speaking Stone** in the deepest hall, and Hrathgar on his throne behind it, standing up.
2. **Anselm** (if he fled in MQ23): at the Stone before the hero, his bound dead around him. He tries to speak the
   changed oath with no crown; it fails; Hrathgar crushes him, or the hero fights him first (his choice of words
   depends on whether Odalys is there: he begs her).
3. **Hrathgar** (level 19, three phases): he speaks in each pause. His last words depend on `hrathgar_rapport`:
   at 3, he offers the bargain (see the Hollow King ending) one last time, honestly.
   - **With a wearer**: in the last phase the wearer must reach the Stone and speak the oath while the hero holds
     Hrathgar off. If the crown was forged well (`crown_quality`), the oath takes at once; if not, the hero must hold
     him a minute longer. Hrathgar kneels, and sleeps.
   - **Broken**: the hero breaks the crown on the Stone. Hrathgar's power floods back: a harder last phase. With
     Sigrun at the hero's side (SQ-BR4), she speaks the old peace's end and Hrathgar can be *laid to rest* rather
     than destroyed (`hrathgar: rested`); else he must be destroyed (`hrathgar: destroyed`).
   - **Anselm wearing it**: he speaks his oath; Hrathgar kneels, and *every* dead thing in the Vale opens its eyes and
     turns to Anselm. The hero can strike Anselm down at the Stone (he dies; the crown falls; choose again: wear it or
     break it), or let it stand.
   - **Corvin wearing it**: the crown burns him; he dies at the Stone, black to the shoulder (*"I knew. I wanted to be
     sure."*). The hero must choose again at once: another wearer present, wear it, or break it.
4. Out of the barrow, into the dawn.
- **Rewards**: 1,000 xp; the Barrow King's iron (a set piece or a crown-shaped ring, by ending).

## MQ29 — What the Vale Remembers
- The epilogue: a narrated sequence of slides (the voxel scenes, still), one for the ending, then one for each
  village, each main character, each faction, in that order. See [choices.md](choices.md) for every slide's
  conditions. Then the game goes on: the hero can keep walking the Vale (open-world after the end), with the world as
  the ending made it.

---

# The Endings

| # | Ending | Requires | What it is |
|---|---|---|---|
| 1 | **The Rightful Queen** | `crowned: maelis`; siege not Fallen | Maelis speaks the oath. Queen Maelis rules from Kingsmere; she pardons or judges Corvin (her choice follows the hero's: `corvin`); Larkspur's hill is planted with larkspur; the Lantern is made to tend the sick. Peace, a gentle crown, and still a crown. |
| 2 | **The Iron Regency** | `crowned: aldous`; siege not Fallen | Aldous speaks the oath, at 17. If Corvin lives (`kept`), he rules behind his son: safe roads, full gallows, quiet villages. If Corvin's gone, Aldous rules as SQ-HM3 shaped him (`aldous_just`: a decent king who listens; `aldous_hard`: his father's son). |
| 3a | **The Lantern Throne — Odalys** | `crowned: odalys` | Queen Odalys, the Lantern Queen: the crypts kept, the rite kept, the Vale run like a well-drilled abbey. Stern, safe, joyless; the Greenhood hunted. |
| 3b | **The Lantern Throne — Anselm (the Grey Host)** | `crowned: anselm` and the hero lets it stand | The dead serve. In a year the Grey Host marches over the Carrow Teeth; Carrow falls; the Vale is feared and rich and very quiet. The last slide: the hero's own grave, someday, and a dead hand rising from it, waiting for orders. |
| 4 | **The Free Vale** | `crowned: broken`; Hrathgar rested or destroyed | No crown. The dead simply rest; the barrows are only graves. The villages send their reeves to a moot at Kingsmere (Wren leads the first, if alive). The Lantern becomes an order of gravekeepers. Hard years, fair ones. If `hrathgar: rested`, Sigrun's last slide: she lies down beside her father. |
| 5 | **The Hollow King** | `crowned: hero` | The hero speaks the oath and is bound: they will never leave the Vale and never quite die; Hrathgar sleeps because they keep him so. With `hrathgar_rapport` 3, the hero can accept Hrathgar's bargain instead: the Barrow King is given back his hills and his dead sleep by consent, not by chains: the gentlest version. The slides vary with the hero's renown: a beloved warden, or a cold one people leave offerings for and never speak to. |
| 6 | **The Long Dark** | the hero dies in MQ28 with no wearer at the Stone (a fail state, shown as an ending if the player chooses "accept fate" after a defeat), or `siege: fallen` and `crowned: anselm` | Hrathgar walks out of his barrow; the Vale's living flee over the mountains. The last slide: Brindleford's chapel bell ringing over an empty village. |

**Carrow's shadow** (any ending, if `carrow_pact`): one more slide: Carrow's miners in the barrow hills; on the
ending's own terms, the dead there never quite rest, and every winter something comes down out of the hills.
