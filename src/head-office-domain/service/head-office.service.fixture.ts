import { HeadOfficeService } from "./head-office.service";
import { getHeadOfficeRepositoryFixture } from "../repository/head-office.repository.fixtures";

export const getHeadOfficeServiceFixture = async () => {
  const { dbFixture, ...headOfficeRepositoryFixture } =
    await getHeadOfficeRepositoryFixture();

  const headOffice =
    await headOfficeRepositoryFixture.headOfficeRepository.getById(
      dbFixture.headOfficeId
    );
  const service = new HeadOfficeService(headOffice);

  await service.initialize();

  return {
    service,
    dbFixture,
    headOfficeRepositoryFixture,
  };
};
