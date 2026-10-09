// The HUD's screens that pause the game behind them (made by features/hud.ts), one up at a time, by their keys: the
// map (M, drawn the first time it's opened), the journal (J) and the pause menu (Esc; Esc also closes the others:
// Resume, Sound, Controls). Every pick in the menu clicks.
// None opens while the game's `busy` (in a conversation, dead).

import type { App } from '@voxel/engine/app';
import { AudioResource, PlaySound } from '@voxel/engine/audio';
import { JournalScreen, MAP_TILES_PER_PIXEL, MapScreen, Menu, drawMapImage, slider } from '@voxel/engine/ui';
import type { WorldMap } from '@voxel/engine/world';
import { CONTROLS } from './controls';
import { MAP_GROUND, mapLabels, mapMarks } from './mapContent';
import { journalEntries, type QuestLogData } from './questLog';

interface Screen {
  readonly isOpen: boolean;
  close(): void;
}

// Installs the screens' keys; the map (once made), for the HUD to keep the hero on it.
export function pausingScreens(app: App, root: HTMLElement, map: WorldMap, busy: () => boolean, log: () => QuestLogData): () => MapScreen | null {
  let mapScreen: MapScreen | null = null;
  const theMap = (): MapScreen => {
    if (mapScreen) return mapScreen;
    mapScreen = new MapScreen(root, drawMapImage(map.data, MAP_GROUND), MAP_TILES_PER_PIXEL);
    mapScreen.setContent(mapLabels(map.data), mapMarks(map.data));
    return mapScreen;
  };
  const journal = new JournalScreen(root);
  const menu = new Menu(root, 'Paused');
  const { world } = app;
  menu.onPick = () => world.emit(PlaySound, { name: 'click' });
  // The sound page: the volume, and mute (N too).
  const soundPage = (): void => {
    if (!world.hasResource(AudioResource)) return menu.page('Sound', [['N', 'No sound yet']]);
    const audio = world.resource(AudioResource);
    const mute = { label: audio.muted ? 'Sound: off' : 'Sound: on', pick: () => {
      audio.setMuted(!audio.muted);
      soundPage();
    } };
    menu.pageOf('Sound', [slider('Volume', audio.volume, (v) => audio.setVolume(v))], [mute]);
  };
  let up: Screen | null = null;

  const close = (): void => {
    up?.close();
    up = null;
    app.resume();
  };
  const open = (screen: Screen, show: () => void): void => {
    up?.close();
    show();
    up = screen;
    app.pause();
  };
  const toggle = (screen: Screen, show: () => void): void => (up === screen ? close() : open(screen, show));

  window.addEventListener('keydown', (event) => {
    if (event.repeat || busy()) return;
    if (event.code === 'Escape') {
      if (up) close();
      else open(menu, () => menu.open([
        { label: 'Resume', pick: close },
        { label: 'Sound', pick: soundPage },
        { label: 'Controls', pick: () => menu.page('Controls', CONTROLS) },
      ]));
    } else if (up === menu) return;
    else if (event.code === 'KeyM') toggle(theMap(), () => theMap().open());
    else if (event.code === 'KeyJ') toggle(journal, () => journal.open(journalEntries(log())));
    else if (up === mapScreen && (event.code === 'Equal' || event.code === 'Minus')) mapScreen!.zoomBy(event.code === 'Equal' ? 1.25 : 0.8);
    else return;
    event.preventDefault();
    event.stopImmediatePropagation();
  });
  return () => mapScreen;
}
