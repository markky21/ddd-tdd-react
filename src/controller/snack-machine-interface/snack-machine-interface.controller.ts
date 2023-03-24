import { Money } from "../../model/snack-machine/core/value-objects/money";
import { SnackMachine } from "../../model/snack-machine/core/entities/snack-machine";
import { BehaviorSubject } from "rxjs";

export class SnackMachineInterfaceController {
  constructor(private readonly snackMachine: SnackMachine) {}

  public readonly moneyInside$ = new BehaviorSubject<string>(
    Money.None().getTotalAmount().toString()
  );

  public insertOneCent(): void {
    this.insertMoney(Money.OneCent());
  }
  public insertTenCent(): void {
    this.insertMoney(Money.TenCent());
  }
  public insertQuarter(): void {
    this.insertMoney(Money.Quarter());
  }
  public insertDollar(): void {
    this.insertMoney(Money.Dollar());
  }
  public insertFiveDollar(): void {
    this.insertMoney(Money.FiveDollar());
  }
  public insertTenDollar(): void {
    this.insertMoney(Money.TenDollar());
  }

  private insertMoney(money: Money): void {
    this.snackMachine.insertMoney(money);
    this.moneyInside$.next(
      this.snackMachine.moneyInTransaction.getTotalAmount().toString()
    );
  }
}
