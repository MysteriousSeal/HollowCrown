// A small panel on the screen's edge following one thing (a quest): its title, a line under it (a stage), and what's
// to do now. Hidden while it follows nothing; the page is touched only when it changes.

import { element } from './overlay';

export interface TrackerText {
  title: string;
  sub?: string;
  line: string;
}

export class TrackerPanel {
  readonly el = element('div', 'ui-tracker');
  private readonly title = element('b', 'ui-tracker-title');
  private readonly sub = element('small', 'ui-tracker-sub');
  private readonly line = element('p', 'ui-tracker-line');
  private shown = '';

  constructor(root: HTMLElement) {
    this.el.append(this.title, this.sub, this.line);
    this.el.hidden = true;
    root.append(this.el);
  }

  // What it shows (null: hidden).
  set(text: TrackerText | null): void {
    const shown = text ? `${text.title}\n${text.sub ?? ''}\n${text.line}` : '';
    if (shown === this.shown) return;
    this.shown = shown;
    this.el.hidden = !text;
    if (!text) return;
    this.title.textContent = text.title;
    this.sub.textContent = text.sub ?? '';
    this.sub.hidden = !text.sub;
    this.line.textContent = text.line;
  }
}
