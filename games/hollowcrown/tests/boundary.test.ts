// The game reaches the engine only through its public entry points (its package's exports), never into its files.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = resolve(__dirname, '../src');
const ENGINE = JSON.parse(readFileSync(resolve(__dirname, '../../../packages/engine/package.json'), 'utf8')) as { exports: Record<string, string> };
const PUBLIC = new Set(Object.keys(ENGINE.exports).map((k) => `@voxel/engine${k.slice(1)}`));
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : f.endsWith('.ts') ? [join(dir, f)] : []));

describe('game boundary', () => {
  for (const file of files(SRC)) {
    const name = relative(SRC, file);
    it(`${name} uses only the engine's public entry points`, () => {
      for (const [, spec] of readFileSync(file, 'utf8').matchAll(/from '([^']+)'/g)) {
        if (spec.startsWith('@voxel/engine')) expect(PUBLIC.has(spec), `${name}: ${spec}`).toBe(true);
        expect(spec.includes('packages/engine'), `${name}: ${spec}`).toBe(false);
      }
    });
  }
});
