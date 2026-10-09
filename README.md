# Hollowcrown

A dark medieval open-world RPG in chunky voxels. Rated PEGI 18.

Seven years ago the king of the Vale drowned on a calm night, and the Hollow Crown was found broken in three. Since
then no one has been crowned, the Regent taxes a drug he hangs men for selling, and the dead stir a little more each
year. You come over the western mountains on the pilgrim road, a stranger, into Brindle Vale.

## Playable now

This is an early build, but the opening of the story plays from start to finish.

- **The story so far:** you arrive at the Pilgrim's Shrine as a robbed stranger. MQ01 (The Stranger at the Ford) plays
  through to its midnight fight and dawn at the well. MQ02 to MQ04 follow, and the side quests start when you meet the
  people who give them.
- **Combat:** strike with Space, and take the rusty knife from the shrine's bowl. The wolves of the Birchwood, the Red
  Hen band and the walking dead fight back. Foes show health bars and damage numbers. If you die, you can rise again
  at your last rest or at the shrine.
- **Talking:** press E by a villager to open a visual-novel screen with portraits, replies and choices. Villagers' names
  float over their heads, and they call out to you as you pass.
- **Brindle Vale, drawn by hand:** Brindleford's 20 buildings, Tallow Green and its chandlery, roads, the river and
  marsh, hedgerows, farms and fields, forests, blooming meadows, and ground cover over all the land.
  The ground is gently uneven, and the camera zooms through five levels.
- **Life:** Brindleford's and Tallow Green's villagers stroll, fidget and keep to their doors. 23 kinds of wildlife
  roam by ground and hour, including deer, sheep, foxes, rabbits, birds, butterflies and frogs.
- **Day and night:** the game starts at dusk, and a full day takes 24 minutes. Sleep at the Ferryman's Rest (ask
  Garrick) to pass the night and heal.
- **Sound:** footsteps, blows and snarls, plus birds, crickets, owls, wind and the river through the day.
- **Screens:** the map (M), the journal (J), and the pause menu (Esc) with Save, Load, Sound and Controls. The game
  autosaves on quest steps, when you sleep and every two minutes.
- **On-screen:** region and place names, the time of day, the quest tracker, notices, your health bar, and a debug
  overlay in development.
- **Model viewer:** `/models.html` shows the creatures, Brindleford's buildings and folk, and the trees.

## Running it

You need Node.js and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). The model viewer is at `/models.html`. Add `?only=` to its
URL to show only some of the models.

In development, these URL options are available:

| Option | What it does |
|---|---|
| `?at=x,z` | Start on that tile (ignored if the tile can't be walked on) |
| `?time=h` | Start at that hour (0 to 24) |
| `?bot` | The bot plays the game, with a badge saying what it's doing |
| `?speed=n` | Run the bot's game n times faster (0.25 to 50, default 10) |

`npm run bot` does the same in a Chromium window you can watch. It reuses the dev server if one is running and
otherwise starts it.

## Controls

| Key | Action |
|---|---|
| WASD or the arrow keys | Walk |
| Shift (held) | Sprint |
| Space | Attack |
| E | Talk to a villager nearby, and move a conversation on (Enter also works) |
| 1-9 or a click | Pick a reply in a conversation |
| M | Open or close the map |
| J | Open or close the journal |
| N | Mute or unmute the sound |
| Esc | Pause menu (Save, Load, Sound, Controls), or close a screen |
| Mouse wheel | Zoom the camera, or zoom the map when it's open (+ and - also work on the map) |

## Scripts

Run these from the repo root.

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server for the game |
| `npm run build` | Type-check both packages, then build the game |
| `npm run typecheck` | Type-check the engine and the game |
| `npm test` | Run the test suite (Vitest) |
| `npm run preview` | Serve the production build |
| `npm run bot` | Watch the bot play the game in a Chromium window |

## Repo layout

```
packages/engine/       @voxel/engine, a reusable voxel engine with no Hollowcrown content
games/hollowcrown/     the game
  src/data/            world map, people, hero: the game's content as data
  src/creatures/       creature models
  src/people/          villager and NPC models
  src/buildings/       building models
  src/nature/          trees and plants
  src/features/        one file per feature, installed from features/index.ts
  src/systems/         game-specific systems
  docs/story/          the story bible: world, characters, quests, regions
```

Games import the engine only through its public entry points: `@voxel/engine/ecs`, `math`, `voxel`, `models`,
`characters`, `structures`, `world`, `render`, `gameplay`, `input`, `app`, `tools` and `ui`.

## How it's built

The engine and the game are kept apart. The engine is an ECS (a world of entities and components, with systems that
run in input, simulate and present stages), and it knows nothing about Hollowcrown. Boundary tests check that it
stays that way. The game is mostly data: the 4096x4096-tile world is drawn by hand, not generated. Each feature
installs itself from its own file in `src/features/`.

Hollowcrown is made by a small studio of AI agents. Each one owns its own area (engine, gameplay, characters,
environment, UI, design, QA, docs) and works on its own branch, and a director reviews and merges every change into
`main`.
