# Characters

The named people of the main story. Regions have their own villagers. For each: who they are, how they look (for the
voxel figure), what they want, what they hide, their stain (what they've done that can't be undone), their wound
(what was done to them), how they speak, how they change, what they remember of the hero, how they can end.
Romanceable characters are marked ♥ ([romances.md](romances.md)).

---

## The hero — "the Stranger"
- Player-made: name, build, look. Came over the western mountains for reasons the player answers (`hero_reason`).
- **Unsworn**: oath-iron doesn't burn them; the dead call them "Unsworn".
- **Voice**: wry, weary, observant; each choice picks a tone (Kind / Hard / Sly / Blunt) ([writing-guide.md](writing-guide.md)).
- Starts robbed by the Red Hen's men on the pilgrim road, in their underclothes, at dusk.
- **Arc**: from nobody to the one who decides whether the Vale keeps its chain.

---

## Garrick Fenn — the ferryman
- **58**, Brindleford, keeps *The Ferryman's Rest*. Big, grey-bearded, bald, a limp, a leather apron, hands that shake
  until his first drink.
- **Wants** to be left alone; to see Elsa settled; to drink until the lake goes quiet.
- **Stain**: on the Night of Still Water he rowed away from Lady Rhosyn and the Chamberlain as they drowned, calling his
  name, because Corvin said "Row". He took Corvin's money for his silence.
- **Wound**: he loved Rhosyn. No one knew. He turned back for the princess because Rhosyn had gone in after her: he
  saved the girl to save something of her.
- **Voice**: slow, kind, water sayings. *"Water remembers, stranger. Best not to ask it things."*
- **Arc**: friend (prologue) → half-confession, drunk (MQ11) → the whole truth (MQ21) if he trusts the hero
  (`garrick_trusts`) → he can testify against Corvin, and against himself. Maelis hates him for Rhosyn and owes him her
  life; whether she forgives him is hers (MQ21).
- **Fates**: testifies and is forgiven, or not; hangs himself in the inn's cellar if exposed without his consent
  (`garrick_exposed` and not `garrick_trusts`); killed by Ketter (`ketter: free`); dies old at his own fire.

## Elsa Fenn
- **24**, the inn's cook; red-brown braid, quick tongue. Wants to marry **Hal Wicke** of Tallow Green. Knows her father
  wakes shouting a woman's name she doesn't know (*Rhosyn*). Runs the inn in every epilogue where she lives.

## Lord Regent Corvin Ashby
- **52**, Kingsmere. Tall, lean, grey at the temples, short beard, black doublet with the grey heron, a chain of office,
  gloved always (his right hand is frost-black to the wrist from the Band: two fingers no longer move).
- **Wants** the Vale whole, solvent, safe; the crown reforged; a ruler he can stand behind; his secrets buried.
- **Stain**: let his king drown and ordered two witnesses left to drown; the poppy purse; the Wet Years' grain policy
  that fed Kingsmere and starved the villages (his sister among the dead); the hanging of a hundred poppy-sellers while
  he taxed the trade; the Barrowborn laws he tightened "to keep order".
- **Wound**: he loved Queen Annis. She died bearing Edric's daughter. He kept Maelis from Haakon because she has
  Annis's face. He has never said so.
- **Voice**: precise, tired, never raised; argues in sums. *"Every hanging in this Vale is a sum I've done. Show me a
  better sum."*
