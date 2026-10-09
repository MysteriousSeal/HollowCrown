// A small label in a corner of the screen (the place the hero is near, the time of day). Hidden while it has no
// text; the page is touched only when its text changes.

import { element } from './overlay';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export class CornerLabel {
  readonly el: HTMLDivElement;
  private text: string | null = null;

  constructor(root: HTMLElement, corner: Corner, className = '') {
    this.el = element('div', `ui-label ui-${corner} ${className}`.trim());
    this.el.hidden = true;
    root.append(this.el);
  }

  // Its text (null: hidden).
  set(text: string | null): void {
    if (text === this.text) return;
    this.text = text;
    this.el.hidden = text === null;
    if (text !== null) this.el.textContent = text;
  }
}
