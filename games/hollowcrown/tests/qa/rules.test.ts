// QA: the studio's codebase rules, checked on every file. Files stay under 500 lines; the engine names none of the
// game's content (the engine's boundary test keeps a short list of words, this one takes every name the game's map
// draws); every feature file is installed from features/index.ts; no console.log is left in the source.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WORLD_MAP } from '../../src/data/world';

const ROOT = resolve(__dirname, '../../../..');
const GAME_SRC = resolve(__dirname, '../../src');
const ENGINE_SRC = resolve(ROOT, 'packages/engine/src');
const FEATURES = resolve(GAME_SRC, 'features');

// Every .ts file under a folder, skipping installed packages and build output.
const tsFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    if (f === 'node_modules' || f === 'dist' || f.startsWith('.')) return [];
    const path = join(dir, f);
    return statSync(path).isDirectory() ? tsFiles(path) : f.endsWith('.ts') ? [path] : [];
  });

const lines = (file: string) => readFileSync(file, 'utf8').split('\n').length;

describe('codebase rules', () => {
  it('keeps every .ts file under packages/ and games/ under 500 lines', () => {
    const long = [...tsFiles(resolve(ROOT, 'packages')), ...tsFiles(resolve(ROOT, 'games'))]
      .filter((f) => lines(f) > 500)
      .map((f) => `${relative(ROOT, f)}: ${lines(f)} lines`);
    expect(long).toEqual([]);
  });

  it("names none of the game's places, areas or regions in the engine", () => {
    // Every id and name the map draws, as whole words: "brindleford", "the pilgrim's shrine", "tallow-green"...
    const named = [...WORLD_MAP.areas, ...WORLD_MAP.places].flatMap((x) => [x.id, x.name ?? '']);
    const words = [...new Set(named.map((n) => n.toLowerCase().replace(/^the /, '')).filter((n) => n.length >= 5))];
    const breaches: string[] = [];
    for (const file of tsFiles(ENGINE_SRC)) {
      const source = readFileSync(file, 'utf8').toLowerCase();
      for (const w of words) {
        const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escaped}\\b`).test(source)) breaches.push(`${relative(ROOT, file)}: "${w}"`);
      }
    }
    expect(breaches).toEqual([]);
  });

  it('installs every feature in src/features/ from features/index.ts', () => {
    const index = readFileSync(join(FEATURES, 'index.ts'), 'utf8');
    const helpers = new Set(['index.ts', 'context.ts']);
    const missing = readdirSync(FEATURES)
      .filter((f) => f.endsWith('.ts') && !helpers.has(f))
      .map((f) => basename(f, '.ts'))
      .filter((name) => !new RegExp(`from '\\./${name}'`).test(index));
    expect(missing).toEqual([]);
  });

  it('leaves no console.log in the source', () => {
    const logs = [...tsFiles(GAME_SRC), ...tsFiles(ENGINE_SRC)].flatMap((f) =>
      readFileSync(f, 'utf8')
        .split('\n')
        .flatMap((line, i) => (/console\.log\(/.test(line) && !/^\s*\/\//.test(line) ? [`${relative(ROOT, f)}:${i + 1}`] : [])),
    );
    expect(logs).toEqual([]);
  });
});
