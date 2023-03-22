export abstract class Entity<T extends string | number | undefined> {
  constructor(private readonly _id: T) {}

  get id(): T {
    return this._id;
  }

  equals(entity: Entity<T>): boolean {
    if (entity.constructor !== this.constructor) return false;
    if (!entity.id || !this.id) return false;
    return this.id === entity.id;
  }
}
