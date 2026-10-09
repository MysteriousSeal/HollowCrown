// Humanoids (the hero) have a naked body of one of two
// builds, male or female (hers slimmer), and differ in its look: skin tone,
// hair color and style, a beard (his only), an expression. The look is stored as indices;
// the view owns the actual colors (view/meshes/human/bodyVoxels.ts).

export const SKIN_TONE_COUNT = 8; // (the last four added after: pale, dark, olive, bronze; saves keep their numbers)
export const HAIR_COLOR_COUNT = 8; // (the last three added after: platinum, auburn, white; saves keep their numbers)
export const EXPRESSIONS = ['calm', 'cheerful', 'stern', 'wistful', 'sly'] as const; // their faces (bodyVoxels.ts)
export type Expression = (typeof EXPRESSIONS)[number];
export const DYE_COUNT = 8; // what their underwear's dyed (bodyVoxels.ts DYES; the last two added after: saffron, orchil)
export const HAIR_STYLES = ['short', 'long', 'cropped', 'bald', 'braid', 'bun', 'ponytail', 'twinBraids', 'crownBraid', 'waves', 'pigtails', 'bob', 'topknot', 'shaggy', 'warriorTail'] as const;
export type HairStyle = (typeof HAIR_STYLES)[number];
export type Build = 'male' | 'female';

export interface BodyLook {
  build: Build;
  skin: number; // 0 .. SKIN_TONE_COUNT - 1
  hair: number; // 0 .. HAIR_COLOR_COUNT - 1
  dye: number; // their braies (and her breast band): 0 .. DYE_COUNT - 1
  hairStyle: HairStyle;
  beard: boolean;
  expression?: Expression; // their face (none: calm, as every look before it was chosen)
}

export const HERO_LOOK: Readonly<BodyLook> = { build: 'male', skin: 0, hair: 0, dye: 1, hairStyle: 'short', beard: false };
