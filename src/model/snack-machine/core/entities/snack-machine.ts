import { Money } from "../value-objects/money";
import { Entity } from "../../../shared/core/entities/entity.abstract";
import { Guard } from "../../../shared/core/utils/guard";

export class SnackMachine extends Entity<number> {
  private _moneyInTransaction: Money = Money.None();
  private _moneyInMachine: Money = Money.None();

  get moneyInTransaction() {
    return this._moneyInTransaction;
  }
  get moneyInMachine() {
    return this._moneyInMachine;
  }

  insertMoney(amount: Money): void {
    Guard.againstTruthy(
      ![
        Money.OneCent(),
        Money.TenCent(),
        Money.Quarter(),
        Money.Dollar(),
        Money.FiveDollar(),
        Money.TenDollar(),
      ].some((money) => money.equals(amount)),
      "Cannot insert more than one coin at a time"
    );

    this._moneyInTransaction = this._moneyInTransaction.add(amount);
  }

  returnMoney(): Money {
    const moneyToReturn = this._moneyInTransaction;
    this._moneyInTransaction = Money.None();
    return moneyToReturn;
  }

  buySnack(): void {
    this._moneyInMachine = this._moneyInMachine.add(this._moneyInTransaction);
    this._moneyInTransaction = Money.None();
  }
}
