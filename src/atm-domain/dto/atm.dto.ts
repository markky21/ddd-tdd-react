import { EntityId } from "../../common/entities/entity.abstract";

export class AtmDto {
  constructor(
    public readonly id: EntityId,
    public readonly moneyInside: string
  ) {}
}
