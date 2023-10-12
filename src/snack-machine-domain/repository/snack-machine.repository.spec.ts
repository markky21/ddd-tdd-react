/* eslint-disable testing-library/no-await-sync-query */
import { SnackMachineRepository } from "./snack-machine.repository";
import { Snack } from "../model/aggregates/snack/snack";
import { SnackPile } from "../model/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../../shared-kernel/value-objects/money";
import { getSnackMachineRepositoryFixture } from "./snack-machine.repository.fixtures";
import { vitest } from "vitest";
import { IdbService } from "../../shared-kernel/storage/idb.service";

describe(SnackMachineRepository.name, () => {
  it("should be able to get snack machine with all entities", async () => {
    const {
      snackMachineRepository,
      moneyInMachineInitial,
      dbFixture: { snackMachineId, snack0FromDb },
    } = await getSnackMachineRepositoryFixture();

    const snackMachine = await snackMachineRepository.getById(snackMachineId);

    expect(snackMachine.getMoneyInMachine()).toEqual(moneyInMachineInitial);
    expect(snackMachine.getSnackPile(0).snack).toContain(snack0FromDb);
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

  it("should dispatch event on post save", async () => {
    const {
      snackMachineRepository,
      dbFixture: { snackMachineId },
    } = await getSnackMachineRepositoryFixture();
    const snackMachine = await snackMachineRepository.getById(snackMachineId);
    snackMachine.insertMoney(Money.FiveDollar());
    snackMachine.buySnack(0);
    expect(snackMachine.getDomainEvents().length).toEqual(1);

    await snackMachineRepository.saveOrUpdate(snackMachine);
    expect(snackMachine.getDomainEvents().length).toEqual(0);
  });

  it("should NOT dispatch event on post save error", async () => {
    const {
      snackMachineRepository,
      dbFixture: { snackMachineId },
    } = await getSnackMachineRepositoryFixture();
    const snackMachine = await snackMachineRepository.getById(snackMachineId);
    snackMachine.insertMoney(Money.FiveDollar());
    vitest
      .spyOn(IdbService.getInstance(), "putSnackMachineById")
      .mockRejectedValueOnce("test error");
    snackMachine.buySnack(0);
    expect(snackMachine.getDomainEvents().length).toEqual(1);

    try {
      await snackMachineRepository.saveOrUpdate(snackMachine);
    } catch {
      expect(snackMachine.getDomainEvents().length).toEqual(1);
    }
  });

  it("should be able to get all snackMachines", async () => {
    const { snackMachineRepository, dbFixture } =
      await getSnackMachineRepositoryFixture();

    const snackMachines = await snackMachineRepository.getAll();

    expect(
      snackMachines.find(({ id }) => id === dbFixture.snackMachineFromDb?.id)
    ).toEqual({
      id: dbFixture.snackMachineFromDb?.id,
      moneyInMachine: "$163.60",
    });
  });
});
