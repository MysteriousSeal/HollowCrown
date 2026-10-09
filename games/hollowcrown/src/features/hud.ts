// The HUD over the scene (styled in index.html): the region's name fading in large as the hero comes into it (and
// at the start), the named place the hero is near, small in the top-left corner, and the time of day in the top-right.

import type { System } from '@voxel/engine/ecs';
import { TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { Banner, CornerLabel, createOverlay } from '@voxel/engine/ui';
import { clockText, nearPlaceName, regionBanner, regionOf } from '../ui/hudText';
import type { Feature } from './context';

export const hud: Feature = {
  name: 'hud',
  install: ({ app, map, hero }) => {
    const root = createOverlay();
    const banner = new Banner(root);
    const place = new CornerLabel(root, 'top-left', 'ui-place');
    const clock = new CornerLabel(root, 'top-right', 'ui-clock');
    let region: string | undefined;

    const system: System = {
      name: 'hud',
      stage: 'present',
      update(world) {
        if (world.hasResource(TimeOfDay)) clock.set(clockText(world.resource(TimeOfDay).hours));
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
