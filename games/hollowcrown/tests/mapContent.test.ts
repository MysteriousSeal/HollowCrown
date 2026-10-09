// What the map screen shows of the Vale: every region named at its middle, a mark for each named place but the
// buildings and fixtures.

import { describe, expect, it } from 'vitest';
import { WORLD_MAP } from '../src/data/world';
import { mapLabels, mapMarks } from '../src/ui/mapContent';

describe('the map content', () => {
  it('names Brindle Vale at its middle', () => {
    const vale = mapLabels(WORLD_MAP).find((l) => l.text === 'Brindle Vale')!;
    expect([vale.x, vale.z]).toEqual([900.5, 3400.5]);
  });

  it('marks Brindleford and the shrine, not a building or the well', () => {
    const names = mapMarks(WORLD_MAP).map((m) => m.name);
    expect(names).toContain('Brindleford');
    expect(names).toContain("The Pilgrim's Shrine");
    expect(names).not.toContain("Brindleford's well");
    expect(mapMarks(WORLD_MAP).length).toBeLessThan(WORLD_MAP.places.filter((p) => p.kind !== 'building').length);
  });
});
