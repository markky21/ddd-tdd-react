import { Entity } from "../../../../../shared/core/entities/entity.abstract";
import { nanoid } from "nanoid";
import { SnackMachine } from "../snack-machine";
import { SnackPile } from "../value-objects/snack-pile";

export type SnackMachineSlotsPosition = 0 | 1 | 2;

export class Slot extends Entity {
  public snackPile = new SnackPile(null, 0, 0);

  constructor(
    private snackMachine: SnackMachine,
    private position: SnackMachineSlotsPosition
  ) {
    super(nanoid());
  }
}
