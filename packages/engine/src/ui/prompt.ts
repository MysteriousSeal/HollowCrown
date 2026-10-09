// What a key would do, low in the middle of the screen: a keycap ("E") and the action ("Talk to the miller"). Hidden
// while there's nothing to do; the page is touched only when it changes.

import { element } from './overlay';

export class Prompt {
  readonly el = element('div', 'ui-prompt');
  private readonly key = element('kbd', 'ui-key');
  private readonly text = element('span', 'ui-prompt-text');
  private shown: string | null = null;

  constructor(root: HTMLElement) {
    this.el.append(this.key, this.text);
    this.el.hidden = true;
    root.append(this.el);
  }

  // The key and what it does (no key: hidden).
  set(key: string | null, text = ''): void {
    const shown = key === null ? null : `${key}\n${text}`;
    if (shown === this.shown) return;
    this.shown = shown;
    this.el.hidden = key === null;
    if (key === null) return;
    this.key.textContent = key;
    this.text.textContent = text;
  }
}
