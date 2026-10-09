// A journal over the dimmed scene: a framed book, its entries listed down the left (a quest each), the one picked
// open on the right: its title, a line under it (its stage), its items (objectives; the done ones struck through) and
// a passage of text. An entry is picked with a click, or the arrows (or W and S).

import { element } from './overlay';

export interface JournalItem {
  text: string;
  done: boolean;
  optional?: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  sub?: string;
  items: JournalItem[];
  text?: string;
  finished?: boolean;
}

export class JournalScreen {
  readonly el = element('div', 'ui-journal');
  private readonly list = element('ol', 'ui-journal-list');
  private readonly page = element('div', 'ui-journal-page');
  private entries: JournalEntry[] = [];
  private picked = 0;

  constructor(root: HTMLElement, title = 'Journal') {
    const book = element('div', 'ui-journal-book');
    const head = element('b', 'ui-journal-head', title);
    const body = element('div', 'ui-journal-body');
    body.append(this.list, this.page);
    book.append(head, body, element('small', 'ui-journal-hint', 'J · close'));
    this.el.append(book);
    this.el.hidden = true;
    root.append(this.el);
    window.addEventListener('keydown', (event) => {
      if (!this.isOpen || !this.entries.length) return;
      if (event.code === 'ArrowDown' || event.code === 'KeyS') this.pick(this.picked + 1);
      else if (event.code === 'ArrowUp' || event.code === 'KeyW') this.pick(this.picked - 1);
      else return;
      event.preventDefault();
    });
  }

  get isOpen(): boolean {
    return !this.el.hidden;
  }

  // Opens on `entries`, the one picked before (by its id) still picked if it's there.
  open(entries: JournalEntry[]): void {
    const was = this.entries[this.picked]?.id;
    this.entries = entries;
    this.list.replaceChildren(
      ...entries.map((entry, i) => {
        const item = element('li', `ui-journal-entry${entry.finished ? ' finished' : ''}`, entry.title);
        item.addEventListener('click', () => this.pick(i));
        return item;
      }),
    );
    this.el.hidden = false;
    this.pick(Math.max(0, entries.findIndex((e) => e.id === was)));
  }

  close(): void {
    this.el.hidden = true;
  }

  private pick(index: number): void {
    const n = this.entries.length;
    if (!n) {
      this.page.replaceChildren(element('p', 'ui-journal-empty', 'Nothing written yet.'));
      return;
    }
    this.picked = ((index % n) + n) % n;
    Array.from(this.list.children).forEach((li, i) => li.classList.toggle('lit', i === this.picked));
    const entry = this.entries[this.picked];
    const items = element('ul', 'ui-journal-items');
    for (const { text, done, optional } of entry.items) {
      items.append(element('li', `ui-journal-item${done ? ' done' : ''}${optional ? ' optional' : ''}`, text));
    }
    this.page.replaceChildren(
      element('b', 'ui-journal-title', entry.title),
      ...(entry.sub ? [element('small', 'ui-journal-sub', entry.sub)] : []),
      items,
      ...(entry.text ? [element('p', 'ui-journal-text', entry.text)] : []),
    );
  }
}
