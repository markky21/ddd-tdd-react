import { SnackMachineService } from "../snack-machine-domain/service/snack-machine.service";
import { IdbService } from "../shared-kernel/storage/idb.service";
import { SnackMachineRepository } from "../snack-machine-domain/repository/snack-machine.repository";
import { SnackRepository } from "../snack-machine-domain/repository/snack.repository";
import { nanoid } from "nanoid";
import { SnackMachineWithPersistence } from "../snack-machine-domain/model/aggregates/snack-machine/snack-machine-with-persistence";
import { Snack } from "../snack-machine-domain/model/aggregates/snack/snack";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "../snack-machine-domain/model/aggregates/snack-machine/entities/slot";
import { SnackPile } from "../snack-machine-domain/model/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../shared-kernel/value-objects/money";
import { SnackMachineMap } from "../snack-machine-domain/repository/mappers/snack-machine.map";
import { SlotMap } from "../snack-machine-domain/repository/mappers/slot.map";
import { EntityId } from "../common/entities/entity.abstract";

interface IniterConfig {
  snackMachineId: EntityId;
  createIfNotExists?: boolean;
}
export class Initer {
  private static db = IdbService.getInstance();
  private static snackRepository = SnackRepository.getInstance();
  private static snackMachineRepository = SnackMachineRepository.getInstance();

  static async init({
    snackMachineId,
  }: IniterConfig): Promise<SnackMachineService> {
    await this.db.initialize();

    if (!(await this.db.getSnackMachineById(snackMachineId))) {
      await Initer.createSnackMachine(snackMachineId);
    }

    const controller = new SnackMachineService(this.snackMachineRepository);
    await controller.initializeSnackMachine(snackMachineId);
    return controller;
  }

  private static async createSnackMachine(snackMachineId: EntityId) {
    const snackMachineToSave = new SnackMachineWithPersistence(snackMachineId);

    const snackPosition: SnackMachineSlotsPosition = 0;
    const snackPile0 = new SnackPile(Snack.Chocolate, 3, 10);
    const snackPile1 = new SnackPile(Snack.Soda, 2, 15);
    const snackPile2 = new SnackPile(Snack.Gum, 1, 20);

    const slot0 = new Slot(nanoid(), snackMachineId, 0);
    const slot1 = new Slot(nanoid(), snackMachineId, 1);
    const slot2 = new Slot(nanoid(), snackMachineId, 2);

    slot0.loadSnackPile(snackPile0);
    slot1.loadSnackPile(snackPile1);
    slot2.loadSnackPile(snackPile2);

    snackMachineToSave.loadSnacks(snackPosition, snackPile0);
    snackMachineToSave.loadMoney(new Money(10, 10, 10, 10, 10, 10));
    snackMachineToSave._setSlot(0, slot0);
    snackMachineToSave._setSlot(1, slot1);
    snackMachineToSave._setSlot(2, slot2);

    await this.db.putSnackMachineById(
      snackMachineId,
      SnackMachineMap.toPersistence(snackMachineToSave)
    );

    await this.db.putSlotById(slot0.id, SlotMap.toPersistence(slot0));
    await this.db.putSlotById(slot1.id, SlotMap.toPersistence(slot1));
    await this.db.putSlotById(slot2.id, SlotMap.toPersistence(slot2));
  }
}
