// A draugr (the barrow-dead: Hrathgar's people in their iron,
// and the peat's bog-bodies) on the human rig's joints and in its parts' sizes, drawn a
// little bigger than a man, dressed each its own way (draugrLook: four
// headgear, three beards, three garbs, an axe or a long sword). Palette first:
// blackened flesh and its shade, ice-blue eyes (they glow), beards
// pale, grey and faded red, iron, blackened iron and rusted mail, worn
// leather, dark cloth, a hood's darker, fur and its lighter tips, a bright edge. Shapes for the
// camera's distance: a helm with a ridge and a nasal guard over a sunken face,
// the eyes lit in dark sockets, a long pale beard in a braid; mail over the
// chest and shoulders, a belt with its buckle, a ragged hem; withered
// forearms; legs wound in wrappings, dark boots. A big bearded axe in hand.

import type { BodyPart, Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, fillBox, setColor } from '@voxel/engine/voxel/voxelShapes';
import { BODIES } from '@voxel/engine/characters/human/bodyVoxels';
import { SHAMBLE, stamp, type FrameSpec } from '@voxel/engine/characters/creatures/frameRig';
import { box, wrap } from '@voxel/engine/characters/creatures/dress';
import type { Size } from '@voxel/engine/characters/creatures/creatureMesh';
import { hashUnit, oneOf } from '@voxel/engine/characters/creatures/creatureMesh';

// Blackened flesh (charcoal, its shade near black), cold eyes, pale/grey/red beards, barrow-iron dull grey-blue
// (and darker), its mail the same gone dull, leather, cloth, a bright edge; grey, red, blackened, fur, its tips, a
// hood; roots pale tan (and lighter), rushes.
export const DRAUGR_PALETTE = [
  0x2a2622, 0x1a1816, 0x8fe8ff, 0xc8c2b0, 0x5c6672, 0x3a424c, 0x4e5660, 0x3e2c1e, 0x2e2a2c, 0xc4ccd2,
  0x66665f, 0x8a5a3a, 0x2a2a30, 0x6a5a48, 0x8a7a64, 0x3a3240, 0x9a8a68, 0xbcae88, 0xb8a66a, 0x8a4e2c,
];
// A bog-draugr's: brown and leathery, tanned by the peat, a noose of twisted rushes at its neck.
export const BOG_PALETTE = DRAUGR_PALETTE.map((c, i) => [0x6a4a2c, 0x4a321e][i] ?? c);
const [ROOT, ROOT_LIGHT, RUSH, RUST] = [17, 18, 19, 20];
export const DRAUGR_GLOW: ReadonlySet<number> = new Set([3]); // its eyes (EYE)
const [FLESH, SHADE, EYE, PALE, IRON, IRON_DARK, MAIL, LEATHER, CLOTH, EDGE] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const [GREY, RED, BLACKENED, FUR, FUR_LIGHT, HOOD] = [11, 12, 13, 14, 15, 16];

// A draugr's look: what's on its head, its beard's colour, what it wears, what it carries.
export interface DraugrLook {
  head: 'helm' | 'cap' | 'hood' | 'bare';
  beard: number; // its colour (PALE, GREY, RED)
  garb: 'mail' | 'fur' | 'jerkin';
  sword: boolean; // a long sword, else the axe
  bog?: boolean; // out of the peat: no iron, a rush noose, roots and weed for armour
}
const HEADS: DraugrLook['head'][] = ['helm', 'cap', 'hood', 'bare'];
const BEARDS = [PALE, GREY, RED];
const GARBS: DraugrLook['garb'][] = ['mail', 'fur', 'jerkin'];

// Its look, from its id: the same every time it's seen, no two neighbours alike as often as not.
export function draugrLook(id: number): DraugrLook {
  const roll = (salt: number) => hashUnit(id, salt, 211);
  return {
    head: oneOf(HEADS, roll(1)),
    beard: oneOf(BEARDS, roll(2)),
    garb: oneOf(GARBS, roll(3)),
    sword: roll(4) < 0.35,
  };
}

