// The HUD over the scene (styled in index.html): the region's name fading in large as the hero comes into it (and
// at the start); villagers' names over their heads as the hero nears them; the named place the hero is near, small
// in the top-left corner, and notices sliding in under it (a quest started, an objective done, a new place); the time
// of day in the top-right, the quest followed under it; the hero's health, bottom left, and a hurt foe's over its head; the damage
// of every blow, floating up from where it landed; what E would do, low in the middle; the conversation screen (ConversationScreen, for gameplay to open); and the screens
// that pause the game (ui/pausingScreens.ts: the map, the journal, the pause menu).

import { VisualComponent } from '@voxel/engine/app';
import type { Entity, System } from '@voxel/engine/ecs';
import { Dead, Health, Hit, InReach, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { Banner, Conversation, CornerLabel, FloatingText, Meter, Prompt, Toasts, TrackerPanel, WorldLabels, createOverlay, fadeByDistance, meterShare, type WorldLabel } from '@voxel/engine/ui';
import { Resident } from '../systems/villagerDay';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../ui/hudText';
import { pausingScreens } from '../ui/pausingScreens';
import { questNews, snapshot, startLog, trackedOf } from '../ui/questLog';
import { trackerText } from '../ui/questText';
import { ConversationScreen, QuestLog } from '../ui/screens';
import type { Feature } from './context';

// Villagers' name tags: whole up to TAG_NEAR tiles from the hero, gone by TAG_FAR. A hurt foe's health bar: whole up
// to BAR_NEAR, gone by BAR_FAR. Each over the head (ABOVE world units over its model's height).
const TAG_NEAR = 4;
const TAG_FAR = 8;
const BAR_NEAR = 12;
const BAR_FAR = 16;
const ABOVE = 0.15;

export const hud: Feature = {
  name: 'hud',
  install: ({ app, map, hero }) => {
    const { world } = app;
    const root = createOverlay();
    const tags = new WorldLabels(root, app.camera);
    const bars = new WorldLabels(root, app.camera, 'ui-world-bar');
    const damage = new FloatingText(root, app.camera);
    const banner = new Banner(root);
    const place = new CornerLabel(root, 'top-left', 'ui-place');
    const clock = new CornerLabel(root, 'top-right', 'ui-clock');
    const tracker = new TrackerPanel(root);
    const toasts = new Toasts(root);
    const prompt = new Prompt(root);
    const heroHealth = new Meter(root, 'ui-hero-health');
    const conversation = world.setResource(ConversationScreen, new Conversation(root));
    const placeholderLog = startLog();
    const logOf = () => (world.hasResource(QuestLog) ? world.resource(QuestLog) : placeholderLog);
    const theMap = pausingScreens(app, root, map, conversation, logOf);
    let questsWere: ReturnType<typeof snapshot> = [];
    const placesSeen = new Set<string>();
    let region: string | undefined;

    // The names of the villagers near the hero, over their heads, fading out farther off.
    const nameTags = (hx: number, hz: number): WorldLabel[] => {
      const labels: WorldLabel[] = [];
      for (const entity of world.query(Resident, Transform)) {
        const { x, y, z } = world.read(entity, Transform);
        const alpha = fadeByDistance(Math.hypot(x - hx, z - hz), TAG_NEAR, TAG_FAR);
        if (alpha > 0) labels.push({ key: entity, text: world.read(entity, Resident).name, x, y: overHead(entity, y), z, alpha });
      }
      return labels;
    };
    // The health of every foe hurt but alive, near the hero.
    const healthBars = (hx: number, hz: number): WorldLabel[] => {
      const labels: WorldLabel[] = [];
      for (const entity of world.query(Health, Transform)) {
        const { hp, max } = world.read(entity, Health);
        if (entity === hero || hp >= max || world.has(entity, Dead)) continue;
        const { x, y, z } = world.read(entity, Transform);
        const alpha = fadeByDistance(Math.hypot(x - hx, z - hz), BAR_NEAR, BAR_FAR);
        if (alpha > 0) labels.push({ key: entity, text: '', x, y: overHead(entity, y), z, alpha, share: meterShare(hp, max) });
      }
      return labels;
    };
    const overHead = (entity: Entity, y: number): number => y + (world.get(entity, VisualComponent)?.model.height ?? 0.45) + ABOVE;

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

        for (const { target, damage: points } of world.eventsOf(Hit)) {
          const at = world.get(target, Transform);
          if (at) damage.add(String(Math.round(points)), at.x, overHead(target, at.y), at.z, target === hero ? 'ui-float-hurt' : '');
        }
        damage.update();
        const life = world.get(hero, Health);
        heroHealth.el.hidden = !life;
        if (life) heroHealth.set(life.hp, life.max);

        const at = world.get(hero, Transform);
        if (!at) return;
        tags.show(nameTags(at.x, at.z));
        bars.show(healthBars(at.x, at.z));
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
