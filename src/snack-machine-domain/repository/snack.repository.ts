import { IdbService } from "../../shared-kernel/storage/idb.service";
import { Snack } from "../model/aggregates/snack/snack";
import { SnackMap } from "./mappers/snack.map";
import { EntityId } from "../../common/entities/entity.abstract";
import { Repository } from "../../common/repositories/repository.abstract";
import { Guard } from "../../util/guard";

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
