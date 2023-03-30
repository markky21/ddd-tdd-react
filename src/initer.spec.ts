import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { Initer } from "./initer";
import { SnackMachineController } from "./model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";

describe(Initer.name, () => {
  it("should return controllers", async () => {
    const snackMachineController = await Initer.init({ dbId: "test" });
    expect(
      snackMachineController instanceof SnackMachineController
    ).toBeTruthy();
  });
});
