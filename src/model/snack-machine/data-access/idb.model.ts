import { CoinsAndNotes } from "../core/aggregates/snack-machine/value-objects/money";
import { EntityId } from "../../shared/core/entities/entity.abstract";
import { SnackMachineSlotsPosition } from "../core/aggregates/snack-machine/entities/slot";

export interface SnackMachineFromDb {
  moneyInMachine: CoinsAndNotes;
  id: EntityId;
  slots: EntityId[];
}

export interface SlotFromDb {
  id: EntityId;
  quantity: number;
  price: number;
  snackMachineId: string;
  snackId: string | null;
  position: SnackMachineSlotsPosition;
}

export interface SnackFromDb {
  id: EntityId;
  name: string;
}
