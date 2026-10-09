# Choices, Flags and the Epilogue

Everything the game must remember, and what each memory changes. Flags are set once (the first outcome stands) unless
noted. Where a flag has values, the first listed is the default if the quest is never done.

---

## Flags

### Prologue and Brindle Vale
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `hero_reason` | `road` / `work` / `forget` | MQ01 | Garrick and others quote it back; Hrathgar in a dream ("You came to forget? The Vale is good at that.") |
| `hero_unsworn_seen` | true | MQ02 | Cuthwin's letter to the Lantern (MQ04) |
| `hamund` | `rested` / `destroyed` | MQ02 | Crypt stays quiet or skeletons return; Lantern +5 (rested) |
| `bv_red_hen` | `hanged` / `killed` / `to_wren` / `spared` | MQ03 | Wren's greeting (MQ09); SQ-GW7 exists only for `to_wren`/`spared`; title *the Red Hen's Bane* (`killed`) |
| `garrick_lied_once` | true | MQ04 | MQ11 (he admits the lie) |
| `bv_flour` | `none` / `jory_told` / `jory_quiet` / `jory_reeve` | SQ-BV1 | Brindleford standing; Jory's epilogue |
| `kit_at_mill` | false / true | SQ-BV1 | Kit's epilogue |
| `kit` | `none` / `kit_with_pip` / `pip_home` / `kit_lied` / `pip_hanged` | SQ-BV2 | Kit's and Pip's epilogue; Wren's second |
| `hal_secret` | `none` / `told` / `kept` | SQ-BV3 | SQ-BV8 easier with `kept` |
| `bv_bell_rung` | false / true | SQ-BV4 | Brindleford +1; persuades Garrick (SQ-BV8); Brindleford's epilogue (the bell) |
| `cuthwin_story` | false / true | SQ-BV4 | Opens SQ-LM5 |
| `rite_of_rest` | false / true | SQ-BV4 | Lays many dead to rest instead of fighting (MQ14 Edric, SQ-HM6, CT-SR2, CT-LM2, SQ-SF6, …) |
| `pell_ledger` | `none` / `hidden` / `reported` / `written_off` | SQ-BV5 | `reported`: Reeve Grimwald replaces Pell; Brindleford -2 |
| `wenna_saved` | false / true | SQ-BV6 | Brindleford +1; Wenna's epilogue |
| `tobin_at_forge` | false / true | SQ-BV7 | Tobin guides the forging (MQ23) |
| `bv_elsa_wed` / `bv_elsa_eloped` | | SQ-BV8 | Garrick's trust (`garrick_trusts`); Elsa's epilogue |
| `hob_watch` | `none` / `stood_down` / `destroyed` | CT-BV1 | Lantern +5 (stood down) |

### Act I
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `mq06_cart` | `defended` / `given` / `split` | MQ06 | Reputation; `split`: Hiram owes the hero (SQ-HM5) |
| `wynfrith_warning` | true | MQ08 | Evidence (with `told_odalys_wynfrith`) |
| `told_odalys_wynfrith` | false / true | MQ08 (talking after) | Evidence against Anselm; Odalys helps at the Oathforge even if Anselm isn't exposed |
| `aedric_alive` | false / true | MQ08 | Aedric guides the forging (MQ23) |
| `mq10_raid` | `raided` / `warned` / `shared` | MQ10 | Thornbeck / Oakhallow standing; `warned`: Pip captured (SQ-HM4) |
| `raid_blood` | false / true | MQ10 | Closes SQ-GW2; no Thornbeck ally |
| `garrick_spared` / `garrick_pressed` | | MQ11 | Garrick's testimony (MQ21) needs `garrick_spared` |

