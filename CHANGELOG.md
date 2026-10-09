# Changelog

All notable changes to Hollowcrown are listed here, one entry per update merged into `main`, newest first. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### 2026-10-09 21:54 — Side quest: Honey and Wax

[`4add7e8`](https://github.com/MysteriousSeal/HollowCrown/commit/4add7e8) · Design

SQ-BV3, Honey and Wax, is written as quest data. It isn't playable yet.

### 2026-10-09 21:54 — Side quest: Kit's Father

[`ea07c64`](https://github.com/MysteriousSeal/HollowCrown/commit/ea07c64) · Design

SQ-BV2, Kit's Father, is written as quest data. It isn't playable yet.

### 2026-10-09 21:53 — Side quest: The Flour Thief

[`472a9a1`](https://github.com/MysteriousSeal/HollowCrown/commit/472a9a1) · Design

SQ-BV1, The Flour Thief, is written as quest data. It isn't playable yet.

### 2026-10-09 21:53 — Chunk timing tests made optional

[`84d4a9b`](https://github.com/MysteriousSeal/HollowCrown/commit/84d4a9b) · Director

Tests: chunk build timings run only when asked for. The streaming logic is always tested.

### 2026-10-09 21:53 — Esc pauses the game

[`84eb8e9`](https://github.com/MysteriousSeal/HollowCrown/commit/84eb8e9) · UI

Esc pauses the game behind a menu with Resume and a Controls page that lists the keys. Opening the map pauses it too.

### 2026-10-09 21:52 — Two villager models found missing

[`f6e85fc`](https://github.com/MysteriousSeal/HollowCrown/commit/f6e85fc) · QA

A test showed that Tamsin's and Wynn's models never appeared in the game.

### 2026-10-09 21:52 — The land is gently uneven

[`7f43ea0`](https://github.com/MysteriousSeal/HollowCrown/commit/7f43ea0) · Design

The world bible now says the land is gently uneven everywhere, while roads, paths, squares and floors stay level.

### 2026-10-09 21:52 — Meadow cost at the start

[`3ccb6f4`](https://github.com/MysteriousSeal/HollowCrown/commit/3ccb6f4) · QA

A test showed that growing the meadows slows the start of the game.

### 2026-10-09 21:51 — Menus

[`d5d398b`](https://github.com/MysteriousSeal/HollowCrown/commit/d5d398b) · UI

The engine's UI kit gains menus: a framed list of choices, and a page of keys with a way back.

### 2026-10-09 21:51 — Lighter meadow flowers

[`f372f71`](https://github.com/MysteriousSeal/HollowCrown/commit/f372f71) · Environment

The meadow flowers cost less to draw, and tests now hold plants to a budget.

### 2026-10-09 21:51 — Pause

[`5a8020e`](https://github.com/MysteriousSeal/HollowCrown/commit/5a8020e) · Engine

The game and its clock can stop while the scene is still drawn. Keys are let go when you pause or switch windows.

### 2026-10-09 21:51 — The quest tracker

[`4df2bbf`](https://github.com/MysteriousSeal/HollowCrown/commit/4df2bbf) · UI

Under the clock, the top-right corner shows the quest you're following: its name, its stage and what to do now.

### 2026-10-09 21:51 — Forest cost at the start

[`c6fe49d`](https://github.com/MysteriousSeal/HollowCrown/commit/c6fe49d) · QA

Tests time fresh map chunks. One test showed that the trees add 300 to 600 ms to the start.

### 2026-10-09 21:51 — Four more villagers appear in game

[`df819b9`](https://github.com/MysteriousSeal/HollowCrown/commit/df819b9) · Characters

Tamsin Reede, Wynn Tidy, Cob Fletcher and Gert Hollin now appear in the world as themselves.

### 2026-10-09 21:50 — Meadows in bloom

[`c2f111f`](https://github.com/MysteriousSeal/HollowCrown/commit/c2f111f) · Environment

The hay and clover meadows have grass, poppies, cornflowers, daisies and buttercups.

### 2026-10-09 21:50 — No more hitches on new chunks

[`6145598`](https://github.com/MysteriousSeal/HollowCrown/commit/6145598) · Engine

Chunks build a step at a time within each frame's budget, so walking no longer stutters as new ground loads.

### 2026-10-09 21:50 — Reachability through the forests

[`7b2811d`](https://github.com/MysteriousSeal/HollowCrown/commit/7b2811d) · QA

Tests: every place can still be reached with the trees' trunks in the way.

### 2026-10-09 21:50 — Press E to talk

[`dc354cb`](https://github.com/MysteriousSeal/HollowCrown/commit/dc354cb) · Gameplay

Press E by a villager to talk. Your portraits face each other and they say their first words.

### 2026-10-09 21:50 — The Fletchers and the Hollins

[`a361674`](https://github.com/MysteriousSeal/HollowCrown/commit/a361674) · Characters

Alys Fletcher with her longbow, one-handed Cob, Bran Hollin with his eel trap, and Gert.

### 2026-10-09 21:49 — The map

[`6491f5d`](https://github.com/MysteriousSeal/HollowCrown/commit/6491f5d) · UI

M opens the map of the Vale, with roads, rivers and marsh, named regions, places marked by kind and your arrow. Zoom with the mouse wheel or + and -.

### 2026-10-09 21:49 — README's playable list refreshed

[`5465fb8`](https://github.com/MysteriousSeal/HollowCrown/commit/5465fb8) · Docs

The README now lists trees, the villagers' models and the clock, and says that talking is coming next.

### 2026-10-09 21:49 — One changelog entry per update

[`c1637e7`](https://github.com/MysteriousSeal/HollowCrown/commit/c1637e7) · Docs

The changelog now has one entry per update, newest first, each linked to its commit.

### 2026-10-09 21:48 — The Vale's dressing as data

[`c96c9ae`](https://github.com/MysteriousSeal/HollowCrown/commit/c96c9ae) · Design

Fences round the Cobbes' strips and the gardens, hay ricks, the gibbet, the Nine Sisters and the Hanging Oak are placed as data.

### 2026-10-09 21:48 — Sibyl, Gammer, Simkin and Ned

[`9dbbbe0`](https://github.com/MysteriousSeal/HollowCrown/commit/9dbbbe0) · Characters

Sibyl Hask in her own weaving, Gammer and Simkin Orr bent over their sticks, and Ned Tolley the drover.

### 2026-10-09 21:48 — Doors test re-enabled

[`2159522`](https://github.com/MysteriousSeal/HollowCrown/commit/2159522) · QA

Tests: every household stands at its drawn door.

### 2026-10-09 21:48 — Wat is away

[`1ee4031`](https://github.com/MysteriousSeal/HollowCrown/commit/1ee4031) · Gameplay

Wat is away from the smithy until his quest.

### 2026-10-09 21:48 — The engine's map kit

[`1856134`](https://github.com/MysteriousSeal/HollowCrown/commit/1856134) · UI

A small world map drawn once, and a map screen with names, marks and the hero's arrow.

### 2026-10-09 21:48 — Quest places reachable

[`bb4c738`](https://github.com/MysteriousSeal/HollowCrown/commit/bb4c738) · QA

Tests: every quest objective and every stop in a villager's day can be reached from the shrine.

### 2026-10-09 21:47 — The Reedes, Joan Lusk and the Tidys

[`ca00e9f`](https://github.com/MysteriousSeal/HollowCrown/commit/ca00e9f) · Characters

Rolf Reede with his reed bundle, Tamsin, Joan Lusk the carter, Edric Tidy with his crook and Wynn with her cup of milk.

### 2026-10-09 21:47 — Households stand at their real doors

[`4b5f83f`](https://github.com/MysteriousSeal/HollowCrown/commit/4b5f83f) · Gameplay

Every household now gathers at its own house's drawn door.

### 2026-10-09 21:47 — Trees fill the woods

[`9f8a13e`](https://github.com/MysteriousSeal/HollowCrown/commit/9f8a13e) · Environment

The Birchwood, Brindle Woods and the Mosshill pines are full of trees, and their trunks block your way.

### 2026-10-09 21:46 — Every model has a villager

[`e00a6c7`](https://github.com/MysteriousSeal/HollowCrown/commit/e00a6c7) · QA

Tests: each person's model belongs to a resident, and anyone who sits can sit.

### 2026-10-09 21:46 — Old Meg, Hob, Ada and Wenna

[`be91053`](https://github.com/MysteriousSeal/HollowCrown/commit/be91053) · Characters

Old Meg in widow's black, Hob Cobbe with his hayfork, Ada Cobbe and young Wenna join the model viewer.

### 2026-10-09 21:46 — The first quest as data

[`455895d`](https://github.com/MysteriousSeal/HollowCrown/commit/455895d) · Design

MQ01, The Stranger at the Ford, is written as quest data with stages, objectives, choices and places. It isn't playable yet.

### 2026-10-09 21:46 — Talking holds a villager still

[`054535b`](https://github.com/MysteriousSeal/HollowCrown/commit/054535b) · Gameplay

Groundwork for conversations: a villager you talk to stops, and the two of you turn to face each other.

### 2026-10-09 21:45 — Households by their doors

[`f7fe04c`](https://github.com/MysteriousSeal/HollowCrown/commit/f7fe04c) · QA

Tests: each household stands by its own house's door.

### 2026-10-09 21:45 — Dunstan, Jory and Kit

[`261abd8`](https://github.com/MysteriousSeal/HollowCrown/commit/261abd8) · Characters

Dunstan the floury miller, Jory pale with blue lips, and Kit small and barefoot in rags join the model viewer.

### 2026-10-09 21:45 — Buildings build faster

[`6236707`](https://github.com/MysteriousSeal/HollowCrown/commit/6236707) · Engine

Lit and glowing faces are meshed in one pass, so buildings build faster.

### 2026-10-09 21:45 — Villagers find the real door

[`e3343d7`](https://github.com/MysteriousSeal/HollowCrown/commit/e3343d7) · Environment

Villagers stand by the spot where each building's drawn door opens.

### 2026-10-09 21:45 — The talk prompt

[`6e6a9ea`](https://github.com/MysteriousSeal/HollowCrown/commit/6e6a9ea) · UI

Near someone you can talk to, "E · Talk" shows low in the middle of the screen.

### 2026-10-09 21:44 — Brindleford's 27 villagers written as data

[`c3ec871`](https://github.com/MysteriousSeal/HollowCrown/commit/c3ec871) · Design

Every villager now has a home, a job, a daily routine, first words and passing remarks, ready for when you can talk to them.

### 2026-10-09 21:44 — Villagers through a day

[`86d0efb`](https://github.com/MysteriousSeal/HollowCrown/commit/86d0efb) · QA

Tests: over a day on the real map, villagers never end up indoors and are all home at dusk.

### 2026-10-09 21:44 — Conversations can offer replies

[`962a177`](https://github.com/MysteriousSeal/HollowCrown/commit/962a177) · UI

A line in a conversation can offer replies, which you pick with a click or the keys 1 to 9.

### 2026-10-09 21:44 — Tobin the smith, Wat his apprentice and Nan Wicket

[`35ae569`](https://github.com/MysteriousSeal/HollowCrown/commit/35ae569) · Characters

Tobin Harrow the smith with his hammer, Wat his apprentice, and Nan Wicket bent over her stick join the model viewer.

### 2026-10-09 21:44 — Villagers wear their own models

[`0fed099`](https://github.com/MysteriousSeal/HollowCrown/commit/0fed099) · Gameplay

Villagers who have a finished model now appear in the world as themselves.

### 2026-10-09 21:44 — Brindleford builds faster

[`f97a26e`](https://github.com/MysteriousSeal/HollowCrown/commit/f97a26e) · Environment

Houses that look alike share one build, so Brindleford's chunks load several times faster.

### 2026-10-09 21:44 — Characters turn to face each other

[`b67558b`](https://github.com/MysteriousSeal/HollowCrown/commit/b67558b) · Engine

An entity can turn smoothly to face another.

### 2026-10-09 21:44 — Conversation lines written out letter by letter

[`54251c8`](https://github.com/MysteriousSeal/HollowCrown/commit/54251c8) · UI

Lines appear letter by letter. Press E or click to finish a line or move on.

### 2026-10-09 21:43 — A changelog

[`9ca5666`](https://github.com/MysteriousSeal/HollowCrown/commit/9ca5666) · Docs

The first version of this changelog.

### 2026-10-09 21:43 — Elsa the cook, Odo the reeve and Father Cuthwin

[`f793355`](https://github.com/MysteriousSeal/HollowCrown/commit/f793355) · Characters

Elsa Fenn the cook, Odo Pell the reeve in heron-grey, and Father Cuthwin with his lantern join the model viewer.

### 2026-10-09 21:43 — A README

[`93c557b`](https://github.com/MysteriousSeal/HollowCrown/commit/93c557b) · Docs

The repo now has a README with the premise, what's playable, how to run it, the controls and the layout.

### 2026-10-09 21:43 — Banner tests re-enabled

[`1fcc34f`](https://github.com/MysteriousSeal/HollowCrown/commit/1fcc34f) · QA

The banner fix holds, and its tests run again.

### 2026-10-09 21:43 — Portraits for dialogue

[`707a56a`](https://github.com/MysteriousSeal/HollowCrown/commit/707a56a) · Engine

Any model can be drawn alone on its own canvas, for portraits in conversations.

### 2026-10-09 21:43 — Village layout checks

[`2a7c9a9`](https://github.com/MysteriousSeal/HollowCrown/commit/2a7c9a9) · QA

Tests: nothing is built on gardens, fields or the pond, and every villager and animal can be reached from the shrine.

### 2026-10-09 21:43 — The speaker stands forward in conversations

[`f3e5aba`](https://github.com/MysteriousSeal/HollowCrown/commit/f3e5aba) · UI

The one speaking steps forward and is lit, and the other is dimmed.

### 2026-10-09 21:42 — Wolves and boars roam the Birchwood

[`80149e1`](https://github.com/MysteriousSeal/HollowCrown/commit/80149e1) · Gameplay

The wolves and boars now wander along the Birchwood's edges instead of standing still.

### 2026-10-09 21:42 — A conversation screen

[`7a76197`](https://github.com/MysteriousSeal/HollowCrown/commit/7a76197) · UI

The scene dims and two portraits face each other with name plates, with the lines between them.

### 2026-10-09 21:42 — Villagers stroll round their doors by day

[`563231f`](https://github.com/MysteriousSeal/HollowCrown/commit/563231f) · Gameplay

Villagers wander near their doors during the day and stand at them at night.

### 2026-10-09 21:42 — Brindleford folk in the model viewer

[`8432bea`](https://github.com/MysteriousSeal/HollowCrown/commit/8432bea) · Characters

The model viewer now has villagers, starting with Garrick Fenn the innkeeper.

### 2026-10-09 21:41 — Day and night checked minute by minute

[`b87eb53`](https://github.com/MysteriousSeal/HollowCrown/commit/b87eb53) · QA

Tests: the light changes smoothly through a full day, with no jumps.

### 2026-10-09 21:41 — Performance tests made optional

[`7772bbd`](https://github.com/MysteriousSeal/HollowCrown/commit/7772bbd) · QA

Performance budgets run only when asked for, so they don't fail on a busy machine.

### 2026-10-09 21:41 — The time of day on screen

[`1dca200`](https://github.com/MysteriousSeal/HollowCrown/commit/1dca200) · UI

The top-right corner shows the time of day, for example "Dusk · 17:40".

### 2026-10-09 21:41 — Rolling ground and two hills

[`a554685`](https://github.com/MysteriousSeal/HollowCrown/commit/a554685) · Design

Brindle Vale's meadows and woods rise in low swells, and Chapel Hill and Mosshill are drawn as leaning, ringed hills.

### 2026-10-09 21:41 — Interaction with E

[`2fc10e2`](https://github.com/MysteriousSeal/HollowCrown/commit/2fc10e2) · Engine

The engine finds the nearest usable thing in reach and lets you use it with E. Nothing in the game answers it yet.

### 2026-10-09 21:41 — Hold Shift to sprint

[`957ba1b`](https://github.com/MysteriousSeal/HollowCrown/commit/957ba1b) · Gameplay

Hold Shift to run. The hero's stride quickens with the pace.

### 2026-10-09 21:40 — Place names in the corner

[`88c8ad0`](https://github.com/MysteriousSeal/HollowCrown/commit/88c8ad0) · UI

When you're near a named place, such as Brindleford or the Pilgrim's Shrine, its name shows in the top-left corner.

### 2026-10-09 21:40 — Oak, birch and pine trees

[`6cd4d3e`](https://github.com/MysteriousSeal/HollowCrown/commit/6cd4d3e) · Environment

Three shapes of each tree are in the model viewer.

### 2026-10-09 21:40 — Hidden banners stay hidden

[`b3cd43d`](https://github.com/MysteriousSeal/HollowCrown/commit/b3cd43d) · UI

Fixed: a banner hidden before its first frame no longer appears.

### 2026-10-09 21:40 — Wandering

[`de39c9c`](https://github.com/MysteriousSeal/HollowCrown/commit/de39c9c) · Engine

Entities can idle round a home spot and stroll within a radius, pausing as they go.

### 2026-10-09 21:39 — Banner tests

[`c2163e6`](https://github.com/MysteriousSeal/HollowCrown/commit/c2163e6) · QA

Tests for the UI kit's banner, including two that showed it could stay up after being hidden.

### 2026-10-09 21:39 — The region's name fades in

[`1cc0114`](https://github.com/MysteriousSeal/HollowCrown/commit/1cc0114) · UI

As you enter a region its name fades in large, with its levels beneath. BRINDLE VALE shows at the start.

### 2026-10-09 21:39 — Day and night in the Vale

[`dec4706`](https://github.com/MysteriousSeal/HollowCrown/commit/dec4706) · Director

The game starts at dusk, and a full day takes 24 minutes.

### 2026-10-09 21:39 — Wolves and boars in the Birchwood

[`a2c13f1`](https://github.com/MysteriousSeal/HollowCrown/commit/a2c13f1) · Gameplay

Two wolves stand at the Birchwood's north edge and three boars at its edges.

### 2026-10-09 21:39 — Brindleford's paths, gardens and pond

[`75aabd9`](https://github.com/MysteriousSeal/HollowCrown/commit/75aabd9) · Design

Footpaths, kitchen gardens, the Cobbes' ploughed strips and a duck pond are drawn in.

### 2026-10-09 21:39 — A day-night clock

[`d46e7ff`](https://github.com/MysteriousSeal/HollowCrown/commit/d46e7ff) · Engine

The world's light runs from dawn through day to a dark blue night.

### 2026-10-09 21:39 — World-build performance budget

[`3b3dcbc`](https://github.com/MysteriousSeal/HollowCrown/commit/3b3dcbc) · QA

Tests time how long the map, the terrain and Brindleford's busiest area take to build.

### 2026-10-09 21:38 — Villagers outside their doors

[`682d17f`](https://github.com/MysteriousSeal/HollowCrown/commit/682d17f) · Gameplay

Brindleford's villagers stand outside their homes. Old Meg sits on her stool and Kit is child-sized.

### 2026-10-09 21:38 — Tests skip the studio's worktrees

[`8e52f35`](https://github.com/MysteriousSeal/HollowCrown/commit/8e52f35) · Director

Repo housekeeping.

### 2026-10-09 21:38 — The engine's UI kit

[`cc34f37`](https://github.com/MysteriousSeal/HollowCrown/commit/cc34f37) · UI

An overlay over the game with a fading banner, corner labels, a key prompt and a dialogue box.

### 2026-10-09 21:38 — Brindle Vale reachability

[`28200d2`](https://github.com/MysteriousSeal/HollowCrown/commit/28200d2) · QA

Tests: every place can be walked to from the Pilgrim's Shrine.

### 2026-10-09 21:37 — Ignore the studio's worktrees

[`ca26912`](https://github.com/MysteriousSeal/HollowCrown/commit/ca26912) · Director

Repo housekeeping.

### 2026-10-09 21:37 — UI kit entry point

[`9e52ef6`](https://github.com/MysteriousSeal/HollowCrown/commit/9e52ef6) · Engine

Games can import the engine's UI kit.

### 2026-10-09 21:37 — Codebase rules

[`527e6f1`](https://github.com/MysteriousSeal/HollowCrown/commit/527e6f1) · QA

Tests check file length, keep game content out of the engine, check that features are installed, and catch stray console.log calls.

### 2026-10-09 21:34 — Features install themselves

[`7c22a73`](https://github.com/MysteriousSeal/HollowCrown/commit/7c22a73) · Director

Each game feature lives in its own file and is installed from one list.

### 2026-10-09 21:30 — Collision tests

[`ad1792b`](https://github.com/MysteriousSeal/HollowCrown/commit/ad1792b) · Director

Tests for obstacles, sliding along walls, and Brindleford's walls and doorways.

### 2026-10-09 21:30 — Walls stop you

[`b365cde`](https://github.com/MysteriousSeal/HollowCrown/commit/b365cde) · Director

You can no longer walk through walls. You slide along them instead.

### 2026-10-09 21:30 — Buildings are solid

[`90abec3`](https://github.com/MysteriousSeal/HollowCrown/commit/90abec3) · Director

Brindleford's walls and fixtures block movement, sized to each body.

### 2026-10-09 21:27 — Building tests

[`5313024`](https://github.com/MysteriousSeal/HollowCrown/commit/5313024) · Director

Tests for the building kit, footprints, the triangle budget and the mill wheel.

### 2026-10-09 21:27 — Buildings in the world

[`48d84ca`](https://github.com/MysteriousSeal/HollowCrown/commit/48d84ca) · Director

Buildings stream into the world as you move, and the model viewer lists them.

### 2026-10-09 21:27 — Brindleford's buildings

[`82d91bb`](https://github.com/MysteriousSeal/HollowCrown/commit/82d91bb) · Director

A voxel kit of walls, roofs, doors, windows and chimneys builds Brindleford's 20 buildings, with props, fixtures and a turning mill wheel.

### 2026-10-09 21:17 — Ignore runtime state

[`9ce7dcd`](https://github.com/MysteriousSeal/HollowCrown/commit/9ce7dcd) · Director

Repo housekeeping.

### 2026-10-09 21:16 — Village placement tests

[`a27a392`](https://github.com/MysteriousSeal/HollowCrown/commit/a27a392) · Director

Tests: buildings sit on dry ground, apart from each other, and every door can be reached.

### 2026-10-09 21:16 — Brindleford's layout and households

[`f08647e`](https://github.com/MysteriousSeal/HollowCrown/commit/f08647e) · Director

The story bible describes Brindleford's layout and its ten households.

### 2026-10-09 21:16 — Brindleford placed on the map

[`0249b5a`](https://github.com/MysteriousSeal/HollowCrown/commit/0249b5a) · Director

The village's buildings are placed with their footprints, doors and residents, and the roads are kept clear of them.

### 2026-10-09 21:11 — World map tests

[`4f50149`](https://github.com/MysteriousSeal/HollowCrown/commit/4f50149) · Director

Tests for the map loader, sliding along shores and the Vale's geography.

### 2026-10-09 21:11 — Start at the Pilgrim's Shrine

[`c27c10c`](https://github.com/MysteriousSeal/HollowCrown/commit/c27c10c) · Director

The Vale map loads, you start at the Pilgrim's Shrine, and water blocks your way.

### 2026-10-09 21:11 — Roads, river and marsh

[`7d8d11c`](https://github.com/MysteriousSeal/HollowCrown/commit/7d8d11c) · Director

The ground now shows its surfaces: water, roads and marsh.

### 2026-10-09 21:11 — A hand-drawn world map

[`66a7d19`](https://github.com/MysteriousSeal/HollowCrown/commit/66a7d19) · Director

The world is drawn by hand and loaded a chunk at a time. Brindle Vale is the first region.

### 2026-10-09 21:02 — Engine and model tests

[`b48b92e`](https://github.com/MysteriousSeal/HollowCrown/commit/b48b92e) · Director

Tests for voxels, math, the world, movement, models and creature snapshots, and a check that the engine and game stay separate.

### 2026-10-09 21:02 — Smoother animation

[`e8c2395`](https://github.com/MysteriousSeal/HollowCrown/commit/e8c2395) · Director

Models are placed, turned and animated without allocating anything new each frame.

### 2026-10-09 21:02 — Lighter terrain

[`b42bf60`](https://github.com/MysteriousSeal/HollowCrown/commit/b42bf60) · Director

All drawn things share one model base, and terrain uses fewer triangles.

### 2026-10-09 21:02 — Engine groundwork

[`510f63f`](https://github.com/MysteriousSeal/HollowCrown/commit/510f63f) · Director

Faster entity queries, a math module and the hero's gait data.

### 2026-10-09 21:02 — Engine entry points

[`6dd8978`](https://github.com/MysteriousSeal/HollowCrown/commit/6dd8978) · Director

The game uses the engine only through its public entry points.

### 2026-10-09 20:46 — Model viewer filter

[`527e79c`](https://github.com/MysteriousSeal/HollowCrown/commit/527e79c) · Director

Add ?only= to /models.html to show some of the models.

### 2026-10-09 20:46 — Reworked enemy models

[`921cbc6`](https://github.com/MysteriousSeal/HollowCrown/commit/921cbc6) · Director

The flesh horrors have their own silhouettes, and the factions are easier to tell apart.

### 2026-10-09 20:35 — The bestiary

[`5672c65`](https://github.com/MysteriousSeal/HollowCrown/commit/5672c65) · Director

The story bible moves into the game, with a bestiary of 23 enemy types.

### 2026-10-09 20:35 — ECS tests

[`8632a56`](https://github.com/MysteriousSeal/HollowCrown/commit/8632a56) · Director

Tests for the engine's core.

### 2026-10-09 20:35 — The game boots on the engine

[`574f47f`](https://github.com/MysteriousSeal/HollowCrown/commit/574f47f) · Director

The game and the model viewer now run on the engine's app loop.

### 2026-10-09 20:35 — Creature models

[`c457048`](https://github.com/MysteriousSeal/HollowCrown/commit/c457048) · Director

The Vale's creatures are modelled, and the engine draws voxels, chunked terrain and rigged bodies.

### 2026-10-09 20:35 — The engine's core

[`35551a5`](https://github.com/MysteriousSeal/HollowCrown/commit/35551a5) · Director

A reusable engine with movement and terrain, and Hollowcrown's world and hero as data.

### 2026-10-09 20:35 — Engine and game split

[`870ac5e`](https://github.com/MysteriousSeal/HollowCrown/commit/870ac5e) · Director

The repo is split into the reusable @voxel/engine and the Hollowcrown game.

### 2026-10-09 20:01 — The story, rewritten for PEGI 18

[`03d8166`](https://github.com/MysteriousSeal/HollowCrown/commit/03d8166) · Director

A darker story bible with romances, grave-poppy and a writing guide.

### 2026-10-09 19:40 — The story bible

[`e43a9c2`](https://github.com/MysteriousSeal/HollowCrown/commit/e43a9c2) · Director

The world, its characters, the main quest, side quests and endings.

### 2026-10-09 19:40 — Walk with WASD

[`276d780`](https://github.com/MysteriousSeal/HollowCrown/commit/276d780) · Director

The hero walks with WASD.

### 2026-10-09 19:40 — Grass and a walking hero

[`8f0a019`](https://github.com/MysteriousSeal/HollowCrown/commit/8f0a019) · Director

Chunked grass ground and an animated hero.

### 2026-10-09 19:40 — A land to walk

[`55ed3ec`](https://github.com/MysteriousSeal/HollowCrown/commit/55ed3ec) · Director

A 4096-tile land of bare grass.

### 2026-10-09 19:40 — Project setup

[`9733676`](https://github.com/MysteriousSeal/HollowCrown/commit/9733676) · Director

Vite and TypeScript.

### 2026-10-09 19:06 — Voxel-art guide

[`33f68ff`](https://github.com/MysteriousSeal/HollowCrown/commit/33f68ff) · Director

A voxel-art reference for the studio's artists.

### 2026-10-09 18:55 — Ignore local settings

[`c0e813b`](https://github.com/MysteriousSeal/HollowCrown/commit/c0e813b) · Director

Repo housekeeping.

### 2026-10-09 18:54 — First commit

[`b11512d`](https://github.com/MysteriousSeal/HollowCrown/commit/b11512d) · Director

The repository is created.
