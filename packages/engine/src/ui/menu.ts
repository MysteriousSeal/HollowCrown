// A menu over the dimmed scene (a pause menu): a framed panel, its title, and its choices one under another, picked
// with a click, or the arrows and Enter. A choice may open a page of its own in the panel (the controls: each key and
// what it does; or any elements: a slider, a list of saves), with a way back. Each pick is told to `onPick` (a click's
// sound).

import { element } from './overlay';

export interface MenuItem {
  label: string;
  pick: () => void;
}

// A slider for a page: its label, its value (0 to 1) and what's told as it moves.
export function slider(label: string, value: number, onInput: (value: number) => void): HTMLElement {
  const row = element('label', 'ui-menu-slider');
  const input = element('input', 'ui-slider');
  Object.assign(input, { type: 'range', min: '0', max: '100', step: '1', value: String(Math.round(value * 100)) });
  const shown = element('span', 'ui-slider-value', `${Math.round(value * 100)}`);
  input.addEventListener('input', () => {
    shown.textContent = input.value;
    onInput(Number(input.value) / 100);
  });
  row.append(element('span', 'ui-menu-slider-label', label), input, shown);
  return row;
}

export class Menu {
  onPick: (() => void) | undefined;
  readonly el = element('div', 'ui-menu');
  private readonly panel = element('div', 'ui-menu-panel');
  private readonly title = element('b', 'ui-menu-title');
  private readonly body = element('div', 'ui-menu-body');
  private items: MenuItem[] = [];
  private buttons: HTMLButtonElement[] = [];
  private focus = 0;

  constructor(root: HTMLElement, private readonly heading: string) {
    this.panel.append(this.title, this.body);
    this.el.append(this.panel);
    this.el.hidden = true;
    root.append(this.el);
    window.addEventListener('keydown', (event) => {
      if (!this.isOpen || !this.buttons.length) return;
      if (event.code === 'ArrowDown' || event.code === 'KeyS') this.move(1);
      else if (event.code === 'ArrowUp' || event.code === 'KeyW') this.move(-1);
      else if (event.code === 'Enter' || event.code === 'Space') this.buttons[this.focus]?.click();
      else return;
      event.preventDefault();
    });
  }

  get isOpen(): boolean {
    return !this.el.hidden;
  }

  // Opens on its choices.
  open(items: MenuItem[]): void {
    this.items = items;
    this.el.hidden = false;
    this.showItems();
  }

  close(): void {
    this.el.hidden = true;
  }

  // A page of its own: `rows` of a key and what it does, and Back to the choices.
  page(title: string, rows: Array<[string, string]>): void {
    const list = element('dl', 'ui-menu-rows');
    for (const [key, text] of rows) list.append(element('dt', 'ui-key', key), element('dd', 'ui-menu-row-text', text));
    this.pageOf(title, [list]);
  }

  // A page of its own: `content`, then `items` (choices of its own), and Back to the choices.
  pageOf(title: string, content: HTMLElement[], items: MenuItem[] = []): void {
    this.title.textContent = title;
    this.body.replaceChildren(...content);
    this.setButtons([...items, { label: 'Back', pick: () => this.showItems() }]);
  }

  private showItems(): void {
    this.title.textContent = this.heading;
    this.body.replaceChildren();
    this.setButtons(this.items);
  }

  private setButtons(items: MenuItem[]): void {
    this.buttons = items.map(({ label, pick }, i) => {
      const button = element('button', 'ui-menu-item', label);
      button.addEventListener('click', () => {
        this.onPick?.();
        pick();
      });
      button.addEventListener('mouseenter', () => this.move(i - this.focus));
      return button;
    });
    this.body.append(...this.buttons);
    this.focus = 0;
    this.move(0);
  }

  // The lit choice, `by` up or down (wrapping).
  private move(by: number): void {
    const n = this.buttons.length;
    this.focus = (((this.focus + by) % n) + n) % n;
    this.buttons.forEach((b, i) => b.classList.toggle('lit', i === this.focus));
  }
}
