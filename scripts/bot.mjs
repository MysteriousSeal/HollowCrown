#!/usr/bin/env node
// `npm run bot [-- --speed N]`: the game played by its bot (games/hollowcrown/src/bot) in a Chromium window you can
// watch. Reuses the dev server on :5173 if it's up, else starts one (`npm run dev`) and waits for it; opens /?bot; and
// streams the bot's goals and any page errors here until the window is closed.

import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'http://localhost:5173';
const CACHE = join(homedir(), 'Library', 'Caches', 'ms-playwright');

// --speed N (the game's pace, 0.25 to 50; default the game's own, 10).
const speedArg = process.argv.indexOf('--speed');
const speed = speedArg > 0 ? Number(process.argv[speedArg + 1]) : null;
if (speed !== null && !(speed >= 0.25 && speed <= 50)) {
  console.error('bot: --speed takes a number from 0.25 to 50');
  process.exit(1);
}

const stamp = () => new Date().toTimeString().slice(0, 8);
const say = (text) => console.log(`${stamp()}  ${text}`);

const up = async () => {
  try {
    return (await fetch(URL, { signal: AbortSignal.timeout(1500) })).ok;
  } catch {
    return false;
  }
};

// The dev server: the one running, else one started here (stopped again on the way out).
async function devServer() {
  if (await up()) {
    say(`dev server already up at ${URL}`);
    return null;
  }
  say('starting the dev server (npm run dev)…');
  const server = spawn('npm', ['run', 'dev'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], detached: false });
  for (let waited = 0; waited < 60_000; waited += 500) {
    if (server.exitCode !== null) throw new Error(`the dev server stopped (code ${server.exitCode})`);
    if (await up()) return server;
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill();
  throw new Error(`the dev server didn't answer at ${URL} within a minute`);
}

// The Chromium cached by Playwright, newest first: for when its own build isn't there.
function cachedChromium() {
  const builds = existsSync(CACHE) ? readdirSync(CACHE).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : [];
  for (const build of builds) {
    for (const app of ['chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing']) {
      const path = join(CACHE, build, app);
      if (existsSync(path)) return path;
    }
  }
  return undefined;
}

async function main() {
  const server = await devServer();
  const options = { headless: false, args: ['--window-size=1440,900'] };
  let browser;
  try {
    browser = await chromium.launch(options);
  } catch {
    const executablePath = cachedChromium();
    if (!executablePath) throw new Error('no Chromium found: npx playwright install chromium');
    browser = await chromium.launch({ ...options, executablePath });
  }
  const stop = () => {
    server?.kill();
    process.exit(0);
  };
  browser.on('disconnected', stop);
  process.on('SIGINT', () => browser.close().finally(stop));

  const page = await (await browser.newContext({ viewport: null })).newPage();
  page.on('console', (message) => {
    const text = message.text();
    if (text.startsWith('[bot]')) say(text.slice(6));
    else if (message.type() === 'error') say(`console error: ${text}`);
  });
  page.on('pageerror', (error) => say(`page error: ${error.message}`));
  page.on('close', () => browser.close());
  const address = `${URL}/?bot${speed !== null ? `&speed=${speed}` : ''}`;
  say(`opening ${address} — close the window to stop`);
  await page.goto(address);
}

main().catch((error) => {
  console.error(`bot: ${error.message}`);
  process.exit(1);
});
