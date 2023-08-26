import {
  getTestDb,
  seedTestDb,
} from "../../shared-kernel/storage/idb.service.fixture";
import { HeadOfficeRepository } from "./head-office.repository";

export const getHeadOfficeRepositoryFixture = async () => {
  const db = await getTestDb();
  const dbFixture = await seedTestDb(db);

  const headOfficeRepository = HeadOfficeRepository.getInstance();

  return {
    db,
    headOfficeRepository,
    dbFixture,
  };
};
