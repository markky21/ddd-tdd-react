import { Money } from "../../shared-kernel/value-objects/money";
import { Cash } from "../../shared-kernel/value-objects/cash";
import Fraction from "fraction.js";
import { Guard } from "../../util/guard";
import { AggregateRoot } from "../../common/aggregates/aggregate-root.abstract";
import { EntityId } from "../../common/entities/entity.abstract";
import { BalanceChangedEvent } from "../events/balance-changed.event";

// import { BalanceChangedEvent } from "../events/balance-changed-event";

export class Atm extends AggregateRoot {
  private readonly commissionRate = 0.01;

  constructor(
    public readonly id: EntityId,
    private moneyInside: Money = Money.None(),
    private moneyCharged: Cash = Cash.None
  ) {
    super(id);
  }

  getMoneyInside(): Money {
    return this.moneyInside;
  }

  getMoneyCharged(): Cash {
    return this.moneyCharged;
  }

  canTakeMoney(cash: Cash): string | true {
    if (cash.amount <= 0) {
      return "Invalid amount to take";
    }
    if (this.moneyInside.getTotalAmount() < cash.amount) {
      return "There is not enough money in the ATM";
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
    const moneyCharged = new Cash(
      new Fraction(cash.amount).add(commission).valueOf()
    );
    this.moneyCharged = moneyCharged;

    this.addDomainEvent(new BalanceChangedEvent(moneyCharged));
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
