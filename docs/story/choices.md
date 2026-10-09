# Choices, Flags and the Epilogue

Everything the game remembers, and what each memory changes. Flags are set once (the first outcome stands) unless
noted. The first value listed is the default if the quest is never done.

---

## Flags

### Prologue and Brindle Vale
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `hero_reason` | `road` / `work` / `forget` | MQ01 | Quoted back by NPCs and Hrathgar |
| `hero_unsworn_seen` | true | MQ02 | Cuthwin's letter (MQ04) |
| `famine_pit` | `untouched` / `blessed` | MQ02 | Famine ghosts stop returning |
| `hamund` | `rested` / `destroyed` | MQ02 | Crypt quiet or not; Lantern +5 |
| `bv_red_hen` | `hanged` / `killed` / `hesper_judged` / `to_wren` / `spared` | MQ03 | Wren's greeting; SQ-GW7; titles |
| `hesper_safe` / `hesper_freed` | | MQ03, MQ13 | Hesper in the Milk House or free; SQ-SR7's giver; SQ-GW7 |
| `garrick_lied_once` | true | MQ04 | MQ11 |
| `bv_flour` | `none` / `jory_told` / `jory_quiet` / `jory_reeve` / `jory_weaned` | SQ-BV1 | Jory lives clean, digs, or hangs himself |
| `kit_at_mill` | | SQ-BV1 | Kit's slide |
| `kit` | `none` / `kit_with_pip` / `pip_home` / `kit_lied` / `pip_hanged` | SQ-BV2, SQ-GW8 | Kit's and Pip's slides |
| `hal_secret` | `none` / `told` / `kept` | SQ-BV3 | SQ-BV8 |
| `bv_bell_rung`, `cuthwin_story`, `rite_of_rest` | | SQ-BV4 | Brindleford; SQ-LM5; rest instead of fighting |
| `pell_ledger` | `none` / `hidden` / `reported` / `written_off` / `pell_confessed` | SQ-BV5 | Pell lives or hangs; Grimwald |
| `wenna` | `none` / `home` / `ada_told` / `hob_beaten` / `wenna_nan` | SQ-BV6 | Wenna's slide |
| `tobin_at_forge` | | SQ-BV7 | MQ23 guide |
| `bv_elsa_wed` / `bv_elsa_eloped`, `garrick_trusts` | | SQ-BV8, SQ-HM6 | Garrick's testimony |
| `hob_watch` | `none` / `stood_down` / `destroyed` | CT-BV1 | |

### Act I
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `mq06_cart` | `defended` / `given` / `drowned_poppy` / `split` | MQ06 | Reputation; Hiram; the Ditch child (`given`) |
| `cairnfold_carving` | | MQ08 | Lore for MQ27 |
| `wynfrith_warning`, `told_odalys_wynfrith` | | MQ08 | Evidence; romance |
| `aedric_alive` | | MQ08 | MQ23 guide |
| `mq10_raid` | `raided` / `warned` / `shared` | MQ10 | Pip captured (`warned`) |
| `raid_blood`, `col_dead` | | MQ10 | Thornbeck; Oakhallow |
| `garrick_spared` / `garrick_pressed` | | MQ11 | Testimony |

### Act II
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `mq13_boat` | `paid` / `favour` / `commandeered` | MQ13 | Nell |
| `edric` | `rested` / `destroyed` / `bound` | MQ14 | Locket; Anselm's weapon in MQ23 |
| `hrathgar_rapport` | 0..3 | dreams, SQ-BR5 | His terms in MQ28 |
| `mq15_sabeline` | `refused` / `sold` / `played` | MQ15 | Sabeline an enemy (`sold`) |
| `told_isolde_truth` | | MQ17 | Trust |
| `larkspur` | `cured` / `burned` | MQ18 | Maelis's crown |
| `ketter` | `dead` / `turned` / `free` | MQ19 | MQ25; `lina_freed` |
| `heart` | `given` / `taken` | MQ19 | `given` needs 2 of: cured, truth told, locket shown, `isolde_hives` |
| `vault_path` | `earned` / `heist` / `writ` / `alone` | MQ20 | `corvin_ledgers` |
| `corvin` | `kept` / `hanged` / `exiled` / `held` / `killed` / `confessed` | MQ21 | Allies, candidates, endings |
| `maelis_to_corvin` | | MQ21 | Puppet queen |
| `maelis_forgave_garrick` | | MQ21 | Garrick's and Maelis's slides |
| `elderwick` | `saved` / `burned` | MQ22 | |
| `anselm_exposed` | | MQ22 / MQ23 | |

**Evidence against Corvin** (MQ21, two needed): Garrick's testimony, Maelis's, `corvin_ledgers`; `edric_letter`,
`saw_maelis_saved` and `white_ledger` each count as one more only alongside one of those three. Each layer of his
confession needs its own key (MQ21).

