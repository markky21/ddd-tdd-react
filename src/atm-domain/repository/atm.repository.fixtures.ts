import {
  getTestDb,
  seedTestDb,
} from "../../shared-kernel/storage/idb.service.fixture";
import { AtmRepository } from "./atm.repository";

export const getAtmRepositoryFixture = async () => {
  const db = await getTestDb();
  const dbFixture = await seedTestDb(db);

  const atmRepository = AtmRepository.getInstance();
  const atm = await atmRepository.getById(dbFixture.atmId);

  return {
    db,
    atmRepository,
    dbFixture,
    atm,
  };
};
