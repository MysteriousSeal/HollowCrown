import { defineConfig } from 'vite';

export default defineConfig({
  server: { strictPort: true },
  build: {
    rollupOptions: {
      // The game, and the creature model viewer (a dev tool: /models.html).
      input: { main: 'index.html', models: 'models.html' }, // (run from this folder: npm run build -w hollowcrown)
      output: {
        // three.js is most of the bundle and changes far less often than game code: its own chunk, cached apart.
        manualChunks: { three: ['three'] },
      },
    },
  },
});
