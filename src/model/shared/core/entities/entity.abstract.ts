export type EntityId = string | number | undefined;
export abstract class Entity {
  constructor(public readonly id: EntityId) {}

  equals(entity: Entity): boolean {
    if (entity.constructor !== this.constructor) return false;
    if (!entity.id || !this.id) return false;
    return this.id === entity.id;
  }
}
