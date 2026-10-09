# Hollowcrown

A dark medieval open-world RPG in chunky voxels. Rated PEGI 18.

Seven years ago the king of the Vale drowned on a calm night, and the Hollow Crown was found broken in three. Since
then no one has been crowned, the Regent taxes a drug he hangs men for selling, and the dead stir a little more each
year. You come over the western mountains on the pilgrim road, a stranger, into Brindle Vale.

## Playable now

This is an early build. You can walk the world and talk to its people, but quests can't be played through yet and
there's no combat.

- Brindle Vale, drawn by hand: roads, the river, marsh, low swells in the meadows and woods, Chapel Hill and Mosshill.
- Brindleford: its 20 buildings, which you can't walk through, plus footpaths, kitchen gardens, ploughed strips and a duck pond.
- The Birchwood, Brindle Woods and the Mosshill pines are full of trees, and you can't walk through their trunks. The
  hay and clover meadows are in bloom.
- Brindleford's 27 villagers, each with their own model. They stroll round their doors by day and stand at them by night.
- Talk: press E by a villager. A visual-novel screen opens, with your portraits face to face and their first words.
- Wolves and boars roam the edges of the Birchwood.
- Day and night: the game starts at dusk, and a full day takes 24 minutes. The time of day shows in the top-right corner.
- The quest tracker under the clock shows the first quest, The Stranger at the Ford, and what to do now.
- On-screen names: the region's name fades in as you enter it, and the place you're near shows in the top-left corner.
- The map of the Vale (M), with regions, places and your arrow.
- A pause menu (Esc) that lists the controls.
- The model viewer at `/models.html` shows the creatures, Brindleford's buildings and folk, and the trees.

## Running it

You need Node.js and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). The model viewer is at `/models.html`. Add `?only=` to its
URL to show only some of the models.

## Controls

| Key | Action |
|---|---|
| WASD or the arrow keys | Walk |
| Shift (held) | Sprint |
| E | Talk to a villager nearby, and move a conversation on |
| 1-9 or a click | Pick a reply in a conversation |
| M | Open or close the map (mouse wheel or + and - to zoom) |
| Esc | Pause menu, or close the map |

## Scripts

Run these from the repo root.

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server for the game |
| `npm run build` | Type-check both packages, then build the game |
| `npm run typecheck` | Type-check the engine and the game |
| `npm test` | Run the test suite (Vitest) |
| `npm run preview` | Serve the production build |

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
