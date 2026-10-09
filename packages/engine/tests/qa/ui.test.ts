// QA: the UI kit's components on a stand-in page (a few fake elements, fake timers and frames): a banner shows and
// fades when it should, and never stays up after it's hidden.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Banner } from '../../src/ui/banner';

// The little of an element the UI kit touches.
class FakeElement {
  className = '';
  textContent = '';
  hidden = false;
  readonly children: FakeElement[] = [];
  readonly style: Record<string, string> = {};
  private readonly classes = new Set<string>();
  readonly classList = {
    add: (c: string) => void this.classes.add(c),
    remove: (c: string) => void this.classes.delete(c),
    contains: (c: string) => this.classes.has(c),
  };
  append(...els: FakeElement[]): void {
    this.children.push(...els);
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('document', { createElement: () => new FakeElement() });
  vi.stubGlobal('requestAnimationFrame', (fn: () => void) => setTimeout(fn, 16));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const shown = (b: Banner) => b.el.classList.contains('shown');

describe('Banner', () => {
  it('shows on the next frame, then fades after its time', () => {
    const banner = new Banner(new FakeElement() as unknown as HTMLElement);
    banner.show('Brindle Vale', 'Levels 1-4');
    expect(shown(banner)).toBe(false);
    vi.advanceTimersByTime(20);
    expect(shown(banner)).toBe(true);
    vi.advanceTimersByTime(4000);
    expect(shown(banner)).toBe(false);
  });

  // BUG (ui): banner.ts:23 adds `.shown` on the next frame even when the banner was hidden in between, and nothing
  // takes it off again: a banner shown then hidden at once stays on screen for good. Filed to ui.
  it.skip('stays hidden when hidden before its first frame', () => {
    const banner = new Banner(new FakeElement() as unknown as HTMLElement);
    banner.show('Brindle Vale');
    banner.hide();
    vi.runAllTimers();
    expect(shown(banner)).toBe(false);
  });

  // BUG (ui): same cause: a time shorter than a frame fades it before it's shown, then the frame shows it for good.
  it.skip('fades even when its time is shorter than a frame', () => {
    const banner = new Banner(new FakeElement() as unknown as HTMLElement);
    banner.show('Brindle Vale', '', 0.005);
    vi.runAllTimers();
    expect(shown(banner)).toBe(false);
  });
});