**Evidence against Anselm** (MQ22, two needed; one with `odalys_doubts`): `told_odalys_wynfrith`, `archive_pages`,
`anselm_pages`, `cuthwin_testimony`, `white_ledger`; `bryn_voices` only alongside another.

### Act III
| Flag | Values | Set in | Changes |
|---|---|---|---|
| `listeners` | `freed` / `mercy` / `left` | MQ23 | Slides; the Lantern endings |
| `forge_guide`, `crown_quality` | | MQ23 | MQ28 |
| `crown_to_anselm`, `odalys_dead` | | MQ23 | |
| `allies` | 0..10 | MQ24 | The siege |
| `carrow_pact`, `sabeline_defected`, `edda_promise` | | MQ24 | |
| `ditch` | `saved` / `burned` | MQ25 | Grey Edda; the Barrowborn slides |
| `siege` | `held` / `costly` / `fallen` | MQ25 | |
| `crowned` | `maelis` / `aldous` / `corvin` / `odalys` / `anselm` / `hero` / `broken` | MQ27–28 | The ending |
| `hrathgar` | `sleeps` / `consents` / `rested` / `destroyed` | MQ28 | Ending variants |
| `anselm` | `tried` / `dead` | MQ28 | |

### Romances
`rom_wren`, `rom_maelis`, `rom_sabeline`, `rom_odalys` (0..5, `committed`, `broken`), `lied_to_sabeline`,
`rom_maelis_waited`, `rom_wren_left_together`: see [romances.md](romances.md).

### Regions (side quests)
| Region | Flags |
|---|---|
| Hollowmere | `hm_weed_rats`, `osric_stone`, `aldous_just` / `aldous_hard`, `hm_gallows`, `orme` / `brayne_exposed`, `hm_lights`, `saw_maelis_saved`, `rhosyn_message`, `elderwick_wall`, `wall_whole` / `wall_lane_out`, `edric_letter`, `ditch_songs`, `edda_promise`, `toll`, `willows` |
| Saltreach | `nell_cargo`, `gull_light`, `garth` (`garth_drowned` / `garth_driven_out`), `widow_ring`, `gullhaven_harbour`, `anselm_pages`, `oswin_given`, `sabeline_mother`, `sorrow_ledger`, `pearl_freed`, `clifftop` |
| Greenwood | `sour_apple`, `varrow_trusts`, `oak_wedding`, `ulfar_lore`, `wren_letter_given`, `brannoc_*`, `fellowe` (`truth` / `regency` / `kept` / `pip_confessed`), `bear`, `lynx` |
| Lantern Moors | `bryn`, `bryn_voices`, `peat` (`warded` / `buried` / `tithe_cut`), `archive_pages`, `smith_book`, `cairnfold_chronicle`, `true_rite`, `cuthwin`, `cuthwin_testimony`, `hode_dead`, `odalys_doubts`, `lowell`, `terraces_drained`, `standing_man` |
| Southfields | `burned_row`, `odalys_knelt`, `deserters`, `ralf_judged`, `isolde_hives`, `tithe`, `scarecrow`, `isolde_clean`, `hedge_graves` |
| The Barrows | `grave_robbers`, `agent_caught`, `watchers_oath`, `adit`, `sigrun_freed`, `cairn_names`, `white_fields`, `white_ledger`, `hounds`, `coldstep` |

**Knots** (either order must work):
- SQ-SF6 before SQ-SF1: if `scarecrow: told`, the ambush is led by **Will Carter**.
- SQ-BV7 during MQ03: freeing Wat completes it.
- SQ-HM4's prisoner: Pip (`mq10_raid: warned`), else Ash Rowan (`oak_wedding: taken`), else Tam Fletch.
- SQ-GW8 `regency` hangs Pip: SQ-BV2 resolves as `pip_hanged`.
- SQ-BR4's torc in hand if `agent_caught`; SQ-SR4's ring in hand if SQ-SR3 done.
- SQ-SR7's giver: Hesper (if in the Milk House) or Pearl.

---

## Allies at the siege (MQ24–MQ25)
One each: Regency guard, Greenhood archers, Lantern knights, Gullhaven boats, village militia (4+ villages Grateful;
Millbrook counts double with `deserters: home`), Thornbeck garrison, Sigrun's oath-dead, the Barrowborn; Carrow counts
two (one if `orme: turned`); `grave_robbers: cleared` a half. **Held** ≥ 4, **costly** 2–3, **fallen** 0–1.
Extra enemies: `nell_cargo: delivered` (a mob at the Hall), `adit: dug` (a wave), `grave_robbers: bribed` (a wave),
`coldstep: opened` without `sabeline_defected` or the pact (Carrow attacks from the east), Sabeline's betrayal (a fight
in the Hall).

