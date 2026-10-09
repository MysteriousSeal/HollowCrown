// The tests of every package: never the studio's worktrees (.claude/worktrees: full copies of the repo).
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: { exclude: [...configDefaults.exclude, '.claude/**'] },
});
