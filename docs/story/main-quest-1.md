# Main Quest — Prologue and Act I

Each quest: who starts it, where, its level and time, then its scenes (with key lines), its choices (their arguments
and costs; flags in [choices.md](choices.md)), rewards and journal. Brindle Vale's places and people:
[regions/brindle-vale.md](regions/brindle-vale.md). Tone and voice: [writing-guide.md](writing-guide.md).

---

# Prologue — *The Stranger at the Ford* (Brindle Vale, ~2.5 h)

Teaches walking, fighting, looting, talking, the journal, tones, the first hard choice. Ends when the hero leaves the
vale.

## MQ01 — The Stranger at the Ford
- **Starts**: the game's start. **Where**: Pilgrim's Shrine (480, 3380) → Brindleford (900, 3350). **Level** 1.
  **Time** 30 min.
1. **Waking** at dusk by the shrine in underclothes, a lump on the head. A red-dyed hen feather in the mud. In the
   offering bowl, a rusty knife and 3 copper someone left for the dead. The hero's first line (the first tone choice,
   alone): Kind *"Thank you, whoever you were."* / Hard *"Of course."* / Sly *"Well. Lighter for the walk."* / Blunt
   *"Robbed. Wonderful."*
2. **The road east**: an old pilgrim woman dead in the ditch, throat cut, her shawl and padded jerkin still on her.
   The hero can take the jerkin (cold night; she doesn't need it) or cover her with it. Two wolves at the Birchwood's
   edge (650, 3420) have already started on a dead mule: the first fight.
3. **Brindleford** at nightfall: the chapel bell on the hill rings, slow, though it has had no tongue for forty years.
   Shutters slam. **Reeve Odo Pell** in a nightcap with a sword: *"In the name of the Lord Regent — who are you, and why
   are you in your smalls?"*
4. **The Ferryman's Rest**: **Garrick** lets the hero in when Pell won't (*"Wipe your feet. The floor's the only thing in
   here I've paid for."*); bread, a bed "on account"; **Elsa** brings soup and an old shirt. Garrick asks why they came
   (`hero_reason`). The bell stops. The silence is worse.
5. **Midnight**: the dead come down from Chapel Hill: not knights, not old bones: **villagers**. Ghosts in famine
   rags, thin as sticks, a woman carrying a child. Old Meg screams a name at one of them: it's her sister. Garrick takes
   an oar and goes out; Pell holds the well with his sword shaking. The hero fights (4 famine ghosts, level 1–2); they
   don't attack people first: they go to the houses they lived in, and only fight when stopped. One whispers to the
   hero: *"Hungry... so hungry... the reeve put us in the pit..."*
6. **Dawn**: the village at the well. Old Meg won't stop crying. **Father Cuthwin**: the dead came from the
   **Bellwarden's Tomb**, he says, and the **famine pit** beside the chapel. Pell goes grey at "pit". No one will go.
   Garrick: *"The stranger fought them. The stranger owes us for a bed."*
- **Rewards**: 40 xp; the inn's bed (free in Brindleford); Garrick's spare **boatman's coat**.
- **Journal**: *"The dead walked into Brindleford tonight: starved villagers, not monsters. One said the reeve put them
  in a pit. Everyone looks at me."*

## MQ02 — The Quiet Bell
- **Starts**: end of MQ01. **Givers**: Cuthwin, Pell. **Where**: the Chapel of the Quiet Bell (1080, 3180), the famine
  pit (1090, 3200), the Bellwarden's Tomb. **Level** 2. **Time** 50 min.
1. Pell gives the **reeve's old sword** (*"Regency property. Bring it back. Clean."*). Cuthwin gives a flask of lantern
   oil (heals) and the legend of **Sir Hamund**, the Bellwarden, buried with the bell's tongue "to ring if the dead rose".
2. **The famine pit**: a long low mound beside the chapel wall, the turf broken from inside. Grave-poppy grows thick
   on it, white as frost; it's been harvested (stems cut clean, a dropped sickle with a mill's mark: Jory's: SQ-BV1).
   Sixty dead of the Wet Years, buried without rites because the Lantern charged a silver a grave and Brindleford had
   none. The hero can say the words Cuthwin knows over it (if they ask him first: a short rite: the famine ghosts don't
   return: `famine_pit: blessed`) or leave it.
3. **The chapel**: roofless, the bell hanging in the half-tower. Two skeletons at the altar. The stairs down are sealed
   by an **oath-iron grate**, white with frost in summer. Cuthwin's palms blister at the bars. The hero's don't.
   He goes very quiet: *"It's only iron to you."* (`hero_unsworn_seen`)
4. **The Bellwarden's Tomb** (crypt, 3 halls, level 2–3): the Ossuary; the Bell Hall (ghosts of bell-ringers, a pit with
   a rope bridge); the Warden's Rest. A journal page in a niche: *"If the crown fails, the bell will ring itself. Then
   someone must go to the Lantern. God help them if the Lantern is what it was when I was young."*
5. **Sir Hamund** (crypt lord, level 3), the bell-tongue in his fist. At half his life he stops and stares: *"Unsworn.
   You're not of the Oath. You can carry what we can't. The crown is broken. Go to the Lantern... no. Don't trust the
   Lantern. Trust what the Lantern fears."* Choice (`hamund`):
   - **Fight to the end**: he falls; the **Bell-Tongue**, **Hamund's sword** (a good blade for now) (`destroyed`).
   - **Let him finish his watch** (Kind or Blunt: *"Your watch is over."*): he lays down the tongue and fades;
     **Hamund's blessing** (+5% max health) (`rested`).
6. Back at the well: Pell, privately, if the hero mentions the pit: *"There was no money for graves. There was no money
   for anything. I dug that pit myself, with Dunstan and the Cobbes. I said the words I knew. I didn't know the right
   ones."* The hero's answer is remembered (Kind: Pell +; Hard: he'll fear the hero).
- **Rewards**: 120 xp, 20 copper, the Bell-Tongue (gives SQ-BV4 to Cuthwin).

## MQ03 — The Red Hen
- **Starts**: MQ02 done, or asking Pell about the robbery. **Where**: the Hanging Oak (1000, 3480), the Red Hen camp
  (620, 3560). **Level** 3. **Time** 45 min.
1. Pell's bounty: 50 copper for **Brannoc Mabb**, "alive to hang, dead to bury". Garrick, seeing the feather:
   *"Brannoc. Says he's Greenhood. The Greenhood says he isn't. Both are lying a little."*
2. **The trail**: red feathers; at the Hanging Oak's hollow, a note (*"Wednesday, the miller's sacks, and the white"*)
   and a vial of grave-poppy milk.
3. **The camp** (5 bandits level 2–3, Brannoc level 4). In the stock by the fire: **Wat**, Tobin's apprentice
   (SQ-BV7). In the back tent, chained: **Hesper Rowe**, a pilgrim woman taken from the road a week ago, the old
   dead woman's daughter. She doesn't speak of what was done to her; she asks for her mother. (Implied, never shown:
   her bruises, her silence, the bandits' laughter as the hero comes in. The hero's choice of tone with her matters:
   Kind lines let her speak; Hard lines make her go still.) The hero's belongings in the chest (12 copper, a
   **traveller's pack**: +4 bag slots).
4. Brannoc, beaten, drops his cleaver, grinning: *"I'm Greenhood, me. Wren's man. You hang me, the woods'll remember."*
   Then the choice (`bv_red_hen`), with Hesper watching:
   - **Bring him to Pell to hang** (`hanged`): Regency +15, Greenhood -15, Brindleford +1. The hanging at the well;
     Hesper watches it and says nothing.
   - **Kill him here** (`killed`): Regency +5, Greenhood -5. Title *the Red Hen's Bane*.
   - **Let Hesper decide** (Kind or Blunt): she takes the cleaver; the screen goes to black over her face; Brannoc's
     voice stops. (`hesper_judged`): Brindleford +1; Hesper leaves the vale at dawn without a word to anyone, except one
     to the hero: *"Thank you for asking me."*
   - **Send him to Wren** (`to_wren`): Greenhood +15, Regency -10, Brindleford -1. Hesper spits at the hero.
   - **Let him go for his purse** (`spared`, +30 copper): Brindleford -2 (Hesper tells everyone). He comes back
     (SQ-GW7).
5. Hesper: she can be taken to Nan Wicket and the Cobbes (`hesper_safe`), or left at the inn. In Act II she's in
   Gullhaven, working in the Milk House (`hesper_safe` false) or a fishwife (`hesper_safe` true): a short meeting.
- **Rewards**: 150 xp; the bounty; the pack.

## MQ04 — Three Roads
- **Starts**: MQ02 and MQ03 done. **Where**: the inn, then Hob's Tower (1400, 3000). **Level** 4. **Time** 30 min.
1. Three messages in one evening: the **Regent's summons** (sealed with the grey heron; Pell's report reached
   Kingsmere); the **Lantern's** (Cuthwin wrote; Odalys answers: *"Send the unsworn one to the Abbey."*); the
   **Greenhood's** (a wren feather and birch bark under the door: *"The Hollow Oak. Come alone. — W."*; if `hanged`:
   *"You hanged one of mine. Come and explain it."*).
