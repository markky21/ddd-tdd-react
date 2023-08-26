import { Observable, ReplaySubject, Subject } from "rxjs";
import { Money } from "../../shared-kernel/value-objects/money";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { HeadOffice } from "../model/head-office";

export class HeadOfficeService {
  public readonly id: string;
  readonly #money$ = new ReplaySubject<Money>();
  readonly #balance$ = new ReplaySubject<Cash>();
  readonly #message$ = new Subject<string>();
  public readonly message$ = this.#message$.asObservable();

  constructor(private readonly headOffice: HeadOffice) {
    this.id = headOffice.id;
  }

  public async initialize(): Promise<void> {
    const headOffice = this.headOffice;
    this.#money$.next(headOffice.getMoney());
    this.#balance$.next(headOffice.getBalance());
    return;
  }

  public get money$(): Observable<Money> {
    return this.#money$.asObservable();
  }

  public get balance$(): Observable<Cash> {
    return this.#balance$.asObservable();
  }

  // takeMoney(money: Cash): void {
  //   this.guardIsAtm();
  //   if (!HeadOfficeService.assertAtmIsInitialized(this.#headOffice)) {
  //     return;
  //   }
  //
  //   const canTakeMoney = this.#headOffice.canTakeMoney(money);
  //   if (canTakeMoney !== true) {
  //     this.#message$.next(canTakeMoney);
  //     return;
  //   }
  //
  //   const atm = this.#headOffice!;
  //   atm.takeMoney(money);
  //   this.#balance$.next(atm.getMoneyCharged());
  //   this.#money$.next(atm.getMoneyInside());
  //   this.#message$.next(
  //     `You have been charged ${atm.getMoneyCharged().toView()}`
  //   );
  // }
  //
  // private guardIsAtm(): void {
  //   Guard.againstTruthy(!this.#headOffice, "Atm is not initialized");
  // }
  //
  // private static assertAtmIsInitialized(atm: Atm | null): atm is Atm {
  //   return atm !== null;
  // }
}
