import { describe, expect, it } from 'vitest';
import { portraitFraming } from '../src/render';

// What the view takes in, bottom to top.
const span = ({ viewHeight, centerY }: { viewHeight: number; centerY: number }) => [centerY - viewHeight / 2, centerY + viewHeight / 2];

describe('portrait framing', () => {
  const aspect = 512 / 768;

  it('frames head and shoulders: the top half, a little room above the head', () => {
    const [bottom, top] = span(portraitFraming(2, 0.6, aspect, 'head'));
    expect(top).toBeGreaterThan(2);
    expect(top).toBeLessThan(2.1);
    expect(bottom).toBeGreaterThan(0.85);
    expect(bottom).toBeLessThan(1.05);
  });

  it('frames the full body, feet to head', () => {
    const [bottom, top] = span(portraitFraming(2, 0.6, aspect, 'full'));
    expect(bottom).toBeLessThan(0);
    expect(top).toBeGreaterThan(2);
    expect(top - bottom).toBeLessThan(2.4);
  });

  it('widens the view for a wide model, keeping it whole across', () => {
    for (const framing of ['head', 'full'] as const) {
      const { viewHeight } = portraitFraming(1, 3, aspect, framing);
      expect(viewHeight * aspect).toBeGreaterThanOrEqual(3);
      const [bottom, top] = span(portraitFraming(1, 3, aspect, framing));
      expect(top).toBeGreaterThan(1);
      if (framing === 'full') expect(bottom).toBeLessThan(0);
    }
  });

  it('rejects a model or canvas of no size', () => {
    expect(() => portraitFraming(0, 1, aspect, 'head')).toThrow();
    expect(() => portraitFraming(1, 1, 0, 'head')).toThrow();
  });
});
