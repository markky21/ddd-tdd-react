/* eslint-disable testing-library/no-await-sync-query */
import { describe } from "vitest";
import { HeadOfficeMap } from "./mappers/head-office.map";
import { HeadOfficeRepository } from "./head-office.repository";
import { getHeadOfficeRepositoryFixture } from "./head-office.repository.fixtures";
import { HeadOffice } from "../model/head-office";

describe(HeadOfficeRepository.name, () => {
  it("should be able to get headOffice by id", async () => {
    const {
      headOfficeRepository,
      dbFixture: { headOfficeId, headOfficeFromDb },
    } = await getHeadOfficeRepositoryFixture();

    const headOffice = await headOfficeRepository.getById(headOfficeId);

    expect(HeadOfficeMap.toPersistence(headOffice)).toEqual(headOfficeFromDb);
  });

  it("should be able to save headOffice", async () => {
    const { headOfficeRepository, db } = await getHeadOfficeRepositoryFixture();
    const headOffice = new HeadOffice("1");

    await headOfficeRepository.saveOrUpdate(headOffice);

    expect(await db.getHeadOfficeById(headOffice.id)).toEqual(
      HeadOfficeMap.toPersistence(headOffice)
    );
  });
});
