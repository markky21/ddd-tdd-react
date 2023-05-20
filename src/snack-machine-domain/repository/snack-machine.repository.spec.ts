/* eslint-disable testing-library/no-await-sync-query */
import { SnackMachineRepository } from "./snack-machine.repository";
import { Snack } from "../model/aggregates/snack/snack";
import { SnackPile } from "../model/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../../shared-kernel/value-objects/money";
import { getSnackMachineRepositoryFixture } from "./snack-machine.repository.fixtures";

describe(SnackMachineRepository.name, () => {
  it("should be able to get snack machine with all entities", async () => {
    const {
      snackMachineRepository,
      moneyInMachineInitial,
      dbFixture: { snackMachineId, snack0FromDb },
    } = await getSnackMachineRepositoryFixture();

    const snackMachine = await snackMachineRepository.getById(snackMachineId);

    expect(snackMachine.getMoneyInMachine()).toEqual(moneyInMachineInitial);
    expect(snackMachine.getSnackPile(0).snack).toEqual(snack0FromDb);
  });

  it("should be able to save snack machine", async () => {
    const {
      snackMachineRepository,
      dbFixture: { snackMachineId },
    } = await getSnackMachineRepositoryFixture();
    const snack = Snack.Chocolate;
    const snackPile = new SnackPile(snack, 2, 5);

    const snackMachine = await snackMachineRepository.getById(snackMachineId);
    snackMachine.loadSnacks(2, snackPile);
    snackMachine.loadMoney(Money.FiveDollar());
    await snackMachineRepository.saveOrUpdate(snackMachine);

    expect(await snackMachineRepository.getById(snackMachine.id)).toEqual(
      snackMachine
    );
  });
});
