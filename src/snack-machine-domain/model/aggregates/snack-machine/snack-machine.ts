import { Money } from "../../../../shared-kernel/value-objects/money";
import { Slot, SnackMachineSlotsPosition } from "./entities/slot";
import { SnackPile } from "./value-objects/snack-pile";
import { Cash } from "../../../../shared-kernel/value-objects/cash";
import { nanoid } from "nanoid";
import { AggregateRoot } from "../../../../common/aggregates/aggregate-root.abstract";
import { EntityId } from "../../../../common/entities/entity.abstract";
import { Guard } from "../../../../util/guard";

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

  getSlots(): SnackMachineSlots {
    return this.slots;
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

  returnMoney(): void {
    this.finalizeTransaction(this.moneyInTransaction);
  }

  canBuySnack(position: SnackMachineSlotsPosition): string | true {
    const snackPile = this.slots[position].snackPile;
    if (snackPile.isEmpty()) {
      return "There is no snack in the slot";
    }

    if (snackPile.price > this.moneyInTransaction.amount) {
      return "Not enough money to buy the snack";
    }

    if (
      !this.moneyInMachine.canAllocate(
        this.moneyInTransaction.subtraction(new Cash(snackPile.price))
      )
    ) {
      return "Not enough money to allocate";
    }

    return true;
  }

  buySnack(position: SnackMachineSlotsPosition): void {
    const canBuySnack = this.canBuySnack(position);
    if (canBuySnack !== true) {
      Guard.againstTruthy(true, canBuySnack);
    }
    this.buySnackCore(position);
  }

  loadSnacks(position: SnackMachineSlotsPosition, snackPile: SnackPile): void {
    this.slots[position].loadSnackPile(snackPile);
  }

  loadMoney(money: Money): void {
    this.moneyInMachine = this.moneyInMachine.add(money);
  }

  private buySnackCore(position: SnackMachineSlotsPosition): void {
    const snackPile = this.slots[position].snackPile;
    const cashToReturn = this.moneyInTransaction.subtraction(
      new Cash(snackPile.price)
    );
    this.finalizeTransaction(cashToReturn);
    this.slots[position].snackPile = snackPile.decreaseQuantity();
  }

  private finalizeTransaction(cash: Cash): void {
    const moneyToReturn = this.moneyInMachine.allocate(cash);
    this.moneyInMachine = this.moneyInMachine.subtraction(moneyToReturn);
    this.moneyInTransaction = Cash.None;
  }
}
