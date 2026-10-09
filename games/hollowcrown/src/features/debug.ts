// In development only: the engine's debug overlay in the bottom-left (fps, draws, chunks, the hero's tile, the time).

import type { Feature } from './context';

export const debug: Feature = {
  name: 'debug',
  install: ({ app }) => {
    if (import.meta.env.DEV) app.enableDebugOverlay();
  },
};
