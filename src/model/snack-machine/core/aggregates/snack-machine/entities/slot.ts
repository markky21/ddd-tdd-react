import {
  Entity,
  EntityId,
} from "../../../../../shared/core/entities/entity.abstract";
import { SnackPile } from "../value-objects/snack-pile";

export type SnackMachineSlotsPosition = 0 | 1 | 2;

export class Slot extends Entity {
  public snackPile = new SnackPile(null, 0, 0);

  constructor(
    public readonly id: EntityId,
    public readonly snackMachineId: EntityId,
    public readonly position: SnackMachineSlotsPosition
  ) {
    super(id);
  }

  loadSnackPile(snackPile: SnackPile): void {
    this.snackPile = snackPile;
  }
}
