// What roams Brindle Vale outside the scripted fights (docs/story/regions/brindle-vale.md, "Enemies"): each encounter
// a creature kind (src/creatures' ids) at a level, how many, where (round a tile, or anywhere in an area), and when
// (hours of the day, story flags). Used by the encounters' spawning (gameplay).

import type { Point } from '@voxel/engine/world';

export interface Encounter {
  id: string;
  note: string;
  foe: string; // a creature id (src/creatures)
  leader?: string; // a pack's or flock's leader, one of them
  level: number;
  count: number;
  where: { at: Point; radius: number } | { area: string };
  hours?: [number, number]; // from, until (wrapping past midnight): when it's there; none: all day
  after?: string; // a quest done, or 'flag:value', before it appears
  until?: string; // ...after which it's gone
  unless?: string; // 'flag:value': never, if that's so
  hostile?: 'always' | 'if-disturbed'; // (none: always)
  respawnDays?: number; // back after killed, in days; none: never
}

export const BRINDLE_VALE_ENCOUNTERS: Encounter[] = [
  // The Birchwood.
  { id: 'birchwood-wolves', note: 'two wolves on a dead mule at the Birchwood\'s edge (MQ01\'s first fight)', foe: 'wolf', level: 1, count: 2, where: { at: [650, 3420], radius: 6 }, until: 'MQ01' },
  { id: 'birchwood-boar-west', note: 'a boar rooting at the Birchwood\'s west edge', foe: 'boar', level: 2, count: 1, where: { at: [470, 3470], radius: 12 }, respawnDays: 5 },
  { id: 'birchwood-boar-east', note: 'a boar at the Birchwood\'s east edge, above the river', foe: 'boar', level: 2, count: 1, where: { at: [790, 3560], radius: 12 }, respawnDays: 5 },
  { id: 'birchwood-boar-south', note: 'a boar at the Birchwood\'s south edge, toward the marsh', foe: 'boar', level: 2, count: 1, where: { at: [560, 3745], radius: 12 }, respawnDays: 5 },

  // Mosshill: two wolf packs on its slopes.
  { id: 'mosshill-pack-west', note: "a wolf pack on Mosshill's west slope, above the shepherds' track", foe: 'wolf', leader: 'alphaWolf', level: 3, count: 3, where: { at: [1215, 3590], radius: 15 }, respawnDays: 7 },
  { id: 'mosshill-pack-south', note: "a wolf pack on Mosshill's south slope", foe: 'wolf', leader: 'alphaWolf', level: 3, count: 3, where: { at: [1300, 3760], radius: 15 }, respawnDays: 7 },

  // Carrion rooks at dusk, where the hanged were.
  { id: 'gibbet-rooks', note: "a flock of carrion rooks on the Pilgrim Road's gibbet", foe: 'rook', leader: 'rookLeader', level: 2, count: 12, where: { at: [700, 3380], radius: 8 }, hours: [18, 21], respawnDays: 3 },
  { id: 'hanging-oak-rooks', note: 'a flock of carrion rooks in the Hanging Oak', foe: 'rook', leader: 'rookLeader', level: 2, count: 12, where: { at: [1000, 3480], radius: 8 }, hours: [18, 21], respawnDays: 3 },

  // Chapel Hill.
  { id: 'chapel-hill-hungry', note: 'the Hungry, wandering Chapel Hill at night', foe: 'hungry', level: 2, count: 2, where: { at: [1080, 3200], radius: 30 }, hours: [21, 5], after: 'MQ01', until: 'MQ02', unless: 'famine_pit:blessed', respawnDays: 1 },
  { id: 'famine-pit-hollowed', note: 'Jory and two sleepers, cutting poppy on the famine pit; they only fight if stopped', foe: 'hollowed', level: 3, count: 3, where: { at: [1090, 3200], radius: 4 }, hours: [22, 4], after: 'MQ02', unless: 'bv_flour:jory_weaned', hostile: 'if-disturbed', respawnDays: 1 },

  // The Southern Marsh.
  { id: 'marsh-ghost', note: 'a ghost drifting over the Southern Marsh', foe: 'ghost', level: 3, count: 1, where: { area: 'southern-marsh' }, hours: [20, 5] },
  { id: 'marsh-cairn-skeleton', note: 'a skeleton warrior guarding the Marsh Cairn and its chest', foe: 'skeleton', level: 4, count: 1, where: { at: [762, 3826], radius: 3 } },
];
