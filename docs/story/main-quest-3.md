# Main Quest — Act III: *The Barrow Wakes* (~6 h) and the Endings

The dead march south. The crown is reforged in a cellar full of blind children; the Vale's allies gather and turn on
each other; Kingsmere is besieged from outside and burns from within; the hero goes north with whoever will wear the
crown, knowing now what it is.

---

## MQ23 — The Oathforge
- **Where**: the Abbey Undercroft (850, 800). **Level** 15. **Time** 70 min.
1. **The Undercroft** (crypt, level 14): the Order's dead stand awake in their niches, watching, waiting for words that
   aren't theirs; only the old wards' guardians attack.
2. **The Listening Hall**: a long vault lit by poppy-lamps; on stone biers over the Order's graves, **seven living
   Listeners**, eyes sewn shut, wax tablets in their laps, murmuring barrow-tongue in a round; cups of milk at their
   lips; the smell of cloves and rot. One is **Novice Bryn**, if SQ-LM1 ended `stayed`. One turns her head toward the
   hero: *"You're the one they can't hear. It's so quiet round you."*
   Choice (`listeners`):
   - **Free them**: cut the threads, carry them up (the withdrawal kills two within a day, whatever is done; the rest
     go to Isolde, Mother Rook or Sister Hild) (`freed`).
   - **Grant what they ask**: four of them ask to die (*"they'll still be talking when you go"*); the hero can give them
     poppy enough to sleep (`mercy`). A scene held in silence.
   - **Leave them** (`left`): Anselm's work goes on in any Lantern ending.
3. **The Oathforge**: a forge older than the Abbey, a barrow-iron anvil, a vent of cold blue flame. The guide
   (`forge_guide`): **Tobin** (`tobin_at_forge`: *"Mm. Good iron."*), **Brother Aedric** (`aedric_alive`), the
   **smith-book** (SQ-LM3), or none. The forging: three heats, three strikes each (a timing game); with a guide the
   window is wider. A good forging: `crown_quality`.
4. **Anselm** comes down the stair as the crown cools.
   - **Exposed**: Odalys and her knights block the stair. Anselm speaks his changed oath: the Undercroft's dead turn
     their heads. A fight (Anselm level 16, dead knights, the Listeners screaming the words with him if left). Odalys
     holds the stair; the hero holds it with her (both live; Anselm escapes north) or goes for him (he's wounded for
     MQ28; Odalys holds alone and dies, `odalys_dead`).
   - **Not exposed**: he asks gently for the crown "to keep it safe until the rite". **Give it** (`crown_to_anselm`),
     **refuse** (he drops the kindness: the fight; Odalys confused, helping only if `told_odalys_wynfrith`), or **expose
     him now** with any one piece of evidence (a persuasion with Odalys present).
   - If `edric: bound`, Anselm sets the Drowned King on the hero: a second fight with Edric, who begs the hero to finish
     it this time.
- **Rewards**: 500 xp; **the Hollow Crown**.

## MQ24 — Gathering the Vale
- **Where**: the whole Vale (a hub of short visits). **Level** 15. **Time** 80 min.
- Allies (`allies`, one each):

| Ally | Gained if | The price (a last choice) |
|---|---|---|
| **Regency guard** | `corvin: kept` or `confessed`, or Regency ≥ 20 (Aldous leads if Corvin's gone) | Captain Brayne wants the Ditch "cleared of grey-eyes before the dead come" (refuse: he comes anyway, angry; agree: the pogrom of MQ25 is the Regency's, and the hero allowed it) |
| **Greenhood archers** | Greenhood ≥ 20 and Wren alive | Pip freed, if held (SQ-HM4) |
| **Lantern knights** | Lantern ≥ 20, or `anselm_exposed` and Odalys alive | — |
| **Gullhaven boats** | SQ-SR1 done or `mq13_boat: paid`, and Gullhaven ≥ +1 | Nell wants the Milk House licensed by whoever rules after (promise or refuse) |
| **Village militia** | 4+ villages Grateful | — |
| **Thornbeck garrison** | SQ-GW2 done, not `raid_blood` | — |
| **Sigrun's oath-dead** | SQ-BR4 (`sigrun_freed`) | The living must agree to fight beside the dead: a speech at Kingsmere's gate (it fails if fewer than 3 allies are already gathered, and the oath-dead go home) |
| **The Barrowborn** | SQ-HM10 done (Grey Edda trusts the hero) | They'll fight only if the hero promises them the Barrowborn laws repealed by whoever rules (the promise is kept or broken in the ending) |
| **Carrow's soldiers** (counts 2) | the pact (`carrow_pact`) | the barrow hills |

- **Sabeline's choice** (romance or not): see [romances.md](romances.md). If not romanced: she offers the pact; refused,
  she goes home, and her agents try for the crown in MQ25 (a fight in the Hall) unless SQ-HM5 `orme: exposed`.
- **The reckoning of lies**: every romance lie comes out here (see romances).
- **Rewards**: 300 xp; the Vale's banner (a cloak) with 5+ allies.

