// A screen for an ending (the hero's death): the scene darkening to black and red behind, a great word in the
// middle ("You died"), a line under it, then its choices (Retry...) once the dark has settled. Picked with a click,
// or the arrows and Enter.

import type { MenuItem } from './menu';
import { element } from './overlay';

export const END_CHOICES_AFTER = 1.6; // seconds before the choices come up

export class EndScreen {
  readonly el = element('div', 'ui-end');
  private readonly title = element('b', 'ui-end-title');
  private readonly sub = element('span', 'ui-end-sub');
  private readonly choices = element('div', 'ui-end-choices');
  private buttons: HTMLButtonElement[] = [];
  private focus = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(root: HTMLElement) {
    this.el.append(this.title, this.sub, this.choices);
    this.el.hidden = true;
    root.append(this.el);
    window.addEventListener('keydown', (event) => {
      if (!this.isOpen || this.choices.hidden || !this.buttons.length) return;
      const by = event.code === 'ArrowDown' || event.code === 'ArrowRight' ? 1 : event.code === 'ArrowUp' || event.code === 'ArrowLeft' ? -1 : 0;
      if (by) this.light(this.focus + by);
      else if (event.code === 'Enter' || event.code === 'KeyE') this.buttons[this.focus].click();
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    });
  }

  get isOpen(): boolean {
    return !this.el.hidden;
  }

  open(title: string, sub: string, items: MenuItem[]): void {
    this.title.textContent = title;
    this.sub.textContent = sub;
    this.buttons = items.map(({ label, pick }, i) => {
      const button = element('button', 'ui-end-choice', label);
      button.addEventListener('click', pick);
      button.addEventListener('mouseenter', () => this.light(i));
      return button;
    });
    this.choices.replaceChildren(...this.buttons);
    this.choices.hidden = true;
    this.light(0);
    this.el.hidden = false;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.choices.hidden = false), END_CHOICES_AFTER * 1000);
  }

  close(): void {
    clearTimeout(this.timer);
    this.el.hidden = true;
  }

  private light(index: number): void {
    const n = this.buttons.length;
    if (!n) return;
    this.focus = ((index % n) + n) % n;
    this.buttons.forEach((b, i) => b.classList.toggle('lit', i === this.focus));
  }
}
