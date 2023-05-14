import { SnackMachine } from "./snack-machine";
import { Slot, SnackMachineSlotsPosition } from "./entities/slot";

export class SnackMachineWithPersistence extends SnackMachine {
  _setSlot(position: SnackMachineSlotsPosition, slot: Slot): void {
    this.slots[position] = slot;
  }

  _setSlotsIds(slotsIds: string[]): void {
    for (const [index, slotId] of slotsIds.entries()) {
      this._setSlot(
        index as SnackMachineSlotsPosition,
        new Slot(slotId, this.id, index as SnackMachineSlotsPosition)
      );
    }
  }
}
