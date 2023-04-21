import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { Initer } from "./initer";
import { SnackMachineController } from "./model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";
import {
  getTestDb,
  setTestInitialDb,
} from "./model/snack-machine/data-access/idb.service.fixture";

describe(Initer.name, () => {
  it("should return controllers", async () => {
    const snackMachineController = await Initer.init({ snackMachineId: "1" });
    expect(
      snackMachineController instanceof SnackMachineController
    ).toBeTruthy();
  });

  it("should initialize snack machine by given ID", async () => {
    const db = await getTestDb();
    const { snackMachineId } = await setTestInitialDb(db);

    const snackMachineController = await Initer.init({
      snackMachineId,
      _db: db,
    });
    const snackMachine = snackMachineController.snackMachineId;
    expect(snackMachine).toEqual(snackMachineId);
  });
});
