import { Money } from "../../value-objects/money";
import { EntityId } from "../../../../shared/core/entities/entity.abstract";
import { Guard } from "../../../../shared/core/utils/guard";
import { Slot, SnackMachineSlotsPosition } from "./entities/slot";
import { AggregateRoot } from "../../../../shared/core/aggregates/aggregate-root.abstract";
import { SnackPile } from "./value-objects/snack-pile";

type SnackMachineSlots = [Slot, Slot, Slot];
export class SnackMachine extends AggregateRoot {
  private moneyInTransaction: Money = Money.None();
  private slots: SnackMachineSlots = [
    new Slot(this, 0),
    new Slot(this, 1),
    new Slot(this, 2),
  ];

  getMoneyInTransaction() {
    return this.moneyInTransaction;
  }
  getMoneyInMachine() {
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

    this.moneyInTransaction = this.moneyInTransaction.add(amount);
  }

  returnMoney(): Money {
    const moneyToReturn = this.moneyInTransaction;
    this.moneyInTransaction = Money.None();
    return moneyToReturn;
  }

  buySnack(position: SnackMachineSlotsPosition): void {
    this.slots[position].snackPile =
      this.slots[position].snackPile.decreaseQuantity();
    this._moneyInMachine = this._moneyInMachine.add(this.moneyInTransaction);
    this.moneyInTransaction = Money.None();
  }

  loadSnacks(position: SnackMachineSlotsPosition, snackPile: SnackPile): void {
    this.slots[position] = new Slot(this, position);
    this.slots[position].snackPile = snackPile;
  }
}
