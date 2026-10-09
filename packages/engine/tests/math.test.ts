import { describe, expect, it } from 'vitest';
import { hashUnit, noise3, oneOf } from '../src/math';

describe('hashes', () => {
  it('are the same every time, in [0, 1), and differ by salt', () => {
    const values = Array.from({ length: 500 }, (_, i) => hashUnit(i, i * 3, 7));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(hashUnit(4, 9, 7)).toBe(hashUnit(4, 9, 7));
    expect(hashUnit(4, 9, 7)).not.toBe(hashUnit(4, 9, 8));
    expect(noise3(1, 2, 3, 4)).toBe(hashUnit(1 * 7 + 2 * 31, 3, 4));
  });

  it('spread evenly enough to pick from lists', () => {
    const picks = new Map<string, number>();
    for (let i = 0; i < 3000; i++) {
      const p = oneOf(['a', 'b', 'c'], hashUnit(i, 0, 1));
      picks.set(p, (picks.get(p) ?? 0) + 1);
    }
    for (const n of picks.values()) expect(n).toBeGreaterThan(800);
  });
});