### Act II
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `mq13_boat` | `paid` / `favour` / `commandeered` | MQ13 | Nell's help later; Gullhaven standing |
| `edric` | `rested` / `destroyed` / `bound` | MQ14 | The locket (not if `bound`); `bound`: Anselm has a royal dead to command in MQ23/28 (a harder fight) |
| `hrathgar_rapport` | 0..3 | the dreams, SQ-BR5 | Hrathgar's last words; the bargain (Hollow King) at 3 |
| `mq15_sabeline` | `refused` / `sold` / `played` | MQ15 | `sold`: steal it back; Sabeline an enemy |
| `told_isolde_truth` | false / true | MQ17 | Isolde's trust |
| `larkspur` | `cured` / `burned` | MQ18 | Larkspur standing; Maelis never takes the crown if `burned` |
| `ketter` | `dead` / `turned` / `free` | MQ19 | `free`: he strikes in MQ25 |
| `heart` | `given` / `taken` | MQ19 | `given` needs 2 of: `larkspur: cured`, `told_isolde_truth`, the locket shown, `isolde_hives`; `taken`: Maelis flees and can't be crowned |
| `vault_path` | `earned` / `heist` / `writ` / `alone` | MQ20 | Faction standing; `heist` gives `corvin_ledgers` |
| `corvin_ledgers` | false / true | MQ20 (heist) | Evidence (MQ21) |
| `corvin` | `kept` / `hanged` / `exiled` / `held` / `killed` / `confessed` | MQ21 | Act III allies, MQ27 candidates, endings, epilogue |
| `maelis_to_corvin` | false / true | MQ21 | Maelis a prisoner in Kingsmere; Rightful Queen as a puppet |
| `anselm_exposed` | false / true | MQ22 (or MQ23) | The Oathforge fight; Odalys's crown |
| `elderwick` | `saved` / `burned` | MQ22 | Elderwick's fate (`elderwick_wall` saves it alone) |

**Evidence against Corvin** (MQ21, needs two): Garrick's testimony (`garrick_spared` and `garrick_trusts` or
Brindleford ≥ +2), Maelis's (`heart: given`), the ledgers (`corvin_ledgers`). `edric_letter` (SQ-HM8) and
`saw_maelis_saved` (SQ-HM6) count as one more each, but only alongside one of those three.

**Evidence against Anselm** (MQ22, needs two; one if `odalys_doubts`): `told_odalys_wynfrith`, `archive_pages`
(SQ-LM3), `anselm_pages` (SQ-SR6), `cuthwin_testimony` (SQ-LM5). `bryn_voices` (SQ-LM1) counts only alongside another.

### Act III
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `forge_guide` | `tobin` / `aedric` / `book` / `none` | MQ23 | `crown_quality` is easier with a guide |
| `crown_quality` | false / true | MQ23 | The oath takes at once in MQ28 (as does `true_rite`) |
| `crown_to_anselm` | false / true | MQ23 | The Grey Host ending |
| `odalys_dead` | false / true | MQ23 | Odalys can't be crowned or lead knights |
| `allies` | 0..8+ | MQ24 | The siege's outcome |
| `carrow_pact` | false / true | MQ24 | Counts as 2 allies; Carrow's shadow on every ending |
| `siege` | `held` / `costly` / `fallen` | MQ25 | Kingsmere's fate; endings 1 and 2 need it not `fallen` |
| `crowned` | `maelis` / `aldous` / `corvin` / `odalys` / `anselm` / `hero` / `broken` | MQ27–28 | The ending |
| `hrathgar` | `sleeps` / `rested` / `destroyed` / `bargained` | MQ28 | Ending variants |

### Regions (side quests)
| Region | Flags |
|---|---|
| Hollowmere | `hm_weed_rats`, `osric_stone`, `aldous_just` / `aldous_hard`, `hm_gallows`, `orme`, `hm_lights`, `saw_maelis_saved`, `elderwick_wall`, `edric_letter`, `toll`, `willows` |
| Saltreach | `nell_cargo`, `gull_light`, `garth`, `widow_ring`, `gullhaven_harbour`, `anselm_pages`, `oswin_given`, `clifftop` |
| Greenwood | `sour_apple`, `varrow_trusts`, `oak_wedding`, `ulfar_lore`, `wren_letter_given` / `wren_letter_kept`, `brannoc_redeemed` / `brannoc_hanged` / `brannoc_dead` / `brannoc_spared_twice`, `bear`, `lynx` |
| Lantern Moors | `bryn`, `bryn_voices`, `peat`, `archive_pages`, `smith_book`, `true_rite`, `cuthwin`, `cuthwin_testimony`, `odalys_doubts`, `lowell`, `standing_man` |
| Southfields | `burned_row`, `odalys_knelt`, `deserters`, `ralf_judged`, `isolde_hives`, `tithe`, `scarecrow` |
| The Barrows | `grave_robbers`, `agent_caught`, `watchers_oath`, `adit`, `sigrun_freed`, `cairn_names`, `hounds`, `coldstep` |

