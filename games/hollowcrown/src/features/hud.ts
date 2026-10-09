// The HUD over the scene (styled in index.html): the region's name fading in large as the hero comes into it (and
// at the start), the named place the hero is near, small in the top-left corner, and the time of day in the top-right;
// what E would do, low in the middle; and the conversation screen (ConversationScreen, for gameplay to open).

import type { System } from '@voxel/engine/ecs';
import { InReach, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { Banner, Conversation, CornerLabel, Prompt, createOverlay } from '@voxel/engine/ui';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../ui/hudText';
import { ConversationScreen } from '../ui/screens';
import type { Feature } from './context';

export const hud: Feature = {
  name: 'hud',
  install: ({ app, map, hero }) => {
    const root = createOverlay();
    const banner = new Banner(root);
    const place = new CornerLabel(root, 'top-left', 'ui-place');
    const clock = new CornerLabel(root, 'top-right', 'ui-clock');
    const prompt = new Prompt(root);
    const conversation = app.world.setResource(ConversationScreen, new Conversation(root));
    let region: string | undefined;

    const system: System = {
      name: 'hud',
      stage: 'present',
      update(world) {
        if (world.hasResource(TimeOfDay)) clock.set(clockText(world.resource(TimeOfDay).hours));
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
      },
    };
    app.addSystems(system);
  },
};
