// Combat: the hero's blow is bare-handed until they take up a weapon; the rusty knife hits harder.

import { describe, expect, it } from 'vitest';
import { HERO } from '../src/data/hero';
import { weaponOf } from '../src/features/combat';

describe('combat', () => {
  it('takes up the hardest-hitting weapon carried, none if there is none', () => {
    expect(weaponOf([])).toBeUndefined();
    expect(weaponOf(['red hen feather', 'rusty knife'])).toBe('rusty knife');
  });

  it('hits harder with the rusty knife than bare-handed', () => {
    expect(HERO.weapons['rusty knife'].damage).toBeGreaterThan(HERO.blow.damage);
  });
});
