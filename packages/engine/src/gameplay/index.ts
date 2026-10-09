// Gameplay: the components entities are made of, the systems that move them (and wander them round a home), turning to
// face another, what the player can interact with, attacks and hostiles, health and death, and the time of day.
export { BODY_RADIUS, BodyRadius, MoveIntent, MoveSpeed, Player, Transform, type TransformData } from './components';
export { movementSystem } from './movement';
export { FACE_TURN_RATE, FaceToward, angleToward, faceToward, facingSystem, type FaceTowardData } from './facing';
export { DEFAULT_INTERACT_RANGE, InReach, Interact, Interactable, interactable, interactionSystem, type InReachData, type InteractableData } from './interaction';
export { WANDER_SPEED, Wander, wander, wanderSystem, type WanderData, type WanderOptions } from './wander';
export { ACTION_TIME, Acting, Attack, AttackIntent, Swing, actingSystem, attack, attackSystem, inReach, targetsOf, type ActingData, type ActionName, type AttackData, type AttackOptions } from './attack';
export { Hostile, hostile, hostileSystem, type HostileData, type HostileOptions, type HostileState } from './hostile';
export { Dead, Died, Faction, Health, Hit, health, healthSystems, isAlive, type HealthData } from './health';
export { TimeOfDay, hoursPerSecond, timeOfDaySystem, type TimeOfDayData } from './time';
