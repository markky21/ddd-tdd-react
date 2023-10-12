import { EntityId } from "../../common/entities/entity.abstract";

export class SnackMachineDto {
  constructor(
    public readonly id: EntityId,
    public readonly moneyInMachine: string
  ) {}
}