2. **Garrick**, late, the fire low, the second bottle: *"Three roads, and all of them want the crown, whatever they say.
   You know what a crown is, stranger? A ring of iron somebody else forged, that you can't take off."* He tells the
   public story of the Still Water, and says he was ill that night (`garrick_lied_once`). Elsa, from the stair, watches
   her father lie and knows it.
3. **Hob's Tower checkpoint**: **Sergeant Matthias Crow** reads the summons, spits, raises the bar: *"Kingsmere. Mind
   the Ditch when you get there: they'll sell you the white for a copper, and your boots for two."*
- **Rewards**: 100 xp; Garrick's **ferry token** (Hollowmere's ferries).

---

# Act I — *Three Claims* (~6.5 h)

The factions court the hero, in any order: Kingsmere (MQ05–06), the Abbey (MQ07–08), the Greenwood (MQ09–10). Then
MQ11 and MQ12. Each faction's first quest shows its best face; its second, its rot.

## MQ05 — The Regent's Court
- **Where**: Kingsmere, the gallows square, the Regent's Hall. **Level** 5. **Time** 45 min.
1. **Arrival**: a hanging in Gallows Square: three Barrowborn poppy-sellers, a boy among them, *"for trading in the
   Lantern's mercy without licence"*. The crowd jeers the grey-eyes. **Old Grey Edda**, at the back, sings under her
   breath. (Seeds SQ-HM10.)
