// UI: a DOM overlay over the canvas and its components (a banner, corner labels, a key prompt, a dialogue box),
// plain DOM, styled by the game's CSS through their `ui-` classes.
export { createOverlay, element } from './overlay';
export { BANNER_SECONDS, Banner } from './banner';
export { CornerLabel, type Corner } from './label';
export { Prompt } from './prompt';
export { TrackerPanel, type TrackerText } from './tracker';
export {
  Conversation, Script, TALK_KEYS, TYPE_SPEED, Typewriter, placeholderPortrait, type ConversationLine, type OnChoice, type Side, type Speaker,
} from './conversation';
export { MAP_TILES_PER_PIXEL, MapView, cssColor, drawMapImage } from './mapImage';
export { MapScreen, NAMES_FROM_ZOOM, type MapLabel, type MapMark, type MarkShape } from './mapScreen';
export { ADVANCE_KEYS, Dialogue, DialogueBox, type DialogueData } from './dialogue';
