import { AtmService } from "./atm.service";
import { getAtmRepositoryFixture } from "../repository/atm.repository.fixtures";

export const getAtmServiceFixture = async () => {
  const { dbFixture, ...atmRepositoryFixture } =
    await getAtmRepositoryFixture();

  const service = new AtmService(atmRepositoryFixture.atmRepository);

  await service.initializeAtm(dbFixture.atmId);

  return {
    service,
    dbFixture,
    atmRepositoryFixture,
  };
};
