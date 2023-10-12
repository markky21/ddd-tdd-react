import { BehaviorSubject, Observable } from "rxjs";
import { AtmDto } from "../../atm-domain/dto/atm.dto";
import { AtmRepository } from "../../atm-domain/repository/atm.repository";

export class AtmsService {
  readonly #allAtms$: BehaviorSubject<AtmDto[]> = new BehaviorSubject(
    [] as AtmDto[]
  );

  get allSnackMachines$(): Observable<AtmDto[]> {
    return this.#allAtms$.asObservable();
  }

  constructor() {
    this.updateAtms();
  }

  async updateAtms(): Promise<void> {
    const atmRepository = AtmRepository.getInstance();
    const atmDtos = await atmRepository.getAll();
    this.#allAtms$.next(atmDtos);
  }
}
