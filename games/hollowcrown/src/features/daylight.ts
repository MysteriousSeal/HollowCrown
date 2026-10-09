// Day and night over the Vale: a game day in 24 real minutes, starting late in the afternoon (dusk soon falls, and
// Brindleford's windows light).

import type { Feature } from './context';

export const daylight: Feature = {
  name: 'daylight',
  install: ({ app }) => app.enableDayNight({ startHour: 17, dayMinutes: 24 }),
};
