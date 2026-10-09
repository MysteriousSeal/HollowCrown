// A conversation, as a visual novel draws one: the scene dimmed behind, two people facing each other in large
// portraits (left and right), each with a name plate under it, and the lines between them in a panel in the middle,
// the next on a key (E or Enter by default) or a click. Its reading (which line, who speaks) is a Script, kept
// apart from the page.

import { element } from './overlay';

export type Side = 'left' | 'right';

// One side of a conversation: a name, and a portrait (a canvas or an image; none: an empty frame).
export interface Speaker {
  name: string;
  portrait?: HTMLCanvasElement | HTMLImageElement;
}

// A line, who says it (`who`: someone else than that side's speaker, a third voice; its portrait still lit), and
// the replies offered once it's said (picked with a click or 1-9; the conversation goes on after).
export interface ConversationLine {
  side: Side;
  text: string;
  who?: string;
  choices?: string[];
}

// What's told of a reply picked: the line it answered (its index) and which reply (its index).
export type OnChoice = (line: number, choice: number) => void;

// Where a conversation's reading is: its line (and who says it), and whether it's over.
export class Script {
  private index = 0;

  constructor(readonly lines: ConversationLine[]) {
    if (lines.length === 0) throw new Error('conversation: no lines');
  }

  get at(): number {
    return this.index;
  }

  get line(): ConversationLine {
    return this.lines[Math.min(this.index, this.lines.length - 1)];
  }

  get done(): boolean {
    return this.index >= this.lines.length;
  }

  get last(): boolean {
    return this.index === this.lines.length - 1;
  }

  // On to the next line: whether there was one.
  advance(): boolean {
    if (this.done) return false;
    this.index++;
    return !this.done;
  }
}

export const TYPE_SPEED = 45; // letters a second

// A line written out a letter at a time (`speed`: letters a second); finished at once on asking.
export class Typewriter {
  private shown = 0;

  constructor(readonly text: string, readonly speed = TYPE_SPEED) {}

  get done(): boolean {
    return this.shown >= this.text.length;
  }

  // The text shown so far, `dt` seconds on.
  tick(dt: number): string {
    this.shown = Math.min(this.text.length, this.shown + dt * this.speed);
    return this.visible;
  }

  get visible(): string {
    return this.text.slice(0, Math.floor(this.shown));
  }

  finish(): string {
    this.shown = this.text.length;
    return this.text;
  }
}

export const TALK_KEYS = ['KeyE', 'Enter']; // (not Space: a game's attack, often)

// One side's portrait and name plate.
class Portrait {
  readonly el: HTMLDivElement;
  private readonly frame = element('div', 'ui-talk-frame');
  private readonly plate = element('div', 'ui-talk-plate');

  constructor(side: Side) {
    this.el = element('div', `ui-talk-side ui-talk-${side}`);
    this.el.append(this.frame, this.plate);
  }

  // Its speaker (none: no name and no portrait, the side left empty, `.absent`).
  set(speaker: Speaker): void {
    this.el.classList.toggle('absent', !speaker.name && !speaker.portrait);
    this.plate.textContent = speaker.name;
    this.frame.replaceChildren(...(speaker.portrait ? [speaker.portrait] : []));
  }
}

export class Conversation {
  readonly el = element('div', 'ui-talk');
  private readonly sides: Record<Side, Portrait> = { left: new Portrait('left'), right: new Portrait('right') };
  private readonly speaker = element('b', 'ui-talk-speaker');
  private readonly text = element('p', 'ui-talk-text');
  private readonly hint = element('small', 'ui-talk-hint');
  private readonly choices = element('ol', 'ui-talk-choices');
  private onChoice: OnChoice | undefined;
  private names: Record<Side, string> = { left: '', right: '' };
  private script: Script | null = null;
  private onClose: (() => void) | undefined;
  private openedAt = 0;
  private typing: Typewriter | null = null;
  private frame = 0;

  constructor(root: HTMLElement, private readonly keys = TALK_KEYS) {
    const panel = element('div', 'ui-talk-panel');
    panel.append(this.speaker, this.text, this.choices, this.hint);
    this.el.append(this.sides.left.el, panel, this.sides.right.el);
    this.el.hidden = true;
    this.choices.hidden = true;
    root.append(this.el);
    window.addEventListener('keydown', (event) => {
      // Not the key press that opened it, nor a held key's repeats.
      if (!this.script || event.repeat || event.timeStamp <= this.openedAt) return;
      const pick = /^Digit([1-9])$/.exec(event.code);
      if (pick && this.asking) this.pick(Number(pick[1]) - 1);
      else if (this.keys.includes(event.code)) this.advance();
      else return;
      event.preventDefault();
    });
    this.el.addEventListener('click', () => this.advance());
  }