2. **The Hall**: the steward **Benedikt Orme** keeps the hero waiting an hour (explore).
3. **Corvin** in his study, gloved; an oath-iron key on the desk: *"Pick it up."* The hero does. He flinches as if the
   cold were in him. *"So it's true."* He offers the official Still Water story, and the Regent's Hand: *"I need someone
   the iron doesn't hate. I'll pay what that's worth, which is a great deal."* If asked about the hanging: *"The trade
   kills more than the dead do. I hang the sellers so I don't have to bury the buyers."* (He taxes it. The hero doesn't
   know yet.)
4. **Aldous** bursts in, eager (*"Is it true you — "*); Corvin sends him out. (SQ-HM3.)
5. **Sabeline** in the corridor, fan half open: *"If the Regent disappoints you, I'm two doors down. Carrow pays in gold,
   not in sums."* (Romance beat 1 for a Sly answer.)
- **Rewards**: 80 xp; the **Regency writ**.

## MQ06 — The Tax Cart
- **Giver**: Corvin. **Where**: Reedby → the Lake Road → the Weeping Willows (1800, 2350). **Level** 6. **Time** 50 min.
1. Escort Reedby's tax cart with two herons and the clerk **Hiram Bose**. The widow **Hester Cole** holds the cart's
   wheel: her children's grain is on it. The guards drag her off; Hiram looks at his shoes.
2. At the Weeping Willows, **Pip Tanner** and six Greenhood archers: *"The grain goes back where it came from. Nobody
   needs to bleed for a reeve's arithmetic."*
3. **The turn**: in the fight or the talk, a sack splits: under the top layer of grain, sealed crates of **grave-poppy
   milk**, stamped with the Lantern's lantern and the Regency's heron. Hiram, white: *"I didn't load it. I just sign."*
   Pip's eyes go to the crates, not the grain: the Greenhood came for the poppy, not the bread.
4. Choice (`mq06_cart`; each with its argument):
   - **Defend the cart** (`defended`): order is order; the poppy's "the Regent's business". Regency +15, Greenhood
     -15, Reedby -1. Corvin, later, about the crates: *"Medicine, for Carrow's hospitals. The Vale's only export that
     isn't sorrow."*
   - **Give it to the Greenhood** (`given`): the grain to Reedby, the poppy to Wren's sellers. Greenhood +15, Regency
     -15, Reedby +1. The poppy will be sold in the Ditch (SQ-HM10 later: a dead child in the Ditch had it from a hood).
   - **The grain to Reedby, the poppy into the lake** (Hard or Blunt; `drowned_poppy`): nobody profits. Regency -10,
     Greenhood -10, Reedby +2. Pip laughs despite himself: *"Wren's going to hate you. I don't."*
   - **The middle way** (needs Brindleford ≥ +1 or Greenhood ≥ 20): half the grain back, the poppy to Kingsmere, Hiram
     writes "lost" (`split`): Regency -5, Greenhood +5, Reedby +2; Hiram owes the hero (SQ-HM5).
