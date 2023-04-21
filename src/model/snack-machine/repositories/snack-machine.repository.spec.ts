/* eslint-disable testing-library/no-await-sync-query */
import { describe, expect, it } from "vitest";
import { SnackMachineRepository } from "./snack-machine.repository";
import {
  getTestDb,
  setTestInitialDb,
} from "../data-access/idb.service.fixture";
import { SnackRepository } from "./snack.repository";
import { Snack } from "../core/aggregates/snack/snack";
import { SnackPile } from "../core/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../core/aggregates/snack-machine/value-objects/money";

const getSUT = async () => {
  const db = await getTestDb();
  const { snackMachineId, snackMachine } = await setTestInitialDb(db);
  const snackRepository = new SnackRepository(db);
  const snackMachineRepository = new SnackMachineRepository(
    db,
    snackRepository
  );

  return { snackMachineRepository, snackMachineId, snackMachine };
};

describe(SnackMachineRepository.name, () => {
  it("should be able to get snack machine with all entities", async () => {
    const { snackMachineRepository, snackMachineId, snackMachine } =
      await getSUT();

    const snackMachineFromDb = await snackMachineRepository.getById(
      snackMachineId
    );

    expect(snackMachineFromDb.getMoneyInMachine()).toEqual(
      snackMachine.getMoneyInMachine()
    );
    expect(snackMachineFromDb.getSnackPile(0)).toEqual(
      snackMachine.getSnackPile(0)
    );
  });

  it("should be able to save snack machine", async () => {
    const { snackMachineRepository, snackMachine } = await getSUT();
    const snack = new Snack("1", "test");
    const snackPile = new SnackPile(snack, 2, 5);

    snackMachine.loadSnacks(2, snackPile);
    snackMachine.loadMoney(Money.FiveDollar());

    await snackMachineRepository.saveOrUpdate(snackMachine);

    expect(await snackMachineRepository.getById(snackMachine.id)).toEqual(
      snackMachine
    );
  });
});
