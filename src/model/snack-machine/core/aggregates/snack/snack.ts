import { nanoid } from "nanoid";
import { AggregateRoot } from "../../../../shared/core/aggregates/aggregate-root.abstract";

export class Snack extends AggregateRoot {
  constructor(public readonly name: string) {
    super(nanoid());
  }
}
