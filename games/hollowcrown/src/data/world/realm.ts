// The whole realm's frame (docs/story/world.md, "The map"): its eight regions, the mountains round it, the sea on the
// west, Hollowmere's lake, and every town, village, dungeon and camp the story names, where it says. Each region's own
// file draws its land in detail over this.

import type { AreaData } from '@voxel/engine/world';
import { EAST, SOUTH, WEST, type ValePart } from './kinds';

const region = (id: string, name: string, rect: [number, number, number, number], levels: [number, number]): AreaData => ({
  id, kind: 'region', name, shape: { rect }, props: { levels },
});

// Mountains (rock, high): the Cold Spine north, the Carrow Teeth east, the Sorrow Hills south, crags west of the coast.
const MOUNTAINS: Array<{ note: string; rect: [number, number, number, number] }> = [
  { note: 'the Cold Spine', rect: [0, 0, 4095, 149] },
  { note: 'the Carrow Teeth', rect: [3950, 0, 4095, 4095] },
  { note: 'the Sorrow Hills', rect: [0, 3901, 4095, 4095] },
  { note: 'the west crags, north of the coast', rect: [0, 0, 299, 1399] },
  { note: 'the west crags, south of the coast', rect: [0, 2901, 299, 4095] },
];

// Hollowmere: the great lake at the realm's heart, Kingsmere on its southern shore.
const LAKE: Array<[number, number]> = [
  [1650, 1700], [1900, 1600], [2250, 1650], [2450, 1850], [2400, 2150], [2200, 2350], [1900, 2350], [1700, 2200], [1620, 1950],
];

export const REALM: ValePart = {
  land: [
    ...MOUNTAINS.map(({ note, rect }) => ({ note, shape: { rect }, tier: 8 })),
    { note: 'the sea', shape: { rect: [0, 1400, 159, 2900] }, tier: 0 },
    { note: 'Hollowmere', shape: { polygon: LAKE }, tier: 0 },
    { note: 'the Drowned Chantry isle', shape: { circle: [2050, 1950, 28] }, tier: 1 },
  ],
  surfaces: [
    ...MOUNTAINS.map(({ note, rect }) => ({ note, shape: { rect }, surface: 'rock' as const })),
    { note: 'the sea', shape: { rect: [0, 1400, 159, 2900] }, surface: 'water' },
    { note: 'the beach', shape: { rect: [160, 1400, 175, 2900] }, surface: 'sand' },
    { note: 'Hollowmere', shape: { polygon: LAKE }, surface: 'water' },
    { note: 'the Drowned Chantry isle', shape: { circle: [2050, 1950, 28] }, surface: 'sand' },
    { note: 'the Sunken Hall, in the reeds', shape: { circle: [1700, 1750, 24] }, surface: 'marsh' },
  ],
  areas: [
    region('brindle-vale', 'Brindle Vale', [350, 2900, 1450, 3900], [1, 4]),
    region('middle-downs', 'Middle Downs', [1450, 2700, 2600, 3800], [4, 8]),
    region('hollowmere', 'Hollowmere', [1450, 1400, 2750, 2700], [4, 8]),
    region('lantern-moors', 'Lantern Moors', [300, 300, 1450, 1500], [6, 11]),
    region('greenwood', 'Greenwood', [2800, 700, 3950, 2600], [6, 11]),
    region('southfields', 'Southfields', [2600, 2700, 3900, 3900], [8, 12]),
    region('saltreach', 'Saltreach Coast', [0, 1400, 750, 2900], [9, 13]),
    region('the-barrows', 'The Barrows', [1450, 150, 3000, 1400], [12, 18]),
    { id: 'white-fields', kind: 'farm', name: 'The White Fields', shape: { rect: [1700, 800, 2700, 1100] } },
  ],
  places: [
    // Middle Downs
    { id: 'old-toll-bridge', kind: 'ruin', name: 'Old Toll Bridge', at: [1900, 3000] },
    // Hollowmere
    { id: 'kingsmere', kind: 'town', name: 'Kingsmere', at: [2100, 2550] },
    { id: 'reedby', kind: 'village', name: 'Reedby', at: [1550, 2050] },
    { id: 'elderwick', kind: 'village', name: 'Elderwick', at: [2600, 1600] },
    { id: 'drowned-chantry', kind: 'crypt', name: 'The Drowned Chantry', at: [2050, 1950], facing: SOUTH },
    { id: 'sunken-hall', kind: 'ruin', name: 'The Sunken Hall', at: [1700, 1750] },
    { id: 'weed-rats', kind: 'camp', name: 'The Weed Rats', at: [1700, 2400] },
    // Lantern Moors
    { id: 'abbey', kind: 'keep', name: 'The Abbey of the Last Lantern', at: [850, 800] },
    { id: 'abbey-undercroft', kind: 'crypt', name: 'The Abbey Undercroft', at: [850, 800], facing: SOUTH },
    { id: 'gorse-hollow', kind: 'village', name: 'Gorse Hollow', at: [1050, 1150] },
    { id: 'cairnfold', kind: 'ruin', name: 'Cairnfold', at: [550, 1250] },
    { id: 'cairnfold-crypt', kind: 'crypt', name: 'Cairnfold Crypt', at: [550, 1250], facing: EAST },
    // Greenwood
    { id: 'oakhallow', kind: 'village', name: 'Oakhallow', at: [3200, 1500] },
    { id: 'thornbeck', kind: 'village', name: 'Thornbeck', at: [3000, 2300] },
    { id: 'fellowe-barn', kind: 'ruin', name: "The Fellowes' barn", at: [3060, 2330] },
    { id: 'hollow-oak', kind: 'camp', name: 'The Hollow Oak', at: [3600, 1100] },
    { id: 'sour-apple', kind: 'camp', name: 'The Sour Apple', at: [3300, 2000] },
    { id: 'spinners-deep', kind: 'cave', name: "Spinner's Deep", at: [3700, 1900], facing: WEST },
    { id: 'hunters-barrow', kind: 'crypt', name: "Hunter's Barrow", at: [3400, 800], facing: SOUTH },
    // Southfields
    { id: 'millbrook', kind: 'village', name: 'Millbrook', at: [3000, 3300] },
    { id: 'larkspur', kind: 'village', name: 'Larkspur', at: [3500, 3100] },
    { id: 'larkspur-barrow', kind: 'crypt', name: 'Larkspur Barrow', at: [3650, 3350], facing: WEST },
    { id: 'deserters', kind: 'camp', name: 'The Deserters', at: [3300, 3700] },
    // Saltreach Coast
    { id: 'gullhaven', kind: 'town', name: 'Gullhaven', at: [320, 2150] },
    { id: 'saltcombe', kind: 'village', name: 'Saltcombe', at: [400, 2700] },
    { id: 'gullmouth', kind: 'cave', name: 'Gullmouth Sea Cave', at: [200, 1750], facing: WEST },
    { id: 'wreckers-hole', kind: 'cave', name: "Wrecker's Hole", at: [250, 2500], facing: WEST },
    { id: 'wreckers', kind: 'camp', name: 'The Wreckers', at: [300, 2420] },
    { id: 'gull-light', kind: 'ruin', name: 'Gull Light', at: [180, 2000] },
    // The Barrows
    { id: 'watchers-crypt', kind: 'crypt', name: "The Watchers' Crypt", at: [2250, 1050], facing: SOUTH },
    { id: 'great-barrow', kind: 'crypt', name: 'The Great Barrow', at: [2250, 450], facing: SOUTH },
    { id: 'grave-robbers', kind: 'camp', name: 'The Grave-robbers', at: [1800, 900] },
  ],
};
