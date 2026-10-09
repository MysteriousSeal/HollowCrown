// Two horrors of what was done to the dead, each the human body (frameRig.ts) made over:
// - a Bloomer: a digger's corpse the white poppy grew through: dried grey-brown skin, a torn tunic; pale stems
//   bursting from its mouth and eyes and out of a split down its chest, white poppies blooming on them over its head
//   and shoulder; stems winding its arms; roots spilling from its feet across the ground. Rooted, it sways like a
//   flower in the wind, its arms lashing;
// - one of the Ashen: the burned of Cairnfold, charred black, still smouldering: embers glowing in the cracks of its
//   skin, in its eyes and its open mouth; its clothes burned to grey tatters; ash drifting off it as it walks. Small
//   ones among them (a child).

import * as THREE from 'three';
import type { BodyLook } from '@voxel/engine/characters/human/humanoid';
import { C, HUMAN_VOXEL_SIZE as V, bodyPalette, type Joint } from '@voxel/engine/characters/human/bodyVoxels';
import type { VoxelGrid } from '@voxel/engine/voxel/greedyMesh';
import { createGrid, setColor } from '@voxel/engine/voxel/voxelShapes';
import { bodyColors, box, over } from '@voxel/engine/characters/creatures/dress';
import { addPart, hashUnit, type Size } from '@voxel/engine/characters/creatures/creatureMesh';
import { SHAMBLE, type FrameModel, type FrameSpec } from '@voxel/engine/characters/creatures/frameRig';

const G = { cloth: 16, clothShade: 17, stem: 18, stemDark: 19, petal: 20, petalShade: 21, heart: 22, root: 23, ember: 24, emberDim: 25, ash: 26 };
const GLOW: ReadonlySet<number> = new Set([G.ember, G.emberDim]);
const noise = (x: number, y: number, z: number, salt: number) => hashUnit(x * 7 + y * 31, z, salt);

// ---- the Bloomer ----

const BLOOMER_LOOK: BodyLook = { build: 'male', skin: 2, hair: 3, dye: 3, hairStyle: 'cropped', beard: false, expression: 'calm' };

// A poppy at (x, y, z) (body-relative), facing up: four white petals round a dark heart, one shaded.
function poppy(g: VoxelGrid, o: Size, x: number, y: number, z: number): void {
  box(g, o, x - 1, y, z, x + 1, y, z, G.petal);
  box(g, o, x, y, z - 1, x, y, z + 1, G.petal);
  box(g, o, x - 1, y, z - 1, x - 1, y, z - 1, G.petalShade);
  box(g, o, x, y, z, x, y, z, G.heart);
  box(g, o, x, y + 1, z, x, y + 1, z, G.petalShade); // (its cup)
}

function bloomerPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  if (joint === 'head') {
    // The eyes and the mouth gone dark; stems out of them, up past the brow, flowering.
    over(g, o, (_x, _y, _z, c) => (c === C.eye || c === C.glint || c === C.mouth ? C.skinDeep : 0));
    box(g, o, 3, 5, 11, 3, 9, 11, (_x, y) => (y % 2 ? G.stem : G.stemDark)); // out of its right eye
    box(g, o, 3, 10, 11, 3, 11, 10, G.stem);
    poppy(g, o, 3, 12, 10);
    box(g, o, 5, 2, 11, 5, 3, 12, G.stem); // out of its mouth, arching up
    box(g, o, 6, 3, 12, 6, 6, 12, G.stemDark);
    box(g, o, 7, 7, 12, 7, 9, 11, G.stem);
    poppy(g, o, 7, 10, 11);
    box(g, o, 5, 11, 4, 5, 13, 4, G.stem); // out of the crown, the biggest
    poppy(g, o, 5, 14, 4);
    over(g, o, (x, y, z, c) => (c === C.skinShade && noise(x, y, z, 21) < 0.2 ? G.stemDark : 0)); // veins of it under the skin
  } else if (joint === 'torso') {
    over(g, o, (x, y, z, c) => (c >= C.cloth && c <= C.clothLight ? G.clothShade : y >= 1 && y <= 6 && noise(x, y, z, 22) < 0.6 ? (y % 3 ? G.cloth : G.clothShade) : 0)); // a torn tunic
    box(g, o, 4, 2, 4, 4, 8, 4, C.skinDeep); // split down the chest...
    box(g, o, 4, 3, 5, 4, 8, 5, (_x, y) => (y % 2 ? G.stem : G.stemDark)); // ...the stems out of it
    box(g, o, 5, 8, 5, 6, 9, 5, G.stem);
    poppy(g, o, 6, 10, 4);
    box(g, o, 3, 5, 5, 2, 7, 5, G.stemDark);
  } else if (joint.endsWith('Arm')) {
    over(g, o, (x, y, z) => ((x + y + z) % 4 === 0 ? G.stem : y >= 5 && noise(x, y, z, 23) < 0.4 ? G.cloth : 0)); // stems winding round
  } else {
    over(g, o, (x, y, z) => (y <= 2 ? ((x + z) % 2 ? G.root : G.stemDark) : y >= 4 && noise(x, y, z, 24) < 0.5 ? G.clothShade : 0));
    for (let i = 0; i < 4; i++) box(g, o, [-1, 3, 0, 2][i], 0, [1, 2, -1, 5][i], [-1, 3, 0, 2][i], 0, [1, 2, -1, 5][i], G.root); // roots out over the toes
  }
}

