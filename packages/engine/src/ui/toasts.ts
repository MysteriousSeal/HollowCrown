// Short notices sliding in at the screen's edge ("Quest started", "New place"), a few at a time, each for a while;
// the rest wait their turn. Which are up is a ToastQueue, kept apart from the page; the slide is the game's CSS
// (`.shown`, `.leaving`).

import { element } from './overlay';

export const TOAST_SECONDS = 4; // on screen, each
export const TOASTS_AT_ONCE = 3;

export interface Toast {
  title: string;
  text?: string;
}

// Which notices are up and which wait, by the time (seconds).
export class ToastQueue {
  readonly waiting: Toast[] = [];
  readonly up: Array<{ toast: Toast; until: number }> = [];

  constructor(readonly seconds = TOAST_SECONDS, readonly atOnce = TOASTS_AT_ONCE) {}

  push(toast: Toast): void {
    this.waiting.push(toast);
  }

  // At `now`: the notices whose time is up (to take down), and those coming up (to put up).
  update(now: number): { gone: Toast[]; shown: Toast[] } {
    const gone: Toast[] = [];
    while (this.up.length && this.up[0].until <= now) gone.push(this.up.shift()!.toast);
    const shown: Toast[] = [];
    while (this.waiting.length && this.up.length < this.atOnce) {
      const toast = this.waiting.shift()!;
      this.up.push({ toast, until: now + this.seconds });
      shown.push(toast);
    }
    return { gone, shown };
  }
}

export class Toasts {
  readonly el = element('div', 'ui-toasts');
  private readonly queue: ToastQueue;
  private readonly elements = new Map<Toast, HTMLElement>();
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(root: HTMLElement, seconds = TOAST_SECONDS, atOnce = TOASTS_AT_ONCE) {
    this.queue = new ToastQueue(seconds, atOnce);
    root.append(this.el);
  }

  push(title: string, text?: string): void {
    this.queue.push({ title, text });
    this.update();
    this.timer ??= setInterval(() => this.update(), 250);
  }

  private update(): void {
    const { gone, shown } = this.queue.update(performance.now() / 1000);
    for (const toast of gone) {
      const el = this.elements.get(toast)!;
      this.elements.delete(toast);
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 400);
    }
    for (const toast of shown) {
      const el = element('div', 'ui-toast');
      el.append(element('b', 'ui-toast-title', toast.title));
      if (toast.text) el.append(element('span', 'ui-toast-text', toast.text));
      this.el.append(el);
      this.elements.set(toast, el);
      requestAnimationFrame(() => el.classList.add('shown'));
    }
    if (!this.queue.up.length && !this.queue.waiting.length) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
