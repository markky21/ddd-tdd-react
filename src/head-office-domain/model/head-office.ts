import { AggregateRoot } from "../../common/aggregates/aggregate-root.abstract";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { Money } from "../../shared-kernel/value-objects/money";
import { EntityId } from "../../common/entities/entity.abstract";

export class HeadOffice extends AggregateRoot {
  private money: Money = Money.None();
  private balance: Cash = Cash.None;

  constructor(public readonly id: EntityId) {
    super(id);
  }

  public addMoney(money: Money): void {
    this.money = this.money.add(money);
  }

  public loadBalance(balance: Cash): void {
    this.balance = balance;
  }

  public getBalance(): Cash {
    return this.balance;
  }

  public getMoney(): Money {
    return this.money;
  }

  public changeBalance(balance: Cash): void {
    this.balance = this.balance.add(balance);
  }
}
