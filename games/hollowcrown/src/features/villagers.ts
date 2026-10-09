// Brindleford's villagers: everyone living in a building of the map, stood just outside its door (a household side by
// side along its front), facing out; by day they stroll round it (systems/villagerDay.ts). Each is their own model
// (src/people/ PEOPLE); anyone not modelled yet is the human body of a look drawn from their name: the same name, the
// same face, every time.

import { FrameModel, MARCH, bodyPalette, type BodyLook, type Build } from '@voxel/engine/characters';
import { MoveSpeed, Transform } from '@voxel/engine/gameplay';
import { hashUnit, oneOf } from '@voxel/engine/math';
import type { Model } from '@voxel/engine/models';
import type { PlaceData, WorldMap } from '@voxel/engine/world';
import { footprint, type BuildingProps } from '../data/world/kinds';
import { Resident, villagerDaySystem } from '../systems/villagerDay';
import { PEOPLE } from '../people';
import type { Feature } from './context';

// What a name can't tell (the region's bible, "Brindleford"): who's a woman, who's old, who's a child (their size).
// Used only here, until the people's own data (src/data/people/) says it.
const WOMEN = new Set(['Elsa Fenn', 'Nan Wicket', 'Old Meg', 'Tamsin Reede', 'Joan Lusk', 'Wynn Tidy', 'Sibyl Hask', 'Gammer Orr', 'Ada Cobbe', 'Wenna']);
const OLD = new Set(['Old Meg', 'Gammer Orr', 'Simkin Orr', 'Nan Wicket', 'Father Cuthwin']);
const YOUNG: Record<string, number> = { Kit: 0.75, Wenna: 0.88 }; // (Kit is 10, Wenna 13)
const SEATED = new Set(['Old Meg']); // on the stool by her door (buildings/props.ts doorstepStool)

const HIS_HAIR = ['short', 'cropped', 'shaggy', 'bald', 'long'] as const;
const HER_HAIR = ['bun', 'braid', 'long', 'crownBraid', 'waves', 'ponytail'] as const;
const WHITE_HAIR = 7;
const SPACING = 0.5; // tiles between neighbours at one door

// A villager: who, where they stand, which way they face, their look and size, whether they sit.
export interface Villager {
  name: string;
  x: number;
  z: number;
  facing: number;
  look: BodyLook;
  scale: number;
  seated: boolean;
}

// A number for `name`, the same each time.
function nameSeed(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return h;
}

// The look of `name`: its skin, hair, dye, hair style and beard from its hash; the build and age from what's known.
export function lookOf(name: string): BodyLook {
  const seed = nameSeed(name);
  const pick = (n: number, salt: number) => Math.floor(hashUnit(seed, salt, 7) * n) % n;
  const build: Build = WOMEN.has(name) ? 'female' : 'male';
  const styles = build === 'female' ? HER_HAIR : HIS_HAIR;
  const grown = !(name in YOUNG);
  return {
    build,
    skin: pick(4, 1), // (the Vale's four first tones)
    hair: OLD.has(name) ? WHITE_HAIR : pick(5, 2),
    dye: pick(8, 3),
    hairStyle: styles[pick(styles.length, 4)],
    beard: build === 'male' && grown && pick(2, 5) === 0,
  };
}

// Everyone living in a building on `map`, each at its door: a household spread along its front.
export function villagersOf(map: WorldMap): Villager[] {
  const out: Villager[] = [];
  for (const place of map.places()) {
    if (place.kind !== 'building') continue;
    const residents = (place.props as BuildingProps).residents;
    residents.forEach((name, i) => out.push(atDoor(place, name, (i - (residents.length - 1) / 2) * SPACING)));
  }
  return out;
}

// How far a house's door is moved along its front (tiles, the building's +x): as buildings/index.ts draws it.
function doorShift(place: PlaceData): number {
  if ((place.props as BuildingProps).use !== 'house') return 0;
  const seed = [...place.id].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 10007;
  return oneOf([0, -8, 8], hashUnit(seed, 4, 21)) / 16;
}

// `name` stood a tile out from `place`'s door, `along` tiles along its front (the building's +x).
function atDoor(place: PlaceData, name: string, along: number): Villager {
  const facing = place.facing ?? 0;
  const [dx, dz] = footprint(place).door;
  const seated = SEATED.has(name);
  // (seated: on the stool, just past the door's right jamb and against the wall)
  const [side, out] = seated ? [doorShift(place) + 0.4, -0.5] : [doorShift(place) + along, 0];
  const [cos, sin] = [Math.cos(facing), Math.sin(facing)];
  return {
    name,
    x: dx + side * cos + out * sin,
    z: dz - side * sin + out * cos,
    facing,
    look: lookOf(name),
    scale: YOUNG[name] ?? 1,
    seated,
  };
}

// A villager's figure: their own model (made at their size), else their look's body at their size; sat down if
// they sit (legs forward, hips on the stool).
export function figureOf(v: Villager): Model {
  const model = PEOPLE[v.name]?.make() ?? new FrameModel({ palette: bodyPalette(v.look), base: v.look, gait: { ...MARCH, speed: 1.6 }, scale: v.scale });
  if (v.seated && model instanceof FrameModel) {
    model.ticks.push(() => {
      model.joints.leftLeg.rotation.x = -1.45;
      model.joints.rightLeg.rotation.x = -1.45;
      model.body.position.y += 0.07; // (the stool stands higher than her hips)
    });
  }
  return model;
}

export const villagers: Feature = {
  name: 'villagers',
  install: ({ app, map }) => {
    for (const v of villagersOf(map)) {
      const person = app.world.spawn(
        [Transform, { x: v.x, y: map.groundY(v.x, v.z), z: v.z, facing: v.facing }],
        [MoveSpeed, 1.2],
        [Resident, { home: { x: v.x, z: v.z }, facing: v.facing, seated: v.seated }],
      );
      app.show(person, figureOf(v));
    }
    app.addSystems(villagerDaySystem);
  },
};
