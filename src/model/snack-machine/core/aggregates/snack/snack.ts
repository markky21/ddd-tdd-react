import { AggregateRoot } from "../../../../shared/core/aggregates/aggregate-root.abstract";
import { EntityId } from "../../../../shared/core/entities/entity.abstract";

export class Snack extends AggregateRoot {
  constructor(public readonly id: EntityId, public name: string) {
    super(id);
  }
}
