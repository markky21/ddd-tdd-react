import { EntityId } from "../../common/entities/entity.abstract";
import { CoinsAndNotes } from "../../shared-kernel/value-objects/money";

export class SnackMachineDto {
  constructor(
    public readonly id: EntityId,
    public readonly moneyInMachine: CoinsAndNotes
  ) {}
}
