# Characters

The named people of the main story. Each region file has its own villagers. For each: who they are, how they look
(for their voxel figure), what they want, what they hide, how they speak, how they change, and what they remember of
the hero (the flags their words depend on: see [choices.md](choices.md)).

---

## The hero — "the Stranger"
- **Made by the player** in the hero forge: name, build, look. No fixed past: they came over the western mountains on
  the pilgrim road, alone, for reasons of their own. The story never says why; the player can answer for themselves in
  dialogue ("Work." / "To forget something." / "I go where the road goes.") and NPCs only remember what was said.
- **Unsworn**: born outside the Vale, untouched by the Oath. Oath-iron doesn't burn them. The dead feel it: crypt lords
  and Hrathgar speak to them as "Unsworn".
- **Starts** robbed by the Red Hen's bandits on the pilgrim road: in their underclothes, no coin, no weapon, waking at
  the Pilgrim's Shrine at dusk.
- **Arc**: from nobody to the one who decides who wears the crown, or whether anyone does.

---

## Garrick Fenn — the ferryman
- **Age** 58. **Where**: Brindleford, keeps the inn *The Ferryman's Rest*. **Look**: big, grey-bearded, bald, a
  boatman's arms, a leather apron, a limp (left leg).
- **Who**: for twenty years the royal ferryman on Hollowmere. He rowed the king the night he drowned.
- **Wants**: to be left alone; to see Elsa settled; to die without that night on him.
- **Secret**: he saw Corvin hold his oar while the king drowned, and did nothing. He pulled the princess out and took
  her to Mother Hesk in Millbrook. Corvin paid for his silence with the inn, far from the lake.
- **Voice**: slow, kind, dry jokes, goes quiet when the lake is mentioned. "Water remembers, stranger. Best not to ask
  it things."
- **Arc**: friend in the prologue; in MQ11 a half-confession when drunk; in MQ21 the whole truth, if the hero has
  earned it (Brindleford Grateful or better, or SQ-BV8 done). He can testify against Corvin in Kingsmere (MQ21), which
  puts him in danger.
- **Remembers**: `bv_bell_rung` ("You gave the village its bell back"), `bv_red_hen` outcome, `bv_elsa_wed`.
- **Fates**: alive and forgiven; alive in disgrace; killed by Ketter if he testifies and Ketter still hunts (MQ19
  choice `ketter_turned`/`ketter_dead` prevents it).

## Elsa Fenn
- **Age** 24. Brindleford, the inn's cook. Red-brown braid, flour on her sleeves, quick-tongued.
- Wants to marry **Hal Wicke**, the chandler's son from Tallow Green; her father forbids it ("a candle-maker's boy").
- Knows nothing of the night of Still Water; knows her father wakes shouting.
- In the epilogue, runs the inn.

## Lord Regent Corvin Ashby
- **Age** 52. **Where**: Kingsmere, the Regent's Hall. **Look**: tall, lean, grey at the temples, short beard, black
  doublet with the Regency's grey heron, a chain of office, gloved always (his right hand is frost-scarred black: he
  held the Band for a moment that night).
- **Who**: the late king's chancellor, the Vale's ruler for seven years.
- **Wants**: the Vale whole, safe and solvent; the crown reforged; a crowned ruler he can stand behind (Maelis, found
  and grateful, or his son Aldous); his secret buried.
- **Secret**: he let the king drown, to stop the sale of the barrows to Carrow. He believes he was right. He hired
  Ketter to find Maelis "quietly", and hasn't decided what he'd do then.
- **Voice**: precise, tired, never raises it; argues like a ledger. "Every hanging in this Vale is a sum I've done.
  Show me a better sum."
- **Arc**: patron and suspect in Act I, antagonist or uneasy ally in Act II; in MQ21 the hero learns the truth and
  decides: expose him, keep his secret (for a price), or kill him. In Act III, if alive and not exposed, he fights at
  Kingsmere's walls and may die there.
- **Remembers**: `mq06_cart` (the tax cart), `hm_gallows` (SQ-HM4), `aldous_lesson`, `vault_path`.
- **Fates**: tried and hanged (exposed, Regency weak); exiled; pardoned by Maelis; dies on the walls; dies wearing the
  crown (if the hero lets him try); rules as regent for Aldous.

