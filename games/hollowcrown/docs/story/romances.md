# Romances

Four romances, open to any hero (any build). Each is a story of its own that runs through the main quest, with a
scene shown tastefully ([writing-guide.md](writing-guide.md): the embrace, the undressing begun, a cut, the morning
after; nothing explicit). Each has its own conflict with the main choices. Each can end badly.

## How they work
- **Affection** per romance, 0..5 (`rom_wren`, `rom_maelis`, `rom_sabeline`, `rom_odalys`), raised by beats (marked
  ♥ in dialogue: a flirt, a confidence, a choice they care about) and lowered by choices they hate.
- **The scene** happens when affection reaches 3 and the scene's quest comes. After it the romance is **committed**.
- **Juggling**: the hero can flirt with all four. Committing to a second while the first is committed: the second asks,
  *"Is there someone else?"* (lie or tell the truth). At **MQ24 (Gathering the Vale)** everyone is in one place; any
  lie comes out: both leave the hero (`rom_* : broken`), each with a line the player will remember. Telling the truth
  early: one accepts it (Sabeline, always: *"Darling, I'd be insulted if you hadn't."*), the others end it then,
  kindly or not.
- **Ending a romance** is always possible in conversation, and happens on its own after certain choices (listed).
- The epilogue has a slide for the romance, by ending.

---

## Wren Halloway — *"The Hood and the Stranger"*
**What it's about**: two people who don't believe in anything finding one thing they do; whether she can forgive
herself the Fellowe barn; whether the hero will break the crown for her.