## MQ25 — The Siege of Kingsmere
- **Where**: Kingsmere at night. **Level** 16. **Time** 65 min.
1. The barrow-host over the Middle Downs: skeletons, draugr in barrow-iron, ghosts, **barrow-giants** (**new**: huge
   draugr grown through with roots), **the Grey Rider** (Hrathgar's herald, level 17). They come at the walls silently,
   in good order, as an army; the living scream; the dead don't.
2. **Three stands**; the hero chooses where to fight each time: **the South Gate**, **the Harbour** (the drowned of
   Hollowmere walking up out of the lake, Lady Rhosyn's ghost among them, unless laid to rest in SQ-HM6), **the Hall**
   (the Grey Rider breaks in).
3. **The Ditch burns.** At the second stand, word comes: Kingsmere's own people (and herons, if the hero agreed to
   Brayne) are dragging the Barrowborn out of the Ditch and killing them, "because the grey-eyes called the dead". The
   hero must choose between the Ditch and the stand they're at. Going to the Ditch: the pogrom is stopped (Grey Edda
   lives; `ditch: saved`), and the stand they left falls (a named ally dies there: by order Corvin if fighting, else Pip,
   else Captain Varrow). Staying: the Ditch burns (`ditch: burned`; Grey Edda dies singing).
4. **Ketter** (`ketter: free`) uses the chaos to take Maelis (or kill Garrick, if Maelis isn't in Kingsmere): a third
   choice the hero can't make in time if they went to the Ditch.
5. Outcome (`siege`, by allies): **held** (≥ 4), **costly** (2–3: the lower town burns; a named ally dies), **fallen**
   (0–1: Kingsmere falls; the Rightful Queen and Iron Regency endings close).
- **Rewards**: 600 xp; the Grey Rider's **barrow blade**.

## MQ26 — The Watchers' Road
- **Where**: Elderwick → the White Fields → the Watchers' Crypt (2250, 1050). **Level** 17. **Time** 50 min.
1. The White Fields after the dead passed: the novices' bodies in the poppy, the poppy grown up through them already,
   white in the black. The Lantern's oath-iron gate on the Barrow Road, broken from the north.
2. **The Watchers' Crypt**: undead knights, barrow-hounds; **Sir Eadric Long**, the First Watcher, who once fled his
   post. With the Watchers' oath (SQ-BR2), he kneels and fights for the hero; without it, he must be beaten.
3. On the far side, the Barrow Valley: dozens of great mounds, every one open, a black sky.
- **Rewards**: 500 xp.

## MQ27 — Who Wears the Crown
- **Where**: the mouth of the Great Barrow (2250, 450). **Level** 17. **Time** 35 min.
- At the mouth, round a fire, those who came with the hero, all of whom now know (Hrathgar's dreams, Sigrun, the
  carvings) that the crown is a chain on a burned people's king. Each makes their case; the hero's companions argue
  with each other:
  - **Maelis** (`heart: given`, not `larkspur: burned`; only if asked): *"I'll wear it, and I'll keep the half of the
    oath none of them kept. The Barrowborn laws go the day I'm crowned."* If committed in romance at 5: *"Or I won't. Ask
    me not to, and I won't."*
  - **Aldous** (alive, Corvin not killed by the hero): frightened, willing; Corvin (if `kept`) presses for it.
  - **Corvin** (`kept`, alive): asks to wear it *"to put things right"*. The crown would kill him. He may know it.
  - **Odalys** (`anselm_exposed`, alive): *"If there's no one else. I'd rather there was."*
  - **Anselm** (`crown_to_anselm`): already holds it; the hero is his escort.
  - **Wren** (alive, Greenhood ≥ 20): *"Three hundred years of kings, and the price of every one of them was paid by
    somebody in a ditch. Break it."*
  - **Sigrun** (`sigrun_freed`): *"Whatever you do, do it honestly. My father can bear a chain. He can't bear a lie."*
  - **The hero**: wear it themselves, or break it.
- The choice (`crowned`: `maelis`, `aldous`, `corvin`, `odalys`, `anselm`, `hero`, `broken`).
- **Rewards**: 100 xp.

## MQ28 — The Great Barrow
- **Where**: the Great Barrow. **Level** 18. **Time** 90 min.
1. **The barrow** (5 levels): Hrathgar's hall-guard in root-grown iron; the **Hall of the Wives**, where the women who
   burned at Cairnfold were laid, their ash in jars, their names on the jars; the **Hall of Sigrun** (her vigil); the
   **Speaking Stone**; Hrathgar on his throne behind it, standing up for the first time in 303 years, roots tearing.
2. **Anselm** (if he fled): at the Stone before the hero, his bound dead round him, trying to speak the changed oath
   with no crown; it fails; Hrathgar takes him by the head (*"So this is the Lantern, now."*) and the hero can save him
   (to stand trial: `anselm: tried`) or let it happen.
3. **Hrathgar** (level 19, three phases). He speaks in each pause; with `hrathgar_rapport` 3 he offers his terms
   honestly: *"Take the crown yourself. Keep me asleep if you must. But keep the half they forgot. Free my children. And
   tell the truth about Cairnfold on every coronation day. Swear that and I'll lie down of my own will."*
   - **A wearer**: in the last phase they reach the Stone and speak the oath while the hero holds Hrathgar. A good
     forging or the true rite (SQ-LM4) and it takes at once; otherwise the hero holds him a minute longer. He kneels.
     If the wearer adds the forgotten half (Maelis does; Aldous if `aldous_just`; Odalys if `odalys_knelt`; the hero
     always may), he sleeps *consenting* (`hrathgar: consents`): a better ending's version. Else he sleeps chained
     (`hrathgar: sleeps`).
   - **Broken**: the hero breaks the crown on the Stone. Hrathgar's power floods back (a harder last phase). With
     Sigrun at the hero's side and the true rite, Hrathgar is **laid to rest** (`rested`): he sits down on his throne
     beside his daughter and closes his eyes, and the barrow goes quiet. Else he must be **destroyed** (`destroyed`).
     Either way: **the Long Night** follows (below).
   - **Anselm wearing it**: Hrathgar kneels and every dead thing in the Vale turns its head toward Anselm. The hero can
     strike him down at the Stone (he dies; the crown falls; choose again) or let it stand.
   - **Corvin wearing it**: it burns him black to the shoulder; he dies at the Stone (*"I knew. I wanted to be sure."*);
     the hero chooses again at once.
4. **The Long Night** (only if broken): every dead thing in the Vale wakes for one night before it can rest. A last
   short sequence: the hero comes out of the barrow into a valley of the dead walking home, not attacking, to sit by
   their own graves, and lie down. In the villages (shown in the epilogue), the dead do whatever they last wanted: Old
   Meg's sister knocks at her door.
- **Rewards**: 1,000 xp.

## MQ29 — What the Vale Remembers
- The epilogue slides ([choices.md](choices.md)), then the open world goes on as the ending made it.

---

# The Endings

| # | Ending | Requires | What it is, and what it costs |
|---|---|---|---|
| 1 | **The Rightful Queen** | `crowned: maelis`; siege not fallen | Queen Maelis. If `hrathgar: consents`, the Barrowborn laws are repealed and Cairnfold's truth is read at her coronation; the Lantern made to tend the sick. She judges Corvin as the hero did. Her habit: if never broken, the last slide is her, alone, poppy cup in hand, talking to her father. If `maelis_to_corvin`: she's crowned as Corvin's puppet; the slides turn grey. |
| 2 | **The Iron Regency** | `crowned: aldous`; siege not fallen | King Aldous at 17. With Corvin alive (`kept`): safe roads, full gallows, the poppy purse, the Ditch emptied "for the town's safety". Without him: as SQ-HM3 shaped the boy: `aldous_just` (a decent king who listens and repeals the laws in his tenth year) or `aldous_hard` (his father's son, without his father's reasons). |
| 3a | **The Lantern Throne — Odalys** | `crowned: odalys` | The Lantern Queen. The White Fields burned on her first day; the Listeners' hall bricked up; the crypts kept; the Vale run like a drill yard: stern, safe, joyless; the Greenhood hunted. If `odalys_knelt`: she rules Larkspur's way, not the Abbey's. |
| 3b | **The Grey Host** | `crowned: anselm`, allowed to stand | The dead serve. In a year the Grey Host goes over the Carrow Teeth and burns Carrow as Carrow burned Anselm's family. The Vale is feared, rich and very quiet. The Listeners multiply. Last slide: the hero's own grave, years later, a dead hand rising, waiting for orders. |
| 4 | **The Free Vale** | `crowned: broken`; Hrathgar rested or destroyed | No crown. After the Long Night, the dead simply rest; the barrows are only graves; the poppy stops growing (it fed on the bound dead's dreams) and the trade dies in a year, and so do many sleepers, in withdrawal. The villages send reeves to a moot at Kingsmere (Wren leads the first, alive). The Lantern becomes gravekeepers. The Barrowborn are freed by no law, but by nothing left to bind them. Hard years, fair ones. |
| 5 | **The Hollow King** | `crowned: hero` | The hero speaks the oath and is bound: they'll never leave the Vale and never quite die. With Hrathgar's terms sworn (`consents`): the Barrowborn freed, Cairnfold told every year, the dead asleep by their own will: the warden-ending, the kindest. Without: the hero keeps the chain, and grows cold; the slides vary with renown (a beloved warden; a feared one people leave offerings for and never speak to). |
| 6 | **The Long Dark** | the hero falls in MQ28 with no wearer at the Stone and chooses "accept fate"; or `siege: fallen` and `crowned: anselm` struck down with no other choice made | Hrathgar walks out of his barrow; the Vale's living flee over the mountains; the last slide is Brindleford's bell ringing over an empty village. |

**Carrow's shadow** (any ending, with `carrow_pact` or `adit: dug`): Carrow's miners in the barrow hills; the dead
there never quite rest; every winter something comes down out of the hills.
