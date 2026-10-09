// The HUD over the scene (styled in index.html): the region's name fading in large as the hero comes into it (and
// at the start), the named place the hero is near, small in the top-left corner, and the time of day in the top-right, the quest followed under it; notices sliding in on the
// left (a quest started, an objective done, a new place);
// what E would do, low in the middle; the conversation screen (ConversationScreen, for gameplay to open); the map
// (M), drawn the first time it's opened; and the pause menu (Esc). The game pauses behind the map and the menu.

import type { System } from '@voxel/engine/ecs';
import { InReach, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { Banner, Conversation, CornerLabel, MAP_TILES_PER_PIXEL, MapScreen, Menu, Prompt, Toasts, TrackerPanel, createOverlay, drawMapImage } from '@voxel/engine/ui';
import { CONTROLS } from '../ui/controls';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../ui/hudText';
import { MAP_GROUND, mapLabels, mapMarks } from '../ui/mapContent';
import { questNews, snapshot, startLog, trackedOf } from '../ui/questLog';
import { trackerText } from '../ui/questText';
import { ConversationScreen, QuestLog } from '../ui/screens';
import type { Feature } from './context';

export const hud: Feature = {
  name: 'hud',
  install: ({ app, map, hero }) => {
    const root = createOverlay();
    const banner = new Banner(root);
    const place = new CornerLabel(root, 'top-left', 'ui-place');
    const clock = new CornerLabel(root, 'top-right', 'ui-clock');
    const tracker = new TrackerPanel(root);
    const toasts = new Toasts(root);
    const prompt = new Prompt(root);
    const placeholderLog = startLog();
    let questsWere: ReturnType<typeof snapshot> = [];
    const placesSeen = new Set<string>();
    const conversation = app.world.setResource(ConversationScreen, new Conversation(root));
    let region: string | undefined;

    let mapScreen: MapScreen | null = null;
    const theMap = (): MapScreen => {
      if (mapScreen) return mapScreen;
      mapScreen = new MapScreen(root, drawMapImage(map.data, MAP_GROUND), MAP_TILES_PER_PIXEL);
      mapScreen.setContent(mapLabels(map.data), mapMarks(map.data));
      return mapScreen;
    };
    const menu = new Menu(root, 'Paused');
    // The game paused while a screen is up, and on again once none is.
    const pauseFor = (screenUp: boolean): void => (screenUp ? app.pause() : app.resume());
    const closeMenu = (): void => {
      menu.close();
      pauseFor(false);
    };
    const openMenu = (): void => {
      menu.open([
        { label: 'Resume', pick: closeMenu },
        { label: 'Controls', pick: () => menu.page('Controls', CONTROLS) },
      ]);
      pauseFor(true);
    };
    window.addEventListener('keydown', (event) => {
      if (event.repeat || conversation.isOpen) return;
      if (event.code === 'Escape' && mapScreen?.isOpen) {
        mapScreen.close();
        pauseFor(false);
      } else if (event.code === 'Escape') {
        if (menu.isOpen) closeMenu();
        else openMenu();
      } else if (menu.isOpen) return;
      else if (event.code === 'KeyM') {
        theMap().toggle();
        pauseFor(theMap().isOpen);
      } else if (mapScreen?.isOpen && (event.code === 'Equal' || event.code === 'Minus')) mapScreen.zoomBy(event.code === 'Equal' ? 1.25 : 0.8);
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    });

    const system: System = {
      name: 'hud',
      stage: 'present',
      update(world) {
        if (world.hasResource(TimeOfDay)) clock.set(clockText(world.resource(TimeOfDay).hours));
        const log = world.hasResource(QuestLog) ? world.resource(QuestLog) : placeholderLog;
        const tracked = trackedOf(log);
        tracker.set(tracked && trackerText(tracked));
        for (const { title, text } of questNews(questsWere, log.quests)) toasts.push(title, text);
        questsWere = snapshot(log);
        const reach = world.hasResource(InReach) ? world.resource(InReach) : null;
        prompt.set(reach?.entity != null && !conversation.isOpen ? 'E' : null, reach?.label);
        const at = world.get(hero, Transform);
        if (!at) return;
        const here = regionOf(map.areasAt(at.x, at.z));
        if (here && here.id !== region) {
          const { title, sub } = regionBanner(here);
          banner.show(title, sub);
        }
        region = here?.id;
        const near = nearPlaceName(map.places(), at.x, at.z);
        place.set(near);
        if (near && !placesSeen.has(near)) {
          placesSeen.add(near);
          toasts.push('New place', near);
        }
        if (mapScreen?.isOpen) {
          mapScreen.setTitle(here ? regionBanner(here).title : '');
          mapScreen.setHero(at.x, at.z, at.facing);
        }
      },
    };
    app.addSystems(system);
  },
};