- **Rewards**: 160 xp; 60 silver (defended) or a **wren token** (given, split).
- **Journal**: *"Under the Reedby grain: poppy-milk, with the Regent's heron on the seal. The Regent hangs the sellers."*

## MQ07 — The Abbey on the Moor
- **Giver**: Odalys's letter. **Where**: the Moor Road → Gorse Hollow (1050, 1150) → the Abbey (850, 800). **Level** 7.
  **Time** 40 min.
1. The Moor Road: heather, mist, standing stones, a grey hound pack. **Gorse Hollow**: the Barrowborn peat-cutters load
   the Abbey's tithe; the children have grey eyes and no shoes.
2. **The Abbey**: walls, the great lantern burning on its tower. Below the walls, the **poppy terraces**: the Order's own
   cemetery, white with grave-poppy, novices in cloth masks bleeding the heads into cups. The knights drilling in the
   yard; **Odalys** holds out an oath-iron reliquary; her gauntlet frosts; the hero takes it bare-handed.
3. **Anselm** in the chapter house, kind, curious, a smell of cloves. He explains the Oath (the Vale's version) and the
   terraces (*"The dead give us their last mercy. We give it to the dying."*). *"The pieces will come to you. Iron finds
   the hands that can hold it."*
4. Night in the guest cell: a novice, **Bryn**, at the door, whispering, then fleeing when a knight passes (SQ-LM1).
   Somewhere under the floor, someone singing in a language no one speaks.
- **Rewards**: 80 xp; Lantern +5; a **lantern charm**.

## MQ08 — Cairnfold
- **Giver**: Odalys. **Where**: Cairnfold ruin and crypt (550, 1250). **Level** 8. **Time** 65 min.
1. Cairnfold's crypt has broken open; three knights went in. **Odalys** comes (companion: mace, a heal once).
2. **The ruin**: Cairnfold's burned barrow-halls, black stone and fused bones in the walls, skeleton archers on the ring
   wall. A Barrowborn carving under the soot (a woman with a lantern, and a man setting fire to a door): Odalys doesn't
   see it, or doesn't look. The hero can (`cairnfold_carving`: lore).
3. **The crypt**: oath-iron seals that only the hero can open; Odalys makes the hero go first and guards their back;
   she prays over every dead she breaks.
4. **The Listener**: in a side chamber, a dead novice, a girl, eyes sewn shut with black thread, a wax tablet in her lap
   covered in barrow-tongue words scratched blind, poppy-cups round her, sent in alone *"to listen"* by the Lector's
   order (a sealed note). Odalys has never seen this. She goes very still. *"There must be a reason."* (She'll keep
   saying it, quieter each time, all game.)
5. The three knights: two dead; **Brother Aedric** alive behind a fallen ward (`aedric_alive`).
6. **Abbess Wynfrith** (crypt lord, level 9): dying, she whispers: *"Anselm... he makes them listen... the dead don't
   sleep, child, they *listen*... he's teaching them a new prayer..."* Odalys hears only "Anselm". Telling her the whole
   warning, now or later, is a choice (`told_odalys_wynfrith`; romance beat).
- **Rewards**: 220 xp; Lantern +15; Odalys's **knight's mace** or 80 silver.

## MQ09 — The Hood in the Wood
- **Giver**: the birch-bark note. **Where**: Thornbeck → Oakhallow → the Hollow Oak (3600, 1100). **Level** 7.
  **Time** 45 min.
1. **Thornbeck**: Captain Ilse Varrow warns the hero off the deep wood. A burned barn at the village's edge, black
   beams, a child's shoe in the ash, still laced: *"The hoods did that,"* says a soldier. *"Burned the Fellowes alive for
   talking to us."* (SQ-GW8.)
2. **Oakhallow**: the villagers won't say where the camp is (unless wren token, Greenhood ≥ 20, or SQ-GW3's first
   step).
3. The trail of wren carvings; a lynx's den; **Kestrel** (12), Wren's scout, drops from a tree with a knife.
4. **The Hollow Oak**: children, the wounded, a hanging larder, a crate of poppy-milk being cut into vials by two
   hoods who stop when they see the hero. **Wren**, bow half drawn. Her greeting depends on `bv_red_hen`
   (`hesper_judged`: *"I heard a woman took Brannoc's head off with his own cleaver. I'd like to buy her a drink."*).
5. Wren on the crown: *"Kings are bandits who got there first. Find the pieces and throw them in the sea."* On the
   poppy, if asked: *"Arrows cost money. Bread costs money. I sell the Lantern's poison back to the Regent's town and
   buy both. Judge me when you've fed forty people through a winter."* Then the test: **MQ10**.