## Aldous Ashby
- **Age** 17. Corvin's son. Slight, fair, ink on his fingers, earnest; secretly reads Greenhood pamphlets.
- Wants to see the "real Vale" and to be a better man than his father. Doesn't know what his father did.
- **Arc**: SQ-HM3 (*Aldous's Lesson*) shapes him: just or hard (`aldous_just`/`aldous_hard`). He can be crowned in
  the Iron Regency ending.

## Wren Halloway
- **Age** 29. **Where**: the Hollow Oak, the Greenwood. **Look**: lean, short black hair, a green hooded cloak, a
  longbow, a scar through her left eyebrow, a leather bracer with a carved wren.
- **Who**: leader of the Greenhood; Corvin's niece. Her mother Maud starved in the Wet Years after the reeves took
  Oakhallow's seed grain.
- **Wants**: no reeves, no crown, no kings: the villages ruling themselves. And, though she won't say it, her uncle to
  admit what he did to her mother.
- **Secret**: she has her mother's last letter to Corvin, begging him for grain, unopened. She stole it from his
  courier the week Maud died and never gave it to him.
- **Voice**: blunt, funny, angry underneath. "Kings are just bandits who got there first."
- **Arc**: a wary ally; in SQ-GW6 she visits her mother's grave; if the hero brings her and Corvin together (MQ21 and
  SQ-GW6 both done, `wren_letter_given`) she spares him. In the Free Vale ending she leads the first moot.
- **Fates**: alive, leading the moot; hanged in Kingsmere (Regency path and `wren_captured`); dies at the siege.

## Brannoc "Red Hen" Mabb
- **Age** 40. Greenhood lieutenant gone rogue; runs the Red Hen camp in Brindle Vale. Red beard, a red-dyed hen
  feather in his hat, a cleaver. Robbed the hero on the pilgrim road.
- Wants coin and to be feared; says he robs "for the cause" and keeps it all.
- The hero decides his fate in MQ03 (`bv_red_hen`: `hanged`, `to_wren`, `killed`, `spared`). Spared or sent to Wren,
  he returns in SQ-GW7.

## Sister-Captain Odalys Venn
- **Age** 38. **Where**: the Abbey of the Last Lantern. **Look**: tall, broad, close-cropped grey-blond hair, plate
  with a brass lantern on the breast, a long-hafted mace, a burn scar on her jaw.
- **Who**: captain of the Order's knights; twenty years fighting the dead. Honest, hard, believes in the rite.
- **Wants**: the dead back in their graves; the crown reforged at the Oathforge and a worthy ruler crowned by the rite.
  She'd put Lector Anselm on the throne, believing him the wisest man in the Vale.
- **Secret**: she ordered Larkspur burned last spring, when the fever first came, and has nightmares of it. (It was
  only half burned; the rest of the village lived and remembers her.)
- **Voice**: short, military, sometimes surprisingly gentle with the frightened. "The dead don't hate you. That's
  what makes them hard to fight."
- **Arc**: patron in Act I; if the hero exposes Anselm (MQ22 with the evidence from SQ-SR6 and SQ-LM3), she turns on
  him, and can be crowned (Lantern Throne, Odalys).
- **Fates**: crowned; dies in the Oathforge fight defending the hero; lives on as captain.

## Lector Anselm Crane
- **Age** 71. Head of the Order. Thin, white-bearded, blind in one eye (milky), soft grey robes, a lantern-topped staff.
  Kind to novices, beloved.
- **Secret**: he has rewritten the oath. His version binds the dead to serve the crown's wearer. He's practised the
  words on the dead of the Abbey Undercroft. He means to wear the crown himself, and march the dead on Carrow, "so no
  foreign duke ever buys our graves again".
