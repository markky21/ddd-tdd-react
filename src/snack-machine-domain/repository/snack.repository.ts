import { Repository } from "../../shared/repositories/repository.abstract";
import { IdbService } from "../storage/idb.service";
import { Guard } from "../../shared/core/utils/guard";
import { Snack } from "../model/aggregates/snack/snack";
import { SnackMap } from "./mappers/snack.map";
import { EntityId } from "../../shared/core/entities/entity.abstract";

export class SnackRepository extends Repository<Snack> {
  constructor(private db: IdbService) {
    super();
  }

  async getById(id: string): Promise<Snack> {
    const snackTableValues = await this.db.getSnackById(id);
    Guard.againstTruthy(!snackTableValues, "Snack not found");
    return SnackMap.toDomain(id, snackTableValues!);
  }

  async saveOrUpdate(aggregateRoot: Snack): Promise<EntityId> {
    return this.db.putSnackById(
      aggregateRoot.id,
      SnackMap.toPersistence(aggregateRoot)
    );
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
