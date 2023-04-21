import { SnackMachineController } from "./model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";
import { IdbService } from "./model/snack-machine/data-access/idb.service";
import { SnackMachineRepository } from "./model/snack-machine/repositories/snack-machine.repository";
import { SnackRepository } from "./model/snack-machine/repositories/snack.repository";
import { EntityId } from "./model/shared/core/entities/entity.abstract";
import { nanoid } from "nanoid";
import { SnackMachineWithPersistence } from "./model/snack-machine/core/aggregates/snack-machine/snack-machine-with-persistence";
import { Snack } from "./model/snack-machine/core/aggregates/snack/snack";
import { SnackMap } from "./model/snack-machine/repositories/mappers/snack.map";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "./model/snack-machine/core/aggregates/snack-machine/entities/slot";
import { SnackPile } from "./model/snack-machine/core/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "./model/snack-machine/core/aggregates/snack-machine/value-objects/money";
import { SnackMachineMap } from "./model/snack-machine/repositories/mappers/snack-machine.map";
import { SlotMap } from "./model/snack-machine/repositories/mappers/slot.map";

interface IniterConfig {
  snackMachineId: EntityId;
  _db?: IdbService;
  createIfNotExists?: boolean;
}
export class Initer {
  static async init({
    snackMachineId,
    _db,
  }: IniterConfig): Promise<SnackMachineController> {
    const db = _db ?? new IdbService();
    await db.initialize();

    if (!(await db.getSnackMachineById(snackMachineId))) {
      await Initer.createSnackMachine(snackMachineId, db);
    }
    const snackRepository = new SnackRepository(db);
    const snackMachineRepository = new SnackMachineRepository(
      db,
      snackRepository
    );

    const controller = new SnackMachineController(
      snackMachineRepository,
      snackRepository
    );
    await controller.initializeSnackMachine(snackMachineId);
    return controller;
  }

  private static async createSnackMachine(
    snackMachineId: EntityId,
    db: IdbService
  ) {
    const snackMachineToSave = new SnackMachineWithPersistence(snackMachineId);

    const snack0 = new Snack(nanoid(), "Snickers");
    await db.putSnackById(snack0.id, SnackMap.toPersistence(snack0));

    const snackPosition: SnackMachineSlotsPosition = 0;
    const snackPile0 = new SnackPile(snack0, 1, 10);

    const slot0 = new Slot(nanoid(), snackMachineId, 0);
    const slot1 = new Slot(nanoid(), snackMachineId, 1);
    const slot2 = new Slot(nanoid(), snackMachineId, 2);

    slot0.loadSnackPile(snackPile0);

    snackMachineToSave.loadSnacks(snackPosition, snackPile0);
    snackMachineToSave.loadMoney(new Money(10, 10, 10, 10, 10, 10));
    snackMachineToSave._setSlot(0, slot0);
    snackMachineToSave._setSlot(1, slot1);
    snackMachineToSave._setSlot(2, slot2);

    await db.putSnackMachineById(
      snackMachineId,
      SnackMachineMap.toPersistence(snackMachineToSave)
    );

    await db.putSlotById(slot0.id, SlotMap.toPersistence(slot0));
    await db.putSlotById(slot1.id, SlotMap.toPersistence(slot1));
    await db.putSlotById(slot2.id, SlotMap.toPersistence(slot2));

    await db.putSnackById(snack0.id, SnackMap.toPersistence(snack0));
  }
}
