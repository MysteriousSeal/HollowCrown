// The pause menu's Save and Load pages (made by ui/pausingScreens.ts), over gameplay's saves (systems/save.ts): each
// save by its label and when it was made, newest first; a new save, or one written over; a save loaded, or deleted.

import type { SaveGame, SlotInfo } from '@voxel/engine/save';
import { element, type Menu, type MenuItem } from '@voxel/engine/ui';

export const MAX_SAVES = 8; // slots of the player's own (the autosave besides)

// When a save was made, as the list says it: "just now", "12 min ago", "3 h ago", else its date.
export function savedWhen(savedAt: number, now = Date.now()): string {
  const minutes = Math.floor((now - savedAt) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} h ago`;
  return new Date(savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

// The first of the player's slots not in use (none left: null).
export function freeSlot(slots: SlotInfo[], max = MAX_SAVES): string | null {
  for (let i = 1; i <= max; i++) if (!slots.some((s) => s.slot === `save-${i}`)) return `save-${i}`;
  return null;
}

// A save's line: its label (the autosave named so), when, small under it.
function line(info: SlotInfo): string {
  return `${info.slot === 'auto' ? `Autosave · ${info.label}` : info.label || info.slot}\n${savedWhen(info.savedAt)}`;
}

// The Save page: a new save (while there's a slot), or any of the player's own written over.
export function savePage(menu: Menu, saves: SaveGame, label: () => string, done: () => void): void {
  const own = saves.slots().filter((s) => s.slot !== 'auto');
  const free = freeSlot(own);
  const items: MenuItem[] = [
    ...(free ? [{ label: 'New save', pick: () => { saves.save(free, label()); done(); } }] : []),
    ...own.map((s) => ({ label: `Over: ${line(s)}`, pick: () => { saves.save(s.slot, label()); done(); } })),
  ];
  menu.pageOf('Save', own.length || free ? [] : [element('p', 'ui-menu-note', 'Every slot is full.')], items);
}

// The Load page: every save, newest first, each loaded on a pick; deleting is on the Delete page.
export function loadPage(menu: Menu, saves: SaveGame, loaded: () => void): void {
  const all = saves.slots();
  const items: MenuItem[] = all.map((s) => ({ label: line(s), pick: () => saves.load(s.slot) && loaded() }));
  if (all.some((s) => s.slot !== 'auto')) items.push({ label: 'Delete a save…', pick: () => deletePage(menu, saves, loaded) });
  menu.pageOf('Load', all.length ? [] : [element('p', 'ui-menu-note', 'Nothing saved yet.')], items);
}

function deletePage(menu: Menu, saves: SaveGame, loaded: () => void): void {
  const own = saves.slots().filter((s) => s.slot !== 'auto');
  menu.pageOf('Delete', [element('p', 'ui-menu-note', 'Pick a save to delete. It cannot be undone.')], own.map((s) => ({
    label: line(s),
    pick: () => {
      saves.remove(s.slot);
      loadPage(menu, saves, loaded);
    },
  })));
}
