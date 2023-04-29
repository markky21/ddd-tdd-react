import { ValueObject } from "../../../../../shared/core/value-objects/value-object.abstract";
import { Money } from "./money";
import { Guard } from "../../../../../shared/core/utils/guard";
import Fraction from "fraction.js";

export class Cash extends ValueObject<Money> {
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

  static None(): Cash {
    return new Cash(0);
  }
}
