import { SnackMachineDto } from "../../snack-machine-domain/dto/snack-machine.dto";
import { SnackMachineRepository } from "../../snack-machine-domain/repository/snack-machine.repository";
import { BehaviorSubject, Observable } from "rxjs";

export class SnackMachinesService {
  readonly #allSnackMachines$: BehaviorSubject<SnackMachineDto[]> =
    new BehaviorSubject([] as SnackMachineDto[]);

  get allSnackMachines$(): Observable<SnackMachineDto[]> {
    return this.#allSnackMachines$.asObservable();
  }

  constructor() {
    this.updateSnackMachines();
  }

  async updateSnackMachines(): Promise<void> {
    const snackMachineRepository = SnackMachineRepository.getInstance();
    const snackMachinesDto = await snackMachineRepository.getAll();
    this.#allSnackMachines$.next(snackMachinesDto);
  }
}
