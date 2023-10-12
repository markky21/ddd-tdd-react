/* eslint-disable testing-library/no-await-sync-query */
import { describe, vitest } from "vitest";
import { AtmMap } from "./mappers/atm.map";
import { AtmRepository } from "./atm.repository";
import { getAtmRepositoryFixture } from "./atm.repository.fixtures";
import { Atm } from "../model/atm";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { IdbService } from "../../shared-kernel/storage/idb.service";

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

  it("on success save should dispatch events", async () => {
    const { atmRepository, atm } = await getAtmRepositoryFixture();
    atm.takeMoney(new Cash(0.01));
    expect(atm.getDomainEvents().length).toEqual(1);
    await atmRepository.saveOrUpdate(atm);

    expect(atm.getDomainEvents().length).toEqual(0);
  });

  it("on save error events should NOT be dispatched", async () => {
    const { atmRepository, atm } = await getAtmRepositoryFixture();
    vitest
      .spyOn(IdbService.getInstance(), "putAtmById")
      .mockRejectedValueOnce("test error");
    atm.takeMoney(new Cash(0.01));
    expect(atm.getDomainEvents().length).toEqual(1);

    try {
      await atmRepository.saveOrUpdate(atm);
    } catch {
      expect(atm.getDomainEvents().length).toEqual(1);
    }
  });

  it("should be able to get all atms", async () => {
    const { atmRepository, dbFixture } = await getAtmRepositoryFixture();

    const atms = await atmRepository.getAll();

    expect(atms.find(({ id }) => id === dbFixture.atmFromDb?.id)).toEqual({
      id: dbFixture.atmFromDb?.id,
      moneyInside: "$1,636.00",
    });
  });
});
