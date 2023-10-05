import { SnackMachine } from "../../model/aggregates/snack-machine/snack-machine";
import { SnackMachineFromDb } from "../../../shared-kernel/storage/idb.model";
import { Money } from "../../../shared-kernel/value-objects/money";
import { SnackMachineWithPersistence } from "../../model/aggregates/snack-machine/snack-machine-with-persistence";
import { SnackMachineDto } from "../../dto/snack-machine.dto";

export class SnackMachineMap {
  public static toDomain(
    snackMachineDB: SnackMachineFromDb
  ): SnackMachineWithPersistence {
    const snackMachine = new SnackMachineWithPersistence(snackMachineDB.id);
    snackMachine.loadMoney(
      Money.FromCoinsAndNotes(snackMachineDB.moneyInMachine)
    );
    snackMachine._setSlotsIds(snackMachineDB.slots);
    return snackMachine;
  }

  public static toPersistence(snackMachine: SnackMachine): SnackMachineFromDb {
    return {
      id: snackMachine.id,
      moneyInMachine: snackMachine.getMoneyInMachine().getCoinsAndNotes(),
      slots: snackMachine.getSlotsIds(),
    };
  }

  public static toDto(snackMachine: SnackMachineFromDb): SnackMachineDto {
    return new SnackMachineDto(snackMachine.id, snackMachine.moneyInMachine);
  }
}
