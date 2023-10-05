import { AggregateRoot } from "../aggregates/aggregate-root.abstract";
import { EntityId } from "../entities/entity.abstract";
import { EventListener } from "../../util/event-listener";

export class Repository<T extends AggregateRoot> {
  getById(id: string): Promise<T> {
    throw new Error("Method not implemented.");
  }

  saveOrUpdate(aggregateRoot: T): Promise<EntityId> {
    throw new Error("Method not implemented.");
  }

  onPostSaveOrUpdate(aggregateRoot: T): void {
    EventListener.getInstance().onPostPut(aggregateRoot);
  }
}
