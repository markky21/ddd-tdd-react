import { Repository } from "../../shared/repositories/repository.abstract";
import { IdbService } from "../storage/idb.service";
import { Guard } from "../../shared/core/utils/guard";
import { Snack } from "../model/aggregates/snack/snack";
import { SnackMap } from "./mappers/snack.map";
import { EntityId } from "../../shared/core/entities/entity.abstract";

export class SnackRepository extends Repository<Snack> {
  private static instance: SnackRepository;

  private constructor(private db = IdbService.getInstance()) {
    super();
    this.initializeReferenceSnacks();
  }

  public static getInstance(): SnackRepository {
    if (!SnackRepository.instance) {
      SnackRepository.instance = new SnackRepository();
    }
    return SnackRepository.instance;
  }

  private async initializeReferenceSnacks() {
    await this.saveOrUpdate(Snack.None);
    await this.saveOrUpdate(Snack.Chocolate);
    await this.saveOrUpdate(Snack.Soda);
    await this.saveOrUpdate(Snack.Gum);
  }

  async getById(id: string): Promise<Snack> {
    const snackTableValues = await IdbService.getInstance().getSnackById(id);
    Guard.againstTruthy(!snackTableValues, "Snack not found");
    return SnackMap.toDomain(id);
  }

  async saveOrUpdate(aggregateRoot: Snack): Promise<EntityId> {
    return this.db.putSnackById(
      aggregateRoot.id,
      SnackMap.toPersistence(aggregateRoot)
    );
  }
}
