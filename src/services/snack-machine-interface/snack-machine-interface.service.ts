import { Money } from "../../model/snack-machine/core/value-objects/money";
import { SnackMachine } from "../../model/snack-machine/core/entities/snack-machine";
import { BehaviorSubject, combineLatest, map, ReplaySubject } from "rxjs";

export class SnackMachineInterfaceService {
  private readonly _moneyInserted$ = new ReplaySubject<Money>();
  private readonly _moneyInMachine$ = new ReplaySubject<Money>();

  public readonly moneyInserted$ = this._moneyInserted$.pipe(
    map((money) => money.toView())
  );
  public readonly message$ = new BehaviorSubject<string>("");

  public readonly coinsAndNotes$ = combineLatest([
    this._moneyInserted$,
    this._moneyInMachine$,
  ]).pipe(
    map(([moneyInserted, moneyInMachine]) =>
      moneyInMachine.add(moneyInserted).getCoinsAndNotes()
    )
  );

  constructor(private readonly snackMachine: SnackMachine) {
    this._moneyInserted$.next(this.snackMachine.moneyInTransaction);
    this._moneyInMachine$.next(this.snackMachine.moneyInMachine);
  }

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

  public buySnack(): void {
    this.snackMachine.buySnack();
    this._moneyInserted$.next(this.snackMachine.moneyInTransaction);
    this._moneyInMachine$.next(this.snackMachine.moneyInMachine);
    this.message$.next(`You have bought a snack`);
  }

  public returnMoney(): void {
    this.snackMachine.returnMoney();
    this._moneyInserted$.next(this.snackMachine.moneyInTransaction);
    this.message$.next("Money returned");
  }

  private insertMoney(money: Money): void {
    this.snackMachine.insertMoney(money);
    this._moneyInserted$.next(this.snackMachine.moneyInTransaction);
    this.message$.next(`You inserted ${money.toView()}`);
  }
}
