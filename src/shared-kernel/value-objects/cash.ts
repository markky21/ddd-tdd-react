import { Money } from "./money";
import Fraction from "fraction.js";
import { ValueObject } from "../../common/value-objects/value-object.abstract";
import { Guard } from "../../util/guard";

export class Cash extends ValueObject<Money> {
  static readonly None: Cash = new Cash(0);

  constructor(readonly amount: number) {
    super();
    Guard.againstNegativeNumber(amount, "Amount is negative");
  }

  toView(): string {
    return this.amount.toLocaleString("en-US", {
      currency: "USD",
      style: "currency",
    });
  }

  add(addend: Cash): Cash {
    return new Cash(new Fraction(this.amount).add(addend.amount).valueOf());
  }

  subtraction(subtrahend: Cash): Cash {
    return new Cash(new Fraction(this.amount).sub(subtrahend.amount).valueOf());
  }
}
