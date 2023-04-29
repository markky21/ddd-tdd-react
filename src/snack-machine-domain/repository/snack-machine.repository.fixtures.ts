import { SnackMachineRepository } from "./snack-machine.repository";
import { getTestDb, seedTestDb } from "../storage/idb.service.fixture";
import { SnackRepository } from "./snack.repository";
import { SnackMachineMap } from "./mappers/snack-machine.map";

export const getSnackMachineRepositoryFixture = async () => {
  const db = await getTestDb();
  const dbFixture = await seedTestDb(db);

  const snackRepository = new SnackRepository(db);
  const snackMachineRepository = new SnackMachineRepository(
    db,
    snackRepository
  );
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