**Cross-quest knots** (the game must handle either order):
- SQ-SF6 before SQ-SF1: if `scarecrow: told`, Jack Pye is in the reeve's hands; SQ-SF1's ambush is led by his friend
  **Will Carter** instead.
- SQ-BV7 during MQ03: freeing Wat in the camp completes SQ-BV7 at once.
- SQ-HM4's prisoner is Pip (if `mq10_raid: warned`) or Ash Rowan (if `oak_wedding: taken`, and Pip isn't held), else
  Tam Fletch.
- SQ-BR4's torc: already in hand if SQ-BR1 ended `agent_caught`.
- SQ-SR4's ring: already in hand if SQ-SR3 is done.

---

## Allies at the siege (MQ24–MQ25)
Count one for each: Regency guard, Greenhood archers, Lantern knights, Gullhaven boats, village militia (4+ villages
Grateful), Thornbeck garrison, Sigrun's oath-dead; Carrow counts two; `grave_robbers: cleared` counts a half. Held ≥ 4,
costly 2–3, fallen 0–1. Extra enemy waves: `nell_cargo: delivered` (Carrow-armed rising at the Hall), `adit: dug` (one
more barrow wave), `grave_robbers: bribed` (one more).

---

## The epilogue (MQ29)
Slides in order: the ending ([main-quest-3.md](main-quest-3.md)), Carrow's shadow (if any), then the places, the
people, the factions. Each line below is one slide; the first matching condition is shown.

### Places
| Place | Slides |
|---|---|
| **Brindleford** | Standing ≥ +2 and `bv_bell_rung`: *"The chapel bell rings every dawn now. Brindleford sleeps well."* / `pell_ledger: reported`: *"Reeve Grimwald's Brindleford paid every penny, and buried more children that winter."* / ≤ -1: *"Brindleford doesn't speak of the stranger."* / else: *"Brindleford went on, as fords do."* |
| **Tallow Green** | `hal_secret` and SQ-BV3 done: *"The bees came back. Tallow Green's candles light Kingsmere's hall."* / else quieter versions |
| **Kingsmere** | `siege: held`: *"Kingsmere's walls held. Its people tell the story of the night the dead came, and who stood on the gate."* / `costly`: *"The lower town burned. They rebuilt it in stone."* / `fallen`: *"Kingsmere stood empty a year. Then the living came back, one cart at a time."* |
| **Reedby** | ≥ +2: *"Reedby's boats go out free of tolls."* / `hm_weed_rats: cleared` with the sons spared: *"Tom Weir's sons fish beside him."* / else |
| **Elderwick** | `elderwick: burned`: *"Elderwick was rebuilt by strangers. The orchards survived."* / `elderwick_wall`: *"Elderwick's wall still stands. The bell on its gate is called the stranger's bell."* |
| **Gullhaven** | `gullhaven_harbour: truce`: *"Nell and the warden share a pew and a profit."* / `warden`: *"Gullhaven is honest now, and poorer."* / `nell`: *"Gullhaven's smugglers drink to the stranger's name."* |
| **Saltcombe** | `gull_light: lit`: *"The Gull Light burns. No boat of Saltcombe's has been lost since."* |
| **Oakhallow** | ≥ +2: *"Oakhallow's children play at being the stranger."* / `mq10_raid: warned`: *"Oakhallow starved a little that winter, and remembered why."* |
| **Thornbeck** | `varrow_trusts`: *"Captain Varrow's garrison mended Thornbeck's roofs."* / else |
| **Gorse Hollow** | `peat: tithe_cut` or `warded`: *"The bog keeps its dead now."* / `bryn: escaped`: *"Bryn came home and married a peat-cutter."* |
| **Millbrook** | `crowned: maelis`: *"Millbrook's herbalist became a queen. They kept her hives."* / else `heart: given`: *"Isolde still keeps Hesk's bees."* / `heart: taken`: *"The herbalist's cottage stands empty."* |
| **Larkspur** | `larkspur: burned`: *"Larkspur is a black hill. The larkspur grows there anyway."* / `odalys_knelt`: *"A rowan grows in the Burned Row, planted by a knight."* / cured: *"Larkspur lived."* |

