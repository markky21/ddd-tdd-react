import { SnackMachineService } from "./snack-machine-domain/service/snack-machine.service";
import { IdbService } from "./snack-machine-domain/storage/idb.service";
import { SnackMachineRepository } from "./snack-machine-domain/repository/snack-machine.repository";
import { SnackRepository } from "./snack-machine-domain/repository/snack.repository";
import { EntityId } from "./shared/core/entities/entity.abstract";
import { nanoid } from "nanoid";
import { SnackMachineWithPersistence } from "./snack-machine-domain/model/aggregates/snack-machine/snack-machine-with-persistence";
import { Snack } from "./snack-machine-domain/model/aggregates/snack/snack";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "./snack-machine-domain/model/aggregates/snack-machine/entities/slot";
import { SnackPile } from "./snack-machine-domain/model/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "./snack-machine-domain/model/aggregates/snack-machine/value-objects/money";
import { SnackMachineMap } from "./snack-machine-domain/repository/mappers/snack-machine.map";
import { SlotMap } from "./snack-machine-domain/repository/mappers/slot.map";

interface IniterConfig {
  snackMachineId: EntityId;
  _db?: IdbService;
  createIfNotExists?: boolean;
}
export class Initer {
  static async init({
    snackMachineId,
    _db,
  }: IniterConfig): Promise<SnackMachineService> {
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

    const controller = new SnackMachineService(
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

    const snackPosition: SnackMachineSlotsPosition = 0;
    const snackPile0 = new SnackPile(Snack.Chocolate, 1, 10);

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
  }
}
