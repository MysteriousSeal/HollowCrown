// Component, resource and event types: typed keys the world stores data under. Defining one gives it a name (for
// debugging and saves) and a type the compiler checks every read and write against.

export interface ComponentType<T> {
  readonly kind: 'component';
  readonly name: string;
  readonly id: number;
  readonly __type?: T; // (phantom: carries T)
}

export interface ResourceType<T> {
  readonly kind: 'resource';
  readonly name: string;
  readonly id: number;
  readonly __type?: T;
}

export interface EventType<T> {
  readonly kind: 'event';
  readonly name: string;
  readonly id: number;
  readonly __type?: T;
}

let nextId = 0;

// Data attached to entities (a position, a health pool, a rig to draw).
export const defineComponent = <T>(name: string): ComponentType<T> => ({ kind: 'component', name, id: nextId++ });

// One value for the whole world (the clock, the input state, the map).
export const defineResource = <T>(name: string): ResourceType<T> => ({ kind: 'resource', name, id: nextId++ });

// Something that happened this frame (a blow landed, a door opened), for any system to react to.
export const defineEvent = <T>(name: string): EventType<T> => ({ kind: 'event', name, id: nextId++ });
