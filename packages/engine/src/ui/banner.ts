// A banner across the screen (a region's name, its levels under it): fades in, stays a while, fades out. Shown
// again while up, it's rewritten and stays its full time from then. Its fade is the game's CSS, on `.shown`.

import { element } from './overlay';

export const BANNER_SECONDS = 4; // on screen before it fades, unless told otherwise

export class Banner {
  readonly el = element('div', 'ui-banner');
  private readonly title = element('b', 'ui-banner-title');
  private readonly sub = element('span', 'ui-banner-sub');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(root: HTMLElement) {
    this.el.append(this.title, this.sub);
    root.append(this.el);
  }

  show(title: string, sub = '', seconds = BANNER_SECONDS): void {
    this.title.textContent = title;
    this.sub.textContent = sub;
    this.sub.hidden = !sub;
    // Shown on the next frame, so a banner just made still fades in.
    requestAnimationFrame(() => this.el.classList.add('shown'));
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.el.classList.remove('shown'), seconds * 1000);
  }

  hide(): void {
    clearTimeout(this.timer);
    this.el.classList.remove('shown');
  }
}
