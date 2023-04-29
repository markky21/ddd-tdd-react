import { Money } from "./value-objects/money";
import { Guard } from "../../../../shared/core/utils/guard";
import { Slot, SnackMachineSlotsPosition } from "./entities/slot";
import { AggregateRoot } from "../../../../shared/core/aggregates/aggregate-root.abstract";
import { SnackPile } from "./value-objects/snack-pile";
import { Cash } from "./value-objects/cash";
import { EntityId } from "../../../../shared/core/entities/entity.abstract";
import { nanoid } from "nanoid";

export type SnackMachineSlots = [Slot, Slot, Slot];
export class SnackMachine extends AggregateRoot {
  private moneyInTransaction: Cash = Cash.None;

  protected slots: SnackMachineSlots = [
    new Slot(nanoid(), this.id, 0),
    new Slot(nanoid(), this.id, 1),
    new Slot(nanoid(), this.id, 2),
  ];

  protected moneyInMachine: Money = Money.None();

  getMoneyInTransaction(): Cash {
    return this.moneyInTransaction;
  }
  getMoneyInMachine(): Money {
    return this.moneyInMachine;
  }

  getSnackPile(position: SnackMachineSlotsPosition): SnackPile {
    return this.slots[position].snackPile;
  }

  getSlotsIds(): EntityId[] {
    return this.slots.map((slot) => slot.id);
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
    this.moneyInMachine = this.moneyInMachine.add(amount);
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
    this.slots[position].loadSnackPile(snackPile);
  }

  loadMoney(money: Money): void {
    this.moneyInMachine = this.moneyInMachine.add(money);
  }

  private finalizeTransaction(cash: Cash): Money {
    const moneyToReturn = this.moneyInMachine.allocate(cash);
    this.moneyInMachine = this.moneyInMachine.subtraction(moneyToReturn);
    this.moneyInTransaction = Cash.None;
    return moneyToReturn;
  }
}
