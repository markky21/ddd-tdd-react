import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { SnackMachineWithPersistence } from "./snack-machine-with-persistence";
import { IdbService } from "../../../data-access/idb.service";
import { Money } from "../../value-objects/money";
import { getTestDb } from "../../../data-access/idb.service.testing";
import { Snack } from "../snack/snack";
import { SnackPile } from "./value-objects/snack-pile";

const getSnackPile = () => {
  const snack = new Snack("Snickers");
  return new SnackPile(snack, 1, 10);
};

const getSUT = async (): Promise<{
  snackMachine: SnackMachineWithPersistence;
  db: IdbService;
  snackMachineId: string;
}> => {
  const snackMachineId = "1";
  const db = await getTestDb();
  await db.putSnackMachine(
    Money.FiveDollar().getCoinsAndNotes(),
    snackMachineId
  );
  const snackMachine = new SnackMachineWithPersistence(snackMachineId, db);
  await snackMachine.load();
  return { snackMachine, db, snackMachineId };
};

describe(SnackMachineWithPersistence.name, () => {
  it("should load money from store", async () => {
    const { snackMachine } = await getSUT();

    expect(snackMachine.getMoneyInMachine()).toEqual(Money.FiveDollar());
  });

  it("buy snack should store money in machine", async () => {
    const { snackMachine, db, snackMachineId } = await getSUT();

    snackMachine.insertMoney(Money.Dollar());
    snackMachine.loadSnacks(0, getSnackPile());
    await snackMachine.buySnack(0);

    expect(snackMachine.getMoneyInMachine()).toEqual(
      Money.FiveDollar().add(Money.Dollar())
    );
    await expect(db.getSnackMachine(snackMachineId)).resolves.toEqual(
      Money.FiveDollar().add(Money.Dollar()).getCoinsAndNotes()
    );
  });
});
