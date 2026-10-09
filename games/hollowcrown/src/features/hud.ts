// The HUD over the scene (styled in index.html): the region's name fading in large as the hero comes into it (and
// at the start), the named place the hero is near, small in the top-left corner, and the time of day in the top-right, the quest followed under it;
// what E would do, low in the middle; the conversation screen (ConversationScreen, for gameplay to open); and the map
// (M), drawn the first time it's opened.

import type { System } from '@voxel/engine/ecs';
import { InReach, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { Banner, Conversation, CornerLabel, MAP_TILES_PER_PIXEL, MapScreen, Prompt, TrackerPanel, createOverlay, drawMapImage } from '@voxel/engine/ui';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../ui/hudText';
import { MAP_GROUND, mapLabels, mapMarks } from '../ui/mapContent';
import { START_PROGRESS, trackerText } from '../ui/questText';
import { ConversationScreen, TrackedQuest } from '../ui/screens';
import type { Feature } from './context';

export const hud: Feature = {
  name: 'hud',
  install: ({ app, map, hero }) => {
    const root = createOverlay();
    const banner = new Banner(root);
    const place = new CornerLabel(root, 'top-left', 'ui-place');
    const clock = new CornerLabel(root, 'top-right', 'ui-clock');
    const tracker = new TrackerPanel(root);
    const prompt = new Prompt(root);
    const conversation = app.world.setResource(ConversationScreen, new Conversation(root));
    let region: string | undefined;

    let mapScreen: MapScreen | null = null;
    const theMap = (): MapScreen => {
      if (mapScreen) return mapScreen;
      mapScreen = new MapScreen(root, drawMapImage(map.data, MAP_GROUND), MAP_TILES_PER_PIXEL);
      mapScreen.setContent(mapLabels(map.data), mapMarks(map.data));
      return mapScreen;
    };
    window.addEventListener('keydown', (event) => {
      if (event.repeat || conversation.isOpen) return;
      if (event.code === 'KeyM') theMap().toggle();
      else if (event.code === 'Escape' && mapScreen?.isOpen) mapScreen.close();
      else if (mapScreen?.isOpen && (event.code === 'Equal' || event.code === 'Minus')) mapScreen.zoomBy(event.code === 'Equal' ? 1.25 : 0.8);
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    });

    const system: System = {
      name: 'hud',
      stage: 'present',
      update(world) {
        if (world.hasResource(TimeOfDay)) clock.set(clockText(world.resource(TimeOfDay).hours));
        tracker.set(trackerText(world.hasResource(TrackedQuest) ? world.resource(TrackedQuest) : START_PROGRESS));
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
        place.set(nearPlaceName(map.places(), at.x, at.z));
        if (mapScreen?.isOpen) {
          mapScreen.setTitle(here ? regionBanner(here).title : '');
          mapScreen.setHero(at.x, at.z, at.facing);
        }
      },
    };
    app.addSystems(system);
  },
};
