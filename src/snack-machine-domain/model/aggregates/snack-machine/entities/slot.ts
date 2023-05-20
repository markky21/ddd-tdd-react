import { SnackPile } from "../value-objects/snack-pile";
import {
  Entity,
  EntityId,
} from "../../../../../common/entities/entity.abstract";

export type SnackMachineSlotsPosition = 0 | 1 | 2;

export class Slot extends Entity {
  public snackPile = SnackPile.empty;

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
