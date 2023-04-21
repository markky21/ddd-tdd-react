import "fake-indexeddb/auto";
import { IdbService } from "./idb.service";
import { nanoid } from "nanoid";
import { SnackMachineWithPersistence } from "../core/aggregates/snack-machine/snack-machine-with-persistence";
import { Snack } from "../core/aggregates/snack/snack";
import { SnackMap } from "../repositories/mappers/snack.map";
import {
  Slot,
  SnackMachineSlotsPosition,
} from "../core/aggregates/snack-machine/entities/slot";
import { SnackPile } from "../core/aggregates/snack-machine/value-objects/snack-pile";
import { Money } from "../core/aggregates/snack-machine/value-objects/money";
import { SnackMachineMap } from "../repositories/mappers/snack-machine.map";
import { SlotMap } from "../repositories/mappers/slot.map";

export async function getTestDb(
  dBName: string = nanoid()
): Promise<IdbService> {
  const db = new IdbService(dBName);
  await db.initialize();
  return db;
}

export const setTestInitialDb = async (db: IdbService) => {
  const snackMachineId = nanoid();
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

  const allSnacks = await db.getAllSnacks();
  const allSnackMachines = await db.getAllSnackMachines();
  const getAllSlots = await db.getAllSlots();

  return {
    snackMachineId,
    snackMachine: snackMachineToSave,
    allSnacks,
    allSnackMachines,
    getAllSlots,
  };
};
