// The HUD over the scene (styled in index.html): the region's name fading in large as the hero comes into it (and
// at the start); the named place the hero is near, small in the top-left corner, and notices sliding in under it (a
// quest started, an objective done, a new place); the time of day in the top-right, the quest followed under it; what
// E would do, low in the middle; the conversation screen (ConversationScreen, for gameplay to open); and the screens
// that pause the game (ui/pausingScreens.ts: the map, the journal, the pause menu).

import type { System } from '@voxel/engine/ecs';
import { InReach, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { Banner, Conversation, CornerLabel, Prompt, Toasts, TrackerPanel, createOverlay } from '@voxel/engine/ui';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../ui/hudText';
import { pausingScreens } from '../ui/pausingScreens';
import { questNews, snapshot, startLog, trackedOf } from '../ui/questLog';
import { trackerText } from '../ui/questText';
import { ConversationScreen, QuestLog } from '../ui/screens';
import type { Feature } from './context';

export const hud: Feature = {
  name: 'hud',
  install: ({ app, map, hero }) => {
    const { world } = app;
    const root = createOverlay();
    const banner = new Banner(root);
    const place = new CornerLabel(root, 'top-left', 'ui-place');
    const clock = new CornerLabel(root, 'top-right', 'ui-clock');
    const tracker = new TrackerPanel(root);
    const toasts = new Toasts(root);
    const prompt = new Prompt(root);
    const conversation = world.setResource(ConversationScreen, new Conversation(root));
    const placeholderLog = startLog();
    const logOf = () => (world.hasResource(QuestLog) ? world.resource(QuestLog) : placeholderLog);
    const theMap = pausingScreens(app, root, map, conversation, logOf);
    let questsWere: ReturnType<typeof snapshot> = [];
    const placesSeen = new Set<string>();
    let region: string | undefined;

    const system: System = {
      name: 'hud',
      stage: 'present',
      update() {
        if (world.hasResource(TimeOfDay)) clock.set(clockText(world.resource(TimeOfDay).hours));
        const log = logOf();
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
        const mapScreen = theMap();
        if (mapScreen?.isOpen) {
          mapScreen.setTitle(here ? regionBanner(here).title : '');
          mapScreen.setHero(at.x, at.z, at.facing);
        }
      },
    };
    app.addSystems(system);
  },
};
