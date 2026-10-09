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
import { MapView, cssColor } from '../src/ui/mapImage';
import { ToastQueue } from '../src/ui/toasts';
import { meterShare } from '../src/ui/meter';

describe('meterShare', () => {
  it('is the share full, kept between empty and full', () => {
    expect([meterShare(25, 50), meterShare(-5, 50), meterShare(80, 50), meterShare(3, 0)]).toEqual([0.5, 0, 1, 0]);
  });
});
import { fadeByDistance } from '../src/ui/worldLabels';

describe('fadeByDistance', () => {
  it('is whole when near, gone when far, between in between', () => {
    expect([fadeByDistance(1, 4, 8), fadeByDistance(6, 4, 8), fadeByDistance(9, 4, 8)]).toEqual([1, 0.5, 0]);
  });
});

describe('ToastQueue', () => {
  it('puts up a few at a time, the rest as those go', () => {
    const q = new ToastQueue(4, 2);
    for (const title of ['a', 'b', 'c']) q.push({ title });
    expect(q.update(0).shown.map((t) => t.title)).toEqual(['a', 'b']);
    expect(q.update(3)).toEqual({ gone: [], shown: [] });
    const { gone, shown } = q.update(4);
    expect([gone.map((t) => t.title), shown.map((t) => t.title)]).toEqual([['a', 'b'], ['c']]);
    expect(q.update(8).gone.map((t) => t.title)).toEqual(['c']);
  });
});

describe('MapView', () => {
  it('puts its centre mid-screen and others by its zoom', () => {
    const view = new MapView(100, 200, 2);
    expect(view.toScreen(100, 200, 800, 600)).toEqual([400, 300]);
    expect(view.toScreen(110, 195, 800, 600)).toEqual([420, 290]);
  });

  it('keeps its zoom within bounds', () => {
    const view = new MapView(0, 0, 10, 0.25, 4);
    expect(view.zoom).toBe(4);
    expect(view.zoomBy(0.001)).toBe(0.25);
  });

  it('writes colors as CSS', () => {
    expect(cssColor(0x3b6a86)).toBe('#3b6a86');
    expect(cssColor(0x00000f)).toBe('#00000f');
  });
});

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