---

## The epilogue (MQ29)
Order: the ending; Carrow's shadow (if any); the places; the people; the romance; the factions. First matching line
shown.

### Places
| Place | Slides |
|---|---|
| **Brindleford** | `bv_bell_rung` and Brindleford ≥ +2: *"The bell rings every dawn now. The pit has a stone with sixty names on it."* / `pell_ledger: reported`: *"Reeve Grimwald's Brindleford paid every penny, and buried more children."* / ≤ -1: *"Brindleford doesn't speak of the stranger."* / *"Brindleford went on, as fords do."* |
| **Tallow Green** | SQ-BV3 done: *"The bees came back."* |
| **Kingsmere** | `held`: *"The walls held."* / `costly`: *"The lower town burned. They rebuilt it in stone."* / `fallen`: *"Kingsmere stood empty a year."* |
| **The Ditch** | `ditch: saved` and `edda_promise` kept: *"The Ditch has a name now: Edda's Rise. Its children go to school with the heron-boys, and fight them, and win."* / `ditch: burned`: *"Nobody rebuilt the Ditch. The grey-eyes who lived went over the mountains, singing."* |
| **Reedby**, **Elderwick**, **Gullhaven**, **Saltcombe**, **Oakhallow**, **Thornbeck**, **Gorse Hollow**, **Millbrook**, **Larkspur** | By standing and their quests: Elderwick (`wall_whole`: *"the stranger's bell"*; `wall_lane_out`: *"Elderwick's grey-eyes moved away"*); Gullhaven (`sorrow_ledger: burned`: *"The Milk House closed. Mother Sorrow opened a bakery, and it's terrible, and full"*); Thornbeck (`fellowe: truth`: *"Joan Fellowe's grave is by the barn's ashes, with her family's"*); Gorse Hollow (`peat: buried`: *"forty stones on the hill"*); Larkspur (`burned`: *"a black hill; the larkspur grows anyway"* / `odalys_knelt`: *"a rowan in the Burned Row, planted by a knight"*) |

### People
| Who | Slides |
|---|---|
| **Garrick** | testified, `maelis_forgave_garrick`: *"Garrick slept through the night, the first time in seven years."* / exposed without trust: found in the inn's cellar / killed by Ketter / `bv_elsa_wed`: *"danced at his grandchild's naming"* / *"kept the Ferryman's Rest, and his silence"* |
| **Elsa** | the inn / a Kingsmere bakery |
| **Kit** | by `kit`: with his father on Joan Fellowe's fields (`pip_confessed`) / in the Greenhood / on the Cobbes' farm / learns the lie at sixteen / the miller's heir |
| **Jory** | `jory_weaned`: Brindleford's miller / `jory_reeve`: hanged himself in the mill / `jory_quiet`: dug up his mother, one winter |
| **Wenna** | `wenna_nan`: Brindleford's herbalist / `ada_told`: grew up / `home`: ran, and wasn't found |
| **Hesper** | `hesper_judged`: *"Hesper Rowe never came back to the Vale. She sent the stranger a letter once. It said: thank you for asking."* / Milk House / freed |
| **Corvin**, **Aldous**, **Wren**, **Odalys**, **Anselm**, **Maelis**, **Ketter** (`lina_freed`: *"Ketter retired with his daughter and a dog, and never took another job"*), **Sabeline** (`sabeline_mother` known: *"She visited Gullhaven once, alone, and stood outside the Milk House a long time"*), **Cuthwin**, **Tobin**, **Nell**, **Sigrun**, **Grey Edda** | By their flags ([characters.md](characters.md) "Fates") |
| **The Listeners** | `freed`: *"Five of the seven lived. One became a singer; she sang what the dead had told her, and people paid to weep."* / `mercy`: *"Four stones in the Abbey garden, without names, because they'd forgotten them."* / `left`: in the Lantern endings, more |
| **The hero** | Hollow King: the warden / romance endings / by renown: *"The stranger stayed"* or *"went back over the mountains, and the Vale told stories"* |

### Factions
- **The Regency**: by ending and `corvin`; the poppy purse closed (Rightful Queen, Free Vale) or not.
- **The Greenhood**: Free Vale: the moot's rangers / Rightful Queen: pardoned / Iron Regency: hunted / else scattered.
- **The Lantern**: Grey Host: an army of the dead / `anselm_exposed`: reformed under Cuthwin or Odalys, Cairnfold
  confessed / Free Vale: gravekeepers / else unchanged, and the poppy still grows.
- **The poppy**: Free Vale: gone in a year / `white_fields: burned`: a season's mercy / else: forever.
