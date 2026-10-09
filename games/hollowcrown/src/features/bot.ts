// The bot (src/bot): in development, with ?bot in the address, it plays the game through the real controls while the
// owner watches, at ?speed=N times the game's pace (10 by default); a badge on top says what it's doing.

import { autopilotSystem, riseSystem } from '../bot/autopilot';
import { BotBadge } from '../bot/badge';
import type { Feature } from './context';

const DEFAULT_SPEED = 10;

// The game's speed asked for in `search` (?speed=N, 0.25 to 50), else the default.
export function speedOf(search: string): number {
  const asked = Number(new URLSearchParams(search).get('speed'));
  return Number.isFinite(asked) && asked >= 0.25 && asked <= 50 ? asked : DEFAULT_SPEED;
}

export const bot: Feature = {
  name: 'bot',
  install: ({ app, map, obstacles, hero }) => {
    if (!import.meta.env.DEV || !new URLSearchParams(location.search).has('bot')) return;
    const speed = speedOf(location.search);
    app.setTimeScale(speed);
    const badge = new BotBadge(speed);
    app.addSystems(autopilotSystem(map, obstacles, hero, badge), riseSystem(hero));
  },
};
