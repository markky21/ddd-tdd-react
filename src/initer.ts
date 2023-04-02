import { SnackMachineController } from "./model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";
import { IdbService } from "./model/snack-machine/data-access/idb.service";
import { SnackMachineWithPersistence } from "./model/snack-machine/core/aggregates/snack-machine/snack-machine-with-persistence";

interface IniterConfig {
  dbId: string;
}
export class Initer {
  static init({ dbId }: IniterConfig): Promise<SnackMachineController> {
    const db = new IdbService();
    return Promise.all([db.initialize()]).then(async () => {
      const snackMachine = new SnackMachineWithPersistence(dbId, db);
      await snackMachine.load();
      return new SnackMachineController(snackMachine);
    });
  }
}
