import { Money } from "../model/aggregates/snack-machine/value-objects/money";
import { BehaviorSubject, map, ReplaySubject } from "rxjs";
import { SnackMachineWithPersistence } from "../model/aggregates/snack-machine/snack-machine-with-persistence";
import { SnackMachineSlotsPosition } from "../model/aggregates/snack-machine/entities/slot";
import { Cash } from "../model/aggregates/snack-machine/value-objects/cash";
import { SnackMachineRepository } from "../repository/snack-machine.repository";
import { SnackRepository } from "../repository/snack.repository";
import { EntityId } from "../../shared/core/entities/entity.abstract";
import {
  SnackMachine,
  SnackMachineSlots,
} from "../model/aggregates/snack-machine/snack-machine";
import { Guard } from "../../shared/core/utils/guard";
import { SlotService } from "./slot.service";

export class SnackMachineService {
  readonly #moneyInserted$ = new ReplaySubject<Cash>();
  readonly #moneyInMachine$ = new ReplaySubject<Money>();
  readonly #snacks$ = new ReplaySubject<SnackMachineSlots>();
  #snackMachine: SnackMachineWithPersistence | null = null;
  #snackMachineId: EntityId | null = null;

  public readonly moneyInserted$ = this.#moneyInserted$.pipe(
    map((cash) => cash.toView())
  );
  public readonly message$ = new BehaviorSubject<string>("");

  public readonly coinsAndNotes$ = this.#moneyInMachine$.pipe(
    map((moneyInMachine) => moneyInMachine.getCoinsAndNotes())
  );

  public readonly snacks$ = this.#snacks$.pipe(
    map((slots) => slots.map((slot) => new SlotService(slot).toView()))
  );

  public moneyInMachine$ = this.#moneyInMachine$.pipe(
    map((money) => new Cash(money.getTotalAmount()).toView())
  );

  public get snackMachineId(): EntityId | null {
    return this.#snackMachineId;
  }

  constructor(
    private readonly snackMachineRepository: SnackMachineRepository,
    private readonly snackRepository: SnackRepository
  ) {}

  public async initializeSnackMachine(snackMachineId: EntityId): Promise<void> {
    this.#snackMachine = await this.snackMachineRepository.getById(
      snackMachineId
    );
    this.#snackMachineId = snackMachineId;

    this.#moneyInserted$.next(this.#snackMachine.getMoneyInTransaction());
    this.#moneyInMachine$.next(this.#snackMachine.getMoneyInMachine());
    this.#snacks$.next(this.#snackMachine.getSlots());
    return;
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

  public async buySnack(position: SnackMachineSlotsPosition): Promise<void> {
    this.guardIsSnackMachine();
    if (
      !SnackMachineService.assertSnackMachineIsInitialized(this.#snackMachine)
    )
      return;

    await this.#snackMachine.buySnack(position);
    await this.snackMachineRepository.saveOrUpdate(this.#snackMachine);
    this.#moneyInserted$.next(this.#snackMachine.getMoneyInTransaction());
    this.#moneyInMachine$.next(this.#snackMachine.getMoneyInMachine());
    this.#snacks$.next(this.#snackMachine.getSlots());
    this.message$.next(`You have bought a snack`);
  }

  public returnMoney(): void {
    this.guardIsSnackMachine();
    if (
      !SnackMachineService.assertSnackMachineIsInitialized(this.#snackMachine)
    )
      return;

    this.#snackMachine.returnMoney();

    this.#moneyInserted$.next(this.#snackMachine.getMoneyInTransaction());
    this.#moneyInMachine$.next(this.#snackMachine.getMoneyInMachine());
    this.message$.next("Money returned");
  }

  private insertMoney(coinOrNode: Money): void {
    this.guardIsSnackMachine();
    if (
      !SnackMachineService.assertSnackMachineIsInitialized(this.#snackMachine)
    )
      return;

    this.#snackMachine.insertMoney(coinOrNode);
    this.#moneyInserted$.next(this.#snackMachine.getMoneyInTransaction());
    this.#moneyInMachine$.next(this.#snackMachine.getMoneyInMachine());
    this.message$.next(`You inserted ${coinOrNode.toView()}`);
  }

  private guardIsSnackMachine(): void {
    Guard.againstTruthy(
      !this.#snackMachine,
      "Snack machine is not initialized"
    );
  }

  private static assertSnackMachineIsInitialized(
    snackMachine: SnackMachine | null
  ): snackMachine is SnackMachine {
    return snackMachine !== null;
  }
}
