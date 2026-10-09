// The UI kit's logic, without a page: a dialogue's reading, line by line to its end.

import { describe, expect, it } from 'vitest';
import { Dialogue } from '../src/ui/dialogue';

describe('Dialogue', () => {
  it('reads its lines in order, then is done', () => {
    const d = new Dialogue({ speaker: 'Miller', lines: ['One.', 'Two.'] });
    expect([d.line, d.last, d.done]).toEqual(['One.', false, false]);
    expect(d.advance()).toBe(true);
    expect([d.line, d.last, d.done]).toEqual(['Two.', true, false]);
    expect(d.advance()).toBe(false);
    expect(d.done).toBe(true);
    expect(d.advance()).toBe(false);
  });

  it('refuses a dialogue with no lines', () => {
    expect(() => new Dialogue({ speaker: 'Nobody', lines: [] })).toThrow(/no lines/);
  });
});
