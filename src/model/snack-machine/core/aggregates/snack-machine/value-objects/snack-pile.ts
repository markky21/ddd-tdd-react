import { Snack } from "../../snack/snack";
import { ValueObject } from "../../../../../shared/core/value-objects/value-object.abstract";

export class SnackPile extends ValueObject<SnackPile> {
  constructor(
    public readonly snack: Snack | null,
    public readonly price: number,
    public readonly quantity: number
  ) {
    super();
  }

  decreaseQuantity(): SnackPile {
    return new SnackPile(this.snack, this.price, this.quantity - 1);
  }
}
