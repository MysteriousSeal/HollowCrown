import { describe, expect, it } from 'vitest';
import { World } from '../src/ecs';
import { InReach, Interact, Interactable, Player, Transform, interactable, interactionSystem } from '../src/gameplay';
import { KeyboardResource, type Action, type Keyboard } from '../src/input';

// A keyboard stand-in: presses queued by the test (the real one listens to the window).
function fakeKeys() {
  const pressed = new Set<Action>();
  const keys = { isHeld: () => false, takePress: (a: Action) => pressed.delete(a) } as unknown as Keyboard;
  return { keys, press: (a: Action) => pressed.add(a) };
}

function scene() {
  const world = new World();
  const { keys, press } = fakeKeys();
  world.setResource(KeyboardResource, keys);
  const player = world.spawn([Player, true], [Transform, { x: 10, y: 0, z: 10, facing: 0 }]);
  const near = world.spawn([Transform, { x: 11, y: 0, z: 10, facing: 0 }], [Interactable, interactable('Talk', 1.5)]);
  const nearer = world.spawn([Transform, { x: 10, y: 0, z: 10.5, facing: 0 }], [Interactable, interactable('Open', 1)]);
  const far = world.spawn([Transform, { x: 14, y: 0, z: 10, facing: 0 }], [Interactable, interactable('Read', 2)]);
  return { world, press, player, near, nearer, far };
}

describe('interaction', () => {
  it('keeps the nearest interactable in reach, with its label', () => {
    const { world, nearer } = scene();
    interactionSystem.update(world, 0);
    expect(world.resource(InReach)).toEqual({ entity: nearer, label: 'Open' });
  });

  it('respects each one\'s own range', () => {
    const { world, player, near } = scene();
    world.read(player, Transform).z = 9; // the "Open" one now 1.5 away, past its range of 1
    interactionSystem.update(world, 0);
    expect(world.resource(InReach).entity).toBe(near);
    world.read(player, Transform).x = 0;
    interactionSystem.update(world, 0);
    expect(world.resource(InReach)).toEqual({ entity: null, label: '' });
  });

  it('emits Interact once on a press with one in reach', () => {
    const { world, press, player, nearer } = scene();
    interactionSystem.update(world, 0);
    expect(world.eventsOf(Interact)).toEqual([]);
    press('interact');
    interactionSystem.update(world, 0);
    expect(world.eventsOf(Interact)).toEqual([{ target: nearer, by: player }]);
    world.clearEvents();
    interactionSystem.update(world, 0);
    expect(world.eventsOf(Interact)).toEqual([]);
  });

  it('lets a press with nothing in reach go', () => {
    const { world, press, player } = scene();
    world.read(player, Transform).x = 0;
    press('interact');
    interactionSystem.update(world, 0);
    world.read(player, Transform).x = 10;
    interactionSystem.update(world, 0);
    expect(world.eventsOf(Interact)).toEqual([]);
  });

  it('rejects an empty label or a bad range', () => {
    expect(() => interactable('')).toThrow();
    expect(() => interactable('Talk', 0)).toThrow();
  });
});
