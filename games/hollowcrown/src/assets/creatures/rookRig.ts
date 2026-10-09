// A carrion rook, fat on hanged men: a black bird bigger than it should be, oily feathers with a blue-violet sheen,
// the bald grey face of a rook, a heavy dark beak; the flock's leader older, greyer at the nape, white-eyed. In
// voxel parts on joints: the body (its tail fanned behind), the head, two wings (folded along its back, spread to
// fly) and two legs. Standing, it struts and pecks; walking, it flies: lifted off the ground, wings beating, legs
// tucked.

import * as THREE from 'three';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, fillBox, setColor } from '@voxel/engine/voxel/voxelShapes';
import { CREATURE_VOXEL as V, addPart, addShade, joint, namedPalette, type CreatureModel } from '@voxel/engine/characters/creatures/creatureMesh';

const colors = {
  feather: 0x221f26,
  sheen: 0x3c3858,
  featherDark: 0x121014,
  nape: 0x221f26, // (the leader's greyer)
  face: 0xb4a49c,
  beak: 0x2c2a2e,
  beakLight: 0x56525a,
  eye: 0x1a120c,
  leg: 0x2a2426,
};
const P = namedPalette(colors);
const { C } = P;
const LEADER = namedPalette({ ...colors, nape: 0x6a6670, eye: 0xf4f2ea }).colors;

const BODY: [number, number, number] = [6, 6, 12];
const HEAD: [number, number, number] = [5, 5, 8];
const WING: [number, number, number] = [2, 3, 10];
const LEG: [number, number, number] = [3, 4, 3];

// The body: a round breast, a sheen along the back, the tail fanned out behind (at low z).
function body(): VoxelGrid {
  const g = createGrid(BODY);
  for (let x = 0; x < 6; x++) for (let y = 0; y < 6; y++) for (let z = 3; z < 12; z++) {
    const r = ((x - 2.5) / 3) ** 2 + ((y - 2.6) / 3) ** 2 + ((z - 7.5) / 4.6) ** 2;
    if (r <= 1) setColor(g, x, y, z, y >= 4 && (x === 2 || x === 3) ? C.sheen : y <= 1 ? C.featherDark : C.feather);
  }
  fillBox(g, 1, 3, 0, 4, 3, 3, (x, _y, z) => (z === 0 && x % 2 ? 0 : x === 1 || x === 4 ? C.featherDark : C.feather)); // the tail, its tip notched
  fillBox(g, 2, 4, 9, 3, 4, 11, C.nape); // the nape
  return g;
}

// The head: the skull dark, the bald grey face round the beak's base, the beak long and heavy, eyes either side.
function head(): VoxelGrid {
  const g = createGrid(HEAD);
  fillBox(g, 0, 0, 0, 4, 4, 3, (_x, y) => (y === 4 ? C.sheen : C.feather));
  fillBox(g, 0, 0, 2, 4, 3, 3, C.face); // bald-faced
  fillBox(g, 1, 4, 0, 3, 4, 1, C.nape);
  setColor(g, 0, 3, 3, C.eye);
  setColor(g, 4, 3, 3, C.eye);
  fillBox(g, 1, 1, 4, 3, 2, 5, (_x, y) => (y === 2 ? C.beakLight : C.beak)); // the beak
  fillBox(g, 2, 1, 6, 2, 2, 6, C.beak);
  setColor(g, 2, 1, 7, C.beak);
  return g;
}

// A wing, folded: from the shoulder (high z) back past the tail, the long primaries ragged at the tip.
function wing(): VoxelGrid {
  const g = createGrid(WING);
  fillBox(g, 0, 0, 0, 1, 2, 9, (x, y, z) => {
    if (z < 3 && y === 2 && z % 2 === 0) return 0; // (ragged tips)
    if (y === 2) return x === 1 ? C.sheen : C.feather;
    return z < 4 ? C.featherDark : C.feather;
  });
  return g;
}

function leg(): VoxelGrid {
  const g = createGrid(LEG);
  fillBox(g, 1, 1, 1, 1, 3, 1, C.leg);
  fillBox(g, 0, 0, 2, 2, 0, 2, C.leg); // the toes, splayed forward...
  setColor(g, 1, 0, 1, C.leg);
  setColor(g, 1, 0, 0, C.leg); // ...and one back
  return g;
}

export class RookModel implements CreatureModel {
  readonly root = new THREE.Group();
  readonly height: number;
  private readonly lift: THREE.Group;
  private readonly head: THREE.Group;
  private readonly wings: Array<{ flap: THREE.Group; spread: THREE.Group; side: number }> = [];
  private readonly legs: THREE.Group[] = [];

  constructor(leader = false) {
    const palette = leader ? LEADER : P.colors;
    const scaled = joint(this.root);
    scaled.scale.setScalar(leader ? 1.25 : 1);
    const legH = (LEG[1] - 0.5) * V;
    this.lift = joint(scaled);
    const trunk = joint(this.lift, 0, legH, 0);
    addPart(trunk, body(), palette, V, [3, 0, 6]);
    this.head = joint(trunk, 0, 4 * V, 5 * V);
    addPart(this.head, head(), palette, V, [2.5, 0, 1]);
    for (const side of [1, -1]) {
      const flap = joint(trunk, side * 3 * V, 5 * V, 4 * V);
      const spread = joint(flap);
      const meshes = addPart(spread, wing(), palette, V, [0, 2, 10]);
      for (const m of meshes) m.scale.x = side; // (built for its left)
      this.wings.push({ flap, spread, side });
    }
    for (const side of [1, -1]) {
      const l = joint(this.lift, side * 1.2 * V, legH, 0);
      addPart(l, leg(), palette, V, [1.5, LEG[1] - 0.5, 1.5]);
      this.legs.push(l);
    }
    this.height = (legH + 9 * V) * (leader ? 1.25 : 1);
    addShade(this.root, 0.7);
  }

  animate(t: number, fly: number): void {
    const hop = Math.max(0, Math.sin(t * 5)) ** 8 * 0.03 * (1 - fly); // (a strut, now and then a hop)
    this.lift.position.y = fly * (0.35 + Math.sin(t * 9) * 0.02) + hop;
    this.lift.rotation.x = fly * 0.25;
    const peck = Math.max(0, Math.sin(t * 1.7)) ** 6;
    this.head.rotation.x = (1 - fly) * peck * 0.9 - fly * 0.2;
    for (const w of this.wings) {
      w.spread.rotation.y = -w.side * (Math.PI / 2) * fly; // (folded along its back .. spread wide)
      w.flap.rotation.z = w.side * fly * Math.sin(t * 14) * 0.7;
    }
    for (const l of this.legs) l.rotation.x = fly * 1.1; // (tucked)
  }
}
