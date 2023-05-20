import { SnackMachineRepository } from "./snack-machine.repository";
import {
  getTestDb,
  seedTestDb,
} from "../../shared-kernel/storage/idb.service.fixture";
import { SnackRepository } from "./snack.repository";
import { SnackMachineMap } from "./mappers/snack-machine.map";

export const getSnackMachineRepositoryFixture = async () => {
  const db = await getTestDb();
  const dbFixture = await seedTestDb(db);

  const snackRepository = SnackRepository.getInstance();
  const snackMachineRepository = SnackMachineRepository.getInstance();
  const moneyInMachineInitial = SnackMachineMap.toDomain(
    dbFixture.snackMachineFromDb
  ).getMoneyInMachine();

  return {
    snackMachineRepository,
    snackRepository,
    dbFixture,
    moneyInMachineInitial,
  };
};
