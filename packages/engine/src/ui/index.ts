// UI: a DOM overlay over the canvas and its components (a banner, corner labels, a key prompt, a dialogue box),
// plain DOM, styled by the game's CSS through their `ui-` classes.
export { createOverlay, element } from './overlay';
export { BANNER_SECONDS, Banner } from './banner';
export { CornerLabel, type Corner } from './label';
export { Prompt } from './prompt';
export { ADVANCE_KEYS, Dialogue, DialogueBox, type DialogueData } from './dialogue';
