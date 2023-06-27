import { AtmRepository } from "../repository/atm.repository";
import { EntityId } from "../../common/entities/entity.abstract";
import { AtmWithPersistence } from "../model/atm-with-persistence";
import { map, ReplaySubject, Subject } from "rxjs";
import { Money } from "../../shared-kernel/value-objects/money";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { Guard } from "../../util/guard";
import { Atm } from "../model/atm";

export class AtmService {
  readonly #moneyInside$ = new ReplaySubject<Money>();
  readonly #moneyCharged$ = new ReplaySubject<Cash>();
  readonly #message$ = new Subject<string>();

  #atm: AtmWithPersistence | null = null;
  #atmId: EntityId | null = null;

  public readonly moneyInside$ = this.#moneyInside$.pipe(
    map((money) => money.getCoinsAndNotes())
  );

  public readonly moneyCharged$ = this.#moneyCharged$.pipe(
    map((money) => money.toView())
  );

  public readonly message$ = this.#message$.asObservable();

  constructor(private readonly atmRepository: AtmRepository) {}

  public async initializeAtm(atmId: EntityId): Promise<void> {
    this.#atm = await this.atmRepository.getById(atmId);
    this.#atmId = atmId;

    this.#moneyInside$.next(this.#atm.getMoneyInside());
    this.#moneyCharged$.next(this.#atm.getMoneyCharged());
    return;
  }

  takeMoney(money: Cash): void {
    this.guardIsAtm();
    if (!AtmService.assertAtmIsInitialized(this.#atm)) {
      return;
    }

    const canTakeMoney = this.#atm.canTakeMoney(money);
    if (canTakeMoney !== true) {
      this.#message$.next(canTakeMoney);
      return;
    }

    const atm = this.#atm!;
    atm.takeMoney(money);
    this.#moneyCharged$.next(atm.getMoneyCharged());
    this.#moneyInside$.next(atm.getMoneyInside());
    this.#message$.next(
      `You have been charged ${atm.getMoneyCharged().toView()}`
    );
  }

  private guardIsAtm(): void {
    Guard.againstTruthy(!this.#atm, "Atm is not initialized");
  }

  private static assertAtmIsInitialized(atm: Atm | null): atm is Atm {
    return atm !== null;
  }
}
