export type EntityId = string | number | undefined;
export abstract class Entity {
  constructor(private readonly _id: EntityId) {}

  get id(): EntityId {
    return this._id;
  }

  equals(entity: Entity): boolean {
    if (entity.constructor !== this.constructor) return false;
    if (!entity.id || !this.id) return false;
    return this.id === entity.id;
  }
}
