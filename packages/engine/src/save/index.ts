// Saving and loading: what a game keeps (its schema), the world as a save and back, slots in the browser's storage,
// autosaves.
export {
  AutosaveNow, Persistent, SaveError, SaveGame, autosaveSystem, isSaveData, keep, keepResource, restore, snapshot,
  type AutosaveOptions, type Kept, type SaveContext, type SaveData, type SaveSchema, type SaveStorage, type SlotInfo,
} from './saveGame';
