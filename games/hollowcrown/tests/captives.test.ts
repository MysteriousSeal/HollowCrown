// Captives: Wat is held until he's found in MQ03 or his quest is over.

import { describe, expect, it } from 'vitest';
import { PEOPLE_DATA } from '../src/data/people';
import { freedFlag, isFree } from '../src/features/captives';
import { newBook } from '../src/systems/quests';

describe('captives', () => {
  it('holds Wat away from the smithy', () => {
    expect(PEOPLE_DATA.Wat.away).toBeDefined();
  });

  it('frees him once found, or once his quest is over', () => {
    const until = PEOPLE_DATA.Wat.away!.until;
    const book = newBook();
    expect(isFree(book, 'Wat', until)).toBe(false);
    book.flags[freedFlag('Wat')] = true;
    expect(isFree(book, 'Wat', until)).toBe(true);
    const done = newBook();
    done.quests.push({ quest: until, stage: 'x', done: [], finished: true });
    expect(isFree(done, 'Wat', until)).toBe(true);
  });
});
