import { Snack } from "../../snack/snack";
import { ValueObject } from "../../../../../shared/core/value-objects/value-object.abstract";
import { Guard } from "../../../../../shared/core/utils/guard";

export class SnackPile extends ValueObject<SnackPile> {
  constructor(
    public readonly snack: Snack | null,
    public readonly price: number,
    public readonly quantity: number
  ) {
    super();
    Guard.againstNegativeNumber(quantity, "Quantity is negative");
    Guard.againstNegativeNumber(price, "Price is negative");
    Guard.againstTruthy(
      (price * 100) % 1 !== 0,
      "Price is not rounded to one cent"
    );
  }

  decreaseQuantity(): SnackPile {
    return new SnackPile(this.snack, this.price, this.quantity - 1);
  }

  isEmpty(): boolean {
    return this.quantity === 0;
  }
}
