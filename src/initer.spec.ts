import { Initer } from "./initer";
import { SnackMachineService } from "./snack-machine-domain/service/snack-machine.service";
import {
  getTestDb,
  seedTestDb,
} from "./snack-machine-domain/storage/idb.service.fixture";

describe(Initer.name, () => {
  it("should return controllers", async () => {
    const snackMachineController = await Initer.init({ snackMachineId: "1" });
    expect(snackMachineController instanceof SnackMachineService).toBeTruthy();
  });

  it("should initialize snack machine by given ID", async () => {
    const db = await getTestDb();
    const { snackMachineId } = await seedTestDb(db);

    const snackMachineController = await Initer.init({
      snackMachineId,
      _db: db,
    });
    const snackMachine = snackMachineController.snackMachineId;
    expect(snackMachine).toEqual(snackMachineId);
  });
});
