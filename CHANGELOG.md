# Changelog

All notable changes to Hollowcrown are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### 2026-10-09

#### Added
- A 4096-tile land and a hero who walks it with WASD, on chunked grass ground.
- The story bible: the world, its characters, the main quest, side quests, endings, romances, grave-poppy, a bestiary of 23 enemy types, and a writing guide. Rated PEGI 18.
- Creature models for the Vale, viewable in the model viewer (`/models.html`, with `?only=` to show a subset).
- A hand-drawn world map with Brindle Vale in it: roads, the river and marsh, all on terrain surfaces. You start at the Pilgrim's Shrine, and water blocks your way.
- Brindleford's layout and ten households, plus its 20 buildings built from a voxel kit of walls, roofs, doors, windows and chimneys, with props, fixtures and a turning mill wheel. They appear in the world and in the model viewer.
- Solid buildings: walls and fixtures stop you, and you slide along them.
- Footpaths, kitchen gardens, the Cobbes' ploughed strips and a duck pond in Brindleford.
- Low swells in Brindle Vale's meadows and woods. Chapel Hill and Mosshill are drawn as leaning, ringed hills.
- Day and night: the game starts at dusk, and a full day takes 24 minutes.
- On-screen names: the region's name fades in large as you enter it, with its levels beneath, and the named place you're near (Brindleford, the Pilgrim's Shrine) shows in the top-left corner.
- Brindleford's villagers, who stroll round their doors by day and stand at them by night. Old Meg sits on her stool and Kit is child-sized. Garrick Fenn the innkeeper and other folk are in the model viewer.
- Wolves and boars that roam the Birchwood's edges.
- Hold Shift to sprint. The hero's stride quickens with the pace.
- Oak, birch and pine trees, three shapes each, in the model viewer.
- Engine: a reusable `@voxel/engine` package (ECS, rendering, voxels, chunked terrain, human and creature rigs, a world-map loader, collision, wandering, a day-night clock, and interaction with E), plus a UI kit with an overlay, a fading banner, corner labels, a key prompt and a dialogue box.

#### Changed
- The enemy models were reworked so the flesh horrors have their own silhouettes and the factions are easier to tell apart.
- Terrain meshes are lighter (greedy meshing), and models are placed and animated without allocating anything per frame.

#### Fixed
- A banner that is hidden before its first frame now stays hidden.

#### Tests
- Unit, snapshot and boundary tests for the engine and the game. QA suites cover codebase rules, reachability of every place in Brindle Vale, day-and-night continuity and world-build performance budgets.
