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
    if (this.amount === 0) {
      return "¢0";
    }
    if (this.amount < 1) {
      return `¢${this.amount * 100}`;
    }
    if (this.amount % 1 === 0) {
      return `$${this.amount}.00`;
    }
    if ((this.amount * 10) % 1 === 0) {
      return `$${this.amount}0`;
    }
    return `$${this.amount}`;
  }

  add(addend: Cash): Cash {
    return new Cash(new Fraction(this.amount).add(addend.amount).valueOf());
  }

  subtraction(subtrahend: Cash): Cash {
    return new Cash(new Fraction(this.amount).sub(subtrahend.amount).valueOf());
  }
}