- **Arc**: patron (Act I) → suspect → in MQ21 he confesses what he can be made to confess. Many layers: the oar; the
  witnesses; the poppy; Annis. Each layer needs evidence or trust. The hero exposes him, keeps his secret, kills him,
  or (with Wren's letter) breaks him into a confession.
- **Fates**: hanged; exiled; pardoned by a queen; dies on the walls; dies wearing the crown; rules through his son.

## Aldous Ashby
- **17**, Corvin's son. Slight, fair, ink-fingered, earnest, secretly reads Greenhood pamphlets; stammers when lying.
  Doesn't know what his father did. SQ-HM3 shapes him (`aldous_just`/`aldous_hard`). Can be crowned. Never a romance.

## Wren Halloway ♥
- **29**, the Hollow Oak. Lean, short black hair, green hood, longbow, a scar through her left eyebrow, a leather
  bracer with a carved wren, bitten nails.
- **Wants** the reeves gone, the villages free, no more kings; her uncle to admit what he did to her mother.
- **Stain**: **the Fellowe barn**. Two years ago her men burned the family of an informer, Tam Fellowe, in their barn at
  Thornbeck, his wife and three children with him. Wren didn't order it. She found out that night, and she hanged the
  man who lit it, and told everyone the Regency did it. She also sells grave-poppy in the Ditch to buy arrows.
- **Wound**: she watched her mother starve. She stole her mother's last letter to Corvin and never gave it.
- **Voice**: blunt, funny, insults as affection, angry underneath. *"Kings are just bandits who got there first."*
- **Arc**: a wary ally (MQ09) → the Fellowe barn found out (SQ-GW8) → her mother's grave (SQ-GW6) → the heist (MQ20).
  Romance: see [romances.md](romances.md).
- **Fates**: leads the moot; hanged in Kingsmere; dies at the siege; leaves the Vale with the hero.

## Brannoc "Red Hen" Mabb
- **40**, rogue Greenhood lieutenant, the Red Hen camp. Red beard, a red-dyed hen feather in his hat, a cleaver, a
  laugh like a dog's bark. Robbed the hero. Keeps a captive in his camp (a pilgrim woman, **Hesper Rowe**: implied
  abused; freed in MQ03). Sells poppy on the side.
- The hero decides his fate in MQ03 (`bv_red_hen`). Spared or sent to Wren, he returns in SQ-GW7.

## Sister-Captain Odalys Venn ♥
- **38**, the Abbey. Tall, broad, close-cropped grey-blond hair, plate with a brass lantern on the breast, a long-hafted
  mace, a burn scar along her jaw, a novice's rope belt she still wears under her armour (a vow of chastity).
- **Wants** the dead back in the ground, the rite kept, a worthy ruler crowned; to believe the Order is good.
- **Stain**: **Larkspur**. Last spring, told by Anselm that the fever was grave-rot spread by breath, she had the first
  five sick houses nailed shut and burned, with the sick inside. Eleven died, three of them children. The fever was
  not spread by breath.
- **Wound**: she flogs herself at night. She has not let anyone touch her in twenty years.
- **Voice**: short, drill-yard, sometimes unexpectedly gentle with the frightened. *"The dead don't hate you. That's what
  makes them hard to fight."*
- **Arc**: patron (Act I) → doubt (SQ-LM5, SQ-SF1) → turns on Anselm if shown the truth (MQ22) → can be crowned.
  Romance: [romances.md](romances.md).
- **Fates**: crowned; dies holding the Oathforge stair; becomes Larkspur's nurse; captain still.

## Lector Anselm Crane
- **71**, head of the Order. Thin, white-bearded, one milky eye, soft grey robes, a lantern-topped staff; kind to
  novices, beloved, smells of cloves (poppy).
- **Stain**: the Listeners: novices with sewn eyes, drugged on grave-poppy, lying on graves to hear the dead; forty
  have died. The changed oath. The lie about Larkspur's fever (to test whether Odalys would obey).
- **Wound**: Carrow's Border Burning killed his parents and sisters when he was 19; he found them in the well.
- **Voice**: warm, patient, scriptural. *"Every grave is a door, child. The question is only who holds the key."*
- **Arc**: mentor → exposed (or not) → MQ23 → MQ28.

## Isolde of Millbrook — Princess Maelis ♥
- **22**, Millbrook, the herbalist's cottage. Small, freckled, dark-auburn hair under a headscarf, a herb-stained
  apron, bee-sting-swollen thumbs, her father's grey eyes, a faint blue tinge to her lips (poppy).
- **Wants** to be left alone; to cure Larkspur; never to see Kingsmere again; to stop seeing water when she closes her
  eyes.
- **Stain**: when Mother Hesk lay dying, in pain, Isolde gave her a dose of poppy she knew would stop her heart, because
  Hesk asked. She's told no one.
- **Wound**: she watched her father drown and Rhosyn, who raised her, drown calling for her, and a ferryman row away. She
  has taken grave-poppy every night for four years to see Rhosyn and her father, who are kind to her there.
- **Voice**: wry, careful, warms slowly, herb metaphors; furious when people are hurt for politics. *"Crowns don't heal
  fevers."*
- **Arc**: MQ16–MQ19; her habit (SQ-SF7); her trust; her choice in MQ27. Romance: [romances.md](romances.md).
- **Fates**: queen; herbalist; prisoner (`maelis_to_corvin`); dead (Ketter, or the poppy).

