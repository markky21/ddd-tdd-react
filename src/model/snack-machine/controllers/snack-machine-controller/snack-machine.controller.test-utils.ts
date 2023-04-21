import "fake-indexeddb/auto";
import { SnackMachineController } from "./snack-machine.controller";
import { Money } from "../../core/aggregates/snack-machine/value-objects/money";
import {
  getTestDb,
  setTestInitialDb,
} from "../../data-access/idb.service.fixture";
import { SnackMachineRepository } from "../../repositories/snack-machine.repository";
import { SnackRepository } from "../../repositories/snack.repository";

export const getSUT = async () => {
  const db = await getTestDb();
  const { snackMachineId } = await setTestInitialDb(db);

  const snackRepository = new SnackRepository(db);
  const snackMachineRepository = new SnackMachineRepository(
    db,
    snackRepository
  );

  const controller = new SnackMachineController(
    snackMachineRepository,
    snackRepository
  );

  await controller.initializeSnackMachine(snackMachineId);

  return {
    moneyInMachineInitial: new Money(10, 10, 10, 10, 10, 10),
    controller,
    snackMachineId,
    snackRepository,
    snackMachineRepository,
  };
};