// The head, its face toward +Z: sunken cheeks, glowing eyes in dark hollows, a beard under; and what's over it:
// a ridged helm with a nasal guard; an open cap with cheek guards; a hood drawn over, the face in its shadow;
// or nothing, the scalp withered, long braids down the back.
function head(g: VoxelGrid, look: DraugrLook): void {
  fillBox(g, 2, 1, 2, 8, 8, 9, FLESH);
  fillBox(g, 1, 3, 3, 9, 7, 8, FLESH);
  fillBox(g, 2, 2, 9, 8, 4, 9, SHADE); // the sunken cheeks
  fillBox(g, 2, 5, 9, 4, 6, 9, CLOTH); // the hollows
  fillBox(g, 6, 5, 9, 8, 6, 9, CLOTH);
  fillBox(g, 3, 5, 10, 3, 5, 10, EYE); // the eyes, glowing, out of them
  fillBox(g, 7, 5, 10, 7, 5, 10, EYE);
  if (look.head === 'helm') {
    fillBox(g, 1, 7, 1, 9, 9, 9, IRON);
    fillBox(g, 2, 10, 2, 8, 10, 8, IRON);
    fillBox(g, 5, 10, 1, 5, 10, 9, IRON_DARK); // its ridge
    fillBox(g, 1, 7, 1, 9, 7, 9, IRON_DARK); // its rim
    fillBox(g, 5, 3, 10, 5, 7, 10, IRON); // the nasal guard
  } else if (look.head === 'cap') {
    fillBox(g, 1, 8, 1, 9, 9, 9, IRON_DARK);
    fillBox(g, 2, 10, 2, 8, 10, 8, IRON);
    for (const x of [1, 9]) fillBox(g, x, 3, 6, x, 8, 9, IRON); // the cheek guards
    fillBox(g, 1, 8, 1, 9, 8, 1, IRON); // a band round the back
  } else if (look.head === 'hood') {
    fillBox(g, 1, 4, 1, 9, 10, 9, HOOD);
    fillBox(g, 0, 2, 0, 10, 8, 7, HOOD); // falling to the shoulders
    fillBox(g, 2, 9, 10, 8, 10, 10, HOOD); // its brow, over the face
    fillBox(g, 2, 5, 9, 8, 8, 9, CLOTH); // (the face in its shadow)
    fillBox(g, 3, 5, 10, 3, 5, 10, EYE); // (the eyes, glowing through)
    fillBox(g, 7, 5, 10, 7, 5, 10, EYE);
  } else {
    fillBox(g, 2, 9, 2, 8, 9, 8, SHADE); // the scalp, withered
    fillBox(g, 3, 10, 3, 7, 10, 7, SHADE);
    for (const x of [2, 8]) fillBox(g, x, 1, 1, x, 8, 1, look.beard); // the braids, down the back
    fillBox(g, 3, 8, 1, 7, 9, 1, look.beard);
  }
  // The beard: long, a braid down its middle.
  fillBox(g, 2, 0, 8, 8, 3, 10, look.beard);
  fillBox(g, 4, 0, 10, 6, 1, 10, SHADE);
  fillBox(g, 5, 0, 10, 5, 2, 10, look.beard);
}

// The chest: rusted mail; blackened mail under a fur mantle; or a leather jerkin, a dark tabard down its front.
// A belt and its buckle; a ragged hem.
function torso(g: VoxelGrid, look: DraugrLook): void {
  if (look.garb === 'jerkin') {
    fillBox(g, 0, 0, 0, 8, 8, 4, (_x, y) => (y % 3 === 0 ? CLOTH : LEATHER));
    fillBox(g, 3, 0, 4, 5, 8, 4, HOOD); // the tabard
    fillBox(g, 3, 0, 0, 5, 7, 0, HOOD);
  } else {
    const [a, b] = look.garb === 'fur' ? [BLACKENED, IRON_DARK] : [MAIL, IRON_DARK];
    fillBox(g, 0, 0, 0, 8, 8, 4, (x, y, z) => ((x + y + z) % 2 ? a : b));
  }
  for (let x = 0; x <= 8; x++) fillBox(g, x, 0, 0, x, Math.floor(hashUnit(x, 1, 191) * 2), 4, CLOTH); // (ragged)
  fillBox(g, 0, 2, 0, 8, 2, 4, LEATHER); // the belt
  fillBox(g, 4, 2, 4, 4, 2, 4, IRON); // its buckle
  if (look.garb === 'fur') fillBox(g, 0, 7, 0, 8, 8, 4, (x, _y, z) => ((x + z) % 3 ? FUR : FUR_LIGHT)); // the mantle over the shoulders
  else fillBox(g, 0, 8, 0, 8, 8, 4, look.garb === 'jerkin' ? LEATHER : MAIL);
}

