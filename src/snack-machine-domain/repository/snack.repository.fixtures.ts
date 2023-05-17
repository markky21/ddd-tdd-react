import { getTestDb, seedTestDb } from "../storage/idb.service.fixture";
import { SnackRepository } from "./snack.repository";

export const getSnackRepositoryFixture = async () => {
  const db = await getTestDb();
  const dbFixture = await seedTestDb(db);

  const snackRepository = SnackRepository.getInstance();

  return {
    db,
    snackRepository,
    dbFixture,
  };
};
