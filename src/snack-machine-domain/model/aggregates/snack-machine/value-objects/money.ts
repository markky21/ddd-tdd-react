import { ValueObject } from "../../../../../shared/core/value-objects/value-object.abstract";
import { Guard } from "../../../../../shared/core/utils/guard";
import Fraction from "fraction.js";
import { Cash } from "./cash";

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
    Guard.againstNegativeNumber(_oneCentCount, "One cent count is negative");
    Guard.againstNegativeNumber(_tenCentCount, "Ten cent count is negative");
    Guard.againstNegativeNumber(_quarterCentCount, "Quarter count is negative");
    Guard.againstNegativeNumber(
      _oneDollarCount,
      "One dollar count is negative"
    );
    Guard.againstNegativeNumber(
      _fiveDollarCount,
      "Five dollars count is negative"
    );
    Guard.againstNegativeNumber(
      _tenDollarCount,
      "Ten dollars count is negative"
    );
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

  multiply(multiplier: number): Money {
    Guard.againstTruthy(
      Math.floor(multiplier) !== multiplier,
      "Multiplier is not an integer"
    );
    Guard.againstNegativeNumber(multiplier, "Multiplier is negative value");

    return new Money(
      this._oneCentCount * multiplier,
      this._tenCentCount * multiplier,
      this._quarterCentCount * multiplier,
      this._oneDollarCount * multiplier,
      this._fiveDollarCount * multiplier,
      this._tenDollarCount * multiplier
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

  toView(): string {
    return new Cash(this.getTotalAmount()).toView();
  }

  canAllocate(cash: Cash): boolean {
    const money = this.allocateCore(cash);
    return money.getTotalAmount() === cash.amount;
  }

  allocate(cash: Cash): Money {
    if (!this.canAllocate(cash)) {
      Guard.againstTruthy(true, "Not enough money to allocate");
    }
    return this.allocateCore(cash);
  }

  private allocateCore(cash: Cash): Money {
    let cashLeft: Cash;
    const tenDollarCount = Math.min(
      this._tenDollarCount,
      Math.floor(cash.amount / 10)
    );
    cashLeft = cash.subtraction(new Cash(tenDollarCount * 10));

    const fiveDollarCount = Math.min(
      this._fiveDollarCount,
      Math.floor(cashLeft.amount / 5)
    );
    cashLeft = cashLeft.subtraction(new Cash(fiveDollarCount * 5));

    const oneDollarCount = Math.min(
      this._oneDollarCount,
      Math.floor(cashLeft.amount)
    );
    cashLeft = cashLeft.subtraction(new Cash(oneDollarCount));

    const quarterCount = Math.min(
      this._quarterCentCount,
      Math.floor(cashLeft.amount / 0.25)
    );
    cashLeft = cashLeft.subtraction(new Cash(quarterCount * 0.25));

    const tenCentCount = Math.min(
      this._tenCentCount,
      Math.floor(cashLeft.amount / 0.1)
    );
    cashLeft = cashLeft.subtraction(new Cash(tenCentCount * 0.1));

    const oneCentCount = Math.min(
      this._oneCentCount,
      Math.floor(cashLeft.amount / 0.01)
    );

    return new Money(
      oneCentCount,
      tenCentCount,
      quarterCount,
      oneDollarCount,
      fiveDollarCount,
      tenDollarCount
    );
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

  static FromCoinsAndNotes(coinsAndNotes: CoinsAndNotes): Money {
    return new Money(
      coinsAndNotes.oneCentCount,
      coinsAndNotes.tenCentCount,
      coinsAndNotes.quarterCentCount,
      coinsAndNotes.oneDollarCount,
      coinsAndNotes.fiveDollarCount,
      coinsAndNotes.tenDollarCount
    );
  }
}