- **Voice**: warm, patient, scripture-like. "Every grave is a door, child. The question is only who holds the key."
- **Arc**: kindly mentor in Act I; the hero may uncover him in Act II (SQ-LM3 archive, SQ-SR6 deserter's pages).
  Exposed: he flees to the Great Barrow and fights the hero there with his bound dead (MQ28). Unexposed: at the
  Oathforge (MQ23) he tries to take the crown; the hero can give it to him (Lantern Throne, Anselm: the darkest
  ending but one).

## Isolde of Millbrook — Princess Maelis
- **Age** 22. **Where**: Millbrook, the herbalist's cottage. **Look**: small, freckled, dark-auburn hair under a
  headscarf, a herb-stained apron, a bee-sting-swollen thumb. Her father's grey eyes.
- **Who**: King Edric's daughter, thought drowned; raised by the herbalist Mother Hesk (dead two winters).
- **Wants**: to be left alone; to cure Larkspur's fever; never to see Kingsmere again. She doesn't want the crown: she
  saw what it made of the men around her father.
- **Secret**: who she is; she saw Corvin hold the oar; she has the Heart, buried under Hesk's hives.
- **Voice**: wry, careful, warms slowly; furious when people are hurt for politics. "Crowns don't heal fevers."
- **Arc**: MQ17–MQ19. If the hero earns her trust (helps Larkspur, protects her from Ketter, SQ-SF3), she gives the
  Heart freely and may choose to be crowned (Rightful Queen). If betrayed or forced, she gives it up but refuses the
  throne; she can be handed to Corvin (`maelis_to_corvin`).
- **Fates**: crowned queen; herbalist in Millbrook still; a prisoner in Kingsmere; dead at Ketter's hand (if the hero
  doesn't stop him in MQ19).

## Ketter
- **Age** 45. Bounty hunter from Carrow's side of the mountains. Lean, leather-coated, a crossbow and a wolfhound
  called **Biscuit**. Polite. Patient. Doesn't kill for free.
- Hired by Corvin to find Maelis and "bring her quietly to the Regent". Has also sold the same news to Sabeline.
- MQ19: killed (`ketter_dead`), turned with a better offer (`ketter_turned`: he reports her dead to both employers),
  or let go (`ketter_free`: he comes back in Act III for Garrick or Maelis).

## Lady Sabeline Marr
- **Age** 35. Envoy of Duke Ferrand of Carrow in Kingsmere. Elegant, black-haired, Carrow's blue silk, a fan with
  steel ribs. Charming, honest about being dishonest.
- **Wants**: the barrow hills for Carrow, a weak ruler in Kingsmere, and the crown pieces (Carrow would melt them).
- **Offers** (MQ15): a fortune for the Brow; later, Carrow soldiers for Act III if the hero promises her the barrow
  hills (`carrow_pact`): an easy siege, a bitter ending (Carrow mines the barrows: the epilogue's dead never quite
  rest).

## Father Cuthwin
- **Age** 60. Brindleford's priest. Stooped, white tonsure, Lantern grey robe gone brown with patching.
- Was a Lantern brother; left the Abbey twelve years ago after refusing Anselm's order to "practise the words" on the
  undercroft's dead. Doesn't say why at first.
- First to notice the hero is unsworn (MQ02). Writes to Odalys (MQ04). SQ-BV4 and SQ-LM5 are his arc: he can confront
  Anselm in the Abbey, giving the hero the first proof.

## Reeve Odo Pell
- **Age** 50. Brindleford's Regency reeve. Round, ruddy, a feathered cap too young for him, the grey heron badge
  polished daily. Pompous, brave when it counts; quietly lies in his ledger to keep Brindleford's tax low (SQ-BV5).

## Nell Corrigan
- **Age** 40. Gullhaven's smuggler queen. One gold earring, a sailor's braids, a shark-tooth necklace, a cutlass. Loyal
  to Gullhaven, then coin. Takes the hero to Gullmouth in MQ13 for a price or a favour.

## Hrathgar, the Barrow King
- The last of the Barrow Kings, asleep 303 years under the Speaking Stone. Huge, his barrow-iron armour grown through
  with roots, a crown-shaped hollow on his brow where his crown was taken.
- Speaks to the hero in dreams from MQ14 on (once they carry a piece): never threatens, always bargains. "You are
  Unsworn. You owe them nothing. Bring me my iron and I will owe you everything."
- Wants: his crown back, the Oath ended, his people's hills.
- MQ28: the final enemy (or, in the Hollow King ending, the hero's eternal neighbour).

## Sigrun, the Oath-Bride
- Hrathgar's daughter, who made the Oath with Osric and married him. Her ghost keeps a vigil in the Great Barrow. Found
  in SQ-BR4; if freed she fights beside the hero in MQ28 and her words decide whether Hrathgar can be laid to rest
  without the crown (Free Vale ending eased).

## King Edric (the Drowned King)
- Drowned seven years ago; his body, carried to the sea cave with the Brow, has risen as a drowned wight that guards it
  (MQ14). Lucid in flashes: "Corvin... the oar... my girl, where is my girl?" The hero can lay him to rest, bind him
  (for the Lantern) or destroy him. Laying him to rest gives his locket, which Maelis will recognise (MQ17).

## Tobin Harrow
- Brindleford's smith. 45, thick-armed, soot-black, slow-talking, honest. His family were Oathforge smiths before the
  Lantern took the forge. He can guide the hero's reforging in MQ23 (`tobin_at_forge`), if the hero did SQ-BV7.