### People
| Who | Slides (first match) |
|---|---|
| **Garrick** | testified and `corvin` not `kept`: *"Garrick told the truth before the whole Vale, and slept through the night after."* / `ketter: free` and Garrick a witness: *"Garrick was found in the river at Brindleford. Ketter collected his fee."* / `bv_elsa_wed`: *"Garrick danced at his grandchild's naming."* / else: *"Garrick kept the Ferryman's Rest, and his silence."* |
| **Elsa** | `bv_elsa_wed`: married to Hal, runs the inn / `bv_elsa_eloped`: bakery in Kingsmere |
| **Kit** | `kit_with_pip`: grows up in the Greenhood / `pip_home`: grows up with his father on the Cobbes' farm / `kit_lied`: learns the truth at sixteen, never forgives / `kit_at_mill`: the miller's heir |
| **Corvin** | by `corvin` and `crowned`: hanged / exiled over the Carrow Teeth / pardoned by Queen Maelis to serve as a clerk / died on the walls / died wearing the crown / ruled behind his son, feared and effective |
| **Aldous** | crowned: just or hard king (`aldous_just`/`aldous_hard`) / not: *"Aldous Ashby became a scholar, and wrote the history of these years. He was kind to the stranger in it."* (if `aldous_just`) |
| **Wren** | `crowned: broken` and alive: leads the first moot / Iron Regency: hanged or hunted / Rightful Queen: Queen Maelis's ranger of the Greenwood / dead at the siege: *"The Greenhood sings of her."* |
| **Odalys** | crowned / `odalys_dead` / `odalys_knelt`: *"Odalys gave up her captaincy and tended Larkspur's sick."* / else captain still |
| **Anselm** | exposed and killed: *"The Lector's name was struck from the Abbey's rolls."* / Grey Host ending: his throne |
| **Maelis** | queen / herbalist / prisoner in Kingsmere (`maelis_to_corvin`) / dead (`ketter: free`, MQ25 choice) |
| **Ketter** | `turned`: *"Ketter retired to Carrow with two fees and a dog."* / `dead` / `free`: as above |
| **Sabeline** | `carrow_pact`: *"Lady Sabeline was made Countess of the Barrow Hills."* / `agent_caught` or `orme: exposed`: *"Sabeline went home empty-handed. Ferrand did not forgive her."* |
| **Cuthwin** | `cuthwin: freed` or `released`: *"Father Cuthwin became Lector, and the Order told the truth about itself."* / `held`: buried at Brindleford under the bell he rang |
| **Tobin** | `tobin_at_forge`: *"Tobin Harrow went home to Brindleford with the Oathforge's last blue ember in a jar, and his forge has burned blue ever since."* |
| **Nell** | by `gullhaven_harbour` |
| **Sigrun** | `hrathgar: rested`: lies down beside her father / `sigrun_freed`: keeps her vigil, at peace |
| **The hero** | Hollow King: the warden / else by renown and their highest faction: *"The stranger stayed"* (any village Devoted) or *"The stranger went back over the mountains, and the Vale told stories."* |

### Factions
- **The Regency**: by ending and `corvin`.
- **The Greenhood**: Free Vale: becomes the moot's rangers / Rightful Queen: pardoned / Iron Regency: hunted to the
  last / else: scattered.
- **The Lantern**: Anselm's ending: an army of the dead / `anselm_exposed`: reformed under Cuthwin or Odalys / Free
  Vale: gravekeepers / else unchanged.
