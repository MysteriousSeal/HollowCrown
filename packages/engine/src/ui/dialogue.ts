// A dialogue box low on the screen: who speaks, and their lines one at a time, the next on a key (Space, E or Enter by
// default). Past the last line it closes and says so. Its reading (which line, over or not) is a Dialogue, kept apart
// from the page.

import { element } from './overlay';

export interface DialogueData {
  speaker: string;
  lines: string[];
}

// Where a dialogue's reading is: its line, and whether it's over.
export class Dialogue {
  private index = 0;

  constructor(readonly data: DialogueData) {
    if (data.lines.length === 0) throw new Error(`dialogue of ${data.speaker}: no lines`);
  }

  get line(): string {
    return this.data.lines[this.index] ?? '';
  }

  get done(): boolean {
    return this.index >= this.data.lines.length;
  }

  get last(): boolean {
    return this.index === this.data.lines.length - 1;
  }

  // On to the next line: whether there was one.
  advance(): boolean {
    if (this.done) return false;
    this.index++;
    return !this.done;
  }
}

export const ADVANCE_KEYS = ['Space', 'KeyE', 'Enter'];

export class DialogueBox {
  readonly el = element('div', 'ui-dialogue');
  private readonly speaker = element('b', 'ui-dialogue-speaker');
  private readonly line = element('p', 'ui-dialogue-line');
  private readonly hint = element('small', 'ui-dialogue-hint');
  private reading: Dialogue | null = null;
  private onClose: (() => void) | undefined;
  private openedAt = 0;

  constructor(root: HTMLElement, private readonly keys = ADVANCE_KEYS) {
    this.el.append(this.speaker, this.line, this.hint);
    this.el.hidden = true;
    root.append(this.el);
    window.addEventListener('keydown', (event) => {
      // Not the key press that opened it, nor a held key's repeats.
      if (!this.reading || event.repeat || event.timeStamp <= this.openedAt || !this.keys.includes(event.code)) return;
      event.preventDefault();
      this.advance();
    });
  }

  get isOpen(): boolean {
    return this.reading !== null;
  }

  // Opens on `data`'s first line; `onClose` when its last is passed (or it's closed).
  open(data: DialogueData, onClose?: () => void): void {
    this.reading = new Dialogue(data);
    this.onClose = onClose;
    this.openedAt = performance.now();
    this.speaker.textContent = data.speaker;
    this.el.hidden = false;
    this.draw();
  }

  advance(): void {
    if (!this.reading) return;
    if (this.reading.advance()) this.draw();
    else this.close();
  }

  close(): void {
    if (!this.reading) return;
    this.reading = null;
    this.el.hidden = true;
    const onClose = this.onClose;
    this.onClose = undefined;
    onClose?.();
  }

  private draw(): void {
    const reading = this.reading!;
    this.line.textContent = reading.line;
    this.hint.textContent = reading.last ? 'Space · close' : 'Space · next';
  }
}
