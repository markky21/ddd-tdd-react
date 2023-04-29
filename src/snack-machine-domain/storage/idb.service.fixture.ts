import { IdbService } from "./idb.service";
import { nanoid } from "nanoid";
import { SlotFromDb, SnackFromDb, SnackMachineFromDb } from "./idb.model";

export async function getTestDb(
  dBName: string = nanoid()
): Promise<IdbService> {
  const db = new IdbService(dBName);
  await db.initialize();
  return db;
}

export const seedTestDb = async (db: IdbService) => {
  // const snackMachineId = nanoid();
  // const snackMachineToSave = new SnackMachineWithPersistence(snackMachineId);
  //
  // const snack0 = new Snack(nanoid(), "Snickers");
  // await db.putSnackById(snack0.id, SnackMap.toPersistence(snack0));
  //
  // const snackPosition: SnackMachineSlotsPosition = 0;
  // const snackPile0 = new SnackPile(snack0, 1, 10);
  //
  // const slot0 = new Slot(nanoid(), snackMachineId, 0);
  // const slot1 = new Slot(nanoid(), snackMachineId, 1);
  // const slot2 = new Slot(nanoid(), snackMachineId, 2);
  //
  // slot0.loadSnackPile(snackPile0);
  //
  // snackMachineToSave.loadSnacks(snackPosition, snackPile0);
  // snackMachineToSave.loadMoney(new Money(10, 10, 10, 10, 10, 10));
  // snackMachineToSave._setSlot(0, slot0);
  // snackMachineToSave._setSlot(1, slot1);
  // snackMachineToSave._setSlot(2, slot2);

  // await db.putSnackMachineById(
  //     snackMachineId,
  //     SnackMachineMap.toPersistence(snackMachineToSave)
  // );
  // await db.putSlotById(slot0.id, SlotMap.toPersistence(slot0));
  // await db.putSlotById(slot1.id, SlotMap.toPersistence(slot1));
  // await db.putSlotById(slot2.id, SlotMap.toPersistence(slot2));
  // await db.putSnackById(snack0.id, SnackMap.toPersistence(snack0));
  //
  // const allSnacks = await db.getAllSnacks();
  // const allSnackMachines = await db.getAllSnackMachines();
  // const getAllSlots = await db.getAllSlots();

  const snackMachineId = nanoid();
  const slot0Id = nanoid();
  const slot1Id = nanoid();
  const slot2Id = nanoid();
  const snack0Id = nanoid();

  const snackMachineSeed: SnackMachineFromDb = {
    id: snackMachineId,
    moneyInMachine: {
      oneCentCount: 10,
      tenCentCount: 10,
      quarterCentCount: 10,
      oneDollarCount: 10,
      fiveDollarCount: 10,
      tenDollarCount: 10,
    },
    slots: [slot0Id, slot1Id, slot2Id],
  };
  const slot0Seed: SlotFromDb = {
    id: slot0Id,
    quantity: 10,
    price: 1,
    snackMachineId: snackMachineId,
    snackId: snack0Id,
    position: 0,
  };
  const slot1Seed: SlotFromDb = {
    id: slot1Id,
    quantity: 0,
    price: 0,
    snackMachineId: snackMachineId,
    snackId: null,
    position: 1,
  };
  const slot2Seed: SlotFromDb = {
    id: slot2Id,
    quantity: 0,
    price: 0,
    snackMachineId: snackMachineId,
    snackId: null,
    position: 2,
  };
  const snack0Seed: SnackFromDb = {
    id: snack0Id,
    name: "Snickers",
  };

  await db.putSnackMachineById(snackMachineId, snackMachineSeed);
  await db.putSlotById(slot0Id, slot0Seed);
  await db.putSlotById(slot1Id, slot1Seed);
  await db.putSlotById(slot2Id, slot2Seed);
  await db.putSnackById(snack0Id, snack0Seed);

  const snackMachineFromDb = (await db.getSnackMachineById(
    snackMachineId
  )) as SnackMachineFromDb;
  const slot0FromDb = await db.getSlotById(slot0Id);
  const slot1FromDb = await db.getSlotById(slot1Id);
  const slot2FromDb = await db.getSlotById(slot2Id);
  const snack0FromDb = await db.getSnackById(snack0Id);

  return {
    snackMachineId,
    slot0Id,
    slot1Id,
    slot2Id,
    snack0Id,
    snackMachineFromDb,
    slot0FromDb,
    slot1FromDb,
    slot2FromDb,
    snack0FromDb,
  };
};
