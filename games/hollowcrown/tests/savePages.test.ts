// The Save and Load pages' words: when a save was made, and the next free slot.

import { describe, expect, it } from 'vitest';
import { freeSlot, savedWhen } from '../src/ui/savePages';

describe('the save pages', () => {
  it('say when a save was made', () => {
    const now = 1_000_000_000;
    expect(savedWhen(now - 10_000, now)).toBe('just now');
    expect(savedWhen(now - 12 * 60_000, now)).toBe('12 min ago');
    expect(savedWhen(now - 3 * 3_600_000, now)).toBe('3 h ago');
  });

  it('find the first free slot, none once all are used', () => {
    const info = (slot: string) => ({ slot, label: '', savedAt: 0 });
    expect(freeSlot([])).toBe('save-1');
    expect(freeSlot([info('save-1'), info('save-3')])).toBe('save-2');
    expect(freeSlot([info('save-1'), info('save-2')], 2)).toBeNull();
  });
});