// Its roots, spilling out across the ground round its feet (they don't move: it's rooted).
function rootMat(model: FrameModel): void {
  const N = 27;
  const g = createGrid([N, 1, N]);
  for (let a = 0; a < 9; a++) {
    const angle = (a / 9) * Math.PI * 2 + hashUnit(a, 1, 25);
    const reach = 7 + hashUnit(a, 2, 26) * 6;
    for (let r = 3; r < reach; r += 0.5) {
      const bend = Math.sin(r * 0.7 + a) * 0.25;
      const x = Math.round(N / 2 + Math.cos(angle + bend) * r);
      const z = Math.round(N / 2 + Math.sin(angle + bend) * r);
      if (x >= 0 && z >= 0 && x < N && z < N) setColor(g, x, 0, z, r > reach - 2 ? G.stemDark : G.root);
    }
  }
  addPart(model.root, g, model.spec.palette, V, [N / 2, 0, N / 2]);
}

export const BLOOMER: FrameSpec = {
  palette: bodyColors(bodyPalette(BLOOMER_LOOK), { skin: 0x8e8270, skinShade: 0x6e6454, skinLight: 0xa49884, skinDeep: 0x3a3028 }, [
    0x6a5a44, 0x4c4032, 0xc8d0a8, 0x8a9a6a, 0xf6f2ea, 0xd8d2c4, 0x2a2a22, 0x5a4a34, 0, 0, 0,
  ]),
  base: BLOOMER_LOOK,
  paint: bloomerPaint,
  gait: { speed: 0.45, legSwing: 0.08, armSwing: 0.35, reach: 0.1, lean: 0.12, sway: 0.18, hover: 0, bob: 0 },
  extra: rootMat,
};

// ---- the Ashen ----

const ASHEN_LOOK: BodyLook = { build: 'male', skin: 3, hair: 1, dye: 4, hairStyle: 'cropped', beard: false, expression: 'stern' };
const ASHEN_CHILD: BodyLook = { build: 'female', skin: 3, hair: 1, dye: 4, hairStyle: 'bob', beard: false, expression: 'wistful' };

function ashenPaint(joint: Joint, g: VoxelGrid, o: Size): void {
  const salt = joint.length * 5 + (joint.startsWith('left') ? 1 : 0);
  over(g, o, (x, y, z, c) => {
    if (c === C.eye || c === C.mouth) return G.ember; // burning eyes, an open burning mouth
    if (c === C.glint) return G.emberDim;
    if (c >= C.cloth && c <= C.clothLight) return noise(x, y, z, salt) < 0.5 ? G.ash : 0; // tatters, grey
    const n = noise(x, y, z, salt + 30);
    return n < 0.07 ? G.ember : n < 0.14 ? G.emberDim : 0; // embers in the cracks
  });
  if (joint === 'torso') box(g, o, -1, -2, 0, 9, -1, 4, (x, y, z) => ((x === -1 || x === 9 || z === 0 || z === 4) && noise(x, y, z, 27) < 0.5 ? G.ash : 0)); // a burnt hem
}

// Ash drifting up off it: a few grey flakes, rising and fading round it, over and over.
function ashFall(model: FrameModel): void {
  const flake = new THREE.BoxGeometry(V * 1.2, V * 1.2, V * 1.2);
  const material = new THREE.MeshBasicMaterial({ color: 0x8a8480, transparent: true, opacity: 0.8 });
  const flakes = Array.from({ length: 10 }, (_, i) => {
    const m = new THREE.Mesh(flake, material);
    model.body.add(m);
    return { m, x: (hashUnit(i, 3, 28) - 0.5) * 0.3, z: (hashUnit(i, 4, 29) - 0.5) * 0.25, t0: hashUnit(i, 5, 30) * 3 };
  });
  model.ticks.push((t) => {
    for (const f of flakes) {
      const life = ((t + f.t0) % 3) / 3; // (0 .. 1, rising)
      f.m.position.set(f.x + Math.sin(t * 2 + f.t0) * 0.03, 0.1 + life * 0.5, f.z);
      f.m.scale.setScalar(1 - life);
    }
  });
}

const ashenPalette = (look: BodyLook) =>
  bodyColors(bodyPalette(look), { skin: 0x2e2622, skinShade: 0x1e1816, skinLight: 0x443834, skinDeep: 0x120c0a, hair: 0x1a1412, hairLight: 0x2a2220, hairDark: 0x0e0a0a, cheek: 0x2a201c }, [
    0, 0, 0, 0, 0, 0, 0, 0, 0xffa040, 0xd85020, 0x6a6460,
  ]);

export const ASHEN: FrameSpec = {
  palette: ashenPalette(ASHEN_LOOK),
  base: ASHEN_LOOK,
  paint: ashenPaint,
  glows: GLOW,
  gait: { ...SHAMBLE, speed: 0.9, reach: 0.2, sway: 0.04, lean: 0.05 },
  extra: ashFall,
};

export const ASHEN_SMALL: FrameSpec = { ...ASHEN, palette: ashenPalette(ASHEN_CHILD), base: ASHEN_CHILD, scale: 0.62 };