- **Rewards**: 80 xp; Greenhood +5; romance beat 1.

## MQ10 — Bread and Arrows
- **Giver**: Wren. **Where**: Thornbeck's tithe barn (3020, 2280). **Level** 8. **Time** 55 min.
1. Oakhallow starves; the garrison's winter grain sits in Thornbeck's barn behind an oath-iron lock. Wren wants the
   hero to open it during a night raid.
2. **Scouting Thornbeck**: Varrow's men are hungry too, three of them boys from Oakhallow pressed into the levy. One,
   **Col Fell**, is headman Aldred's grandson.
3. Choice (`mq10_raid`):
   - **Open the barn for Wren** (`raided`): the hero holds the gate; the choice to fight to kill or to stun is the
     hero's (`raid_blood` if any soldier dies; if Col Fell dies, Oakhallow learns its grain was bought with its own
     boy). Greenhood +20, Regency -20, Oakhallow +2 (or -1 with Col dead), Thornbeck -2.
   - **Warn Varrow** (`warned`): the raid walks into an ambush. Pip is taken; two hoods die; Wren, at the camp later,
     puts an arrow through the hero's shoulder (a scripted wound) and lets them go: *"Because Kit's father would be dead
     already if I didn't need you. Get out of my wood."* Regency +20, Greenhood -30.
   - **Make Varrow share** (needs SQ-GW2 done, or SQ-GW1 `both`, or Regency ≥ 20 and Greenhood ≥ 20) (`shared`): Varrow
     opens the barn to Oakhallow "for the winter's peace" and is reprimanded by Kingsmere. Regency -5, Greenhood +10,
     Thornbeck +1, Oakhallow +2.
- **Rewards**: 220 xp; a Greenhood **longbow** or 80 silver.

## MQ11 — What the Ferryman Saw
- **Starts**: MQ05, MQ07 and MQ09 done. **Where**: Brindleford (Elsa sends word). **Level** 9. **Time** 35 min.
1. Elsa: her father hasn't been sober in a week; he's been sleeping by the river; he called her Rhosyn.
2. Garrick at the river bank at night, a bottle, his feet in the water. Half a confession: three on the boat besides
   himself and two more: *"The king. The chancellor, now Regent. The little princess. The Chamberlain. Lady Rhosyn."*
   He says Rhosyn's name and stops. *"The crown broke on my rowlock, three ways. I heard one piece hit the water. Ask the
   lake. The lake knows everything I did."*
3. Choice: **press him** (Hard; he breaks, weeping, says nothing more: `garrick_pressed`, Brindleford -1) or **sit with
   him** till he sleeps, and take the bottle (`garrick_spared`).
- **Rewards**: 60 xp; the ferry token opens the isle.

## MQ12 — Still Water
- **Where**: Reedby's ferry → the Drowned Chantry isle (2050, 1950). **Level** 10. **Time** 75 min.
1. **Agnes Lark** rows the hero out at dusk: *"Seven years, and I never once rowed this way. The water's wrong here.
   Too still."*
2. The isle: the drowned chapel; the royal ferry's wreck beached in the reeds where no current could carry it. Its
   oath-iron rowlock, scarred.
3. **The Drowned Chantry** (flooded halls, level 9–10): the drowned courtiers' ghosts, skeletons from the water, a hall
   crossed on tomb-tops.
4. **The vision**: the ghosts play the night in light on the black water, in pieces the hero must walk between (each
   piece a lit tableau): the king drunk, striking; *two* men struggling; one going over; a gloved hand on the gunwale,
   a boot on an oar; a girl in the water; a woman diving after her; a ferryman rowing **away** while two people call his
   name; then, far off, the boat turning back for one.
5. **Lord Osbert Hale**, the Drowned Chamberlain (crypt lord, level 11): he dove after the king. Laid to rest (Rite of
   Rest) or beaten, he speaks: *"He rowed away from us. Garrick. He rowed away. I don't blame him. I would have. Tell
   Rhosyn — no. She's here. She's always here."* And: *"The lake goes under the hills to the sea, at Gullmouth. The king
   went with the water. His iron too."*
- **Rewards**: 300 xp; the **Chamberlain's signet** (Kingsmere's old water-gate).
- **Journal**: *"The lake showed me the Still Water: a gloved hand held the oar down while the king drowned, and Garrick
  rowed away from two drowning people. Then turned back for one. The iron went to the sea, at Gullmouth."*
- **Act I ends.** The Barrows' fringe opens: from Elderwick, the White Fields can be seen, white as snow in summer.
