// The UI's root: a layer laid over the canvas that never takes the mouse, and the one helper every component makes
// its elements with. The look is the game's: every element carries a `ui-` class for its CSS to style.

// An element of `tag` with `className`, and its text (if any).
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// The overlay over the whole screen (on `parent`, the page's body by default), for the UI's components to sit in.
export function createOverlay(parent: HTMLElement = document.body): HTMLElement {
  const root = element('div', 'ui-overlay');
  Object.assign(root.style, { position: 'fixed', inset: '0', pointerEvents: 'none', overflow: 'hidden', zIndex: '10' });
  parent.append(root);
  return root;
}