  // Whether replies are up, waiting for one to be picked.
  get asking(): boolean {
    return !this.choices.hidden;
  }

  get isOpen(): boolean {
    return this.script !== null;
  }

  // Opens between `left` (the hero, say) and `right`, on the first of `lines`; `onClose` when the last is passed (or
  // it's closed); `onChoice` when a reply is picked.
  open(left: Speaker, right: Speaker, lines: ConversationLine[], onClose?: () => void, onChoice?: OnChoice): void {
    this.script = new Script(lines);
    this.onClose = onClose;
    this.onChoice = onChoice;
    this.openedAt = performance.now();
    this.names = { left: left.name, right: right.name };
    this.sides.left.set(left);
    this.sides.right.set(right);
    this.el.hidden = false;
    this.draw();
  }

  // The line written out at once if it's still being written; else on to the next (past the last: closed).
  advance(): void {
    if (!this.script) return;
    if (this.typing && !this.typing.done) {
      this.text.textContent = this.typing.finish();
      this.offer();
      return;
    }
    if (this.asking) return;
    if (this.script.advance()) this.draw();
    else this.close();
  }

  // Picks reply `index` of the line's (if offered), and goes on.
  pick(index: number): void {
    const script = this.script;
    const offered = script?.line.choices ?? [];
    if (!script || !this.asking || index < 0 || index >= offered.length) return;
    this.choices.hidden = true;
    this.onChoice?.(script.at, index);
    if (this.script === script) this.advance();
  }

  close(): void {
    if (!this.script) return;
    this.script = null;
    this.typing = null;
    cancelAnimationFrame(this.frame);
    this.el.hidden = true;
    const onClose = this.onClose;
    this.onClose = undefined;
    onClose?.();
  }

  private draw(): void {
    const script = this.script!;
    const { side, text, who } = script.line;
    // The one speaking lit, the other dimmed (`.speaking` and `.listening`, styled by the game).
    for (const s of ['left', 'right'] as const) {
      this.sides[s].el.classList.toggle('speaking', s === side);
      this.sides[s].el.classList.toggle('listening', s !== side);
    }
    this.el.dataset.speaker = side;
    this.speaker.textContent = who ?? this.names[side];
    this.choices.hidden = true;
    this.type(text);
    this.hint.textContent = script.last ? 'E · close' : 'E · next';
  }

  // The line's replies, once it's all written out.
  private offer(): void {
    const offered = this.script?.line.choices;
    if (!offered?.length || this.asking) return;
    this.choices.replaceChildren(
      ...offered.map((choice, i) => {
        const item = element('li', 'ui-talk-choice', choice);
        item.addEventListener('click', (event) => {
          event.stopPropagation();
          this.pick(i);
        });
        return item;
      }),
    );
    this.choices.hidden = false;
    this.hint.textContent = '1-9 · reply';
  }

  // Writes `text` out a frame at a time.
  private type(text: string): void {
    cancelAnimationFrame(this.frame);
    const typing = (this.typing = new Typewriter(text));
    this.text.textContent = '';
    let last = performance.now();
    const step = (now: number): void => {
      if (this.typing !== typing) return;
      this.text.textContent = typing.tick(Math.max(0, now - last) / 1000);
      last = now;
      if (!typing.done) this.frame = requestAnimationFrame(step);
      else this.offer();
    };
    this.frame = requestAnimationFrame(step);
  }
}

// A stand-in portrait until a model's own is drawn: a head and shoulders in `color` on a dark ground.
export function placeholderPortrait(color = '#b98a46', width = 240, height = 300): HTMLCanvasElement {
  const canvas = element('canvas', 'ui-portrait-placeholder');
  [canvas.width, canvas.height] = [width, height];
  const g = canvas.getContext('2d');
  if (!g) return canvas;
  g.fillStyle = color;
  g.beginPath();
  g.ellipse(width / 2, height * 0.4, width * 0.17, height * 0.15, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(width / 2, height * 1.02, width * 0.4, height * 0.38, 0, Math.PI, 0);
  g.fill();
  return canvas;
}
