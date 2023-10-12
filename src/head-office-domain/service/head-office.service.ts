import { Observable, ReplaySubject, Subject } from "rxjs";
import { Money } from "../../shared-kernel/value-objects/money";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { HeadOffice } from "../model/head-office";
import { AtmDto } from "../../atm-domain/dto/atm.dto";
import { AtmRepository } from "../../atm-domain/repository/atm.repository";

export class HeadOfficeService {
  public readonly id: string;
  readonly #money$ = new ReplaySubject<Money>();
  readonly #balance$ = new ReplaySubject<Cash>();
  readonly #message$ = new Subject<string>();
  readonly #atms$ = new ReplaySubject<AtmDto[]>();
  public readonly message$ = this.#message$.asObservable();

  constructor(private readonly headOffice: HeadOffice) {
    this.id = headOffice.id;
  }

  public async initialize(): Promise<void> {
    const headOffice = this.headOffice;
    this.#money$.next(headOffice.getMoney());
    this.#balance$.next(headOffice.getBalance());
    await this.updateAtms();
    return;
  }

  public get money$(): Observable<Money> {
    return this.#money$.asObservable();
  }

  public get balance$(): Observable<Cash> {
    return this.#balance$.asObservable();
  }

  public get atms$(): Observable<AtmDto[]> {
    return this.#atms$.asObservable();
  }

  private async updateAtms(): Promise<void> {
    const atmRepository = AtmRepository.getInstance();
    const atms = await atmRepository.getAll();
    this.#atms$.next(atms);
  }
}
