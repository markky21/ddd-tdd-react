import { ValueObject } from "../../../shared/core/value-objects/value-object.abstract";
import { Guard } from "../../../shared/core/utils/guard";
import Fraction from "fraction.js";

export interface CoinsAndNotes {
  oneCentCount: number;
  tenCentCount: number;
  quarterCentCount: number;
  oneDollarCount: number;
  fiveDollarCount: number;
  tenDollarCount: number;
}

export class Money extends ValueObject<Money> {
  constructor(
    private readonly _oneCentCount: number = 0,
    private readonly _tenCentCount: number = 0,
    private readonly _quarterCentCount: number = 0,
    private readonly _oneDollarCount: number = 0,
    private readonly _fiveDollarCount: number = 0,
    private readonly _tenDollarCount: number = 0
  ) {
    super();
  }

  add(addend: Money): Money {
    // @ts-ignore
    return Object.freeze(
      new Money(
        addend._oneCentCount + this._oneCentCount,
        addend._tenCentCount + this._tenCentCount,
        addend._quarterCentCount + this._quarterCentCount,
        addend._oneDollarCount + this._oneDollarCount,
        addend._fiveDollarCount + this._fiveDollarCount,
        addend._tenDollarCount + this._tenDollarCount
      )
    );
  }

  getTotalAmount(): number {
    return new Fraction(this._oneCentCount)
      .mul(0.01)
      .add(new Fraction(this._tenCentCount).mul(0.1))
      .add(new Fraction(this._quarterCentCount).mul(0.25))
      .add(new Fraction(this._oneDollarCount).mul(1))
      .add(new Fraction(this._fiveDollarCount).mul(5))
      .add(new Fraction(this._tenDollarCount).mul(10))
      .valueOf();
  }

  subtraction(money: Money): Money {
    Guard.againstNegativeNumber(
      this._oneCentCount - money._oneCentCount,
      "One cent count is negative"
    );
    Guard.againstNegativeNumber(
      this._tenCentCount - money._tenCentCount,
      "Ten cent count is negative"
    );
    Guard.againstNegativeNumber(
      this._quarterCentCount - money._quarterCentCount,
      "Quarter count is negative"
    );
    Guard.againstNegativeNumber(
      this._oneDollarCount - money._oneDollarCount,
      "One dollar count is negative"
    );
    Guard.againstNegativeNumber(
      this._fiveDollarCount - money._fiveDollarCount,
      "Five dollars count is negative"
    );
    Guard.againstNegativeNumber(
      this._tenDollarCount - money._tenDollarCount,
      "Ten dollars count is negative"
    );

    return new Money(
      this._oneCentCount - money._oneCentCount,
      this._tenCentCount - money._tenCentCount,
      this._quarterCentCount - money._quarterCentCount,
      this._oneDollarCount - money._oneDollarCount,
      this._fiveDollarCount - money._fiveDollarCount,
      this._tenDollarCount - money._tenDollarCount
    );
  }

  toView(): string {
    const totalAmount = this.getTotalAmount();
    if (totalAmount === 0) {
      return "¢0";
    }
    if (totalAmount < 1) {
      return `¢${totalAmount * 100}`;
    }
    if (totalAmount % 1 === 0) {
      return `$${totalAmount}.00`;
    }
    if ((totalAmount * 10) % 1 === 0) {
      return `$${totalAmount}0`;
    }
    return `$${totalAmount}`;
  }

  getCoinsAndNotes(): CoinsAndNotes {
    return {
      oneCentCount: this._oneCentCount,
      tenCentCount: this._tenCentCount,
      quarterCentCount: this._quarterCentCount,
      oneDollarCount: this._oneDollarCount,
      fiveDollarCount: this._fiveDollarCount,
      tenDollarCount: this._tenDollarCount,
    };
  }

  static None(): Money {
    return new Money();
  }

  static OneCent(): Money {
    return new Money(1);
  }

  static TenCent(): Money {
    return new Money(0, 1);
  }

  static Quarter(): Money {
    return new Money(0, 0, 1);
  }

  static Dollar(): Money {
    return new Money(0, 0, 0, 1);
  }

  static FiveDollar(): Money {
    return new Money(0, 0, 0, 0, 1);
  }

  static TenDollar(): Money {
    return new Money(0, 0, 0, 0, 0, 1);
  }
}