## Ketter
- **45**, bounty hunter from Carrow. Lean, leather coat, crossbow, a wolfhound called **Biscuit**. Polite, patient.
- Hired by Corvin to bring Maelis "quietly", and paid by Sabeline for the same news. **His wound**: Duke Ferrand holds
  his daughter **Lina** (14) at court as surety for his work. He does nothing for free and everything for her.
- MQ19: killed, turned (`turned`: he reports her dead; with SQ-HM9's or Sabeline's romance help, Lina can be got out of
  Carrow: `lina_freed`), or let go (`free`: he returns in MQ25).

## Lady Sabeline Marr ♥
- **35**, Carrow's envoy in Kingsmere. Elegant, black-haired, Carrow-blue silk, a steel-ribbed fan, a ring on every
  finger but the right index (it was frostbitten off: see below).
- **Wants** the barrow hills and the poppy contracts for Carrow, a weak ruler in Kingsmere, the crown pieces (Carrow
  would melt them); privately, to never be sent home to Ferrand's court again.
- **Secret**: she's **Vale-born**, sworn: the Duke's bastard by a Gullhaven poppy-den girl, taken to Carrow at six. She
  touched an oath-iron reliquary once and lost a finger; that's why she needs the hero.
- **Stain**: her agents' grave-robbing, the Sour Apple's murders, the arms for a rising in Kingsmere, the grain she
  buys to keep the Vale hungry.
- **Wound**: Ferrand has promised her to his son Haakon (her half-brother, who doesn't care) if she fails.
- **Voice**: charming, honest about being dishonest, answers questions with questions. *"Is it a lie if we both know?"*
- **Arc**: MQ05 → MQ15 → SQ-HM9 → her choice in MQ24 (pact, defection or betrayal). Romance: [romances.md](romances.md).

## Father Cuthwin
- **60**, Brindleford's priest, an ex-Lantern brother. Stooped, white tonsure, a patched grey robe. Left the Abbey 12
  years ago after refusing to help sew a novice's eyes. First to see the hero is unsworn (MQ02). His arc: SQ-BV4,
  SQ-LM5.

## Reeve Odo Pell
- **50**, Brindleford's reeve. Round, ruddy, a feathered cap too young for him, a polished heron badge. Pompous, brave
  when it counts; lies in his ledger to feed the village (SQ-BV5). In the Wet Years he dug the famine pit on Chapel
  Hill and buried sixty without rites because the Lantern wanted a silver a grave. He has dreams.

## Nell Corrigan
- **40**, Gullhaven's smuggler queen. Gold earring, sailor's braids, shark-tooth necklace, cutlass, owns the Milk House.
  *"I sell what people want. If they want the wrong things, take it up with the gods."*

## Hrathgar, the Barrow King
- Huge, barrow-iron armour grown through with roots, a crown-shaped hollow on his brow. Speaks in dreams from MQ14.
  **Never threatens; bargains; tells his side**: Cairnfold, his burned people, his daughter. *"You are Unsworn. You owe
  them nothing. Tell me, stranger, who in this story were the monsters?"*
- **Wants** his chain broken, his daughter's honour told, the Barrowborn free. Not revenge, unless refused.

## Sigrun, the Oath-Bride
- Hrathgar's daughter, taken at Cairnfold, wed to Osric. Her ghost keeps a vigil at her cairn and in the Great Barrow.
  Speaks the truth no song does (SQ-BR4). Can make laying Hrathgar to rest possible.

## King Edric (the Drowned King)
- His drowned wight guards the Brow in Gullmouth (MQ14). Lucid in flashes: *"Corvin... let go of the oar... Rhosyn?
  Where's my girl — "*. Laid to rest, he gives his locket (Maelis at fourteen). He was not a good king. He loved his
  daughter, and was going to sell her.

## Tobin Harrow
- Brindleford's smith. 45, thick-armed, soot-black, answers in one word. His family were the Oathforge's smiths before
  the Lantern took it. Can guide the reforging (MQ23, `tobin_at_forge`).

## Old Grey Edda
- **80**, Barrowborn elder in Kingsmere's Ditch. Blind, grey-eyed, sings the true songs of Cairnfold. SQ-HM10. In
  MQ25's pogrom, the Ditch burns or doesn't.
