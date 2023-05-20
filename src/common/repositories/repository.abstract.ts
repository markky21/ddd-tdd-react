import { AggregateRoot } from "../aggregates/aggregate-root.abstract";
import { EntityId } from "../entities/entity.abstract";

export class Repository<T extends AggregateRoot> {
  getById(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }

  saveOrUpdate(aggregateRoot: T): Promise<EntityId> {
    throw new Error("Method not implemented.");
  }
}
