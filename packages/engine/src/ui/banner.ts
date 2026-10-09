// A banner across the screen (a region's name, its levels under it): fades in, stays a while, fades out. Shown
// again while up, it's rewritten and stays its full time from then. Its fade is the game's CSS, on `.shown`.

import { element } from './overlay';

export const BANNER_SECONDS = 4; // on screen before it fades, unless told otherwise

export class Banner {
  readonly el = element('div', 'ui-banner');
  private readonly title = element('b', 'ui-banner-title');
  private readonly sub = element('span', 'ui-banner-sub');
  private timer: ReturnType<typeof setTimeout> | undefined;
  private frame = 0;

  constructor(root: HTMLElement) {
    this.el.append(this.title, this.sub);
    root.append(this.el);
  }

  show(title: string, sub = '', seconds = BANNER_SECONDS): void {
    this.title.textContent = title;
    this.sub.textContent = sub;
    this.sub.hidden = !sub;
    this.cancel();
    // Shown on the next frame, so a banner just made still fades in.
    this.frame = requestAnimationFrame(() => this.el.classList.add('shown'));
    this.timer = setTimeout(() => this.hide(), seconds * 1000);
  }

  // Fades out now (and won't show on a frame still to come).
  hide(): void {
    this.cancel();
    this.el.classList.remove('shown');
  }

  private cancel(): void {
    cancelAnimationFrame(this.frame);
    clearTimeout(this.timer);
  }
}
