import { Money } from "../../shared-kernel/value-objects/money";
import { Cash } from "../../shared-kernel/value-objects/cash";
import Fraction from "fraction.js";
import { Guard } from "../../util/guard";
import { AggregateRoot } from "../../common/aggregates/aggregate-root.abstract";
import { EntityId } from "../../common/entities/entity.abstract";

export class Atm extends AggregateRoot {
  private readonly commissionRate = 0.01;

  constructor(
    public readonly id: EntityId,
    public moneyInside: Money = Money.None(),
    public moneyCharged: Cash = Cash.None
  ) {
    super(id);
  }

  canTakeMoney(cash: Cash): string | true {
    if (cash.amount <= 0) {
      return "Invalid amount to take";
    }
    if (this.moneyInside.getTotalAmount() < cash.amount) {
      return "Not enough money inside";
    }

    if (!this.moneyInside.canAllocate(cash)) {
      return "Not enough money to allocate";
    }
    return true;
  }

  loadMoney(money: Money): void {
    this.moneyInside = this.moneyInside.add(money);
  }

  takeMoney(cash: Cash): void {
    const canTakeMoney = this.canTakeMoney(cash);
    Guard.againstTruthy(canTakeMoney !== true, canTakeMoney as string);

    const allocated = this.moneyInside.allocate(cash);
    this.moneyInside = this.moneyInside.subtraction(allocated);

    const commission = this.calculateCommission(cash);
    const amountWithCommission = new Fraction(cash.amount)
      .add(commission)
      .valueOf();
    this.moneyCharged = new Cash(this.moneyCharged.amount).add(
      new Cash(amountWithCommission)
    );
  }

  private calculateCommission(cash: Cash): number {
    return new Fraction(cash.amount)
      .mul(this.commissionRate)
      .mul(100)
      .ceil()
      .div(100)
      .valueOf();
  }
}