| Beat | Where | What happens | Affection |
|---|---|---|---|
| 1 | MQ09 | First meeting; she draws on the hero; banter (Sly or Blunt answers she likes) | +1 |
| 2 | MQ10 | The hero sides with her at the barn (`raided` or `shared`) | +1 (`warned`: -3, closes it for Act I) |
| 3 | SQ-GW6 | Her mother's grave; she cries and hates that the hero saw | +1 (+1 if the hero asks for the letter for the right reason) |
| 4 | SQ-GW8 | The Fellowe barn: the hero finds out. If the hero lets her tell it herself, and doesn't excuse it or condemn it outright: | +1; condemning it publicly: -2 |
| **Scene** | after MQ20 (the heist done, or the vault got any way, if she's alive and affection ≥ 3) | The Hollow Oak at night, up in the crown of the hollow tree on a platform among the leaves; she's drunk on stolen royal wine; she says she's never done this sober and isn't going to start; they kiss; cut; morning: she's already up, bow strung, pretending nothing happened, then grins. | committed |
| 5 | MQ24 | She asks the hero to break the crown: *"Not for me. Well. A bit for me."* | — |

- **Conflicts**: hanging Pip or Brannoc to-Wren choices (-1 each); `corvin: kept` (she ends it: *"You'd keep him. After
  everything."*); crowning anyone but `broken` ends it at MQ27 unless affection 5 (she stays, furious, and leaves in the
  epilogue).
- **Endings**: Free Vale: she leads the moot, the hero beside her, arguing; Hollow King: she visits the hero's barrow
  every spring until she's old; others: she leaves the Vale for the hills over the mountains, and asks the hero once to
  come (`rom_wren_left_together` if the hero goes: the hero's own last slide changes).

## Isolde / Maelis — *"Hesk's Bees"*
**What it's about**: a woman who drugs herself to see her dead; a hero who can help her stop, or not; a throne she
doesn't want and might take for someone else's sake, or give up for the hero's.

| Beat | Where | What happens | Affection |
|---|---|---|---|
| 1 | MQ17 | The fever barn; the hero helps without being asked | +1 |
| 2 | SQ-SF3 | Hesk's hives; she talks; the hero tells the truth about the crown (`told_isolde_truth`) | +1 |
| 3 | SQ-SF7 | Her poppy habit. Helping her through withdrawal (not judging; staying three nights) | +2; giving her more poppy because she begs: +1 now, and her habit stays |
| **Scene** | after MQ19, if affection ≥ 3 and she gave the Heart | Hesk's cottage, a storm; she's clean, or not (the scene is written for both: clean, she's frightened of feeling things; using, she's warm and far away and the hero can choose to stop, `rom_maelis_waited`: +1 later); they undress by the fire; cut; morning: she's out at the hives in the hero's shirt | committed |
| 4 | MQ21 | She faces Corvin and Garrick; the hero stands by her (any choice that doesn't hand her over) | +1 |
| 5 | MQ27 | She asks: *"If I wear it, will you stay?"* | — |

- **Conflicts**: `heart: taken` closes it; `maelis_to_corvin` closes it forever; `larkspur: burned` (-3); lying about
  Garrick (-1).
- **Endings**: Rightful Queen: the hero becomes her consort or her captain (the player chooses in MQ29), or leaves
  (she asks them to stay, once); she refuses the crown *for* the hero (an MQ27 choice only if committed and affection 5:
  `crowned` passes to another candidate or to `broken`, and she leaves the Vale with the hero, keeping bees somewhere
  over the mountains); Hollow King: she stays in Millbrook and comes north once a year; if her habit is never broken,
  her epilogue slide is the dark one: she is found on Hesk's grave one spring.

## Lady Sabeline Marr — *"The Envoy's Table"*
**What it's about**: a seduction that might be a job, a hero who never quite knows, and a woman who has to choose
between the man who owns her and the stranger who doesn't want to.

| Beat | Where | What happens | Affection |
|---|---|---|---|
| 1 | MQ05 | The corridor; flirting back (Sly) | +1 |
| 2 | MQ15 | Her offer; refusing her charmingly (she likes being refused) | +1; selling to her: +1, and she respects the hero less |
| 3 | SQ-HM9 | Dinner at the envoy's house: wine, Carrow food, a duel of questions; she shows the hero her missing finger and lies about how she lost it | +1 |
| **Scene** | SQ-HM9's end, if affection ≥ 3 | Her rooms over the lake; candles; she undresses the hero like a negotiation and then, briefly, not like one; cut; morning: she's writing a letter to Carrow at her desk, and covers it with her hand, and then doesn't | committed |
| 4 | MQ22–MQ24 | The truth: the hero sees her reach for a crown piece by instinct and her hand frost: she's Vale-born. She tells it all: the Gullhaven den, Ferrand, Haakon. | +1 |
| 5 | MQ24 | Her choice (below) | — |

- **Her choice at MQ24** (by affection, and whether the hero ever lied to her: `lied_to_sabeline`):
  - affection ≥ 4: **defects**: tears up the pact, tells the hero Carrow's army is already waiting on Coldstep Pass to
    take the Vale after the dead have bled it (a Carrow ambush prevented in MQ25), and stays (`sabeline_defected`);
    with Ketter turned, she helps get his daughter out (`lina_freed`).
  - affection 3: offers the pact honestly (`carrow_pact` if accepted), and stays the hero's lover in it.
  - affection ≤ 2, or if the hero lied to her: **betrays**: in MQ25 her agents try to steal the crown during the siege
    (a fight in the Hall).
- **Endings**: with `sabeline_defected`, she becomes the new ruler's ambassador to Carrow, or runs away with the hero;
  with `carrow_pact`, Countess of the Barrow Hills (the hero visits; it's cold up there); betrayal: executed in
  Kingsmere, or escapes over the Teeth.

## Sister-Captain Odalys Venn — *"The Vow"*
**What it's about**: a woman who has made herself a weapon for twenty years, learning she was aimed by a liar; whether
she can be forgiven Larkspur; whether she lets anyone close.

| Beat | Where | What happens | Affection |
|---|---|---|---|
| 1 | MQ08 | Cairnfold together; the hero guards her back; she notices | +1 |
| 2 | MQ08 end | The hero tells her Wynfrith's whole warning (`told_odalys_wynfrith`) | +1 |
| 3 | SQ-SF1 | The Burned Row: the hero brings her to Larkspur to kneel (`odalys_knelt`) | +2 |
| 4 | SQ-LM5 | Cuthwin's trial: the hero asks her for his release, and she does it | +1 |
| **Scene** | after MQ22 (Anselm exposed, if affection ≥ 3) | The Abbey's bell-loft at night, the great lantern below, the moor dark. She unknots the rope belt of her vow and gives it to the hero to hold; she's shaking; she asks the hero to be slow; cut; morning: she's on the tower walk in her shirt, looking at the moor, and says she slept for the first time in a year | committed |
| 5 | MQ23 | The Oathforge: if committed, she holds the stair against Anselm's dead. The hero chooses: hold the stair with her (both live, Anselm escapes north) or go after Anselm (he's wounded and slowed for MQ28, and she holds the stair alone and dies, `odalys_dead`) | — |

- **Conflicts**: helping the Larkspur ambush (SQ-SF1 `ambushed`: -5, ends it, she can't forgive the knights' deaths);
  `crown_to_anselm` ends it.
- **Endings**: crowned: the Lantern Queen takes no consort; the hero is her "captain" and everyone knows; Free Vale:
  she lays down her mace and keeps Larkspur's sick with the hero; Hollow King: she becomes the hero's Lector, the last
  Lantern, keeping the rite for one; dead: the hero keeps her rope belt (an item: a slide where they wear it).
