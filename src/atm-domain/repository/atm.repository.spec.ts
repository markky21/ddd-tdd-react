/* eslint-disable testing-library/no-await-sync-query */
import { describe } from "vitest";
import { AtmMap } from "./mappers/atm.map";
import { AtmRepository } from "./atm.repository";
import { getAtmRepositoryFixture } from "./atm.repository.fixtures";
import { Atm } from "../model/atm";

describe(AtmRepository.name, () => {
  it("should be able to get atm by id", async () => {
    const {
      atmRepository,
      dbFixture: { atmId, atmFromDb },
    } = await getAtmRepositoryFixture();

    const atm = await atmRepository.getById(atmId);

    expect(AtmMap.toPersistence(atm)).toEqual(atmFromDb);
  });

  it("should be able to save atm", async () => {
    const { atmRepository, db } = await getAtmRepositoryFixture();
    const newAtm = new Atm("1");

    await atmRepository.saveOrUpdate(newAtm);

    expect(await db.getAtmById(newAtm.id)).toEqual(
      AtmMap.toPersistence(newAtm)
    );
  });
});
