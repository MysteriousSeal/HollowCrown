// The engine stands alone: it imports only three.js and its own files, and names nothing of any game.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = resolve(__dirname, '../src');
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : f.endsWith('.ts') ? [join(dir, f)] : []));
const GAME_WORDS = /hollowcrown|greenhood|barrowborn|regency|carrow|hrathgar|bestiary/i;

describe('engine boundary', () => {
  for (const file of files(SRC)) {
    const name = relative(SRC, file);
    it(`${name} imports only three.js and the engine`, () => {
      const source = readFileSync(file, 'utf8');
      for (const [, spec] of source.matchAll(/from '([^']+)'/g)) {
        if (spec === 'three' || spec.startsWith('three/')) continue;
        expect(spec.startsWith('.'), `${name}: ${spec}`).toBe(true);
        expect(resolve(dirname(file), spec).startsWith(SRC), `${name}: ${spec} leaves the engine`).toBe(true);
      }
      expect(GAME_WORDS.test(source), `${name} names a game's content`).toBe(false);
    });
  }
});
