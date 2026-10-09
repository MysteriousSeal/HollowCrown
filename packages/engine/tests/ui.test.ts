// The UI kit's logic, without a page: a dialogue's reading, line by line to its end.

import { describe, expect, it } from 'vitest';
import { Script, Typewriter } from '../src/ui/conversation';

describe('Typewriter', () => {
  it('writes its line out at its speed, and all at once on asking', () => {
    const t = new Typewriter('Hello there', 10);
    expect(t.tick(0.25)).toBe('He');
    expect(t.tick(0.3)).toBe('Hello');
    expect(t.done).toBe(false);
    expect(t.finish()).toBe('Hello there');
    expect(t.done).toBe(true);
    expect(t.tick(1)).toBe('Hello there');
  });
});
import { Dialogue } from '../src/ui/dialogue';

describe('Script', () => {
  it('reads its lines and who says each, then is done', () => {
    const s = new Script([{ side: 'left', text: 'Well met.' }, { side: 'right', text: 'Is it?' }]);
    expect([s.line.side, s.last]).toEqual(['left', false]);
    expect(s.advance()).toBe(true);
    expect([s.line.side, s.line.text, s.last]).toEqual(['right', 'Is it?', true]);
    expect(s.advance()).toBe(false);
    expect(s.done).toBe(true);
  });

  it('refuses a conversation with no lines', () => {
    expect(() => new Script([])).toThrow(/no lines/);
  });
});

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
