// Saving: a save and its load put back where the hero stood, their health, the quest book (into the same object the
// HUD follows), the hour and the last rest; a quest stage begun asks for an autosave.

import { describe, expect, it } from 'vitest';
import { World } from '@voxel/engine/ecs';
import { Health, TimeOfDay, Transform } from '@voxel/engine/gameplay';
import { AutosaveNow, Persistent, SaveGame, type SaveStorage } from '@voxel/engine/save';
import { QUESTS } from '../src/data/quests';
import { Quests, completeObjective, newBook, startQuest } from '../src/systems/quests';
import { LastRest } from '../src/systems/respawn';
import { autosaveMoments, lastingName, saveSchema } from '../src/systems/save';

const memory = (): SaveStorage => {
  const kept = new Map<string, string>();
  return {
    getItem: (k: string) => kept.get(k) ?? null,
    setItem: (k: string, v: string) => void kept.set(k, v),
    removeItem: (k: string) => void kept.delete(k),
    get length() {
      return kept.size;
    },
    key: (i: number) => [...kept.keys()][i] ?? null,
  };
};

const world = () => {
  const w = new World();
  w.setResource(TimeOfDay, { hours: 19, rate: 1 });
  w.setResource(LastRest, null);
  const book = w.setResource(Quests, newBook());
  startQuest(book, QUESTS, 'MQ01');
  const hero = w.spawn([Persistent, lastingName.hero], [Transform, { x: 480, y: 0, z: 3380, facing: 0 }], [Health, { hp: 30, max: 30 }]);
  return { w, book, hero };
};

describe('save', () => {
  it('puts back the hero, the quest book (the same object), the hour and the last rest', () => {
    const { w, book, hero } = world();
    const saves = new SaveGame(w, saveSchema(w), 'test', memory());
    completeObjective(book, QUESTS, 'MQ01', 'bowl');
    Object.assign(w.read(hero, Transform), { x: 600, z: 3400 });
    w.read(hero, Health).hp = 12;
    w.resource(TimeOfDay).hours = 20;
    w.setResource(LastRest, { x: 906, z: 3346 });
    saves.save('1', 'test');

    Object.assign(w.read(hero, Transform), { x: 0, z: 0 });
    w.read(hero, Health).hp = 1;
    completeObjective(book, QUESTS, 'MQ01', 'feather');
    w.resource(TimeOfDay).hours = 3;
    w.setResource(LastRest, null);
    expect(saves.load('1')).toBe(true);

    expect(w.read(hero, Transform)).toMatchObject({ x: 600, z: 3400 });
    expect(w.read(hero, Health).hp).toBe(12);
    expect(w.resource(Quests)).toBe(book);
    expect(book.quests[0].done).toEqual(['bowl']);
    expect(book.items).toEqual(['rusty knife']);
    expect(w.resource(TimeOfDay).hours).toBe(20);
    expect(w.resource(LastRest)).toEqual({ x: 906, z: 3346 });
  });

  it('asks for an autosave as a quest stage begins', () => {
    const { w, book } = world();
    const moments = autosaveMoments();
    moments.update(w, 1 / 60);
    expect(w.eventsOf(AutosaveNow)).toHaveLength(0);
    for (const id of ['feather', 'bowl', 'first-words']) completeObjective(book, QUESTS, 'MQ01', id);
    moments.update(w, 1 / 60);
    expect(w.eventsOf(AutosaveNow).at(-1)?.label).toBe('The Stranger at the Ford: The road east');
  });
});
