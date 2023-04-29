import { AggregateRoot } from "../../../../shared/core/aggregates/aggregate-root.abstract";
import { EntityId } from "../../../../shared/core/entities/entity.abstract";

export class Snack extends AggregateRoot {
  static readonly None = new Snack("0", "None");
  static readonly Chocolate = new Snack("1", "Chocolate");
  static readonly Soda = new Snack("2", "Soda");
  static readonly Gum = new Snack("3", "Gum");

  private constructor(public readonly id: EntityId, public name: string) {
    super(id);
  }

  static getSnackReferenceById(id: EntityId): Snack {
    switch (id) {
      case Snack.None.id:
        return Snack.None;
      case Snack.Chocolate.id:
        return Snack.Chocolate;
      case Snack.Soda.id:
        return Snack.Soda;
      case Snack.Gum.id:
        return Snack.Gum;
      default:
        throw new Error("Snack not found");
    }
  }
}