const PARTS: Record<BodyPart, (g: VoxelGrid, look: DraugrLook) => void> = {
  head,
  torso,
  // An arm: its sleeve to the elbow (as it's dressed), a withered forearm, a grey hand.
  arm: (g, look) => {
    fillBox(g, 0, 5, 0, 2, 8, 2, look.garb === 'jerkin' ? LEATHER : look.garb === 'fur' ? BLACKENED : MAIL);
    if (look.garb === 'fur') fillBox(g, 0, 8, 0, 2, 8, 2, FUR);
    fillBox(g, 0, 1, 0, 2, 4, 2, FLESH);
    fillBox(g, 0, 2, 0, 2, 2, 2, SHADE); // (sinew)
    fillBox(g, 0, 0, 0, 2, 0, 2, SHADE); // the hand
  },
  // A leg: wound in wrappings, a dark boot, its toe forward.
  leg: (g) => {
    fillBox(g, 0, 2, 0, 3, 6, 3, (_x, y) => (y % 2 ? CLOTH : LEATHER));
    fillBox(g, 0, 0, 0, 3, 1, 4, LEATHER);
  },
};

// A root run: two voxels wide, laid over whatever is outermost along +Z (the chest) or +Y (the helm), from a to b.
function run(g: VoxelGrid, along: 'front' | 'top', a: [number, number], b: [number, number]): void {
  const [sx, sy, sz] = g.size;
  const steps = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 1);
  for (let s = 0; s <= steps; s++) for (const w of [0, 1]) {
    const u = Math.round(a[0] + ((b[0] - a[0]) * s) / steps) + w;
    const v = Math.round(a[1] + ((b[1] - a[1]) * s) / steps);
    const depth = along === 'front' ? sz : sy;
    for (let d = depth - 1; d >= 0; d--) {
      const [x, y, z] = along === 'front' ? [u, v, d] : [u, d, v];
      if (x < 0 || x >= sx || y < 0 || y >= sy || z < 0 || z >= sz || !g.cells[x + sx * (y + sy * z)]) continue;
      setColor(g, x, y, z, s % 3 === 0 ? ROOT_LIGHT : ROOT);
      break;
    }
  }
}

// Its bulk (drawn on the body's frame, then made huge): the chest deepened front and back, the arms thickened, and
// barrow-iron pauldrons on the shoulders, rusted at the rims; then roots grown through it all, pale runs across the
// chest and over the helm, up the legs.
function bulk(joint: Joint, g: VoxelGrid, o: Size, look: DraugrLook): void {
  const outer = joint.startsWith('right') ? -1 : 3;
  if (joint === 'torso') {
    wrap(g, o, (x, y, z) => (x >= 0 && x <= 8 && y >= 4 && y <= 8 && (z === -1 || z === 5) ? (look.bog ? LEATHER : (x + y) % 2 ? MAIL : IRON_DARK) : 0));
    run(g, 'front', [0, 1], [7, 8]);
    run(g, 'front', [7, 2], [3, 6]);
    if (look.bog) {
      box(g, o, 1, 8, 0, 7, 8, 4, (x, _y, z) => ((x + z) % 2 ? RUSH : ROOT_LIGHT)); // the noose's coil
      for (let y = 3; y <= 7; y++) box(g, o, 3 + (y % 2), y, 5, 3 + (y % 2), y, 5, RUSH); // its end, hanging down its front
    }
  } else if (joint.endsWith('Arm')) {
    wrap(g, o, (x, y) => (x !== (outer === -1 ? 3 : -1) && y >= 1 && y <= 8 ? (y >= 6 && !look.bog ? (y === 8 ? RUST : IRON) : FLESH) : 0));
    box(g, o, outer === -1 ? -1 : 2, 9, 0, outer === -1 ? 0 : 3, 9, 2, look.bog ? ROOT : IRON_DARK); // the pauldron's top
  } else if (joint === 'head') {
    if (look.head === 'helm' || look.head === 'cap') run(g, 'top', [2, 1], [7, 9]);
  } else {
    run(g, 'front', [0, 0], [3, 6]);
  }
}

