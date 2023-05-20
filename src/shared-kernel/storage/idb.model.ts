import { CoinsAndNotes } from "../value-objects/money";
import { EntityId } from "../../common/entities/entity.abstract";

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
  position: 0 | 1 | 2;
}

export interface SnackFromDb {
  id: EntityId;
  name: string;
}

export interface ATMFromDb {
  id: EntityId;
  moneyInMachine: CoinsAndNotes;
  moneyCharged: number;
}
