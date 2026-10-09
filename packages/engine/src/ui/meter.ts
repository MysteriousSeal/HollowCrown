// A meter (health, stamina): a bar filled to its share, the share just lost lingering a moment behind it before it
// drains (the game's CSS: a transition on `.ui-meter-trail`), its numbers on it ("34 / 50"). The page is touched
// only when its value changes.

import { element } from './overlay';

// How full a meter of `value` out of `max` is, 0 to 1.
export function meterShare(value: number, max: number): number {
  return max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
}

export class Meter {
  readonly el: HTMLDivElement;
  private readonly trail = element('i', 'ui-meter-trail');
  private readonly fill = element('i', 'ui-meter-fill');
  private readonly text = element('span', 'ui-meter-text');
  private shown = '';

  constructor(root: HTMLElement, className = '', private readonly numbers = true) {
    this.el = element('div', `ui-meter ${className}`.trim());
    this.el.append(this.trail, this.fill, this.text);
    root.append(this.el);
  }

  set(value: number, max: number): void {
    const shown = `${value}/${max}`;
    if (shown === this.shown) return;
    this.shown = shown;
    const share = `${(meterShare(value, max) * 100).toFixed(1)}%`;
    this.fill.style.width = this.trail.style.width = share;
    this.text.textContent = this.numbers ? `${Math.max(0, Math.ceil(value))} / ${max}` : '';
    this.el.classList.toggle('low', meterShare(value, max) <= 0.25);
  }
}
