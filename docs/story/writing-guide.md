# Writing Guide

How Hollowcrown is written. Every quest, line and scene follows this.

## Rating and ambition
- **PEGI 18.** The Vale is a cruel place: massacres, torture, plague, addiction, sexual exploitation, the abuse of
  power, grief. The game shows what these do to people.
- **The bar is The Witcher 3's storytelling**: quests that are short stories, characters with their own lives, choices
  without clean answers whose consequences arrive late, monsters that are tragedies, humour that makes the dark land.
  **Nothing is borrowed**: no plot, character, creature, place or line is lifted or lightly reskinned from The Witcher
  or any other work. If a scene reminds a reader of a famous one, rewrite it until it doesn't.

## Tone: grim, with warmth and humour
- For every crypt, a drinking song. Kind people exist and are rarely rewarded for it; their kindness is the point.
- Humour is dry, character-born, never winking at the player: a smith who answers in one word; a reeve with a hat
  too young for him; a dog that finds every corpse.
- Horror is specific and quiet. Not "a pile of bodies" but "a child's shoe in the ash, still laced".

## Themes, and the rules for them
| Theme | Allowed | Rules |
|---|---|---|
| **Violence, war crimes, massacres** | Shown | Never glorified. Every atrocity has a perpetrator with reasons, and survivors who remember. |
| **Torture and body horror** | Shown | Plague, mutilation, the undead's decay, the Listeners. Shown to disturb, not to titillate; the camera can cut away at the worst. |
| **Drugs and addiction** | Shown | Grave-poppy ([grave-poppy.md](grave-poppy.md)). Addicts are people, not jokes or monsters. Getting clean is hard and can fail. |
| **Sex** | Shown tastefully | Romance scenes fade at the explicit moment: undressing, an embrace, the morning after. Brothels, sex work and desire are part of the world, written with dignity for the workers. Always between adults; always consenting on screen. |
| **Sexual violence** | Implied, **never shown** | Only in pasts and consequences (Sigrun's "marriage", a captive in the Red Hen camp, a girl running from her uncle). Never on screen, never described in detail, never a joke, never a reward, never used to motivate the hero cheaply. Survivors have voices and choices. |
| **Children** | As victims of the world (famine, plague, war), never of sexual content | No child is ever sexualised, in any way. Aldous is 17: never a romance. |
| **Cruelty to animals** | Sparingly | Never played for laughs. |

## The hero's voice
The hero is player-made but **has a voice**: a wry, weary outsider. They've seen other kingdoms rot; they're not
shocked, they're tired. They're observant, dry, quietly decent or quietly hard depending on the player. They never
monologue. They never explain the joke.

Every dialogue choice is labelled with a **tone**, and the hero says the line written for it:

| Tone | What it does | Example (Garrick asks why they came to the Vale) |
|---|---|---|
| **Kind** | warm, honest, generous | "Somebody told me it was beautiful. They were right, so far." |
| **Hard** | cold, demanding, threatening | "That's my business. The room's yours to sell; sell it." |
| **Sly** | deflecting, joking, manipulative | "The beer. I heard it was terrible. I had to know." |
| **Blunt** | plain truth, no softening | "Nowhere else would have me." |

Some choices are **actions** in brackets: *[Give him the coin]*, *[Draw your blade]*, *[Leave]*. Lines that use
something the hero knows are marked: *[Edric's letter] "Your king wrote to his daughter the night before. Want to
hear it?"*. Timed choices (5 seconds) are rare and only in confrontations.

The hero's backstory is never fixed. When an NPC asks, the player answers; the game remembers (`hero_reason`) and
NPCs quote it back.

## How quests are built
1. **A short story with a turn.** Every side quest has at least one moment where what it seemed to be is not what it
   is (the thief is a hungry child; the monster is a grieving mother; the victim is the villain's accomplice).
2. **Investigate, don't follow arrows.** Tracks, smells, letters, contradictions in testimony. The hero reasons aloud,
   in their voice.
3. **Choices without a right answer.** Each option has a real argument and a real cost. The game never tells the
   player which was good.
4. **Delayed consequences.** At least a third of side-quest choices pay off (or bite) later: a letter in Act II, a face
   at the siege, a line in the epilogue.
5. **Monsters are people's stories.** A contract's monster has a cause: grief, a crime, a broken ward, greed. Ending it
   by understanding it is usually possible and usually costs something.
6. **No fetch quests without a story.** If the hero carries three things, each one says something.
7. **Places remember.** Villages change after quests: a burned house, a new song at the inn, a grave with flowers.

## Dialogue style
- Short lines. People interrupt, deflect, lie, change the subject.
- Every speaker has a tic of speech: Garrick's water sayings, Tobin's single words, Wren's insults that are
  compliments, Corvin's sums, Odalys's drill-yard bluntness, Sabeline's questions, Maelis's herb metaphors.
- No exposition dumps. Lore comes in pieces: a carving, a drunk's story, a ghost's last sentence.
- Swearing is the Vale's own: *"Barrow-blight!"*, *"Hrathgar's teeth"*, *"go and drown"*, *"poppy-eyed"*,
  *"lantern-licker"* (for the Order's lackeys), *"heron"* (for Regency men), and the ordinary old words too.

## Words of the Vale
| Word | Meaning |
|---|---|
| **sworn** / **unsworn** | born under the Oath / not |
| **oath-iron** | barrow iron forged by the Lantern; burns the sworn |
| **the Barrowborn** | descendants of Hrathgar's hill-folk; an underclass |
| **grave-poppy**, **milk**, **the white** | the drug |
| **poppy-eyed**, **a sleeper** | an addict (they sleep on graves) |
| **herons** | Regency soldiers (from the grey heron badge) |
| **hoods** | the Greenhood |
| **lanterns**, **lantern-lickers** | the Order, its toadies |
| **the Still Water** | the night the king drowned |
| **the Wet Years** | the famine, 12 to 9 years ago |