// A draugr as it's dressed, as a frame: huge (drawn near half again a man), its blade in its right hand.
export function draugrFrame(look: DraugrLook): FrameSpec {
  return {
    palette: look.bog ? BOG_PALETTE : DRAUGR_PALETTE,
    pad: true,
    paint: (joint, g, o) => {
      const part = (joint.endsWith('Arm') ? 'arm' : joint.endsWith('Leg') ? 'leg' : joint) as BodyPart;
      const body = createGrid(BODIES.male.grid[part]);
      PARTS[part](body, look);
      stamp(g, body, o);
      bulk(joint, g, o, look);
    },
    glows: DRAUGR_GLOW,
    scale: look.bog ? 1.3 : 1.45,
    gait: { ...SHAMBLE, speed: 0.8, legSwing: 0.4, armSwing: 0.15, sway: 0.05, lean: 0.08 },
    held: { rightArm: look.sword ? { grid: longsword, grip: [3.5, 1, 4.5], turn: [-0.8, 0, 0] } : { grid: axe, grip: [1.5, 5.5, 2], turn: [-1.1, 0, 0] } },
  };
}
export const DRAUGR = draugrFrame({ head: 'helm', beard: GREY, garb: 'fur', sword: false });
export const BOG_DRAUGR = draugrFrame({ head: 'bare', beard: RED, garb: 'jerkin', sword: true, bog: true });

// A long sword, held forward (+Z) from the hand: a pommel, a bound grip, a crossguard, a long straight blade, bright along its edge.
function longsword(): VoxelGrid {
  const grid = createGrid([7, 2, 32]);
  fillBox(grid, 2, 0, 0, 4, 1, 1, IRON_DARK); // the pommel
  fillBox(grid, 3, 0, 2, 3, 1, 6, LEATHER); // the grip
  fillBox(grid, 3, 0, 3, 3, 1, 3, CLOTH); // (its binding)
  fillBox(grid, 0, 0, 7, 6, 1, 7, IRON); // the crossguard
  fillBox(grid, 2, 0, 8, 4, 1, 30, (x) => (x === 3 ? IRON : EDGE)); // the blade, its fuller down the middle
  fillBox(grid, 3, 0, 31, 3, 1, 31, EDGE); // the point
  return grid;
}

// The axe, held forward (+Z) from the hand: a long haft bound in leather, a bearded iron head far out, its edge bright.
function axe(): VoxelGrid {
  const grid = createGrid([3, 13, 30]);
  fillBox(grid, 1, 5, 0, 1, 6, 29, LEATHER); // the haft
  for (let z = 2; z <= 6; z += 2) fillBox(grid, 1, 5, z, 1, 6, z, CLOTH); // its binding
  // The head: up from the haft at its end, the beard sweeping down below, the edge along its front.
  for (let z = 21; z <= 28; z++) {
    const [low, high] = [z <= 24 ? 1 + (24 - z) : 1, 11 - Math.abs(z - 25)];
    fillBox(grid, 0, low, z, 2, high, z, IRON);
  }
  for (let y = 1; y <= 11; y++) fillBox(grid, 1, y, 28, 1, y, 28, EDGE); // the edge
  fillBox(grid, 0, 4, 21, 2, 7, 22, IRON_DARK); // where it's fixed
  return grid;
}
