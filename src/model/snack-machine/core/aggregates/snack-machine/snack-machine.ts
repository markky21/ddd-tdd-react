import { Money } from "./value-objects/money";
import { EntityId } from "../../../../shared/core/entities/entity.abstract";
import { Guard } from "../../../../shared/core/utils/guard";
import { Slot, SnackMachineSlotsPosition } from "./entities/slot";
import { AggregateRoot } from "../../../../shared/core/aggregates/aggregate-root.abstract";
import { SnackPile } from "./value-objects/snack-pile";
import { Cash } from "./value-objects/cash";

type SnackMachineSlots = [Slot, Slot, Slot];
export class SnackMachine extends AggregateRoot {
  private moneyInTransaction: Cash = Cash.None();
  private slots: SnackMachineSlots = [
    new Slot(this, 0),
    new Slot(this, 1),
    new Slot(this, 2),
  ];

  getMoneyInTransaction(): Cash {
    return this.moneyInTransaction;
  }
  getMoneyInMachine(): Money {
    return this._moneyInMachine;
  }

  getSnackPile(position: SnackMachineSlotsPosition): SnackPile {
    return this.slots[position].snackPile;
  }

  constructor(id: EntityId, protected _moneyInMachine: Money = Money.None()) {
    super(id);
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

    this.moneyInTransaction = this.moneyInTransaction.add(
      new Cash(amount.getTotalAmount())
    );
    this._moneyInMachine = this._moneyInMachine.add(amount);
  }

  returnMoney(): Money {
    return this.finalizeTransaction(this.moneyInTransaction);
  }

  buySnack(position: SnackMachineSlotsPosition): Money {
    const snackPile = this.slots[position].snackPile;
    Guard.againstTruthy(snackPile.isEmpty(), "There is no snack in the slot");
    Guard.againstTruthy(
      snackPile.price > this.moneyInTransaction.amount,
      "Not enough money to buy the snack"
    );

    const cashToReturn = this.moneyInTransaction.subtraction(
      new Cash(snackPile.price)
    );
    const moneyToReturn = this.finalizeTransaction(cashToReturn);
    this.slots[position].snackPile = snackPile.decreaseQuantity();
    return moneyToReturn;
  }

  loadSnacks(position: SnackMachineSlotsPosition, snackPile: SnackPile): void {
    this.slots[position] = new Slot(this, position);
    this.slots[position].snackPile = snackPile;
  }

  loadMoney(money: Money): void {
    this._moneyInMachine = this._moneyInMachine.add(money);
  }

  private finalizeTransaction(cash: Cash): Money {
    const moneyToReturn = this._moneyInMachine.allocate(cash);
    this._moneyInMachine = this._moneyInMachine.subtraction(moneyToReturn);
    this.moneyInTransaction = Cash.None();
    return moneyToReturn;
  }
}
