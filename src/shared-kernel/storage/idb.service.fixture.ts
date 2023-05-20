import { IdbService } from "./idb.service";
import { nanoid } from "nanoid";
import {
  ATMFromDb,
  SlotFromDb,
  SnackFromDb,
  SnackMachineFromDb,
} from "./idb.model";
import { Snack } from "../../snack-machine-domain/model/aggregates/snack/snack";
import { SnackMap } from "../../snack-machine-domain/repository/mappers/snack.map";

export async function getTestDb(): Promise<IdbService> {
  const db = IdbService.getInstance();
  await db.initialize();
  return db;
}

export const seedTestDb = async (db: IdbService) => {
  const snackMachineId = nanoid();
  const slot0Id = nanoid();
  const slot1Id = nanoid();
  const slot2Id = nanoid();
  const snack0Id = Snack.Chocolate.id;
  const atmId = nanoid();

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

  const atmSeed: ATMFromDb = {
    id: atmId,
    moneyInMachine: {
      oneCentCount: 0,
      tenCentCount: 0,
      quarterCentCount: 0,
      oneDollarCount: 0,
      fiveDollarCount: 0,
      tenDollarCount: 0,
    },
    moneyCharged: 0,
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
  const snack0Seed: SnackFromDb = SnackMap.toPersistence(Snack.Chocolate);

  await db.putSnackMachineById(snackMachineId, snackMachineSeed);
  await db.putSlotById(slot0Id, slot0Seed);
  await db.putSlotById(slot1Id, slot1Seed);
  await db.putSlotById(slot2Id, slot2Seed);
  await db.putSnackById(snack0Id, snack0Seed);
  await db.putAtmById(atmId, atmSeed);

  const snackMachineFromDb = (await db.getSnackMachineById(
    snackMachineId
  )) as SnackMachineFromDb;
  const slot0FromDb = await db.getSlotById(slot0Id);
  const slot1FromDb = await db.getSlotById(slot1Id);
  const slot2FromDb = await db.getSlotById(slot2Id);
  const snack0FromDb = await db.getSnackById(snack0Id);
  const atmFromDb = await db.getAtmById(atmId);

  return {
    snackMachineId,
    slot0Id,
    slot1Id,
    slot2Id,
    snack0Id,
    atmId,
    snackMachineFromDb,
    slot0FromDb,
    slot1FromDb,
    slot2FromDb,
    snack0FromDb,
    atmFromDb,
  };
};