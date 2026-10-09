// The Bellwarden's Tomb (docs/story/main-quest-1.md, MQ02; docs/story/regions/brindle-vale.md): under the Chapel of
// the Quiet Bell, down the stair behind the oath-iron grate. Three halls, each lower: the Ossuary, its walls built of
// the parish's bones; the Bell Hall, where the ringers' ghosts still pull at nothing, a pit across it and a rope bridge
// over; the Warden's Rest, Sir Hamund on his sarcophagus with the bell's tongue in his fist. After MQ02, quiet, or
// three skeletons every three days if Hamund was destroyed. Used by the dungeons' loading (engine) and MQ02.

import { NORTH, SOUTH } from '../world/kinds';
import type { Dungeon } from './kinds';

export const BELLWARDENS_TOMB: Dungeon = {
  id: 'bellwardens-tomb',
  name: "The Bellwarden's Tomb",
  place: 'bellwardens-tomb',
  size: { width: 64, depth: 64 },
  entrance: { room: 'the-stair', at: [31, 3], facing: SOUTH },
  rooms: [
    { id: 'the-stair', name: 'The stair', rect: [29, 2, 34, 8], tier: 6 },
    { id: 'ossuary', name: 'The Ossuary', rect: [20, 10, 43, 25], tier: 5 },
    { id: 'bell-hall', name: 'The Bell Hall', rect: [12, 27, 51, 45], tier: 4 },
    { id: 'wardens-rest', name: "The Warden's Rest", rect: [22, 47, 41, 61], tier: 3 },
  ],
  doors: [
    { from: 'the-stair', to: 'ossuary', at: [31, 9], kind: 'stairs' },
    { from: 'ossuary', to: 'bell-hall', at: [31, 26], kind: 'stairs' },
    { from: 'bell-hall', to: 'wardens-rest', at: [31, 46], kind: 'stairs' },
  ],
  features: [
    // The Ossuary: skulls stacked to the vault, a bone pile in each corner.
    { id: 'ossuary-bones-nw', kind: 'bones', at: [21, 11] },
    { id: 'ossuary-bones-ne', kind: 'bones', at: [42, 11] },
    { id: 'ossuary-bones-sw', kind: 'bones', at: [21, 24] },
    { id: 'ossuary-bones-se', kind: 'bones', at: [42, 24] },
    { id: 'ossuary-torch', kind: 'torch', at: [31, 12] },
    // The Bell Hall: the pit across its middle, east to west; one rope bridge over; the old practice bell; the niche
    // with the Bellwarden's page (MQ02).
    { id: 'bell-hall-pit', kind: 'pit', at: [31, 36], props: { size: [40, 5] } },
    { id: 'bell-hall-bridge', kind: 'rope-bridge', at: [31, 36], facing: SOUTH, props: { length: 7, width: 2 } },
    { id: 'practice-bell', kind: 'bell', at: [18, 31] },
    { id: 'page-niche', kind: 'niche', at: [50, 42], facing: NORTH, props: { holds: "the Bellwarden's page" } },
    // The Warden's Rest: Hamund's sarcophagus, his feet to the door; an altar behind.
    { id: 'hamund-sarcophagus', kind: 'sarcophagus', at: [31, 55], facing: NORTH },
    { id: 'wardens-altar', kind: 'altar', at: [31, 60], facing: NORTH },
  ],
  spawns: [
    { foe: 'skeleton', at: [26, 18], count: 2, level: 2 },
    { foe: 'bell-ringer ghost', at: [24, 41], count: 2, level: 2 },
    { foe: 'bell-ringer ghost', at: [40, 31], count: 1, level: 3 },
    { foe: 'Sir Hamund', at: [31, 54], count: 1, level: 3, boss: true },
    { foe: 'skeleton', at: [31, 18], count: 3, level: 3, when: 'hamund:destroyed' }, // every three days, after MQ02
  ],
};
