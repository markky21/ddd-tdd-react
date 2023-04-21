import { SlotFromDb } from "../../data-access/idb.model";
import { Slot } from "../../core/aggregates/snack-machine/entities/slot";

export class SlotMap {
  public static toDomain(slotFromDb: SlotFromDb): Slot {
    return new Slot(
      slotFromDb.id,
      slotFromDb.snackMachineId,
      slotFromDb.position
    );
  }

  public static toPersistence(slot: Slot): SlotFromDb {
    return {
      id: slot.id,
      quantity: slot.snackPile.quantity,
      price: slot.snackPile.price,
      snackMachineId: slot.snackMachineId,
      snackId: slot.snackPile.snack?.id ?? null,
      position: slot.position,
    };
  }
}
