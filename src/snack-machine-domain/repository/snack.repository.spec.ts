/* eslint-disable testing-library/no-await-sync-query */
import { describe } from "vitest";
import { SnackRepository } from "./snack.repository";
import { getSnackRepositoryFixture } from "./snack.repository.fixtures";
import { SnackMap } from "./mappers/snack.map";
import { Snack } from "../model/aggregates/snack/snack";

describe(SnackRepository.name, () => {
  it("should be able to get snack by id", async () => {
    const {
      snackRepository,
      dbFixture: { snack0Id, snack0FromDb },
    } = await getSnackRepositoryFixture();

    const snack = await snackRepository.getById(snack0Id);

    expect(SnackMap.toPersistence(snack)).toEqual(snack0FromDb);
  });

  it("should be able to save snack", async () => {
    const { snackRepository, db } = await getSnackRepositoryFixture();
    const newSnack = Snack.Gum;
    newSnack.name = "New Gum";

    await snackRepository.saveOrUpdate(newSnack);

    expect(await db.getSnackById(newSnack.id)).toEqual(
      SnackMap.toPersistence(newSnack)
    );
  });

  it("should set reference snacks to DB", async () => {
    const { db } = await getSnackRepositoryFixture();

    expect(await db.getSnackById(Snack.None.id)).toEqual(
      SnackMap.toPersistence(Snack.None)
    );
    expect(await db.getSnackById(Snack.Chocolate.id)).toEqual(
      SnackMap.toPersistence(Snack.Chocolate)
    );
    expect(await db.getSnackById(Snack.Soda.id)).toEqual(
      SnackMap.toPersistence(Snack.Soda)
    );
    expect(await db.getSnackById(Snack.Gum.id)).toEqual(
      SnackMap.toPersistence(Snack.Gum)
    );
  });
});
