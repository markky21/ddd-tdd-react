import { ValueObject } from "../../../shared/core/value-objects/value-object.abstract";
import { Guard } from "../../../shared/core/utils/guard";

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

  // get oneCentCount(): number {
  //   return this._oneCentCount;
  // }
  //
  // get tenCentCount(): number {
  //   return this._tenCentCount;
  // }
  //
  // get quarterCentCount(): number {
  //   return this._quarterCentCount;
  // }
  //
  // get oneDollarCount(): number {
  //   return this._oneDollarCount;
  // }
  //
  // get fiveDollarCount(): number {
  //   return this._fiveDollarCount;
  // }
  //
  // get tenDollarCount(): number {
  //   return this._tenDollarCount;
  // }

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
    return (
      this._oneCentCount * 0.01 +
      this._tenCentCount * 0.1 +
      this._quarterCentCount * 0.25 +
      this._oneDollarCount * 1 +
      this._fiveDollarCount * 5 +
      this._tenDollarCount * 10
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
