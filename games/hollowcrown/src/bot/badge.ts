// The bot's badge, top middle of the screen: "BOT", the game's speed, and what it's doing ("Walking to Brindleford —
// talk to Garrick Fenn"). Each new goal is logged too ([bot] …), for `npm run bot` to stream to the terminal.

export class BotBadge {
  private readonly el = document.createElement('div');
  private readonly goal = document.createElement('span');
  private shown = '';

  constructor(speed: number) {
    const tag = document.createElement('b');
    tag.textContent = speed === 1 ? 'BOT' : `BOT ×${speed}`;
    Object.assign(tag.style, { background: '#b8402e', color: '#fff4e0', padding: '1px 7px', borderRadius: '3px', marginRight: '9px', letterSpacing: '0.08em' });
    Object.assign(this.el.style, {
      position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: '50', pointerEvents: 'none',
      font: '600 13px/1.6 Georgia, serif', color: '#f3e6c8', background: 'rgba(20, 16, 12, 0.72)', padding: '4px 12px 4px 6px',
      borderRadius: '5px', whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 32px)', overflow: 'hidden', textOverflow: 'ellipsis',
    });
    this.el.dataset.bot = '';
    this.el.append(tag, this.goal);
    document.body.append(this.el);
  }

  // Shows (and logs) `goal`, if it's new.
  set(goal: string): void {
    if (goal === this.shown) return;
    this.shown = goal;
    this.goal.textContent = goal;
    console.info(`[bot] ${goal}`);
  }
}
